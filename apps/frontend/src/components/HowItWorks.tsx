export function HowItWorks() {
  const steps = [
    { title: "Register & Choose", desc: "Sign up and select your contribution amount and frequency" },
    { title: "Join Group", desc: "Get matched with 6 other members to form a group of 7" },
    { title: "Make Contributions", desc: "Pay your amount weekly or monthly as scheduled" },
    { title: "Receive Payout", desc: "When it's your turn, receive the full group contribution" },
    { title: "Continue Cycle", desc: "Keep contributing until everyone has received their turn" }
  ];

  return (
    <section id="how" className="p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
        {steps.map((step, idx) => (
          <div key={step.title} className="relative text-center p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 blur-lg" />
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-lg">
                {idx + 1}
              </div>
              <h4 className="font-semibold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-white/80 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}



