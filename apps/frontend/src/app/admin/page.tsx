"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { API_BASE_URL } from "../../services/api";
import { apiService } from "../../services/api";

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>({ users: 0, groups: 0, transactions: 0 });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      if (!token) return;
      const [users, groups, tx] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/groups`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/transactions`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setStats({ users: users.length, groups: groups.length, transactions: tx.length });
    }
    load();
  }, [token]);

  const handlePromoteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      await apiService.promoteUserByEmail(email.trim());
      setMessage(`Successfully promoted ${email} to admin`);
      setEmail("");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoteByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    setMessage("");
    
    try {
      await apiService.demoteUserByEmail(email.trim());
      setMessage(`Successfully demoted ${email} from admin`);
      setEmail("");
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Overview</h1>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="border p-4"><div className="font-semibold">Users</div><div className="text-2xl">{stats.users}</div></div>
        <div className="border p-4"><div className="font-semibold">Groups</div><div className="text-2xl">{stats.groups}</div></div>
        <div className="border p-4"><div className="font-semibold">Transactions</div><div className="text-2xl">{stats.transactions}</div></div>
      </div>

      {/* Promote/Demote User by Email Section */}
      <div className="border p-6 rounded-lg">
        <h2 className="text-xl mb-4">Manage User Admin Status</h2>
        <p className="text-gray-600 mb-4">Promote or demote users to/from admin status using their email address.</p>
        
        <form onSubmit={handlePromoteByEmail} className="mb-4">
          <div className="flex gap-2 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Promote to Admin"}
            </button>
          </div>
        </form>

        <form onSubmit={handleDemoteByEmail}>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Demote from Admin"}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes("Error") 
              ? "bg-red-100 text-red-700 border border-red-300" 
              : "bg-green-100 text-green-700 border border-green-300"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}







