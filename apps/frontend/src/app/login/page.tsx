"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh relative overflow-hidden bg-[radial-gradient(1200px_600px_at_20%_-10%,#22d3ee_0%,transparent_60%),radial-gradient(1000px_600px_at_110%_10%,#8b5cf6_0%,transparent_60%),linear-gradient(to_bottom_right,#0f172a,#111827)]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(800px_300px_at_50%_110%, rgba(16,185,129,0.15), transparent 60%)" }} />
      <div className="mx-auto flex min-h-dvh max-w-7xl items-center justify-center p-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-md md:p-8">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h1>
            <p className="mt-1 text-white/80">Sign in to continue</p>

            {error && <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-rose-200">{error}</div>}

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border-2 border-white/10 bg-white/10 p-3 text-white placeholder-white/50 outline-none transition focus:border-cyan-400/60"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border-2 border-white/10 bg-white/10 p-3 text-white placeholder-white/50 outline-none transition focus:border-cyan-400/60"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 p-3 font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading?"Please wait...":"Login"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm text-white/80">
              <Link href="/" className="hover:text-white">Back to Home</Link>
              <div>
                Don't have an account? <Link className="text-cyan-300 underline hover:text-cyan-200" href="/register">Sign up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



