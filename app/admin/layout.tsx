import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-slate-950 text-white lg:block">
          <div className="border-b border-slate-800 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Admin Panel
            </p>
            <h1 className="mt-2 text-xl font-semibold">
              Bootcamp Attendance
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              {profile?.full_name || profile?.email || "Admin"}
            </p>
          </div>

          <nav className="flex flex-col gap-2 p-4">
            <Link href="/admin/dashboard" className="rounded-xl px-4 py-3 hover:bg-slate-800">
              Dashboard
            </Link>
            <Link href="/admin/scanner" className="rounded-xl px-4 py-3 hover:bg-slate-800">
              QR Scanner
            </Link>
            <Link href="/admin/attendance" className="rounded-xl px-4 py-3 hover:bg-slate-800">
              Attendance
            </Link>
            <Link href="/admin/participants" className="rounded-xl px-4 py-3 hover:bg-slate-800">
              Participants
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">Admin Access</p>
                <h2 className="text-xl font-semibold text-slate-900">
                  Attendance Control Panel
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  Admin
                </span>
                <form action="/auth/signout" method="post">
                  <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}