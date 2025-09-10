export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  nextOfKin?: string;
  nextOfKinPhone?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  nin?: string;
  contributionAmount?: number;
  frequency?: string;
  startDate?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
