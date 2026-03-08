"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  participantId: string;
};

export default function QRCard({ participantId }: Props) {
  const [qrSrc, setQrSrc] = useState("");

  useEffect(() => {
    async function generateQR() {
      const payload = JSON.stringify({ participantId });

      const url = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
      });

      setQrSrc(url);
    }

    generateQR();
  }, [participantId]);

  return (
    <div className="w-full max-w-sm rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-center text-lg font-semibold text-slate-900 sm:text-xl">
        Your Attendance QR
      </h3>

      <p className="mt-2 text-center text-sm text-slate-500">
        Use this same QR code for all 5 event days.
      </p>

      <div className="mt-5 flex justify-center">
        {qrSrc ? (
          <img
            src={qrSrc}
            alt="Attendance QR"
            className="h-auto w-full max-w-[280px] sm:max-w-[320px]"
          />
        ) : (
          <div className="rounded-2xl bg-slate-50 px-6 py-10 text-sm text-slate-500">
            Generating QR...
          </div>
        )}
      </div>
    </div>
  );
}