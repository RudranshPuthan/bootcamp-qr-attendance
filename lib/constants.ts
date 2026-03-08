export const EVENT_NAME =
  "Business Development and Brand Building Bootcamp for First-Time Founders";

export const EVENT_DATES = [
  "2026-03-10",
  "2026-03-11",
  "2026-03-12",
  "2026-03-13",
  "2026-03-14"
] as const;

export const DATE_LABELS: Record<(typeof EVENT_DATES)[number], string> = {
  "2026-03-10": "Day 1 - 10 Mar 2026",
  "2026-03-11": "Day 2 - 11 Mar 2026",
  "2026-03-12": "Day 3 - 12 Mar 2026",
  "2026-03-13": "Day 4 - 13 Mar 2026",
  "2026-03-14": "Day 5 - 14 Mar 2026"
};

export const YEAR_OPTIONS = ["FY", "SY", "TY", "Final Year"];
