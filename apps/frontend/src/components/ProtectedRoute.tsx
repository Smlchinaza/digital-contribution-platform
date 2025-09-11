"use client";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if we're running in the browser
    if (typeof window !== 'undefined') {
      // First try to get from localStorage if not in state
      const storedToken = token || localStorage.getItem('token');
      const storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');

      if (!storedToken || !storedUser) {
        router.push("/login");
        return;
      }

      if (requireAdmin && !storedUser?.isAdmin) {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, token, router, requireAdmin]);

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && !user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
