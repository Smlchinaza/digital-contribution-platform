"use client";

import React, { useMemo, useState } from "react";
import { apiService } from "../../services/api";

type FrequencyOption = "weekly" | "monthly";

type RegistrationFormState = {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  dob: string;
  gender: string;
  address: string;
  nextOfKin: string;
  nextOfKinPhone: string;
  // Step 2: Financial Details
  bankName: string;
  accountNumber: string;
  accountName: string;
  nin: string;
  // Step 3: Contribution Preferences
  contributionAmount: number | null;
  frequency: FrequencyOption | "";
  startDate: string;
  agreeTerms: boolean;
  dataConsent: boolean;
};

const initialState: RegistrationFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
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
  agreeTerms: false,
  dataConsent: false,
};

const contributionOptions = [
  { amount: 5000, receive: 35000 },
  { amount: 10000, receive: 70000 },
  { amount: 20000, receive: 140000 },
  { amount: 50000, receive: 350000 },
  { amount: 100000, receive: 700000 },
];

export default function RegisterPage() {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 3;
  const [form, setForm] = useState<RegistrationFormState>(initialState);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const progressPercent = useMemo(
    () => Math.round((step / totalSteps) * 100),
    [step]
  );

  function onChange<K extends keyof RegistrationFormState>(
    key: K,
    value: RegistrationFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(current: number): boolean {
    if (current === 1) {
      const required: Array<keyof RegistrationFormState> = [
        "firstName",
        "lastName",
        "phone",
        "email",
        "password",
        "confirmPassword",
        "dob",
        "gender",
        "address",
        "nextOfKin",
        "nextOfKinPhone",
      ];
      const missing = required.filter((k) => {
        const v = form[k];
        return typeof v === "string" ? v.trim() === "" : !v;
      });
      if (missing.length) {
        alert("Please fill in all required personal information fields.");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        alert("Passwords do not match.");
        return false;
      }
      return true;
    }
    if (current === 2) {
      const required: Array<keyof RegistrationFormState> = [
        "bankName",
        "accountNumber",
        "accountName",
      ];
      const missing = required.filter((k) => {
        const v = form[k];
        return typeof v === "string" ? v.trim() === "" : !v;
      });
      if (missing.length) {
        alert("Please complete the financial details.");
        return false;
      }
      return true;
    }
    if (current === 3) {
      if (!form.contributionAmount) {
        alert("Please select a contribution amount.");
        return false;
      }
      if (!form.frequency) {
        alert("Please select a payment frequency.");
        return false;
      }
      if (!form.agreeTerms || !form.dataConsent) {
        alert("Please agree to the terms and data consent.");
        return false;
      }
      return true;
    }
    return true;
  }

  function go(dir: -1 | 1) {
    if (dir === 1) {
      if (!validateStep(step)) return;
      setStep((s) => Math.min(totalSteps, s + 1));
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit() {
    if (!validateStep(3)) return;
    try {
      setSubmitting(true);
      
      // Prepare registration data for backend
      const registrationData = {
        fullName: `${form.firstName} ${form.lastName}`,
        email: form.email,
        password: form.password,
        // Additional fields for future use
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        address: form.address,
        nextOfKin: form.nextOfKin,
        nextOfKinPhone: form.nextOfKinPhone,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        accountName: form.accountName,
        nin: form.nin,
        contributionAmount: form.contributionAmount || undefined,
        frequency: form.frequency,
        startDate: form.startDate,
      };

      const data = await apiService.register(registrationData) as { accessToken: string; user: any };
      
      // Store auth data
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      alert(
        "Registration successful! You are now logged in. You will be contacted within 24 hours for verification."
      );
      
      setForm(initialState);
      setStep(1);
      
      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-br from-indigo-400 to-purple-600 p-5">
      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 text-center text-white">
          <h1 className="text-2xl font-bold md:text-3xl">Join Our Community</h1>
          <p className="mt-2 opacity-90">
            Register to participate in our contribution groups
          </p>
          <div className="mt-5 h-1.5 rounded bg-white/30">
            <div
              className="h-1.5 rounded bg-white transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div>
          {/* Step 1 */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 p-6 md:p-10">
              <div className="text-center border-b border-neutral-200 pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Personal Information
                </h2>
                <p className="text-sm text-black">
                  Tell us about yourself
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="First Name" required>
                  <input
                    id="firstName"
                    className="w-full rounded-md border-2 border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) => onChange("firstName", e.target.value)}
                  />
                </Field>
                <Field label="Last Name" required>
                  <input
                    id="lastName"
                    className="w-full rounded-md border-2 border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={(e) => onChange("lastName", e.target.value)}
                  />
                </Field>
                <Field label="Phone Number" required>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full rounded-md border-2 border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="+234 xxx xxx xxxx"
                    value={form.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                  />
                </Field>
                <Field label="Email Address" required>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border-2 border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                  />
                </Field>
                <Field label="Password" required>
                  <input
                    id="password"
                    type="password"
                    className="w-full text-black rounded-md border-2 border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Enter a strong password"
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                  />
                </Field>
                <Field label="Confirm Password" required>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={(e) => onChange("confirmPassword", e.target.value)}
                  />
                </Field>
                <Field label="Date of Birth" required>
                  <input
                    id="dob"
                    type="date"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    value={form.dob}
                    onChange={(e) => onChange("dob", e.target.value)}
                  />
                </Field>
                <Field label="Gender" required>
                  <select
                    id="gender"
                    className="w-full rounded-md border-2 border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0 text-black"
                    value={form.gender}
                    onChange={(e) => onChange("gender", e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </Field>
                <Field className="md:col-span-2" label="Residential Address" required>
                  <textarea
                    id="address"
                    rows={3}
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Enter your full address"
                    value={form.address}
                    onChange={(e) => onChange("address", e.target.value)}
                  />
                </Field>
                <Field label="Next of Kin Name" required>
                  <input
                    id="nextOfKin"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Full name of next of kin"
                    value={form.nextOfKin}
                    onChange={(e) => onChange("nextOfKin", e.target.value)}
                  />
                </Field>
                <Field label="Next of Kin Phone" required>
                  <input
                    id="nextOfKinPhone"
                    type="tel"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="+234 xxx xxx xxxx"
                    value={form.nextOfKinPhone}
                    onChange={(e) => onChange("nextOfKinPhone", e.target.value)}
                  />
                </Field>
              </div>

              <InfoBox
                title="Why we need this information"
                body="Your personal details help us verify your identity and ensure secure participation in our contribution groups. All information is kept confidential and used only for group management purposes."
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 p-6 md:p-10">
              <div className="text-center border-b border-neutral-200 pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Financial Details
                </h2>
                <p className="text-sm text-black">
                  Help us understand your financial capacity
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Bank Name" required>
                  <input
                    id="bankName"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Your bank name"
                    value={form.bankName}
                    onChange={(e) => onChange("bankName", e.target.value)}
                  />
                </Field>
                <Field label="Account Number" required>
                  <input
                    id="accountNumber"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="10-digit account number"
                    value={form.accountNumber}
                    onChange={(e) => onChange("accountNumber", e.target.value)}
                  />
                </Field>
                <Field label="Account Name" required>
                  <input
                    id="accountName"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="Account holder name"
                    value={form.accountName}
                    onChange={(e) => onChange("accountName", e.target.value)}
                  />
                </Field>
                <Field label="National ID Number (NIN)">
                  <input
                    id="nin"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    placeholder="11-digit NIN (optional but recommended)"
                    value={form.nin}
                    onChange={(e) => onChange("nin", e.target.value)}
                  />
                </Field>
              </div>

              <div className="mt-5 rounded-md border border-amber-500 bg-amber-50 p-4">
                <h4 className="mb-1 font-semibold text-amber-700">
                  Financial Commitment Notice
                </h4>
                <p className="text-sm text-amber-800">
                  Please ensure you can comfortably afford your chosen contribution amount. Missed payments may affect group dynamics and your standing in the community.
                </p>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 p-6 md:p-10">
              <div className="text-center border-b border-neutral-200 pb-4 mb-6">
                <h2 className="text-2xl font-semibold text-black">
                  Contribution Preferences
                </h2>
                <p className="text-sm text-black">
                  Choose your contribution amount and frequency
                </p>
              </div>

              <Field label="Select Contribution Amount" required>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                  {contributionOptions.map((opt) => {
                    const selected = form.contributionAmount === opt.amount;
                    return (
                      <button
                        key={opt.amount}
                        type="button"
                        className={
                          "rounded-lg border-2 bg-neutral-50 p-4 text-left transition hover:-translate-y-0.5 hover:shadow " +
                          (selected
                            ? "border-green-600 bg-green-50"
                            : "border-neutral-200")
                        }
                        onClick={() => onChange("contributionAmount", opt.amount)}
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
                  <Field label="Payment Frequency" required>
                    <div className="flex flex-col gap-3 md:flex-row">
                      <label className="inline-flex items-center gap-2 text-black">
                        <input
                          type="radio"
                          name="frequency"
                          value="weekly"
                          checked={form.frequency === "weekly"}
                          onChange={(e) =>
                            onChange("frequency", e.target.value as FrequencyOption)
                          }
                        />
                        <span>Weekly (1% service fee)</span>
                      </label>
                      <label className="inline-flex items-center gap-2 text-black">
                        <input
                          type="radio"
                          name="frequency"
                          value="monthly"
                          checked={form.frequency === "monthly"}
                          onChange={(e) =>
                            onChange("frequency", e.target.value as FrequencyOption)
                          }
                        />
                        <span>Monthly (3% service fee)</span>
                      </label>
                    </div>
                  </Field>
                </div>
                <Field label="Preferred Start Date">
                  <select
                    id="startDate"
                    className="w-full rounded-md border-2 text-black border-neutral-200 p-3 focus:border-green-600 focus:outline-none focus:ring-0"
                    value={form.startDate}
                    onChange={(e) => onChange("startDate", e.target.value)}
                  >
                    <option value="">Select start preference</option>
                    <option value="immediate">Join next available group</option>
                    <option value="next-month">Start next month</option>
                    <option value="specific">Specific date (contact us)</option>
                  </select>
                </Field>
              </div>

              <InfoBox
                title="How Groups Work"
                body="You'll be placed in a group of 7 members. Each member contributes the same amount, and one person receives the total contribution each cycle. The order is determined fairly, and you'll know exactly when your turn will be."
              />

              <div className="mt-6 rounded-lg bg-neutral-50 p-4">
                <h4 className="font-semibold text-neutral-800">Terms and Conditions</h4>
                <div className="mt-3 max-h-56 overflow-y-auto text-black rounded border border-neutral-200 bg-white p-4 text-sm">
                  <ol className="list-decimal space-y-2 pl-5">
                    <li>
                      All members must make timely contributions according to the
                      agreed schedule.
                    </li>
                    <li>
                      Service fees are deducted from each contribution (1%
                      weekly, 3% monthly).
                    </li>
                    <li>Missed payments may result in removal from the group.</li>
                    <li>
                      Groups are managed transparently with full member
                      visibility.
                    </li>
                    <li>
                      Disputes are resolved through church leadership mediation.
                    </li>
                    <li>
                      Personal information is kept confidential and secure.
                    </li>
                    <li>
                      Participation is voluntary and members can withdraw with
                      proper notice.
                    </li>
                    <li>
                      All financial transactions are recorded and auditable.
                    </li>
                  </ol>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-black">
                    <input
                      id="agreeTerms"
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => onChange("agreeTerms", e.target.checked)}
                    />
                    <span>
                      I agree to the terms and conditions
                      <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-black">
                    <input
                      id="dataConsent"
                      type="checkbox"
                      checked={form.dataConsent}
                      onChange={(e) => onChange("dataConsent", e.target.checked)}
                    />
                    <span>
                      I consent to data collection and processing
                      <span className="ml-1 text-red-500">*</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 p-6">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={step === 1}
            className="rounded-md bg-neutral-600 px-5 py-2.5 font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-neutral-300 hover:bg-neutral-700"
          >
            Previous
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => go(1)}
              className="rounded-md bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700"
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={onSubmit}
              className="rounded-md bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-semibold text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function InfoBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 rounded-md border border-sky-600 bg-sky-50 p-4">
      <h4 className="mb-1 font-semibold text-sky-700">{title}</h4>
      <p className="text-sm text-black">{body}</p>
    </div>
  );
}


