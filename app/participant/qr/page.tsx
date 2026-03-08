import { requireCompleteParticipant } from "@/lib/auth";
import QRCard from "@/components/QRCard";

export default async function ParticipantQRPage() {
  const { user, profile } = await requireCompleteParticipant();

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">My Attendance QR</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          {profile?.full_name ?? "Participant"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Show this QR code each day to mark your attendance.
        </p>
      </div>

      <div className="flex justify-center">
        <QRCard participantId={user.id} />
      </div>
    </div>
  );
}