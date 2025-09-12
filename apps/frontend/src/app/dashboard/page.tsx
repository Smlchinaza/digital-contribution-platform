"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { apiService } from "../../services/api";
import { Group } from "../../types/group";
import { Payment } from "../../types/payment";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import { CurrentGroups } from "../../components/dashboard/CurrentGroups";
import { ContributionStatus } from "../../components/dashboard/ContributionStatus";
import { PayoutSchedule } from "../../components/dashboard/PayoutSchedule";
import { BalanceHistory } from "../../components/dashboard/BalanceHistory";
import { PaymentForm } from "../../components/PaymentForm";
import Link from "next/link";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [contributions, setContributions] = useState<{
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
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [myPayments, setMyPayments] = useState<Payment[]>([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedGroupForPayment, setSelectedGroupForPayment] = useState<Group | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!token) return;
      setLoading(true);
      try {
        const [allGroups, myGroupsData, contributionsData, paymentsData] = await Promise.all([
          apiService.getGroups(),
          apiService.getMyGroups(),
          apiService.getMyContributions(),
          apiService.getMyPayments()
        ]);
        setGroups(allGroups);
        setMyGroups(myGroupsData);
        setContributions(contributionsData);
        setMyPayments(paymentsData);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [token]);

  async function join(id: string) {
    if (!token) return;
    try {
      await apiService.joinGroup(id);
      alert("Joined group successfully!");
      // Refresh all data
      const [allGroups, myGroupsData, contributionsData, paymentsData] = await Promise.all([
        apiService.getGroups(),
        apiService.getMyGroups(),
        apiService.getMyContributions(),
        apiService.getMyPayments()
      ]);
      setGroups(allGroups);
      setMyGroups(myGroupsData);
      setContributions(contributionsData);
      setMyPayments(paymentsData);
    } catch (e: any) {
      alert(`Failed to join group: ${e.message}`);
    }
  }

  async function createGroup(formData: FormData) {
    try {
      setCreating(true);
      const title = formData.get('title') as string;
      const amount = parseInt(formData.get('amount') as string);
      const plan = formData.get('plan') as string;
      
      await apiService.createGroup({ title, amount, plan });
      alert('Group created successfully!');
      setShowCreateForm(false);
      
      // Refresh all data
      const [allGroups, myGroupsData, contributionsData, paymentsData] = await Promise.all([
        apiService.getGroups(),
        apiService.getMyGroups(),
        apiService.getMyContributions(),
        apiService.getMyPayments()
      ]);
      setGroups(allGroups);
      setMyGroups(myGroupsData);
      setContributions(contributionsData);
      setMyPayments(paymentsData);
    } catch (e: any) {
      alert(`Failed to create group: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  function handlePaymentSuccess() {
    setShowPaymentForm(false);
    setSelectedGroupForPayment(null);
    // Refresh payments data
    apiService.getMyPayments().then(setMyPayments).catch(console.error);
  }

  function handlePaymentCancel() {
    setShowPaymentForm(false);
    setSelectedGroupForPayment(null);
  }

  function openPaymentForm(group: Group) {
    setSelectedGroupForPayment(group);
    setShowPaymentForm(true);
  }

  function getPaymentStatusForGroup(groupId: string) {
    return myPayments.find(p => p.groupId.toString() === groupId);
  }

  // Generate mock transaction history for now
  const mockTransactions = contributions ? [
    ...contributions.groups.flatMap(group => {
      const userMember = group.members?.find(m => m.userId);
      if (!userMember) return [];
      
      const transactions = [];
      // Add contribution transactions
      for (let i = 1; i < group.currentCycle; i++) {
        transactions.push({
          id: `${group.id}-contrib-${i}`,
          type: 'contribution' as const,
          amount: group.amount,
          groupTitle: group.title,
          date: new Date(Date.now() - (group.currentCycle - i) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed' as const
        });
      }
      
      // Add payout transaction if user has received
      if (userMember.hasReceived) {
        const feePercent = group.plan === 'weekly' ? 0.01 : 0.03;
        const totalContributors = group.members?.length || 0;
        const gross = totalContributors * group.amount;
        const fee = gross * feePercent;
        const payout = Math.round(gross - fee);
        
        transactions.push({
          id: `${group.id}-payout`,
          type: 'payout' as const,
          amount: payout,
          groupTitle: group.title,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed' as const
        });
      }
      
      return transactions;
    })
  ] : [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.fullName || 'User'}!</p>
            </div>
            {user?.isAdmin && (
              <div className="flex gap-3">
                <Link 
                  href="/admin"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Dashboard
                </Link>
                <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showCreateForm ? 'Cancel' : 'Create Group'}
                </button>
              </div>
            )}
          </div>

          {/* Admin Group Creation Form */}
          {showCreateForm && user?.isAdmin && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Create New Group</h3>
              <form onSubmit={(e) => { e.preventDefault(); createGroup(new FormData(e.currentTarget)); }}>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Group Title</label>
                    <input 
                      name="title" 
                      type="text" 
                      required 
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Weekly Savings Group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                    <select name="amount" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select amount</option>
                      <option value="5000">₦5,000</option>
                      <option value="10000">₦10,000</option>
                      <option value="20000">₦20,000</option>
                      <option value="50000">₦50,000</option>
                      <option value="100000">₦100,000</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Plan</label>
                    <select name="plan" required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select plan</option>
                      <option value="weekly">Weekly (1% fee)</option>
                      <option value="monthly">Monthly (3% fee)</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
              </form>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} onRetry={() => window.location.reload()} />
            </div>
          )}

          {/* Dashboard Content */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Contribution Status */}
              {contributions && (
                <ContributionStatus
                  totalContributed={contributions.totalContributed}
                  totalReceived={contributions.totalReceived}
                  pendingContributions={contributions.pendingContributions}
                  loading={loading}
                />
              )}

              {/* Current Groups and Payout Schedule */}
              <div className="grid lg:grid-cols-2 gap-8">
                <CurrentGroups
                  groups={myGroups}
                  loading={loading}
                  onJoinGroup={join}
                />
                
                {contributions && (
                  <PayoutSchedule
                    nextPayouts={contributions.nextPayouts}
                    loading={loading}
                  />
                )}
              </div>

              {/* Transaction History */}
              <BalanceHistory
                transactions={mockTransactions}
                loading={loading}
              />

              {/* Available Groups */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Available Groups</h2>
                {groups.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No groups available at the moment.</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {groups.map((group) => {
                      const isJoined = myGroups.some(g => g.id === group.id);
                      const paymentStatus = getPaymentStatusForGroup(group.id);
                      return (
                        <div key={group.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <h3 className="font-semibold text-lg">{group.title}</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                            <div>
                              <span className="text-gray-600">Amount:</span>
                              <p className="font-medium">₦{group.amount?.toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Plan:</span>
                              <p className="font-medium capitalize">{group.plan}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Members:</span>
                              <p className="font-medium">{group.members?.length || 0}/7</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Cycle:</span>
                              <p className="font-medium">{group.currentCycle}/7</p>
                            </div>
                          </div>
                          
                          {/* Payment Status */}
                          {isJoined && paymentStatus && (
                            <div className="mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                paymentStatus.status === 'approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : paymentStatus.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                Payment {paymentStatus.status}
                              </span>
                            </div>
                          )}

                          <div className="mt-3 flex gap-2">
                            {isJoined ? (
                              <>
                                {!paymentStatus || paymentStatus.status === 'rejected' ? (
                                  <button 
                                    onClick={() => openPaymentForm(group)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                  >
                                    Make Payment
                                  </button>
                                ) : paymentStatus.status === 'pending' ? (
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                    Payment Pending
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    Payment Approved
                                  </span>
                                )}
                              </>
                            ) : (
                              <button 
                                onClick={() => join(group.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Join Group
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedGroupForPayment && (
        <PaymentForm
          group={selectedGroupForPayment}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </ProtectedRoute>
  );
}



