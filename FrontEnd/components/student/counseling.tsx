"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

const counseling = {
  totalSessions: 8,
  completedSessions: 5,
  nextSession: "Selasa, 14:00",
  topic: "Bimbingan Karier & Pengembangan Diri",
  notes: "Diskusi tentang minat karier dan jalur pendidikan lanjutan.",
};

export function Counseling() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-start gap-3">
        <MessageCircle className="size-5 text-[#0d5c52] flex-shrink-0" />
        <div className="min-w-0">
          <h3 className="font-medium text-[#071f1c]">Bimbingan Konseling</h3>
          <p className="text-xs text-[#536360]">Total sesi: {counseling.totalSessions}</p>
          <p className="mt-1 text-sm">Sesi selesai: {counseling.completedSessions}</p>
          <p className="mt-2 text-sm">Sesi selanjutnya: {counseling.nextSession}</p>
          <p className="mt-2 truncate max-w-sm text-sm text-[#787580]">{counseling.topic}</p>
          <p className="mt-3 text-xs text-[#787580]">{counseling.notes}</p>
          <Link
            href="/student/counseling"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0d5c52] hover:underline"
          >
            Lihat bimbingan
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
