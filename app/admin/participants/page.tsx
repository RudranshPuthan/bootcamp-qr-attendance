import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { requireAdmin } from "@/lib/auth";

export default async function AdminParticipantsPage() {
  await requireAdmin();
  const supabase = createClient();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "participant")
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as Profile[];

  return (
    <div className="card p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Participant Directory</h2>
          <p className="mt-2 text-sm text-slate-500">
            Use this table for backup verification if scanner access is temporarily unavailable.
          </p>
        </div>

        <a href="/api/export-participants" className="btn-secondary">
          Export Participants CSV
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-sm text-slate-500">
              <th className="px-4">Name</th>
              <th className="px-4">Phone</th>
              <th className="px-4">Year</th>
              <th className="px-4">Branch</th>
              <th className="px-4">Division</th>
              <th className="px-4">Roll No.</th>
              <th className="px-4">Email</th>
              <th className="px-4">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No participants registered yet.
                </td>
              </tr>
            ) : (
              rows.map((participant) => (
                <tr key={participant.id} className="bg-slate-50">
                  <td className="rounded-l-2xl px-4 py-4 font-medium text-slate-900">{participant.full_name}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{participant.phone}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{participant.year}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{participant.branch}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{participant.division}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{participant.roll_no}</td>
                  <td className="max-w-[220px] truncate px-4 py-4 text-sm text-slate-600">{participant.email}</td>
                  <td className="rounded-r-2xl px-4 py-4 text-sm text-slate-600">
                    {new Date(participant.created_at).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
