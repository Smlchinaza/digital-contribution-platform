export function Hero() {
  return (
    <section className="relative p-8 text-center md:p-12">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(600px 200px at 50% 0%, rgba(34,211,238,0.15), transparent 60%)" }} />
      <div className="relative">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Digital Contributory
          <span className="block bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            System
          </span>
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/80 max-w-2xl mx-auto">
          Join our rotating savings groups and support each other
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5" 
            href="/register"
          >
            Join a Group
          </a>
          <a 
            className="px-8 py-4 rounded-lg border-2 border-white/20 bg-white/10 text-white font-semibold backdrop-blur hover:bg-white/20 transition-all" 
            href="#how"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}



