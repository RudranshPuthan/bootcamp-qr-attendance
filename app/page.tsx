import Link from "next/link";
import { EVENT_DATES } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.85fr] lg:gap-10">
          <div>
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 sm:text-sm">
              5-Day Attendance System
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Business Development and Brand Building Bootcamp for First-Time Founders
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Register once, complete your profile, and use one QR code throughout all
              5 event days for quick and seamless attendance.
            </p>

            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href="/signup"
                className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
              >
                Register as Participant
              </Link>
              <Link
                href="/login"
                className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Login
              </Link>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Single QR for all 5 days
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Get one QR code and use it throughout the entire bootcamp.
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  Fast attendance marking
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Show your QR daily and get your attendance marked quickly.
                </p>
              </div>

              <div className="rounded-3xl border bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Simple participant portal
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Manage your profile, track attendance, and access your QR anytime.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-lg">🗓️</div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                  Event Dates
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Attendance will be marked on each bootcamp day.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {EVENT_DATES.map((date, index) => (
                <div
                  key={date}
                  className="rounded-2xl border bg-slate-50 px-4 py-4"
                >
                  <p className="font-semibold text-slate-900">
                    Day {index + 1} — {formatDateLabel(date)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{date}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-800">
                Register once and keep your QR ready for all 5 days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}