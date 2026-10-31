"use client";

import { CalendarPlus, Download, TicketPlus } from "lucide-react";
import { ChatConversations } from "@/components/admin/chat-conversations";
import { ChatDetailPanel } from "@/components/admin/chat-detail-panel";
import { ChatStats } from "@/components/admin/chat-stats";
import { ChatThread } from "@/components/admin/chat-thread";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function ChatKonselingPage() {
  return (
    <div className="flex w-full flex-col gap-6 pt-2">
      <FadeIn>
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-[#eef0f5] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(32,44,90,0.04)] xl:flex-row xl:items-center">
          <SlideIn direction="left">
            <div className="max-w-[560px]">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#4331a8]">
                <span className="rounded-full bg-[#e5deff] px-3 py-1">● SMK MATARAM COUNSELING SYSTEM 4.0</span>
                <span className="flex items-center gap-1.5 rounded-full bg-[#d1fae5] px-3 py-1 text-[#047857]">● Live Tele-Counseling</span>
              </div>
              <h1 className="text-[26px] font-bold leading-tight tracking-[-0.6px] text-[#181c20] sm:text-[28px]">Pusat Komunikasi &amp; Konseling Siswa<br className="hidden sm:block" /> (BK &amp; <span className="text-[#6c5dd3]">Wellness Console)</span></h1>
              <p className="mt-2 text-[13px] leading-5 text-[#4e566c]">Layanan bimbingan konseling terpadu: kelola percakapan rahasia siswa, agenda tatap muka, dokumentasi rekam medis BK, hingga koordinasi tindak lanjut dengan wali murid.</p>
            </div>
          </SlideIn>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => window.alert("Jadwalkan Tatap Muka")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><CalendarPlus className="size-4" /> Jadwalkan Tatap Muka</button>
            <button type="button" onClick={() => window.alert("Ekspor Log Konseling (.xlsx)")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1f4f9] px-4 text-sm font-semibold text-[#4e566c] hover:bg-[#eceef3]"><Download className="size-4" /> Ekspor Log (.xlsx)</button>
            <button type="button" onClick={() => window.alert("Buat Tiket Baru")} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#5343b9] px-4 text-sm font-semibold text-white shadow-[0_6px_14px_-2px_rgba(83,67,185,0.35)] hover:bg-[#4331a8]"><TicketPlus className="size-4" /> Buat Tiket Baru</button>
          </div>
        </section>
      </FadeIn>
      <ChatStats />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[300px_minmax(0,1fr)_294px]">
        <FadeIn className="min-w-0"><ChatConversations /></FadeIn>
        <FadeIn className="min-w-0"><ChatThread /></FadeIn>
        <FadeIn className="min-w-0"><ChatDetailPanel /></FadeIn>
      </div>
    </div>
  );
}
