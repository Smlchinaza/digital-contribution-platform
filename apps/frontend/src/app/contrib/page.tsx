"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import { Header } from "../../components/Header";
import { Hero } from "../../components/Hero";
import { Tiers } from "../../components/Tiers";
import { HowItWorks } from "../../components/HowItWorks";
import { Team } from "../../components/Team";
import { Support } from "../../components/Support";

export default function ContribHome() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const storedToken = token || localStorage.getItem('token');
    const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');

    if (storedToken && storedUser) {
      router.push('/dashboard');
    }
  }, [user, token, router, isClient]);

  if (isClient && (user || token || localStorage.getItem('token'))) {
    return null;
  }

  return (
    <div className="min-h-dvh relative overflow-hidden bg-[radial-gradient(1200px_600px_at_20%_-10%,#22d3ee_0%,transparent_60%),radial-gradient(1000px_600px_at_110%_10%,#8b5cf6_0%,transparent_60%),linear-gradient(to_bottom_right,#0f172a,#111827)] text-white">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(900px_300px_at_50%_110%, rgba(16,185,129,0.12), transparent 60%)" }} />
      <div className="relative mx-auto max-w-[1200px]">
        <Header />

        <div className="mx-5 mt-5 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
          <Hero />
        </div>

        <div className="px-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
            <Tiers />
          </div>

          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <HowItWorks />
          </div>

          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <Team />
          </div>

          <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <Support />
          </div>

          <footer className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
            <p className="text-white/90">© 2025 Digital Contributory System · support@churchcontrib.org</p>
          </footer>
        </div>
      </div>
    </div>
  );
}


