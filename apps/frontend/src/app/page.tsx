import Link from "next/link";
import Image from "next/image";

export default function ChurchHome() {
  return (
    <div className="min-h-dvh bg-[#05070b] text-white">
      {/* Aurora background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[560px] w-[1200px] -translate-x-1/2 rounded-full opacity-50 blur-3xl" style={{ background: "radial-gradient(600px 220px at 50% 40%, rgba(34,211,238,0.25), transparent 60%)" }} />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[800px] rounded-full opacity-40 blur-3xl" style={{ background: "radial-gradient(400px 200px at 40% 50%, rgba(16,185,129,0.22), transparent 60%)" }} />
        <div className="absolute bottom-0 -right-20 h-[420px] w-[820px] rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(420px 220px at 60% 60%, rgba(168,85,247,0.18), transparent 60%)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-6xl p-4 sm:p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/20">
              <Image src="/images/church-logo.jpg" alt="Church logo" fill sizes="48px" className="object-cover" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">St Peter's Anglican Church</h1>
              <p className="text-xs sm:text-sm text-white/70">Thinker's Corner, Enugu State</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-2 sm:gap-4 md:gap-6 text-sm">
            <a className="rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition" href="#home">Home</a>
            <a className="rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition" href="#about">About</a>
            <a className="rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition" href="#services">Services</a>
            <a className="rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition" href="#events">Events</a>
            <a className="rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition" href="#ministries">Ministries</a>
            <a className="rounded-md px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 transition" href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="relative isolate px-6 pt-10 md:pt-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Arise and Shine · Anglican Communion
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Worship in a modern, Christ-centered community
            </h2>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-prose">
              We gather to exalt Christ, equip believers, and extend love to our city. Join us in-person or online and be part of what God is doing.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/contrib" className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-0.5 text-center">
                Digital Contributory
              </Link>
              <Link href="/charity" className="px-6 py-3 rounded-lg border-2 border-white/20 bg-white/10 text-white font-semibold backdrop-blur hover:bg-white/15 transition-all text-center">
                Charity Form
              </Link>
            </div>
          </div>
          <div className="relative order-first md:order-last">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[540px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
              <div className="relative h-full w-full rounded-xl bg-[radial-gradient(circle_at_30%_10%,rgba(34,211,238,.25),transparent_40%),radial-gradient(circle_at_70%_90%,rgba(16,185,129,.25),transparent_40%)]" />
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative h-[90%] w-[80%] max-h-[520px] max-w-[520px] overflow-hidden ring-2 ring-white/20">
                  <Image src="/images/church-logo.jpg" alt="Church crest" fill sizes="(min-width: 768px) 540px, 90vw" className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <section id="about" className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-xl font-semibold">Welcome Message</h3>
            <p className="mt-3 text-white/80">
              We are a vibrant Anglican family proclaiming the Gospel and serving our city. Whether you are exploring faith or seeking a church home, you are warmly welcome at St Peter's Anglican Church, Thinker's Corner.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 backdrop-blur">
            <h4 className="font-semibold">Service Information</h4>
            <p className="mt-2 text-white/80"><strong className="text-white">Sunday:</strong> 7:00 AM</p>
            <p className="text-white/80"><strong className="text-white">Location:</strong> Thinker's Corner</p>
            <p className="text-white/80"><strong className="text-white">Parking:</strong> Available</p>
          </div>
        </section>

        <section id="services" className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Give Online", desc: "Partner with our mission through secure online giving.", cta: "Donate Now", href: "/contrib" },
            { title: "Prayer Requests", desc: "We would love to pray with you and for you.", cta: "Send a Request", href: "#contact" },
            { title: "Sermons", desc: "Grow through the Word with recent messages.", cta: "Browse Messages", href: "#events" }
          ].map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
              <h4 className="text-lg font-semibold">{card.title}</h4>
              <p className="mt-2 text-white/80">{card.desc}</p>
              <div className="mt-4">
                <a href={card.href} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30">
                  {card.cta}
                </a>
              </div>
            </div>
          ))}
        </section>

        <section id="ministries" className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold">Our Ministries</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 text-sm">
            {["Children", "Youth", "Women", "Men", "Choir", "Evangelism"].map((m) => (
              <span key={m} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-white/90">{m}</span>
            ))}
          </div>
          </section>

        <section id="contact" className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-white/70">Address</p>
              <p className="mt-1">Thinker's Corner, Enugu State</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-white/70">Phone</p>
              <p className="mt-1">+234 XXX XXXX XXX</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-white/70">Email</p>
              <p className="mt-1">info@stpetersanglican.org</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-white/70">Office Hours</p>
              <p className="mt-1">Mon–Fri: 9AM–4PM</p>
            </div>
            </div>
          </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-6xl p-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <h4 className="font-semibold mb-3">About St Peter's</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>Our History</li>
                <li>Our Beliefs</li>
                <li>Leadership Team</li>
                <li>Mission & Vision</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>YouTube</li>
                <li>WhatsApp</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>Sermon Archive</li>
                <li>Bible Study</li>
                <li>Prayer Guide</li>
                <li>Newsletter</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Get Involved</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>Volunteer</li>
                <li>Small Groups</li>
                <li>Ministry Teams</li>
                <li>Community Outreach</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4 text-center text-sm text-white/70">
            © 2025 St Peter's Anglican Church, Thinker's Corner, Enugu State. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
