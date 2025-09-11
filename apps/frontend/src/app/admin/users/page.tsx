"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { apiService } from "../../../services/api";
import { User } from "../../../types/user";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const data = await apiService.getAdminUsers();
        setUsers(data);
      } catch (e: any) {
        console.error("Failed to load users:", e.message);
      }
    }
    load();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Users</h1>
      <div className="overflow-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-[#f9f9f9]">
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Admin</th>
              <th className="border p-2 text-left">Created</th>
              <th className="border p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.fullName}</td>
                <td className="border p-2">{u.isAdmin ? 'Yes' : 'No'}</td>
                <td className="border p-2">{new Date(u.createdAt).toLocaleString()}</td>
                <td className="border p-2">
                  {u.isAdmin ? (
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded"
                      onClick={async () => {
                        try {
                          const updated = await apiService.demoteUser(u.id);
                          setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
                        } catch (e: any) {
                          console.error('Failed to demote user:', e.message);
                        }
                      }}
                    >
                      Demote
                    </button>
                  ) : (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={async () => {
                        try {
                          const updated = await apiService.promoteUser(u.id);
                          setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
                        } catch (e: any) {
                          console.error('Failed to promote user:', e.message);
                        }
                      }}
                    >
                      Promote
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



