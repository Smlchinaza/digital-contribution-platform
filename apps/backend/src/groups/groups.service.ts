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

  async getUserGroups(userId: string): Promise<Group[]> {
    return this.groups.filter(group => 
      group.members.some(member => member.userId === userId)
    );
  }

  async addUserToGroup(groupId: string, userId: string, position?: number): Promise<Group> {
    const group = await this.getGroup(groupId);
    
    // Check if user is already in the group
    if (group.members.some((m) => m.userId === userId)) {
      throw new BadRequestException('User is already in this group');
    }
    
    // Check if group is full
    if (group.members.length >= 7) {
      throw new BadRequestException('Group is full');
    }
    
    // If position is provided, check if it's valid and available
    if (position !== undefined) {
      if (position < 1 || position > 7) {
        throw new BadRequestException('Position must be between 1 and 7');
      }
      if (group.members.some((m) => m.position === position)) {
        throw new BadRequestException('Position is already taken');
      }
    } else {
      // Auto-assign next available position
      position = group.members.length + 1;
    }
    
    group.members.push({ userId, position, hasReceived: false });
    return group;
  }

  async removeUserFromGroup(groupId: string, userId: string): Promise<Group> {
    const group = await this.getGroup(groupId);
    const memberIndex = group.members.findIndex((m) => m.userId === userId);
    
    if (memberIndex === -1) {
      throw new BadRequestException('User is not in this group');
    }
    
    group.members.splice(memberIndex, 1);
    return group;
  }

  async assignNextPayout(groupId: string, userId: string): Promise<Group> {
    const group = await this.getGroup(groupId);
    const member = group.members.find((m) => m.userId === userId);
    
    if (!member) {
      throw new BadRequestException('User is not in this group');
    }
    
    // Set the current cycle to this user's position
    group.currentCycle = member.position;
    return group;
  }

  async getUserContributions(userId: string): Promise<{
    groups: Group[];
    totalContributed: number;
    totalReceived: number;
    pendingContributions: number;
    nextPayouts: Array<{
      groupId: string;
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
    const nextPayouts: Array<{
      groupId: string;
      groupTitle: string;
      amount: number;
      position: number;
      estimatedDate: string;
    }> = [];

    for (const group of userGroups) {
      const userMember = group.members.find(m => m.userId === userId);
      if (!userMember) continue;

      // Calculate contributions based on cycles completed
      const cyclesCompleted = group.currentCycle - 1;
      const userContribution = cyclesCompleted * group.amount;
      totalContributed += userContribution;

      // Check if user has received payout
      if (userMember.hasReceived) {
        const feePercent = this.feeFor(group.plan);
        const totalContributors = group.members.length;
        const gross = totalContributors * group.amount;
        const fee = gross * feePercent;
        const payout = Math.round(gross - fee);
        totalReceived += payout;
      }

      // Calculate pending contributions
      if (group.currentCycle <= userMember.position) {
        pendingContributions += group.amount;
      }

      // Add to next payouts if user hasn't received yet
      if (!userMember.hasReceived) {
        const feePercent = this.feeFor(group.plan);
        const totalContributors = group.members.length;
        const gross = totalContributors * group.amount;
        const fee = gross * feePercent;
        const payout = Math.round(gross - fee);
        
        // Estimate payout date based on position and plan
        const weeksUntilPayout = userMember.position - group.currentCycle;
        const estimatedDate = new Date();
        if (group.plan === 'weekly') {
          estimatedDate.setDate(estimatedDate.getDate() + (weeksUntilPayout * 7));
        } else {
          estimatedDate.setMonth(estimatedDate.getMonth() + weeksUntilPayout);
        }

        nextPayouts.push({
          groupId: group.id,
          groupTitle: group.title,
          amount: payout,
          position: userMember.position,
          estimatedDate: estimatedDate.toISOString().split('T')[0]
        });
      }
    }

    return {
      groups: userGroups,
      totalContributed,
      totalReceived,
      pendingContributions,
      nextPayouts: nextPayouts.sort((a, b) => new Date(a.estimatedDate).getTime() - new Date(b.estimatedDate).getTime())
    };
  }
}


