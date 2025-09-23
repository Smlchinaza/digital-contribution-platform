"use client";

import { useState } from "react";
import Link from "next/link";

export default function CharityFormPage() {
  const [fullName, setFullName] = useState("");
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [group, setGroup] = useState("None");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-dvh bg-[#05070b] text-white">
      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[1200px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(600px 220px at 50% 40%, rgba(34,211,238,0.25), transparent 60%)" }} />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[800px] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(400px 200px at 40% 50%, rgba(16,185,129,0.22), transparent 60%)" }} />
        <div className="absolute bottom-0 -right-20 h-[420px] w-[820px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(420px 220px at 60% 60%, rgba(168,85,247,0.18), transparent 60%)" }} />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Charity Request</h1>
          <p className="mt-2 text-white/80">Submit your charity request or pledge. We are here to help.</p>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6 text-emerald-200">
            Thank you! Your submission has been received.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-white/80">Full Name</label>
                <input
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/50 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/30"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-white/80">Preferred Contact</label>
                <div className="flex gap-3 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" className="accent-cyan-400" name="contact" value="email" checked={contactMethod === "email"} onChange={() => setContactMethod("email")} />
                    <span>Email</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" className="accent-cyan-400" name="contact" value="phone" checked={contactMethod === "phone"} onChange={() => setContactMethod("phone")} />
                    <span>Phone</span>
                  </label>
                </div>
              </div>

              {contactMethod === "email" ? (
                <div>
                  <label className="mb-1 block text-sm text-white/80">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/50 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/30"
                    placeholder="you@example.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-1 block text-sm text-white/80">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/50 outline-none focus:border-cyan-400/40 focus:ring-1 focus:ring-cyan-400/30"
                    placeholder="e.g. +234 801 234 5678"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-white/80">Church Group</label>
                <select
                  value={group}
                  onChange={e => setGroup(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none focus:border-emerald-400/40 focus:ring-1 focus:ring-emerald-400/30"
                >
                  {['Alpha','Bethel','Ebenezer','Omega','None'].map(opt => (
                    <option key={opt} value={opt} className="bg-black">{opt}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-white/80">Message / Need</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={6}
                  required
                  className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-white/50 outline-none focus:border-purple-400/40 focus:ring-1 focus:ring-purple-400/30"
                  placeholder="Describe your request or pledge"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <Link href="/" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition">← Back</Link>
              <button type="submit" className="rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 py-2 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5">Submit</button>
            </div>

            <p className="mt-6 text-sm text-white/70">
              We will take our time to go through your request and get back to you if we wish to engage. Please exercise patience with us. If it's urgent, please contact your group leader.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}


