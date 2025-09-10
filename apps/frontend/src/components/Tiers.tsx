"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";

type PlanType = "weekly" | "monthly";

const TIERS = [5000, 10000, 20000, 50000, 100000] as const;

export function Tiers() {
  const { token } = useAuth();
  const [planByTier, setPlanByTier] = useState<Record<number, PlanType>>({});

  useEffect(() => {
    // default monthly
    const initial: Record<number, PlanType> = {};
    TIERS.forEach((t) => (initial[t] = "monthly"));
    setPlanByTier(initial);
  }, []);

  function togglePlan(amount: number, plan: PlanType) {
    setPlanByTier((prev) => ({ ...prev, [amount]: plan }));
  }

  async function createGroup(amount: number) {
    if (!token) {
      alert("Please login to create/join a group.");
      return;
    }
    const res = await fetch("http://localhost:3001/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: `₦${amount.toLocaleString()} ${planByTier[amount] === "weekly" ? "Weekly" : "Monthly"} Group`,
        amount: amount,
        plan: planByTier[amount],
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      alert(`Failed to create group: ${t}`);
      return;
    }
    const g = await res.json();
    alert(`Group created: ${g.title}. Now join from dashboard.`);
  }

  return (
    <section id="tiers" className="p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Available Contribution Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {TIERS.map((amount) => (
          <div key={amount} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 blur-xl" />
            <div className="relative">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-3">
                ₦{amount.toLocaleString()}
              </div>
              <div className="my-3 text-sm leading-6 text-white/80">
                • 7 members per group<br />
                • Receive ₦{(amount * 7).toLocaleString()} when it's your turn<br />
                • Groups available: forming
              </div>
              <div className="my-4 flex gap-2">
                <button
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                    planByTier[amount] === "monthly" 
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg" 
                      : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                  }`}
                  onClick={() => togglePlan(amount, "monthly")}
                >
                  Monthly (3% fee)
                </button>
                <button
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                    planByTier[amount] === "weekly" 
                      ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg" 
                      : "bg-white/10 text-white/70 border border-white/20 hover:bg-white/20"
                  }`}
                  onClick={() => togglePlan(amount, "weekly")}
                >
                  Weekly (1% fee)
                </button>
              </div>
              <button 
                className="w-full p-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5" 
                onClick={() => createGroup(amount)}
              >
                Create Group
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



