"use client";

import { CircleAlert, Headset, Hourglass, MessagesSquare } from "lucide-react";

const card = "rounded-2xl border border-[#eef0f5] bg-white p-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)]";

export function ChatStats() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <section className={`${card} flex items-center gap-3`}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4f2ff]"><MessagesSquare className="size-5 text-[#6c5dd3]" /></span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#4e566c]">Total Sesi Akti</p>
          <p className="flex items-baseline gap-1.5"><span className="text-lg font-bold text-[#181c20]">14</span><span className="text-xs text-[#787584]">Percakapan</span></p>
          <span className="mt-1 inline-block rounded-full bg-[#e5deff] px-2 py-0.5 text-[9px] font-semibold text-[#4331a8]">9 Siswa Online</span>
        </div>
      </section>
      <section className={`${card} flex items-center gap-3`}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4f2ff]"><Hourglass className="size-5 text-[#6c5dd3]" /></span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#4e566c]">Antrean KC</p>
          <p className="flex items-baseline gap-1.5"><span className="text-lg font-bold text-[#181c20]">3 Tiket</span><span className="text-xs text-[#787584]">Baru</span></p>
          <span className="mt-1 inline-block rounded-full bg-[#eceef3] px-2 py-0.5 text-[9px] font-semibold text-[#4e566c]">Butuh Penugasan</span>
        </div>
      </section>
      <section className={`${card} flex items-center gap-3`}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#fee2e2]"><CircleAlert className="size-5 text-[#dc2626]" /></span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#4e566c]">Kasus Priorit</p>
          <p className="flex items-baseline gap-1.5"><span className="text-lg font-bold text-[#dc2626]">2 Kasus</span><span className="text-xs text-[#787584]">Urgent</span></p>
          <span className="mt-1 inline-block rounded-full bg-[#fee2e2] px-2 py-0.5 text-[9px] font-semibold text-[#dc2626]">Tindakan Cepat</span>
        </div>
      </section>
      <section className={`${card} flex items-center gap-3`}>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4f2ff]"><Headset className="size-5 text-[#6c5dd3]" /></span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#4e566c]">Konselor Siag</p>
          <p className="flex items-baseline gap-1.5"><span className="text-lg font-bold text-[#181c20]">4 Guru</span><span className="text-xs text-[#787584]">BK Aktif</span></p>
          <span className="mt-1 flex -space-x-1.5">{["SJ", "AF", "RY", "PW"].map((i) => <span key={i} className="flex size-5 items-center justify-center rounded-full bg-[#4e566c] text-[7px] font-bold text-white ring-2 ring-white">{i}</span>)}</span>
        </div>
      </section>
    </div>
  );
}
