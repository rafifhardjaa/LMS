"use client";

import { useState } from "react";
import { FileSignature, Mail, Phone, Send, UserRound } from "lucide-react";

const metrics = [
  { label: "Rata-rata Nilai", value: "91.4", sub: "IPK 3.88" },
  { label: "Presensi", value: "96.2%", sub: "Absensi" },
  { label: "Kompetensi", value: "LSP", sub: "Jr. Net Admin" },
];

const categories = ["Pengembangan Karir & Studi Lanjut", "Akademik", "Personal & Sosial", "Karir"];

export function ChatDetailPanel() {
  const [category, setCategory] = useState(categories[0]);
  const [notes, setNotes] = useState("");

  return (
    <aside className="flex w-full flex-col gap-6">
      <section className="rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-[#6c5dd3] text-sm font-bold text-white">PB</span>
          <p className="mt-2.5 text-sm font-bold text-[#181c20]">Pawell Bennett</p>
          <span className="mt-1 rounded-full bg-[#d1fae5] px-2.5 py-1 text-[9px] font-semibold text-[#047857]">Siswa Ungulan</span>
          <div className="mt-3 w-full space-y-2 text-left">
            <p className="text-[10px] leading-4 text-[#4e566c]"><b className="text-[#181c20]">NISN:</b> 0072918821<br /><b className="text-[#181c20]">Program Keahlian:</b> Teknik Jaringan Komputer &amp; Telekomunikasi</p>
            <p className="flex items-center gap-2 text-[10px] text-[#4e566c]"><Mail className="size-3 shrink-0 text-[#6c5dd3]" /> pawell.bennett@smkmataram.sch.id</p>
            <p className="flex items-center gap-2 text-[10px] text-[#4e566c]"><Phone className="size-3 shrink-0 text-[#6c5dd3]" /> +62 812-3456-7890 (Wali: Ibu Rina)</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <h2 className="text-[10px] font-bold uppercase tracking-wide text-[#4e566c]">Metrik Akademik &amp; Karakter</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {metrics.map(({ label, value, sub }) => <div key={label} className="rounded-xl bg-[#f8f9fc] px-2 py-2.5 text-center"><p className="text-[8px] font-semibold text-[#787584]">{label}</p><p className="mt-0.5 text-sm font-bold text-[#181c20]">{value}</p><p className="text-[8px] text-[#787584]">{sub}</p></div>)}
        </div>
      </section>

      <section className="rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <h2 className="text-[10px] font-bold uppercase tracking-wide text-[#4e566c]">Riwayat Konseling BK</h2>
        <ul className="mt-3 space-y-2.5 text-[10px]">
          <li className="flex items-center justify-between gap-2"><span className="text-[#4e566c]">Jumlah Sesi Tercatat</span><span className="font-bold text-[#181c20]">4 Kali Sesi</span></li>
          <li className="flex items-center justify-between gap-2"><span className="text-[#4e566c]">Rekomendasi Karir</span><span className="text-right font-bold text-[#4331a8]">Pusat 94%<br /><span className="font-medium text-[#787584]">Informatika &amp; AI</span></span></li>
          <li className="flex items-center justify-between gap-2"><span className="text-[#4e566c]">Sikap &amp; Resiliensi</span><span className="font-bold text-[#047857]">Sangat Kooperatif</span></li>
          <li className="flex items-center justify-between gap-2"><span className="text-[#4e566c]">Konselor Pembimbing</span><span className="font-bold text-[#181c20]">Mrs. Sarah Jenkins</span></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-[#eef0f5] bg-white p-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex items-start justify-between gap-2">
          <h2 className="flex items-start gap-2 text-[10px] font-bold uppercase tracking-wide text-[#4e566c]"><UserRound className="mt-0.5 size-3.5 text-[#6c5dd3]" />Lembar Observasi<br />&amp; Tindakan BK</h2>
          <span className="rounded-full bg-[#fef3c7] px-2 py-1 text-[9px] font-semibold text-[#b45309]">Sedang - Terjadwal</span>
        </div>
        <label className="mt-3 block text-[9px] font-semibold text-[#787584]" htmlFor="chat-category">Kategori Masalah</label>
        <select id="chat-category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 h-9 w-full rounded-xl bg-[#f1f4f9] px-3 text-[11px] text-[#181c20] outline-none">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <label className="mt-3 block text-[9px] font-semibold text-[#787584]" htmlFor="chat-notes">Catatan Diagnostik</label>
        <textarea id="chat-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Ringkas hasil observasi & tindak lanjut konseling..." className="mt-1 w-full resize-none rounded-xl bg-[#f1f4f9] px-3 py-2.5 text-[11px] outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" />
        <div className="mt-3 space-y-2">
          <button type="button" onClick={() => window.alert("Simpan Catatan Rekam Medis BK")} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#5343b9] text-xs font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"><FileSignature className="size-3.5" /> Simpan Catatan Rekam Medis BK</button>
          <button type="button" onClick={() => window.alert("Terbitkan Rekomendasi Resmi")} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f1f4f9] text-xs font-semibold text-[#181c20] hover:bg-[#e5deff]"><FileSignature className="size-3.5" /> Terbitkan Rekomendasi Resmi</button>
          <button type="button" onClick={() => window.alert("Kirim Notifikasi Ringkasan ke WhatsApp Wali")} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#f1f4f9] text-xs font-semibold text-[#181c20] hover:bg-[#e5deff]"><Send className="size-3.5" /> Kirim Notifikasi Ringkasan ke WhatsApp Wali</button>
        </div>
      </section>
    </aside>
  );
}
