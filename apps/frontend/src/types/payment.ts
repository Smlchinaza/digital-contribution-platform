export interface Payment {
  id: number;
  userId: number;
  groupId: number;
  amount: number;
  userBankName: string;
  userAccountName: string;
  userAccountNumber: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
  group?: {
    id: number;
    title: string;
    amount: number;
    plan: string;
  };
}

export interface CreatePaymentDto {
  groupId: number;
  amount: number;
  userBankName: string;
  userAccountName: string;
  userAccountNumber: string;
  receiptUrl?: string;
}

export interface UpdatePaymentStatusDto {
  status: 'approved' | 'rejected';
  adminNotes?: string;
}

