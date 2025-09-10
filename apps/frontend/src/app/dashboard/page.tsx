"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { apiService } from "../../services/api";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage";
import Link from "next/link";

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchGroups() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiService.getGroups();
        setGroups(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, [token]);

  async function join(id: string) {
    if (!token) return;
    try {
      await apiService.joinGroup(id);
      alert("Joined group successfully!");
      // Refresh groups list
      const data = await apiService.getGroups();
      setGroups(data);
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
      
      // Refresh groups list
      const data = await apiService.getGroups();
      setGroups(data);
    } catch (e: any) {
      alert(`Failed to create group: ${e.message}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f5f5f5] text-[#333]">
        <div className="max-w-[1200px] mx-auto bg-white border-2 border-[#ccc] p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl">My Dashboard</h1>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showCreateForm ? 'Cancel' : 'Create Group'}
            </button>
          </div>
          
          {showCreateForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">Create New Group</h3>
              <form onSubmit={(e) => { e.preventDefault(); createGroup(new FormData(e.currentTarget)); }}>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Group Title</label>
                    <input 
                      name="title" 
                      type="text" 
                      required 
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Weekly Savings Group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount (₦)</label>
                    <select name="amount" required className="w-full p-2 border rounded">
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
                    <select name="plan" required className="w-full p-2 border rounded">
                      <option value="">Select plan</option>
                      <option value="weekly">Weekly (1% fee)</option>
                      <option value="monthly">Monthly (3% fee)</option>
                    </select>
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
              </form>
            </div>
          )}
          
          {loading && <LoadingSpinner size="lg" className="my-8" />}
          {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} className="mb-4" />}
          <div className="grid md:grid-cols-2 gap-5">
            {groups.map((g) => (
              <div key={g.id} className="border p-4">
                <h3 className="font-semibold">{g.title}</h3>
                <p className="text-sm">Amount: ₦{g.amount?.toLocaleString?.() ?? g.amount}</p>
                <p className="text-sm">Plan: {g.plan}</p>
                <p className="text-sm">Members: {g.members?.length ?? 0} / 7</p>
                <p className="text-sm">Current cycle: {g.currentCycle}</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 border bg-[#28a745] text-white" onClick={() => join(g.id)}>Join</button>
                  <button className="px-3 py-2 border" onClick={async ()=>{
                    try {
                      const d = await apiService.getNextPayout(g.id);
                      alert(`Next recipient: ${d.recipientUserId}, Total payout: ₦${d.totalPayout.toLocaleString()}`);
                    } catch (e: any) {
                      alert(`Error: ${e.message}`);
                    }
                  }}>Next payout</button>
                  <button className="px-3 py-2 border" onClick={async ()=>{
                    try {
                      await apiService.markPayoutComplete(g.id);
                      alert('Marked as paid, advanced cycle');
                      // Refresh groups list
                      const data = await apiService.getGroups();
                      setGroups(data);
                    } catch (e: any) {
                      alert(`Error: ${e.message}`);
                    }
                  }}>Mark paid</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}



