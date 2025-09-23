"use client";

import { useState } from "react";
import Link from "next/link";

export default function CharityFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-dvh bg-gray-100 text-gray-900">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Charity Form</h1>
        <p className="text-gray-600 mb-6">Submit charity requests or pledges to St Peter's Anglican Church.</p>

        {submitted ? (
          <div className="bg-green-50 border border-green-400 text-green-800 p-4 rounded">
            Thank you! Your submission has been received.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded border">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Message / Need</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded">Submit</button>
          </form>
        )}

        <div className="mt-6">
          <Link href="/" className="text-blue-700">← Back to Church Home</Link>
        </div>
      </div>
    </div>
  );
}


