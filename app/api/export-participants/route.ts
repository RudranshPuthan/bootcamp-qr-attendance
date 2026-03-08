import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { csvEscape } from "@/lib/utils";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "participant")
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as Profile[];

  const headers = [
    "full_name",
    "phone",
    "year",
    "branch",
    "division",
    "roll_no",
    "email",
    "created_at"
  ];

  const csvRows = [
    headers.join(","),
    ...rows.map((row) =>
      [
        csvEscape(row.full_name),
        csvEscape(row.phone),
        csvEscape(row.year),
        csvEscape(row.branch),
        csvEscape(row.division),
        csvEscape(row.roll_no),
        csvEscape(row.email),
        csvEscape(new Date(row.created_at).toLocaleString("en-IN"))
      ].join(",")
    )
  ];

  return new NextResponse(csvRows.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="participants.csv"'
    }
  });
}
