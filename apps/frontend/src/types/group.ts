export interface GroupMember {
  userId: number;
  position: number;
  hasReceived: boolean;
}

export interface Group {
  id: number;
  title: string;
  amount: number;
  plan: string;
  currentCycle: number;
  members: GroupMember[];
}
