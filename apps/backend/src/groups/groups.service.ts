import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type ContributionAmount = 5000 | 10000 | 20000 | 50000 | 100000;
export type PlanType = 'weekly' | 'monthly';

export interface GroupMember {
  userId: string;
  position: number; // 1..7 payout order
  hasReceived: boolean;
}

export interface Group {
  id: string;
  title: string;
  amount: ContributionAmount;
  plan: PlanType;
  members: GroupMember[]; // max 7
  currentCycle: number; // 1..7
  createdAt: Date;
}

@Injectable()
export class GroupsService {
  private readonly groups: Group[] = [];

  private readonly validAmounts: ContributionAmount[] = [5000, 10000, 20000, 50000, 100000];

  private feeFor(plan: PlanType): number {
    return plan === 'weekly' ? 0.01 : 0.03;
  }

  async createGroup(input: { title: string; amount: ContributionAmount; plan: PlanType }): Promise<Group> {
    if (!this.validAmounts.includes(input.amount)) {
      throw new BadRequestException('Invalid contribution amount');
    }
    const group: Group = {
      id: randomUUID(),
      title: input.title,
      amount: input.amount,
      plan: input.plan,
      members: [],
      currentCycle: 1,
      createdAt: new Date(),
    };
    this.groups.push(group);
    return group;
  }

  async listGroups(): Promise<Group[]> {
    return this.groups.slice();
  }

  async getGroup(groupId: string): Promise<Group> {
    const g = this.groups.find((x) => x.id === groupId);
    if (!g) throw new NotFoundException('Group not found');
    return g;
  }

  async joinGroup(groupId: string, userId: string): Promise<Group> {
    const group = await this.getGroup(groupId);
    if (group.members.some((m) => m.userId === userId)) {
      throw new BadRequestException('Already joined');
    }
    if (group.members.length >= 7) {
      throw new BadRequestException('Group is full');
    }
    const position = group.members.length + 1; // 1..7
    group.members.push({ userId, position, hasReceived: false });
    return group;
  }

  async nextPayout(groupId: string): Promise<{ recipientUserId: string; totalPayout: number; feePercent: number }> {
    const group = await this.getGroup(groupId);
    const recipient = group.members.find((m) => m.position === group.currentCycle);
    if (!recipient) {
      throw new BadRequestException('Payout order not set or group incomplete');
    }
    const feePercent = this.feeFor(group.plan);
    const totalContributors = group.members.length;
    const contributionPerMember = group.amount;
    const gross = totalContributors * contributionPerMember;
    const fee = gross * feePercent;
    const totalPayout = Math.round(gross - fee);
    return { recipientUserId: recipient.userId, totalPayout, feePercent };
  }

  async markPayoutComplete(groupId: string): Promise<Group> {
    const group = await this.getGroup(groupId);
    const recipient = group.members.find((m) => m.position === group.currentCycle);
    if (!recipient) {
      throw new BadRequestException('No recipient for current cycle');
    }
    recipient.hasReceived = true;
    if (group.currentCycle >= 7) {
      group.currentCycle = 1;
      group.members.forEach((m) => (m.hasReceived = false));
    } else {
      group.currentCycle += 1;
    }
    return group;
  }
}


