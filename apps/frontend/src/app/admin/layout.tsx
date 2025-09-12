import { ProtectedRoute } from "../../components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-[#f5f5f5] text-[#333]">
        <div className="max-w-[1200px] mx-auto bg-white border-2 border-[#ccc] p-6">
          <nav className="mb-4 flex gap-4">
            <a className="border px-3 py-2" href="/admin">Overview</a>
            <a className="border px-3 py-2" href="/admin/users">Users</a>
            <a className="border px-3 py-2" href="/admin/groups">Groups</a>
            <a className="border px-3 py-2" href="/admin/payments">Payments</a>
            <a className="border px-3 py-2" href="/admin/transactions">Transactions</a>
          </nav>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

