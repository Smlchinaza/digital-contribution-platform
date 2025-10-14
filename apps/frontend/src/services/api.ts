import { Group } from '../types/group';
import { PayoutInfo } from '../types/payout';
import { Transaction } from '../types/transaction';
import { User } from '../types/user';
import { Payment, CreatePaymentDto, UpdatePaymentStatusDto } from '../types/payment';
import { Sermon } from '../types/sermon';

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

  async joinGroup(groupId: number) {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/join`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getNextPayout(groupId: number): Promise<PayoutInfo> {
    const response = await fetch(`${API_BASE_URL}/groups/${groupId}/next-payout`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PayoutInfo>(response);
  }

  async markPayoutComplete(groupId: number) {
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

  async promoteUserByEmail(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/promote-by-email`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email }),
    });
    return this.handleResponse<User>(response);
  }

  async demoteUserByEmail(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/admin/users/demote-by-email`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email }),
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

  async advanceGroup(groupId: number): Promise<Group> {
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
      groupId: number;
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

  // Payment endpoints
  async createPayment(data: CreatePaymentDto): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Payment>(response);
  }

  async getMyPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/payments/my-payments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment[]>(response);
  }

  async getAllPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment[]>(response);
  }

  async getPendingPayments(): Promise<Payment[]> {
    const response = await fetch(`${API_BASE_URL}/payments/pending`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment[]>(response);
  }

  async getPaymentById(paymentId: number): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<Payment>(response);
  }

  async updatePaymentStatus(paymentId: number, data: UpdatePaymentStatusDto): Promise<Payment> {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<Payment>(response);
  }

  // Admin group management endpoints
  async addUserToGroup(groupId: number, userId: number, position?: number): Promise<Group> {
    const response = await fetch(`${API_BASE_URL}/admin/groups/${groupId}/add-user`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, position }),
    });
    return this.handleResponse<Group>(response);
  }

  async removeUserFromGroup(groupId: number, userId: number): Promise<Group> {
    const response = await fetch(`${API_BASE_URL}/admin/groups/${groupId}/remove-user`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    return this.handleResponse<Group>(response);
  }

  async assignNextPayout(groupId: number, userId: number): Promise<Group> {
    const response = await fetch(`${API_BASE_URL}/admin/groups/${groupId}/assign-payout`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    return this.handleResponse<Group>(response);
  }

  // Sermon endpoints
  async getSermons(): Promise<Sermon[]> {
    const response = await fetch(`${API_BASE_URL}/sermons`);
    return this.handleResponse<Sermon[]>(response);
  }

  async getSermonById(id: number): Promise<Sermon> {
    const response = await fetch(`${API_BASE_URL}/sermons/${id}`);
    return this.handleResponse<Sermon>(response);
  }

  async createSermon(formData: FormData, onProgress?: (progress: number) => void) {
    const token = localStorage.getItem('token');
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(xhr.responseText || `HTTP error! status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener('error', () => {
        reject(new Error('Network error'));
      });
      
      xhr.open('POST', `${API_BASE_URL}/sermons`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }

  async updateSermon(id: number, formData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/sermons/${id}`, {
      method: 'PATCH',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async deleteSermon(id: number) {
    const response = await fetch(`${API_BASE_URL}/sermons/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async incrementSermonPlayCount(id: number) {
    const response = await fetch(`${API_BASE_URL}/sermons/${id}/play`, {
      method: 'POST',
    });
    return this.handleResponse(response);
  }

  async incrementSermonDownloadCount(id: number) {
    const response = await fetch(`${API_BASE_URL}/sermons/${id}/download`, {
      method: 'POST',
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();
