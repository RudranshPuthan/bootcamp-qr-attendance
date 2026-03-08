import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EVENT_DATES } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";
import type { AttendanceJoinRow } from "@/lib/types";
import { requireAdmin } from "@/lib/auth";

type Props = {
  searchParams?: {
    date?: string;
  };
};

export default async function AdminAttendancePage({ searchParams }: Props) {
  await requireAdmin();

  const selectedDate = EVENT_DATES.includes(
    searchParams?.date as (typeof EVENT_DATES)[number]
  )
    ? (searchParams?.date as (typeof EVENT_DATES)[number])
    : EVENT_DATES[0];

  const supabase = createClient();

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      id,
      participant_id,
      attendance_date,
      marked_at,
      full_name,
      phone,
      year,
      branch,
      division,
      roll_no,
      email
    `)
    .eq("attendance_date", selectedDate)
    .order("marked_at", { ascending: false });

  const rows = (data ?? []) as AttendanceJoinRow[];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Present Participants</h2>
            <p className="mt-2 text-sm text-slate-500">
              Only participants scanned on the selected day are shown here.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {EVENT_DATES.map((date) => (
              <Link
                key={date}
                href={`/admin/attendance?date=${date}`}
                className={
                  date === selectedDate
                    ? "btn-primary h-10 px-4"
                    : "btn-secondary h-10 px-4"
                }
              >
                {formatDateLabel(date)}
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
          <div>
            <p className="text-sm text-slate-500">Selected Day</p>
            <p className="font-semibold text-slate-900">
              {formatDateLabel(selectedDate)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white px-4 py-2 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
              Present Count:{" "}
              <span className="font-semibold text-slate-900">{rows.length}</span>
            </div>
            <a
              href={`/api/export-attendance?date=${selectedDate}`}
              className="btn-secondary"
            >
              Export Selected Day CSV
            </a>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[1250px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Division</th>
                <th className="px-4 py-3">Roll No.</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Attendance Date</th>
                <th className="px-4 py-3">Marked At</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-500">
                    No participants marked present for this day.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 bg-white">
                    <td className="px-4 py-4 font-medium text-slate-900">{row.full_name ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.phone ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.year ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.branch ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.division ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.roll_no ?? "-"}</td>
                    <td className="max-w-[220px] truncate px-4 py-4 text-sm text-slate-600">{row.email ?? "-"}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">{row.attendance_date}</td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {row.marked_at ? new Date(row.marked_at).toLocaleString("en-IN") : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span className="badge-success">Present</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}