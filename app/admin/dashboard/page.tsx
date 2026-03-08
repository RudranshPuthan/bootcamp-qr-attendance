import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EVENT_DATES } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = createClient();

  const { count: participantCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "participant");

  const { data: attendanceRows } = await supabase
    .from("attendance")
    .select("attendance_date");

  const attendanceCountByDate = new Map<string, number>();

  for (const row of attendanceRows ?? []) {
    attendanceCountByDate.set(
      row.attendance_date,
      (attendanceCountByDate.get(row.attendance_date) ?? 0) + 1
    );
  }

  const totalAttendanceMarks = attendanceRows?.length ?? 0;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Registered Participants" value={String(participantCount ?? 0)} />
        <StatCard label="Total Attendance Marks" value={String(totalAttendanceMarks)} />
        <StatCard label="Configured Event Days" value={String(EVENT_DATES.length)} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="card p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Attendance by Day</h2>
              <p className="mt-1 text-sm text-slate-500">
                Quick overview of how many participants were marked present each day.
              </p>
            </div>
            <Link href="/admin/scanner" className="btn-primary">
              Open Scanner
            </Link>
          </div>

          <div className="space-y-3">
            {EVENT_DATES.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-slate-900">{formatDateLabel(date)}</p>
                  <p className="text-sm text-slate-500">{date}</p>
                </div>
                <span className="badge-success">
                  {attendanceCountByDate.get(date) ?? 0} Present
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-2xl font-semibold">Admin Actions</h2>
          <p className="mt-2 text-sm text-slate-500">
            Use these quick links during the live event for faster management.
          </p>

          <div className="mt-5 grid gap-3">
            <Link href="/admin/scanner" className="btn-secondary justify-start">
              Scan QR attendance
            </Link>
            <Link href="/admin/attendance" className="btn-secondary justify-start">
              View day-wise attendance
            </Link>
            <Link href="/admin/participants" className="btn-secondary justify-start">
              View participant directory
            </Link>
            <a href="/api/export-attendance" className="btn-secondary justify-start">
              Export all attendance CSV
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}
