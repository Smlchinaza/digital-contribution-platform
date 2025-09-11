export function Team() {
  const members = [
    { name: "Ven. Dr. Emma Uzuegbunam", role: "Project Lead" },
    { name: "Rev. Arch. Echezona Okolo", role: "Product Manager" },
    { name: "Samuel Chinaza", role: "Full Stack Engineer" },
  ];

  return (
    <section id="team" className="p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-3 border-b border-white/10">Team behind the system</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {members.map((m) => (
          <div key={m.name} className="relative p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
            <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 blur-lg" />
            <div className="relative">
              <div className="text-white font-semibold">{m.name}</div>
              <div className="text-white/70 text-sm">{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


