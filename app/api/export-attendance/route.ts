import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { EVENT_DATES } from "@/lib/constants";
import type { AttendanceJoinRow } from "@/lib/types";

function csvEscape(value: unknown) {
  const stringValue = value == null ? "" : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const dateParam = searchParams.get("date");

  const selectedDate = EVENT_DATES.includes(dateParam as (typeof EVENT_DATES)[number])
    ? (dateParam as (typeof EVENT_DATES)[number])
    : null;

  let query = supabase
    .from("attendance")
    .select(`
      id,
      participant_id,
      attendance_date,
      marked_at,
      participant:profiles!attendance_participant_id_fkey (
        full_name,
        phone,
        year,
        branch,
        division,
        roll_no,
        email
      )
    `)
    .order("attendance_date", { ascending: true })
    .order("marked_at", { ascending: false });

  if (selectedDate) {
    query = query.eq("attendance_date", selectedDate);
  }

  const { data, error } = await query;

  if (error) {
    return new NextResponse(error.message, { status: 400 });
  }

  const rows = (data ?? []) as AttendanceJoinRow[];

  const csvRows = [
    [
      "Full Name",
      "Phone",
      "Year",
      "Branch",
      "Division",
      "Roll Number",
      "Email",
      "Attendance Date",
      "Marked At",
    ],
    ...rows.map((row) => {
      const participant = row.participant?.[0];

      return [
        csvEscape(participant?.full_name),
        csvEscape(participant?.phone),
        csvEscape(participant?.year),
        csvEscape(participant?.branch),
        csvEscape(participant?.division),
        csvEscape(participant?.roll_no),
        csvEscape(participant?.email),
        csvEscape(row.attendance_date),
        csvEscape(
          row.marked_at ? new Date(row.marked_at).toLocaleString("en-IN") : ""
        ),
      ];
    }),
  ];

  const csvContent = csvRows.map((row) => row.join(",")).join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="attendance${selectedDate ? `-${selectedDate}` : ""
        }.csv"`,
    },
  });
}