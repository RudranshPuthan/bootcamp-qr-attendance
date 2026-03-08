"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

type Props = {
  onScanSuccess: (decodedText: string) => void | Promise<void>;
};

export default function QRScanner({ onScanSuccess }: Props) {
  const lastScanRef = useRef<{ text: string; time: number } | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false
    );

    scanner.render(
      (decodedText) => {
        const now = Date.now();
        const last = lastScanRef.current;

        if (
          last &&
          last.text === decodedText &&
          now - last.time < 3000
        ) {
          return;
        }

        lastScanRef.current = { text: decodedText, time: now };
        void onScanSuccess(decodedText);
      },
      () => { }
    );

    return () => {
      scanner.clear().catch(() => { });
    };
  }, [onScanSuccess]);

  return <div id="reader" className="w-full overflow-hidden rounded-xl" />;
}