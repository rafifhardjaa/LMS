"use client";

import { useState } from "react";
import { CalendarClock, FileText, Lock, Paperclip, Send, ShieldCheck, SlidersHorizontal, UserRoundCog, X } from "lucide-react";

const templates = [
  { label: "Kirim Jadwal Temu", icon: CalendarClock, alert: "Kirim Jadwal Temu" },
  { label: "Formulir Refleksi", icon: SlidersHorizontal, alert: "Kirim Formulir Refleksi" },
];

export function ChatThread() {
  const [message, setMessage] = useState("");
  const [secretNotes, setSecretNotes] = useState(false);

  const send = () => {
    if (!message.trim()) return;
    window.alert(`Kirim Pesan: ${message.trim()}`);
    setMessage("");
  };

  return (
    <section className="flex min-h-[640px] max-lg:min-h-[480px] flex-col overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#eef0f5] px-4 py-3 max-lg:flex-wrap">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#6c5dd3] text-[10px] font-bold text-white">PB</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#181c20]">Pawell Bennett <span className="ml-1 rounded-full bg-[#eceef3] px-1.5 py-0.5 text-[8px] font-semibold text-[#4e566c]">XII TKJ 1</span></p>
            <p className="truncate text-[10px] text-[#787584]">Konselor: Mrs. Sarah Jenkins, M.Psi <span className="mx-1">•</span> <span className="inline-flex items-center gap-1"><Lock className="size-2.5" /> Enkripsi 256-Bit</span></p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 max-lg:ml-auto">
          <button type="button" aria-label="Panel detail siswa" onClick={() => window.alert("Buka Panel Detail Siswa")} className="flex size-8 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><SlidersHorizontal className="size-3.5" /></button>
          <button type="button" aria-label="Transfer konselor" onClick={() => window.alert("Transfer ke Konselor Lain")} className="flex size-8 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><UserRoundCog className="size-3.5" /></button>
          <button type="button" aria-label="Laporkan insiden" onClick={() => window.alert("Laporkan Insiden BK")} className="flex size-8 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><ShieldCheck className="size-3.5" /></button>
          <button type="button" onClick={() => window.alert("Tutup Sesi Konseling")} className="inline-flex h-8 items-center gap-1 rounded-full bg-[#fee2e2] px-2.5 text-[10px] font-semibold text-[#dc2626] hover:bg-[#fecaca]"><X className="size-3" /> Tutup Sesi</button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#fbfcfd] px-4 py-4">
        <div className="flex justify-center"><span className="rounded-full bg-white px-3 py-1 text-[9px] font-semibold text-[#787584] shadow-sm">Hari ini, 20 Maret 2025</span></div>
        <p className="mx-auto max-w-[420px] rounded-xl bg-[#eceef3] px-3 py-2 text-center text-[9px] leading-3.5 text-[#4e566c]">Sesi ini memuat komunikasi pribadi siswa. Dilarang menyebarkan konten tanpa izin tertulis dari pihak yang bersangkutan (SOP BK 4.0).</p>
        <div className="flex items-start gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eceef3] text-[8px] font-bold text-[#4e566c]">PB</span>
          <div className="max-w-[70%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(32,44,90,0.06)]"><p className="text-[11px] leading-4 text-[#181c20]">Bu, saya sudah selesai mengerjakan draf esai portofolio untuk beasiswa LPDP. Boleh tolong direview sebentar? Saya masih ragu dengan alur paragraf pembukanya.</p><p className="mt-1 text-right text-[8px] text-[#787584]">09:15</p></div>
        </div>
        <div className="flex items-start justify-end gap-2.5">
          <div className="max-w-[70%] rounded-2xl rounded-tr-md bg-[#6c5dd3] px-3.5 py-2.5 text-white shadow-[0_4px_12px_rgba(108,93,211,0.3)]"><p className="text-[11px] leading-4">Tentu, Pawell. Silakan kirimkan drafnya lewat lampiran di sini. Nanti saya beri catatan per paragraf sebelum jam 12 siang ya.</p><p className="mt-1 text-right text-[8px] text-white/70">09:20</p></div>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#6c5dd3] text-[8px] font-bold text-white">SJ</span>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#eceef3] text-[8px] font-bold text-[#4e566c]">PB</span>
          <div className="max-w-[70%] rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(32,44,90,0.06)]">
            <p className="text-[11px] leading-4 text-[#181c20]">Siap bu. Ini draf terbarunya setelah saya rombak bagian awal kemarin malam.</p>
            <span className="mt-2 flex items-center gap-2.5 rounded-xl bg-[#f1f4f9] px-3 py-2.5"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#f0edff] text-[#6c5dd3]"><FileText className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-semibold text-[#181c20]">Draft_Esai_Portofolio_Pawell.pdf</span><span className="block text-[8px] text-[#787584]">PDF • 1.8 MB</span></span><button type="button" aria-label="Unduh lampiran" onClick={() => window.alert("Unduh Draft_Esai_Portofolio_Pawell.pdf")} className="shrink-0 text-[9px] font-semibold text-[#6c5dd3] hover:underline">Unduh</button></span>
            <p className="mt-1 text-right text-[8px] text-[#787584]">10:05</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#eef0f5] px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {templates.map(({ label, icon: Icon, alert }) => <button key={label} type="button" onClick={() => window.alert(alert)} className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f4f9] px-3 py-1.5 text-[10px] font-semibold text-[#4331a8] hover:bg-[#e5deff]"><Icon className="size-3" /> {label}</button>)}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#f1f4f9] px-3 py-2 max-lg:flex-wrap">
          <button type="button" aria-label="Lampirkan berkas" onClick={() => window.alert("Lampirkan Berkas")} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#4e566c] shadow-sm hover:text-[#6c5dd3]"><Paperclip className="size-4" /></button>
          <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Tulis balasan reassuring & empatik..." aria-label="Tulis pesan" className="h-8 min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-[#787584]" />
          <label className="flex shrink-0 cursor-pointer items-center gap-1.5 max-lg:order-last max-lg:w-full text-[9px] font-semibold text-[#4e566c]"><input type="checkbox" checked={secretNotes} onChange={(e) => setSecretNotes(e.target.checked)} className="size-3.5 accent-[#6c5dd3]" /> Catatan Rahasia</label>
          <button type="button" onClick={send} aria-label="Kirim pesan" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#5343b9] text-white shadow-[0_4px_10px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"><Send className="size-3.5" /></button>
        </div>
      </div>
    </section>
  );
}
