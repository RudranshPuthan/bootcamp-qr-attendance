import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { EVENT_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Bootcamp QR Attendance",
  description: "QR attendance portal for the bootcamp"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="shell flex min-h-16 items-center justify-between gap-4 py-3">
            <Link href="/" className="text-sm font-bold text-slate-900 sm:text-base">
              {EVENT_NAME}
            </Link>

            <nav className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="btn-secondary h-10 px-4">
                Login
              </Link>
              <Link href="/signup" className="btn-primary h-10 px-4">
                Register
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
