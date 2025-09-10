"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>({ users: 0, groups: 0, transactions: 0 });

  useEffect(() => {
    async function load() {
      if (!token) return;
      const [users, groups, tx] = await Promise.all([
        fetch("http://localhost:3001/admin/users", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch("http://localhost:3001/admin/groups", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        fetch("http://localhost:3001/admin/transactions", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      ]);
      setStats({ users: users.length, groups: groups.length, transactions: tx.length });
    }
    load();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Overview</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border p-4"><div className="font-semibold">Users</div><div className="text-2xl">{stats.users}</div></div>
        <div className="border p-4"><div className="font-semibold">Groups</div><div className="text-2xl">{stats.groups}</div></div>
        <div className="border p-4"><div className="font-semibold">Transactions</div><div className="text-2xl">{stats.transactions}</div></div>
      </div>
    </div>
  );
}



