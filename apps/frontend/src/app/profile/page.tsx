"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { ProtectedRoute } from "../../components/ProtectedRoute";

type FrequencyOption = "weekly" | "monthly";

type ProfileData = {
  // Personal
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  // Financial
  bankName: string;
  accountNumber: string;
  accountName: string;
  nin: string;
  // Contribution preferences
  contributionAmount: number | null;
  frequency: FrequencyOption | "";
  startDate: string;
};

const defaultProfile: ProfileData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dob: "",
  gender: "",
  address: "",
  nextOfKin: "",
  nextOfKinPhone: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  nin: "",
  contributionAmount: null,
  frequency: "",
  startDate: "",
};

const contributionOptions = [
  { amount: 5000, receive: 35000 },
  { amount: 10000, receive: 70000 },
  { amount: 20000, receive: 140000 },
  { amount: 50000, receive: 350000 },
  { amount: 100000, receive: 700000 },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [data, setData] = useState<ProfileData>(defaultProfile);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    // Prefill from localStorage if present
    const stored = localStorage.getItem("profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData((prev) => ({ ...prev, ...parsed }));
      } catch {}
    }
    // Fallback email/fullName
    if (user) {
      setData((prev) => ({
        ...prev,
        email: prev.email || user.email || "",
        firstName: prev.firstName || (user.fullName?.split(" ")[0] ?? ""),
        lastName:
          prev.lastName || (user.fullName?.split(" ").slice(1).join(" ") ?? ""),
      }));
    }
  }, [user]);

  function onChange<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    if (!editing) return;
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function onSave() {
    setSaving(true);
    try {
      // TODO: integrate backend profile save
      await new Promise((r) => setTimeout(r, 500));
      localStorage.setItem("profile", JSON.stringify(data));
      setEditing(false);
      alert("Profile saved");
    } finally {
      setSaving(false);
    }
  }

  const headerTitle = useMemo(
    () => (editing ? "Edit Profile" : "Your Profile"),
    [editing]
  );

  const displayName = useMemo(() => {
    if (data.firstName || data.lastName) return `${data.firstName} ${data.lastName}`.trim();
    if (user?.fullName) return user.fullName;
    return "Your Name";
  }, [data.firstName, data.lastName, user]);

  const stats = useMemo(
    () => [
      { label: "Active Groups", value: 0 },
      { label: "Total Contributed", value: "₦0" },
      { label: "Next Payment", value: "—" },
      { label: "Turn Position", value: "—" },
    ],
    []
  );

  return (
    <ProtectedRoute>
      <div className="min-h-dvh bg-[radial-gradient(1200px_600px_at_20%_-10%,#8b5cf6_0%,transparent_60%),radial-gradient(1000px_600px_at_110%_10%,#22d3ee_0%,transparent_60%),linear-gradient(to_bottom_right,#0f172a,#111827)] p-5 md:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Hero / Header */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(600px 200px at 10% 0%, rgba(34,211,238,0.15), transparent 60%)" }} />
          <div className="relative flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">{headerTitle}</h1>
              <p className="mt-2 text-white/80">Welcome, <span className="text-white">{displayName}</span>. Manage your contributions and profile.</p>
            </div>
            <div className="flex gap-3">
              {!editing ? (
                <button
                  type="button"
                  className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-lg bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20"
                    onClick={() => setEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-60"
                    onClick={onSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-white">
                <div className="text-xs uppercase tracking-wide text-white/70">{s.label}</div>
                <div className="mt-1 text-2xl font-bold">{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid: Quick Actions + Activity + Settings */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Quick Actions */}
          <div className="md:col-span-1 rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
            <div className="flex flex-col gap-3">
              <button className="rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 font-semibold text-white shadow hover:opacity-90">Join a Group</button>
              <button className="rounded-lg bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 font-semibold text-white shadow hover:opacity-90">Make a Payment</button>
              <button className="rounded-lg bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20">View Schedule</button>
              <button className="rounded-lg bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20">Contact Support</button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-white backdrop-blur">
            <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="text-white/90">No recent activity yet.</span>
                <span className="text-xs text-white/60">—</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Profile Settings Editor */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
          <h3 className="mb-6 text-lg font-semibold">Profile Settings</h3>
          {/* Personal */}
          <Section title="Personal Information">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="First Name">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="First name"
                  value={data.firstName}
                  onChange={(e) => onChange("firstName", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Last Name">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="Last name"
                  value={data.lastName}
                  onChange={(e) => onChange("lastName", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Phone Number">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="+234 xxx xxx xxxx"
                  value={data.phone}
                  onChange={(e) => onChange("phone", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="your.email@example.com"
                  value={data.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Date of Birth">
                <input
                  type="date"
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  value={data.dob}
                  onChange={(e) => onChange("dob", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Gender">
                <select
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  value={data.gender}
                  onChange={(e) => onChange("gender", e.target.value)}
                  disabled={!editing}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </Field>
              <Field className="md:col-span-2" label="Residential Address">
                <textarea
                  rows={3}
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="Full address"
                  value={data.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Next of Kin Name">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="Full name of next of kin"
                  value={data.nextOfKin}
                  onChange={(e) => onChange("nextOfKin", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Next of Kin Phone">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="+234 xxx xxx xxxx"
                  value={data.nextOfKinPhone}
                  onChange={(e) => onChange("nextOfKinPhone", e.target.value)}
                  disabled={!editing}
                />
              </Field>
            </div>
          </Section>

          {/* Financial */}
          <Section title="Financial Details">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Bank Name">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="Your bank name"
                  value={data.bankName}
                  onChange={(e) => onChange("bankName", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Account Number">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="10-digit account number"
                  value={data.accountNumber}
                  onChange={(e) => onChange("accountNumber", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="Account Name">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="Account holder name"
                  value={data.accountName}
                  onChange={(e) => onChange("accountName", e.target.value)}
                  disabled={!editing}
                />
              </Field>
              <Field label="National ID Number (NIN)">
                <input
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  placeholder="11-digit NIN (optional)"
                  value={data.nin}
                  onChange={(e) => onChange("nin", e.target.value)}
                  disabled={!editing}
                />
              </Field>
            </div>
          </Section>

          {/* Preferences */}
          <Section title="Contribution Preferences">
            <Field label="Selected Contribution Amount">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {contributionOptions.map((opt) => {
                  const selected = data.contributionAmount === opt.amount;
                  return (
                    <button
                      key={opt.amount}
                      type="button"
                      className={
                        "rounded-lg border-2 bg-neutral-50 p-4 text-left transition " +
                        (selected
                          ? "border-green-600 bg-green-50"
                          : "border-neutral-200")
                      }
                      onClick={() => editing && setData((p) => ({ ...p, contributionAmount: opt.amount }))}
                      disabled={!editing}
                    >
                      <div className="text-xl font-bold text-green-600">
                        ₦{opt.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-black">
                        Receive ₦{opt.receive.toLocaleString()}<br />
                        when it's your turn
                      </div>
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Payment Frequency">
                  <div className="flex flex-col gap-3 md:flex-row text-black">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="weekly"
                        checked={data.frequency === "weekly"}
                        onChange={(e) => editing && setData((p) => ({ ...p, frequency: e.target.value as FrequencyOption }))}
                        disabled={!editing}
                      />
                      <span>Weekly (1% service fee)</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="frequency"
                        value="monthly"
                        checked={data.frequency === "monthly"}
                        onChange={(e) => editing && setData((p) => ({ ...p, frequency: e.target.value as FrequencyOption }))}
                        disabled={!editing}
                      />
                      <span>Monthly (3% service fee)</span>
                    </label>
                  </div>
                </Field>
              </div>

              <Field label="Preferred Start Date">
                <select
                  className="w-full rounded-md border-2 border-neutral-200 p-3 text-black focus:border-green-600 focus:outline-none focus:ring-0"
                  value={data.startDate}
                  onChange={(e) => onChange("startDate", e.target.value)}
                  disabled={!editing}
                >
                  <option value="">Select start preference</option>
                  <option value="immediate">Join next available group</option>
                  <option value="next-month">Start next month</option>
                  <option value="specific">Specific date (contact us)</option>
                </select>
              </Field>
            </div>
          </Section>

          {/* Actions */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-6">
            {!editing ? (
              <button
                type="button"
                className="rounded-lg bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-5 py-2.5 font-semibold text-white hover:bg-white/20"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 disabled:opacity-60"
                  onClick={onSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="mb-6 border-b border-white/10 pb-3 text-center">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-semibold text-black">{label}</label>
      {children}
    </div>
  );
}


