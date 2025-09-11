"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { API_BASE_URL } from "../services/api";

type PlanType = "weekly" | "monthly";

const TIERS = [5000, 10000, 20000, 50000, 100000] as const;

export function Tiers() {
  const { token } = useAuth();
  const [planByTier, setPlanByTier] = useState<Record<number, PlanType>>({});
  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    // default monthly
    const initial: Record<number, PlanType> = {};
    TIERS.forEach((t) => (initial[t] = "monthly"));
    setPlanByTier(initial);
  }, []);

  function togglePlan(amount: number, plan: PlanType) {
    setPlanByTier((prev) => ({ ...prev, [amount]: plan }));
  }

  // Create group action removed per redesign

  return (
    <section id="tiers" className="p-6">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Available Contribution Groups</h2>

      {/* Mobile: show only 2, with Show more */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:hidden">
        {(showAllMobile ? TIERS : TIERS.slice(0, 2)).map((amount) => (
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
            </div>
          </div>
        ))}

        <button
          className="mt-2 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-white hover:bg-white/15 transition"
          onClick={() => setShowAllMobile((s) => !s)}
        >
          {showAllMobile ? "Show less" : "Show more"}
        </button>
      </div>

      {/* Desktop/Tablet: show all */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



