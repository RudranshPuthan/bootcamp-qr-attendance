import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function isProfileComplete(profile: any) {
    return !!(
        profile?.full_name &&
        profile?.phone &&
        profile?.year &&
        profile?.branch &&
        profile?.division &&
        profile?.roll_no &&
        profile?.email
    );
}

export async function requireAuth() {
    const supabase = createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    return { supabase, user, profile };
}

export async function requireAdmin() {
    const { supabase, user, profile } = await requireAuth();

    if (!profile || profile.role !== "admin") {
        redirect("/participant/dashboard");
    }

    return { supabase, user, profile };
}

export async function requireParticipantAccess() {
    const { supabase, user, profile } = await requireAuth();

    if (profile?.role === "admin") {
        redirect("/admin/dashboard");
    }

    return { supabase, user, profile };
}

export async function requireCompleteParticipant() {
    const { supabase, user, profile } = await requireParticipantAccess();

    if (!profile || !isProfileComplete(profile)) {
        redirect("/participant/profile");
    }

    return { supabase, user, profile };
}