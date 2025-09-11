"use client";
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { apiService } from "../services/api";
import type { User } from "../types/user";

type AuthResponse = {
  user: User;
  accessToken: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetInactivityTimer: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout>();

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
  }, [inactivityTimer]);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    if (token) {
      const timer = setTimeout(() => {
        logout();
      }, 5 * 60 * 1000); // 5 minutes
      setInactivityTimer(timer);
    }
  }, [token, inactivityTimer, logout]);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  }, []);

  useEffect(() => {
    if (token) {
      resetInactivityTimer();
    }
    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [token, resetInactivityTimer, inactivityTimer]);

  useEffect(() => {
    // Set up event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    const handleUserActivity = () => resetInactivityTimer();
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [resetInactivityTimer]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    login: async (email, password) => {
      const data = await apiService.login(email, password) as AuthResponse;
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    register: async (fullName, email, password) => {
      const data = await apiService.register({ fullName, email, password }) as AuthResponse;
      setToken(data.accessToken);
      setUser(data.user);
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    logout,
    resetInactivityTimer,
  }), [user, token, logout, resetInactivityTimer]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


