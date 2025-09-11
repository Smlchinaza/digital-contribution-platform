export function Support() {
  return (
    <section id="support" className="p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Need help?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-white font-semibold mb-2">FAQs</h3>
          <p className="text-white/80 text-sm">Find answers to common questions about contributions, payouts, and security.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-white font-semibold mb-2">Email Support</h3>
          <p className="text-white/80 text-sm">Reach us at <a href="mailto:support@churchcontrib.org" className="text-cyan-300 underline">support@churchcontrib.org</a>.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-white font-semibold mb-2">Community</h3>
          <p className="text-white/80 text-sm">Join our community channel to connect with others.</p>
        </div>
      </div>
    </section>
  );
}


