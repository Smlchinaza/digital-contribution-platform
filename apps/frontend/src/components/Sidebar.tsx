"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";

export function Sidebar() {
  const { token } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    async function fetchGroups() {
      if (!token) return;
      const res = await fetch("http://localhost:3001/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGroups(data);
      }
    }
    fetchGroups();
  }, [token]);

  return (
    <aside className="flex flex-col gap-5">
      <div className="border-2 border-[#4caf50] p-5 bg-[#e8f5e8]">
        <h3>Your Status</h3>
        <div className="my-2 p-2 bg-white border text-[14px]">Active Groups: {groups.length}</div>
        <div className="my-2 p-2 bg-white border text-[14px]">Next Payment: —</div>
        <div className="my-2 p-2 bg-white border text-[14px]">Total Contributed: —</div>
      </div>

      <div className="border-2 border-[#ffc107] p-5 bg-[#fff3cd]">
        <h3>My Groups</h3>
        {groups.length === 0 && (
          <div className="my-2 p-2 bg-white border text-[14px]">No groups yet</div>
        )}
        {groups.map((g) => (
          <div key={g.id} className="my-2 p-2 bg-white border text-[14px]">
            {g.title}
            <br />
            <small>Members: {g.members?.length ?? 0} / 7 • Cycle: {g.currentCycle}</small>
          </div>
        ))}
      </div>

      <div className="border-2 border-[#ccc] p-5 bg-[#f9f9f9]">
        <h3>Quick Actions</h3>
        <button className="px-4 py-2 border-2 border-[#007bff] bg-[#007bff] text-white w-full my-1">Make Payment</button>
        <button className="px-4 py-2 border border-[#007bff] bg-white text-[#007bff] w-full my-1">View Schedule</button>
        <button className="px-4 py-2 border border-[#007bff] bg-white text-[#007bff] w-full my-1">Contact Support</button>
      </div>
    </aside>
  );
}



