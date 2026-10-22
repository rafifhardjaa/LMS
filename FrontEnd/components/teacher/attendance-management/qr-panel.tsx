"use client";

import { useEffect, useRef, useState } from "react";
import { Maximize2, RefreshCw, Timer } from "lucide-react";
import { toast } from "sonner";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function QrPanel() {
  const [secondsLeft, setSecondsLeft] = useState(252);
  const qrCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => (current <= 0 ? 300 : current - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  function handleRefresh() {
    setSecondsLeft(300);
    toast.success("Kode QR diperbarui", {
      description: "Token presensi baru berlaku selama 5 menit.",
    });
  }

  async function handleFullscreen() {
    if (!qrCardRef.current) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await qrCardRef.current.requestFullscreen();
      }
    } catch {
      toast.info("Mode proyektor tidak tersedia", {
        description:
          "Izinkan akses layar penuh pada browser untuk menampilkan QR.",
      });
    }
  }

  return (
    <section
      ref={qrCardRef}
      className="flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#EF4444] opacity-70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#EF4444]" />
          </span>
          <h2 className="text-[12px] font-bold text-[#1E293B]">
            Presensi QR Siswa Sesi Ini
          </h2>
        </div>
        <span className="rounded-full bg-[#FFEBEB] px-2 py-1 text-[8px] font-bold text-[#b71422]">
          Rotasi Dinamis
        </span>
      </div>

      <p className="text-[10px] leading-4 text-[#475569]">
        Siswa memindai kode via aplikasi mobile SiManis Siswa untuk check-in
        terverifikasi GPS radius sekolah.
      </p>

      <div className="mt-1 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#EFF4FF] p-4 text-center">
        <div className="flex items-center justify-center rounded-xl bg-white p-3 shadow-sm">
          <svg
            viewBox="0 0 120 120"
            role="img"
            aria-label="Kode QR presensi kelas"
            className="size-40 text-[#1E293B]"
            fill="currentColor"
          >
            <rect
              x="10"
              y="10"
              width="30"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <rect x="20" y="20" width="10" height="10" rx="1" />
            <rect
              x="80"
              y="10"
              width="30"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <rect x="90" y="20" width="10" height="10" rx="1" />
            <rect
              x="10"
              y="80"
              width="30"
              height="30"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <rect x="20" y="90" width="10" height="10" rx="1" />
            <rect x="50" y="15" width="8" height="8" rx="1" />
            <rect x="65" y="15" width="8" height="8" rx="1" />
            <rect x="50" y="30" width="18" height="8" rx="1" />
            <rect x="15" y="50" width="10" height="8" rx="1" />
            <rect x="35" y="50" width="12" height="12" rx="1" />
            <rect x="55" y="48" width="10" height="10" rx="1" />
            <rect x="75" y="50" width="8" height="20" rx="1" />
            <rect x="95" y="50" width="12" height="8" rx="1" />
            <rect x="50" y="70" width="8" height="14" rx="1" />
            <rect x="65" y="68" width="14" height="8" rx="1" />
            <rect x="88" y="70" width="16" height="16" rx="1" />
            <rect x="52" y="90" width="16" height="18" rx="1" />
            <rect x="75" y="95" width="12" height="12" rx="1" />
            <rect x="95" y="95" width="12" height="12" rx="1" />
            <circle cx="60" cy="60" r="4.5" className="fill-[#b71422]" />
          </svg>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
          <Timer className="size-3.5" />
          <span>Kedaluwarsa dalam:</span>
          <span className="font-mono text-[12px] font-bold text-[#b71422]">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleFullscreen}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#F1F5F9] py-2 text-[10px] font-bold text-[#b71422] transition hover:bg-[#FFEBEB]"
        >
          <Maximize2 className="size-3.5" />
          Layar Penuh (Proyektor)
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          title="Perbarui kode QR"
          aria-label="Perbarui kode QR"
          className="rounded-lg bg-[#F1F5F9] p-2 text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#b71422]"
        >
          <RefreshCw className="size-4" />
        </button>
      </div>
    </section>
  );
}
