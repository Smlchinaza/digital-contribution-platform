"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../providers/AuthProvider";

export function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur">
      <div className="mx-auto max-w-[1200px] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/church-logo.jpg" alt="Church logo" width={40} height={40} className="rounded-md object-cover" />
              <span className="sr-only">Home</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {user && <Link className="text-white/80 hover:text-white transition" href="/dashboard">Dashboard</Link>}
              <a className="text-white/80 hover:text-white transition" href="#how">How It Works</a>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link className="text-white/80 hover:text-white transition" href="/login">Login</Link>
                <Link className="rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-2 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30" href="/register">Register</Link>
              </>
            ) : (
              <>
                <span className="text-white/80">Welcome, {user.fullName}</span>
                <Link className="text-white/80 hover:text-white transition" href="/profile">Profile</Link>
                {user.isAdmin && (
                  <Link className="text-white/80 hover:text-white transition" href="/admin">Admin</Link>
                )}
                <button 
                  className="text-white/80 hover:text-white transition" 
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}



