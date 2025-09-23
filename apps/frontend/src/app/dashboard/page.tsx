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
  const { token, user, logout } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [contributions, setContributions] = useState<{
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

  async function join(id: number) {
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

  function getPaymentStatusForGroup(groupId: number) {
    return myPayments.find(p => p.groupId === groupId);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
          {/* Futuristic Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg blur opacity-30"></div>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Personal Dashboard
                  </h1>
                  <p className="text-slate-400 text-sm sm:text-base">Welcome back, {user?.fullName || 'User'}!</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {user?.isAdmin && (
                  <>
                    <Link 
                      href="/admin"
                      className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Dashboard
                    </Link>
                    <button 
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-sm sm:text-base"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {showCreateForm ? 'Cancel' : 'Create Group'}
                    </button>
                  </>
                )}
                <button 
                  onClick={logout}
                  className="group w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Admin Group Creation Form */}
          {showCreateForm && user?.isAdmin && (
            <div className="mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    Create New Group
                  </h3>
                  <p className="text-slate-400">Set up a new contribution group for members</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); createGroup(new FormData(e.currentTarget)); }}>
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Group Title</label>
                      <input 
                        name="title" 
                        type="text" 
                        required 
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        placeholder="e.g., Weekly Savings Group"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Amount (₦)</label>
                      <select name="amount" required className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300">
                        <option value="">Select amount</option>
                        <option value="5000">₦5,000</option>
                        <option value="10000">₦10,000</option>
                        <option value="20000">₦20,000</option>
                        <option value="50000">₦50,000</option>
                        <option value="100000">₦100,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-300">Plan</label>
                      <select name="plan" required className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300">
                        <option value="">Select plan</option>
                        <option value="weekly">Weekly (1% fee)</option>
                        <option value="monthly">Monthly (3% fee)</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-center">
                    <button 
                      type="submit" 
                      disabled={creating}
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 mx-auto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {creating ? 'Creating...' : 'Create Group'}
                    </button>
                  </div>
                </form>
              </div>
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
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
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
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-3xl backdrop-blur-sm border border-slate-600/20"></div>
                <div className="relative p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      Available Groups
                    </h2>
                    <p className="text-slate-400">Join groups to start your contribution journey</p>
                  </div>
                  
                  {groups.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-slate-400 text-lg">No groups available at the moment.</p>
                      <p className="text-slate-500 text-sm mt-2">Check back later for new opportunities!</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {groups.map((group) => {
                        const isJoined = myGroups.some(g => g.id === group.id);
                        const paymentStatus = getPaymentStatusForGroup(group.id);
                        return (
                          <div key={group.id} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                            <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-300">
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg text-white">{group.title}</h3>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-xs text-slate-400">Active</span>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="text-slate-400">Amount:</span>
                                  <p className="font-semibold text-cyan-400">₦{group.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Plan:</span>
                                  <p className="font-semibold text-white capitalize">{group.plan}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Members:</span>
                                  <p className="font-semibold text-white">{group.members?.length || 0}/7</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Cycle:</span>
                                  <p className="font-semibold text-white">{group.currentCycle}/7</p>
                                </div>
                              </div>
                              
                              {/* Payment Status */}
                              {isJoined && paymentStatus && (
                                <div className="mb-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    paymentStatus.status === 'approved' 
                                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                      : paymentStatus.status === 'rejected'
                                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                  }`}>
                                    Payment {paymentStatus.status}
                                  </span>
                                </div>
                              )}

                              <div className="mt-4">
                                {isJoined ? (
                                  <>
                                    {!paymentStatus || paymentStatus.status === 'rejected' ? (
                                      <button 
                                        onClick={() => openPaymentForm(group)}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
                                      >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Make Payment
                                      </button>
                                    ) : paymentStatus.status === 'pending' ? (
                                      <div className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded-xl border border-yellow-500/30 flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                                        Payment Pending
                                      </div>
                                    ) : (
                                      <div className="w-full px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-xl border border-green-500/30 flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Payment Approved
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <button 
                                    onClick={() => join(group.id)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Join Group
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
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



