import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type ContributionAmount = 5000 | 10000 | 20000 | 50000 | 100000;
export type PlanType = 'weekly' | 'monthly';

interface GroupMemberDto {
  userId: number;
  position: number;
  hasReceived: boolean;
}

export interface SavingsGroupDto {
  id: number;
  title: string;
  amount: ContributionAmount | number;
  plan: PlanType | string;
  members: GroupMemberDto[];
  currentCycle: number;
  createdAt: Date;
}

export interface NextPayout {
  recipientUserId: string;
  totalPayout: number;
  feePercent: number;
}

@Injectable()
export class GroupsService {
  private readonly validAmounts: ContributionAmount[] = [5000, 10000, 20000, 50000, 100000];

  constructor(private readonly prisma: PrismaService) {}

  private feeFor(plan: PlanType): number {
    return plan === 'weekly' ? 0.01 : 0.03;
  }

  async createGroup(input: { title: string; amount: ContributionAmount; plan: PlanType }): Promise<SavingsGroupDto> {
    if (!this.validAmounts.includes(input.amount)) {
      throw new BadRequestException('Invalid contribution amount');
    }
    const created = await this.prisma.group.create({
      data: {
        title: input.title,
        amount: input.amount,
        plan: input.plan,
        currentCycle: 1,
      },
      include: { members: true },
    });
    return this.mapGroup(created);
  }

  async listGroups(): Promise<SavingsGroupDto[]> {
    const groups = await this.prisma.group.findMany({ include: { members: true } });
    return groups.map(g => this.mapGroup(g));
  }

  private async getGroup(groupId: number) {
    const g = await this.prisma.group.findUnique({ where: { id: groupId }, include: { members: true } });
    if (!g) throw new NotFoundException('Group not found');
    return g;
  }

  async joinGroup(groupId: number, userId: number): Promise<SavingsGroupDto> {
    const group = await this.getGroup(groupId);
    if (group.members.some((m) => m.userId === userId)) {
      throw new BadRequestException('Already joined');
    }
    if (group.members.length >= 7) {
      throw new BadRequestException('Group is full');
    }
    const position = group.members.length + 1;
    await this.prisma.groupMember.create({
      data: { groupId, userId, position, hasReceived: false },
    });
    const updated = await this.getGroup(groupId);
    return this.mapGroup(updated);
  }

  async nextPayout(groupId: number): Promise<NextPayout> {
    const group = await this.getGroup(groupId);
    const recipient = group.members.find((m) => m.position === group.currentCycle);
    if (!recipient) {
      throw new BadRequestException('Payout order not set or group incomplete');
    }
    const feePercent = this.feeFor(group.plan as PlanType);
    const totalContributors = group.members.length;
    const contributionPerMember = group.amount;
    const gross = totalContributors * contributionPerMember;
    const fee = gross * feePercent;
    const totalPayout = Math.round(gross - fee);
    return { recipientUserId: String(recipient.userId), totalPayout, feePercent };
  }

  async markPayoutComplete(groupId: number): Promise<SavingsGroupDto> {
    const group = await this.getGroup(groupId);
    const recipient = group.members.find((m) => m.position === group.currentCycle);
    if (!recipient) {
      throw new BadRequestException('No recipient for current cycle');
    }
    await this.prisma.groupMember.updateMany({
      where: { groupId, userId: recipient.userId },
      data: { hasReceived: true },
    });
    let nextCycle = group.currentCycle + 1;
    if (nextCycle > 7) {
      nextCycle = 1;
      await this.prisma.groupMember.updateMany({ where: { groupId }, data: { hasReceived: false } });
    }
    await this.prisma.group.update({ where: { id: groupId }, data: { currentCycle: nextCycle } });
    const updated = await this.getGroup(groupId);
    return this.mapGroup(updated);
  }

  async getUserGroups(userId: number): Promise<SavingsGroupDto[]> {
    const memberships = await this.prisma.groupMember.findMany({ where: { userId } });
    const groupIds = memberships.map(m => m.groupId);
    if (groupIds.length === 0) return [];
    const groups = await this.prisma.group.findMany({ where: { id: { in: groupIds } }, include: { members: true } });
    return groups.map(g => this.mapGroup(g));
  }

  async addUserToGroup(groupId: number, userId: number, position?: number): Promise<SavingsGroupDto> {
    const group = await this.getGroup(groupId);
    if (group.members.some((m) => m.userId === userId)) {
      throw new BadRequestException('User is already in this group');
    }
    if (group.members.length >= 7) {
      throw new BadRequestException('Group is full');
    }
    let finalPosition = position;
    if (finalPosition !== undefined) {
      if (finalPosition < 1 || finalPosition > 7) {
        throw new BadRequestException('Position must be between 1 and 7');
      }
      if (group.members.some((m) => m.position === finalPosition)) {
        throw new BadRequestException('Position is already taken');
      }
    } else {
      finalPosition = group.members.length + 1;
    }
    await this.prisma.groupMember.create({ data: { groupId, userId, position: finalPosition, hasReceived: false } });
    const updated = await this.getGroup(groupId);
    return this.mapGroup(updated);
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<SavingsGroupDto> {
    const group = await this.getGroup(groupId);
    const member = group.members.find((m) => m.userId === userId);
    if (!member) {
      throw new BadRequestException('User is not in this group');
    }
    await this.prisma.groupMember.deleteMany({ where: { groupId, userId } });
    const updated = await this.getGroup(groupId);
    return this.mapGroup(updated);
  }

  async assignNextPayout(groupId: number, userId: number): Promise<SavingsGroupDto> {
    const group = await this.getGroup(groupId);
    const member = group.members.find((m) => m.userId === userId);
    if (!member) {
      throw new BadRequestException('User is not in this group');
    }
    await this.prisma.group.update({ where: { id: groupId }, data: { currentCycle: member.position } });
    const updated = await this.getGroup(groupId);
    return this.mapGroup(updated);
  }

  async getUserContributions(userId: number): Promise<{
    groups: SavingsGroupDto[];
    totalContributed: number;
    totalReceived: number;
    pendingContributions: number;
    nextPayouts: Array<{
      groupId: number;
      groupTitle: string;
      amount: number;
      position: number;
      estimatedDate: string;
    }>;
  }> {
    const userGroups = await this.getUserGroups(userId);
    let totalContributed = 0;
    let totalReceived = 0;
    let pendingContributions = 0;
    const nextPayouts: Array<{ groupId: number; groupTitle: string; amount: number; position: number; estimatedDate: string }>= [];

    for (const group of userGroups) {
      const userMember = group.members.find((m) => m.userId === userId);
      if (!userMember) continue;

      const cyclesCompleted = group.currentCycle - 1;
      const userContribution = cyclesCompleted * group.amount;
      totalContributed += userContribution;

      if (userMember.hasReceived) {
        const feePercent = this.feeFor(group.plan as PlanType);
        const totalContributors = group.members.length;
        const gross = totalContributors * group.amount;
        const fee = gross * feePercent;
        const payout = Math.round(gross - fee);
        totalReceived += payout;
      }

      if (group.currentCycle <= userMember.position) {
        pendingContributions += group.amount;
      }

      if (!userMember.hasReceived) {
        const feePercent = this.feeFor(group.plan as PlanType);
        const totalContributors = group.members.length;
        const gross = totalContributors * group.amount;
        const fee = gross * feePercent;
        const payout = Math.round(gross - fee);
        const weeksUntilPayout = userMember.position - group.currentCycle;
        const estimatedDate = new Date();
        if (group.plan === 'weekly') {
          estimatedDate.setDate(estimatedDate.getDate() + weeksUntilPayout * 7);
        } else {
          estimatedDate.setMonth(estimatedDate.getMonth() + weeksUntilPayout);
        }
        nextPayouts.push({
          groupId: group.id,
          groupTitle: group.title,
          amount: payout,
          position: userMember.position,
          estimatedDate: estimatedDate.toISOString().split('T')[0],
        });
      }
    }

    return {
      groups: userGroups,
      totalContributed,
      totalReceived,
      pendingContributions,
      nextPayouts: nextPayouts.sort(
        (a, b) => new Date(a.estimatedDate).getTime() - new Date(b.estimatedDate).getTime(),
      ),
    };
  }

  async deleteGroup(groupId: number): Promise<{ success: true }> {
    const existing = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!existing) {
      throw new NotFoundException('Group not found');
    }
    await this.prisma.groupMember.deleteMany({ where: { groupId } });
    await this.prisma.payment.deleteMany({ where: { groupId } });
    await this.prisma.transaction.deleteMany({ where: { groupId } });
    await this.prisma.group.delete({ where: { id: groupId } });
    return { success: true };
  }

  private mapGroup(g: any): SavingsGroupDto {
    return {
      id: g.id,
      title: g.title,
      amount: g.amount,
      plan: g.plan,
      members: (g.members || []).map((m: any) => ({ userId: m.userId, position: m.position, hasReceived: m.hasReceived })),
      currentCycle: g.currentCycle,
      createdAt: g.createdAt,
    };
  }
}


