import { Group } from '../types/group';
import { PayoutInfo } from '../types/payout';
import { Transaction } from '../types/transaction';
import { User } from '../types/user';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse(response);
  }

  async register(data: {
    fullName: string;
    email: string;
    password: string;
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
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Groups endpoints
  async getGroups(): Promise<Group[]> {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Group[]>(response);
  }

  async createGroup(data: { title: string; amount: number; plan: string }) {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async joinGroup(groupId: string) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getNextPayout(groupId: string): Promise<PayoutInfo> {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/next-payout`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PayoutInfo>(response);
  }

  async markPayoutComplete(groupId: string) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/mark-paid`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getAdminUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User[]>(response);
  }

  async promoteUser(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/promote`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async demoteUser(userId: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/demote`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async getAdminGroups(): Promise<Group[]> {
    const response = await fetch(`${API_BASE_URL}/admin/groups`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Group[]>(response);
  }

  async getAdminTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/admin/transactions`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Transaction[]>(response);
  }

  async advanceGroup(groupId: string): Promise<Group> {
    const response = await fetch(`${API_BASE_URL}/admin/groups/${groupId}/advance`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Group>(response);
  }

  // User dashboard endpoints
  async getMyGroups(): Promise<Group[]> {
    const response = await fetch(`${API_BASE_URL}/groups/my-groups`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Group[]>(response);
  }

  async getMyContributions(): Promise<{
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
    const response = await fetch(`${API_BASE_URL}/groups/my-contributions`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
