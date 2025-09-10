export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  userId: string;
  groupId?: string;
}
