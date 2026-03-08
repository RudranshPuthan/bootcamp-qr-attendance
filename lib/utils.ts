import { clsx } from "clsx";
import { EVENT_DATES, DATE_LABELS } from "@/lib/constants";

export function cn(...inputs: Array<string | undefined | false | null>) {
  return clsx(inputs);
}

export function formatDateLabel(date: string) {
  if (date in DATE_LABELS) {
    return DATE_LABELS[date as keyof typeof DATE_LABELS];
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function profileComplete(profile: {
  full_name?: string | null;
  phone?: string | null;
  year?: string | null;
  branch?: string | null;
  division?: string | null;
  roll_no?: string | null;
  email?: string | null;
}) {
  return Boolean(
    profile.full_name &&
      profile.phone &&
      profile.year &&
      profile.branch &&
      profile.division &&
      profile.roll_no &&
      profile.email
  );
}

export function isEventDate(date: string) {
  return EVENT_DATES.includes(date as (typeof EVENT_DATES)[number]);
}

export function csvEscape(value: unknown) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}
