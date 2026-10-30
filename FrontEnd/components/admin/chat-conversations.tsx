"use client";

import { useState } from "react";
import { Filter, Plus, Search } from "lucide-react";

type Chat = { id: string; name: string; detail: string; time: string; unread?: number; active?: boolean; initials: string; tone: string; badge?: string; online?: boolean };

const conversations: Chat[] = [
  { id: "1", name: "Pawell Bennett", detail: "Saya selesai mengerjakan tugas esai port...", time: "09:15", active: true, initials: "PB", tone: "bg-[#6c5dd3] text-white", online: true },
  { id: "2", name: "Sarah Azzahra", detail: "Terima kasih bu, untuk arah konsentrasiny...", time: "09:20", unread: 3, initials: "SA", tone: "bg-[#a39afd] text-[#181c20]", online: true },
  { id: "3", name: "Jim Anderson", detail: "Terkait jadwal ujian praktik saya meras...", time: "09:20", initials: "JA", tone: "bg-[#f97316] text-white", badge: "Perhatian Khusus", online: true },
  { id: "4", name: "Danu Ramadhan", detail: "Konfirmasi jadwal asesmen gelombang 2...", time: "Kemarin", unread: 1, initials: "DR", tone: "bg-[#eceef3] text-[#4e566c]" },
  { id: "5", name: "Lisa Hilton", detail: "Bu, saya ingin bertanya mengenai schol...", time: "Kemarin", initials: "LH", tone: "bg-[#10b981] text-white" },
  { id: "6", name: "Natasha Hughes", detail: "Terima kasih atas sesi konselingnya ka...", time: "Selasa", initials: "NH", tone: "bg-[#7c6fe4] text-white" },
];

const tabs = ["Semua (18)", "Aktif (8)", "Urgent (2)"];

export function ChatConversations() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(tabs[0]);
  const [selected, setSelected] = useState("1");

  const rows = conversations.filter((c) => !query.trim() || c.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <section className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
      <div className="flex items-center justify-between px-4 py-4">
        <h2 className="text-sm font-bold text-[#181c20]">Daftar Percakapan</h2>
        <button type="button" aria-label="Percakapan baru" onClick={() => window.alert("Buat Percakapan Baru")} className="flex size-8 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><Plus className="size-4" /></button>
      </div>
      <div className="flex items-center gap-2 px-4">
        <label className="relative flex-1"><span className="sr-only">Cari percakapan</span><Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#787584]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari siswa, topik..." className="h-9 w-full rounded-full bg-[#f1f4f9] pl-9 pr-3 text-xs outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30" /></label>
        <button type="button" aria-label="Filter percakapan" onClick={() => window.alert("Filter Percakapan")} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]"><Filter className="size-3.5" /></button>
      </div>
      <div role="tablist" aria-label="Filter status percakapan" className="flex gap-1.5 overflow-x-auto px-4 py-3">
        {tabs.map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`shrink-0 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${tab === item ? "bg-[#5343b9] text-white" : "bg-[#f1f4f9] text-[#4e566c] hover:bg-[#eceef3]"}`}>{item}</button>)}
      </div>
      <ul className="flex-1 divide-y divide-[#eceef3] overflow-y-auto">
        {rows.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => setSelected(c.id)} aria-current={selected === c.id ? "true" : undefined} className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${selected === c.id ? "border-l-[3px] border-[#6c5dd3] bg-[#f4f2ff]" : "border-l-[3px] border-transparent hover:bg-[#fbfcfd]"}`}>
              <span className="relative shrink-0"><span className={`flex size-10 items-center justify-center rounded-full text-[10px] font-bold ${c.tone}`}>{c.initials}</span>{c.online && <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#10b981] ring-2 ring-white" />}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2"><span className="truncate text-xs font-semibold text-[#181c20]">{c.name}</span><span className="shrink-0 text-[9px] text-[#787584]">{c.time}</span></span>
                {c.badge && <span className="mt-1 inline-block rounded-full bg-[#fee2e2] px-2 py-0.5 text-[8px] font-bold text-[#dc2626]">{c.badge}</span>}
                <span className="mt-0.5 block truncate text-[10px] text-[#787584]">{c.detail}</span>
              </span>
              {c.unread && <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#6c5dd3] text-[9px] font-bold text-white">{c.unread}</span>}
            </button>
          </li>
        ))}
        {!rows.length && <li className="px-4 py-10 text-center text-xs text-[#787584]">Tidak ada percakapan yang cocok.</li>}
      </ul>
    </section>
  );
}
