"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
    <div className="min-h-dvh bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 min-h-dvh flex items-center justify-center p-5">
        <div className="mx-auto w-full max-w-4xl">
          {/* Futuristic Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-30"></div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Join Our Community
            </h1>
            <p className="text-slate-400 text-lg">
              Register to participate in our contribution groups
            </p>
            
            {/* Progress Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="mt-8 flex items-center justify-between text-sm text-slate-400 max-w-md mx-auto">
              <Link href="/" className="hover:text-white flex items-center gap-2 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </Link>
              <div>
                Already have an account? <Link className="text-cyan-400 underline hover:text-cyan-300 transition-colors" href="/login">Sign in</Link>
              </div>
            </div>
          </div>

          {/* Main Form Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 to-slate-900/30 rounded-3xl backdrop-blur-sm border border-slate-600/20"></div>
            <div className="relative p-8">
              {/* Step 1 */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Personal Information
                    </h2>
                    <p className="text-slate-400">
                      Tell us about yourself
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="First Name" required>
                      <input
                        id="firstName"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter your first name"
                        value={form.firstName}
                        onChange={(e) => onChange("firstName", e.target.value)}
                      />
                    </Field>
                    <Field label="Last Name" required>
                      <input
                        id="lastName"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter your last name"
                        value={form.lastName}
                        onChange={(e) => onChange("lastName", e.target.value)}
                      />
                    </Field>
                    <Field label="Phone Number" required>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="+234 xxx xxx xxxx"
                        value={form.phone}
                        onChange={(e) => onChange("phone", e.target.value)}
                      />
                    </Field>
                    <Field label="Email Address" required>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="your.email@example.com"
                        value={form.email}
                        onChange={(e) => onChange("email", e.target.value)}
                      />
                    </Field>
                    <Field label="Password" required>
                      <input
                        id="password"
                        type="password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter a strong password"
                        value={form.password}
                        onChange={(e) => onChange("password", e.target.value)}
                      />
                    </Field>
                    <Field label="Confirm Password" required>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={(e) => onChange("confirmPassword", e.target.value)}
                      />
                    </Field>
                    <Field label="Date of Birth" required>
                      <input
                        id="dob"
                        type="date"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        value={form.dob}
                        onChange={(e) => onChange("dob", e.target.value)}
                      />
                    </Field>
                    <Field label="Gender" required>
                      <select
                        id="gender"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Enter your full address"
                        value={form.address}
                        onChange={(e) => onChange("address", e.target.value)}
                      />
                    </Field>
                    <Field label="Next of Kin Name" required>
                      <input
                        id="nextOfKin"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Full name of next of kin"
                        value={form.nextOfKin}
                        onChange={(e) => onChange("nextOfKin", e.target.value)}
                      />
                    </Field>
                    <Field label="Next of Kin Phone" required>
                      <input
                        id="nextOfKinPhone"
                        type="tel"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
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
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Financial Details
                    </h2>
                    <p className="text-slate-400">
                      Help us understand your financial capacity
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Field label="Bank Name" required>
                      <input
                        id="bankName"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Your bank name"
                        value={form.bankName}
                        onChange={(e) => onChange("bankName", e.target.value)}
                      />
                    </Field>
                    <Field label="Account Number" required>
                      <input
                        id="accountNumber"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="10-digit account number"
                        value={form.accountNumber}
                        onChange={(e) => onChange("accountNumber", e.target.value)}
                      />
                    </Field>
                    <Field label="Account Name" required>
                      <input
                        id="accountName"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="Account holder name"
                        value={form.accountName}
                        onChange={(e) => onChange("accountName", e.target.value)}
                      />
                    </Field>
                    <Field label="National ID Number (NIN)">
                      <input
                        id="nin"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
                        placeholder="11-digit NIN (optional but recommended)"
                        value={form.nin}
                        onChange={(e) => onChange("nin", e.target.value)}
                      />
                    </Field>
                  </div>

                  <div className="mt-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="mb-2 font-semibold text-yellow-400">
                            Financial Commitment Notice
                          </h4>
                          <p className="text-sm text-slate-300">
                            Please ensure you can comfortably afford your chosen contribution amount. Missed payments may affect group dynamics and your standing in the community.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Contribution Preferences
                    </h2>
                    <p className="text-slate-400">
                      Choose your contribution amount and frequency
                    </p>
                  </div>

                  <Field label="Select Contribution Amount" required>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                      {contributionOptions.map((opt) => {
                        const selected = form.contributionAmount === opt.amount;
                        return (
                          <button
                            key={opt.amount}
                            type="button"
                            className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                              selected
                                ? "border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/25"
                                : "border-slate-600/50 bg-slate-800/30 hover:border-cyan-400/50 hover:bg-slate-800/50"
                            }`}
                            onClick={() => onChange("contributionAmount", opt.amount)}
                          >
                            <div className={`text-xl font-bold mb-1 ${
                              selected ? "text-cyan-400" : "text-white"
                            }`}>
                              ₦{opt.amount.toLocaleString()}
                            </div>
                            <div className={`text-xs ${
                              selected ? "text-cyan-300" : "text-slate-400"
                            }`}>
                              Receive ₦{opt.receive.toLocaleString()}<br />
                              when it's your turn
                            </div>
                            {selected && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </Field>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <Field label="Payment Frequency" required>
                        <div className="flex flex-col gap-4 md:flex-row">
                          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            form.frequency === "weekly" 
                              ? "border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" 
                              : "border-slate-600/50 bg-slate-800/30 hover:border-cyan-400/50"
                          }`}>
                            <input
                              type="radio"
                              name="frequency"
                              value="weekly"
                              checked={form.frequency === "weekly"}
                              onChange={(e) =>
                                onChange("frequency", e.target.value as FrequencyOption)
                              }
                              className="w-4 h-4 text-cyan-500"
                            />
                            <div>
                              <span className={`font-semibold ${
                                form.frequency === "weekly" ? "text-cyan-400" : "text-white"
                              }`}>Weekly</span>
                              <span className={`text-sm ml-2 ${
                                form.frequency === "weekly" ? "text-cyan-300" : "text-slate-400"
                              }`}>(1% service fee)</span>
                            </div>
                          </label>
                          <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            form.frequency === "monthly" 
                              ? "border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/20" 
                              : "border-slate-600/50 bg-slate-800/30 hover:border-cyan-400/50"
                          }`}>
                            <input
                              type="radio"
                              name="frequency"
                              value="monthly"
                              checked={form.frequency === "monthly"}
                              onChange={(e) =>
                                onChange("frequency", e.target.value as FrequencyOption)
                              }
                              className="w-4 h-4 text-cyan-500"
                            />
                            <div>
                              <span className={`font-semibold ${
                                form.frequency === "monthly" ? "text-cyan-400" : "text-white"
                              }`}>Monthly</span>
                              <span className={`text-sm ml-2 ${
                                form.frequency === "monthly" ? "text-cyan-300" : "text-slate-400"
                              }`}>(3% service fee)</span>
                            </div>
                          </label>
                        </div>
                      </Field>
                    </div>
                    <Field label="Preferred Start Date">
                      <select
                        id="startDate"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300"
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

                  <div className="mt-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-slate-800/20 rounded-2xl"></div>
                    <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-6">
                      <h4 className="font-semibold text-cyan-400 mb-4">Terms and Conditions</h4>
                      <div className="mt-3 max-h-56 overflow-y-auto text-slate-300 rounded-xl border border-slate-600/30 bg-slate-800/30 p-4 text-sm">
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

                      <div className="mt-6 flex flex-col gap-4">
                        <label className="flex items-center gap-3 text-sm text-slate-300">
                          <input
                            id="agreeTerms"
                            type="checkbox"
                            checked={form.agreeTerms}
                            onChange={(e) => onChange("agreeTerms", e.target.checked)}
                            className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                          <span>
                            I agree to the terms and conditions
                            <span className="ml-1 text-red-400">*</span>
                          </span>
                        </label>
                        <label className="flex items-center gap-3 text-sm text-slate-300">
                          <input
                            id="dataConsent"
                            type="checkbox"
                            checked={form.dataConsent}
                            onChange={(e) => onChange("dataConsent", e.target.checked)}
                            className="w-4 h-4 text-cyan-500 bg-slate-800 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                          />
                          <span>
                            I consent to data collection and processing
                            <span className="ml-1 text-red-400">*</span>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-600/30">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 1}
                  className="px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-500 hover:to-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg shadow-slate-500/25 hover:shadow-slate-500/40 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
                  >
                    Next Step
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={onSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Submit Registration
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
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
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function InfoBox({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl"></div>
      <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-cyan-400">{title}</h4>
            <p className="text-sm text-slate-300">{body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


