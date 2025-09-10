"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import { apiService } from "../../../services/api";
import { Group } from "../../../types/group";

export default function AdminGroupsPage() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    async function load() {
      if (!token) return;
      try {
        const data = await apiService.getAdminGroups();
        setGroups(data);
      } catch (e: any) {
        console.error("Failed to load groups:", e.message);
      }
    }
    load();
  }, [token]);

  async function advance(id: string) {
    try {
      const updated = await apiService.advanceGroup(id);
      setGroups((gs) => gs.map((g) => g.id === id ? updated : g));
    } catch (e: any) {
      console.error("Failed to advance group:", e.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">Groups</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div key={g.id} className="border p-4">
            <div className="font-semibold">{g.title}</div>
            <div className="text-sm">Amount: ₦{g.amount?.toLocaleString?.() ?? g.amount} • Plan: {g.plan}</div>
            <div className="text-sm">Members: {g.members?.length ?? 0}/7 • Current cycle: {g.currentCycle}</div>
            <div className="mt-3 flex gap-2">
              <button className="px-3 py-2 border" onClick={() => advance(g.id)}>Advance Cycle</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



