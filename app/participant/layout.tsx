import Link from "next/link";
import { requireParticipantAccess } from "@/lib/auth";

export default async function ParticipantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireParticipantAccess();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-slate-500">Participant Portal</p>
              <h1 className="text-base font-semibold leading-tight text-slate-900 sm:text-xl">
                Business Development and Brand Building Bootcamp
              </h1>
            </div>

            <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <Link
                href="/participant/dashboard"
                className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Dashboard
              </Link>
              <Link
                href="/participant/profile"
                className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                Profile
              </Link>
              <Link
                href="/participant/qr"
                className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                My QR
              </Link>

              <div className="flex items-center justify-center rounded-xl bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
                {profile?.full_name || "Participant"}
              </div>

              <form action="/auth/signout" method="post" className="col-span-2 sm:col-span-1">
                <button className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Logout
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-6">{children}</main>
    </div>
  );
}