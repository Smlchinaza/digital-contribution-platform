"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { apiService } from "../../../services/api";

export default function AdminTransactionsPage() {
  const { token } = useAuth();
  const [tx, setTx] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const data = await apiService.getAdminTransactions();
        setTx(data);
      } catch (e: any) {
        console.error("Failed to load transactions:", e.message);
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Transactions</h1>
      {tx.length === 0 ? (
        <div className="text-sm">No transactions yet</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full border">
            <thead>
              <tr className="bg-[#f9f9f9]">
                <th className="border p-2 text-left">Ref</th>
                <th className="border p-2 text-left">User</th>
                <th className="border p-2 text-left">Group</th>
                <th className="border p-2 text-left">Amount</th>
                <th className="border p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tx.map((t) => (
                <tr key={t.reference}>
                  <td className="border p-2">{t.reference}</td>
                  <td className="border p-2">{t.userId}</td>
                  <td className="border p-2">{t.groupId}</td>
                  <td className="border p-2">₦{t.amount?.toLocaleString?.() ?? t.amount}</td>
                  <td className="border p-2">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



