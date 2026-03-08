import Link from "next/link";
import { CalendarDays, QrCode, ShieldCheck, Users } from "lucide-react";
import { EVENT_DATES, EVENT_NAME } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";

const features = [
  {
    title: "Single QR for all 5 days",
    description: "Participants get one QR code after registering and use it throughout the event.",
    icon: QrCode
  },
  {
    title: "Admin scanner terminal",
    description: "Admins scan QR codes, mark attendance, and view clean daily records.",
    icon: ShieldCheck
  },
  {
    title: "Complete participant data",
    description: "Each attendance row includes name, phone, year, branch, division, roll number, and email.",
    icon: Users
  }
];

export default function HomeHero() {
  return (
    <div className="shell py-10 sm:py-14 lg:py-20">
      <section className="grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
            5-Day Attendance System
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {EVENT_NAME}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              A clean and responsive QR attendance website with participant registration, QR generation,
              admin scanning, attendance monitoring, and CSV export.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="btn-primary">
              Register as Participant
            </Link>
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-5">
                  <div className="mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-700">
                    <Icon size={22} />
                  </div>
                  <h2 className="mb-2 text-lg font-semibold">{feature.title}</h2>
                  <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
              <CalendarDays size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Event Dates</h2>
              <p className="muted">Attendance opens on each configured event day.</p>
            </div>
          </div>

          <div className="space-y-3">
            {EVENT_DATES.map((date) => (
              <div
                key={date}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <span className="font-medium text-slate-700">{formatDateLabel(date)}</span>
                <span className="badge-muted">{date}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <h3 className="mb-2 text-lg font-semibold">Admin Access</h3>
            <p className="text-sm leading-6 text-slate-200">
              Create your account first, promote it to admin in Supabase, then use the scanner, attendance
              dashboard, and participant directory.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
