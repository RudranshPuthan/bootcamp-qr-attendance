"use client";

import { useCallback, useState } from "react";
import QRScanner from "@/components/admin/QRScanner";
import { EVENT_DATES } from "@/lib/constants";
import { formatDateLabel } from "@/lib/utils";

type ScanState = {
  status: "idle" | "success" | "error";
  title: string;
  message: string;
};

export default function AdminScannerClient() {
  const today = new Date().toISOString().slice(0, 10);
  const defaultDate = EVENT_DATES.includes(today as (typeof EVENT_DATES)[number])
    ? (today as (typeof EVENT_DATES)[number])
    : EVENT_DATES[0];

  const [selectedDate, setSelectedDate] = useState<(typeof EVENT_DATES)[number]>(
    defaultDate
  );
  const [submitting, setSubmitting] = useState(false);
  const [scanState, setScanState] = useState<ScanState>({
    status: "idle",
    title: "Latest Result",
    message: "The scan result appears here after each successful or failed read.",
  });

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (submitting) return;

      try {
        const parsed = JSON.parse(decodedText);
        const participantId = parsed?.participantId;

        if (!participantId || typeof participantId !== "string") {
          setScanState({
            status: "error",
            title: "Scan failed",
            message: "Invalid QR data. Expected a participantId.",
          });
          return;
        }

        setSubmitting(true);

        const response = await fetch("/api/mark-attendance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participantId,
            attendanceDate: selectedDate,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setScanState({
            status: "error",
            title: "Scan failed",
            message: data?.error || "Unable to mark attendance.",
          });
          return;
        }

        setScanState({
          status: "success",
          title: "Attendance marked",
          message:
            data?.message || `Attendance marked for ${formatDateLabel(selectedDate)}.`,
        });
      } catch {
        setScanState({
          status: "error",
          title: "Scan failed",
          message: "QR code is not in valid JSON format.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [selectedDate, submitting]
  );

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr]">
      <section className="card p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Scan Attendance</h2>
        <p className="mt-2 text-sm text-slate-500">
          Select the day first, then scan the participant QR from mobile or printed card.
        </p>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Attendance Date
          </label>
          <select
            className="input"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value as (typeof EVENT_DATES)[number])
            }
          >
            {EVENT_DATES.map((date) => (
              <option key={date} value={date}>
                {formatDateLabel(date)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
          <QRScanner onScanSuccess={handleScanSuccess} />
        </div>
      </section>

      <aside className="card p-6">
        <h2 className="text-2xl font-semibold text-slate-900">{scanState.title}</h2>
        <p className="mt-2 text-sm text-slate-500">
          The scan result appears here after each successful or failed read.
        </p>

        <div
          className={`mt-6 rounded-2xl border p-5 ${scanState.status === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : scanState.status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
        >
          <p className="font-medium">{scanState.title}</p>
          <p className="mt-2 text-sm">{scanState.message}</p>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-900">Selected Day</p>
          <p className="mt-2">{formatDateLabel(selectedDate)}</p>
        </div>
      </aside>
    </div>
  );
}