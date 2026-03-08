import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { participantId, attendanceDate } = await req.json();

    if (!participantId || !attendanceDate) {
      return NextResponse.json(
        { error: "participantId and attendanceDate are required." },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError || !adminProfile || adminProfile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: participantProfile, error: participantError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", participantId)
      .maybeSingle();

    if (participantError || !participantProfile) {
      return NextResponse.json({ error: "Participant not found." }, { status: 404 });
    }

    const { error: insertError } = await supabase.from("attendance").insert({
      participant_id: participantId,
      attendance_date: attendanceDate,
      marked_by: user.id,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { message: "Attendance already marked for this participant on this date." },
          { status: 200 }
        );
      }

      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Attendance marked successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
