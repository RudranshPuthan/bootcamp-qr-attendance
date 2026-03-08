import Link from "next/link";
import { EVENT_DATES } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";
import { requireCompleteParticipant } from "@/lib/auth";

export default async function ParticipantDashboardPage() {
  const { supabase, user, profile } = await requireCompleteParticipant();

  const { data: attendance } = await supabase
    .from("attendance")
    .select("attendance_date")
    .eq("participant_id", user.id);

  const attendanceSet = new Set(
    (attendance ?? []).map((item) => item.attendance_date)
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Participant</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
            {profile?.full_name ?? "Participant"}
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Profile Status</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
            Complete
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <p className="text-sm font-medium text-slate-500">Days Marked Present</p>
          <p className="mt-2 text-lg font-semibold text-slate-900 sm:text-xl">
            {attendanceSet.size} / {EVENT_DATES.length}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              My Attendance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track your attendance across all five event days.
            </p>
          </div>

          <Link
            href="/participant/qr"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
          >
            Open My QR
          </Link>
        </div>

        <div className="mt-5 space-y-3">
          {EVENT_DATES.map((date) => {
            const present = attendanceSet.has(date);

            return (
              <div
                key={date}
                className="rounded-2xl border bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{formatDateLabel(date)}</p>
                    <p className="text-sm text-slate-500">{date}</p>
                  </div>

                  {present ? (
                    <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Present
                    </span>
                  ) : (
                    <span className="inline-flex w-fit rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                      Not marked yet
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
