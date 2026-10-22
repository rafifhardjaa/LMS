"use client";

import { Send } from "lucide-react";
import { toast } from "sonner";
import { atRiskStudent } from "./data";

export function AtRiskPanel() {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#EF4444]" />
          <h2 className="text-[12px] font-bold text-[#1E293B]">
            Perhatian Khusus (&lt; 85%)
          </h2>
        </div>
        <span className="rounded-full bg-[#FEE2E2] px-2 py-1 text-[8px] font-bold text-[#DC2626]">
          1 Siswa
        </span>
      </div>

      <p className="text-[10px] leading-4 text-[#475569]">
        Siswa terdeteksi mendekati ambang batas minimum kehadiran syarat ujian
        akhir semester.
      </p>

      <div className="rounded-lg bg-[#F8FAFC] p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#FEE2E2] text-[10px] font-bold text-[#DC2626]">
              {atRiskStudent.initials}
            </span>
            <div>
              <p className="text-[10px] font-bold leading-4 text-[#1E293B]">
                {atRiskStudent.name}
              </p>
              <p className="text-[9px] font-medium text-[#94A3B8]">
                {atRiskStudent.nisn}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[12px] font-bold text-[#EF4444]">
              {atRiskStudent.percentage}%
            </p>
            <p className="text-[8px] font-bold uppercase tracking-[0.03em] text-[#94A3B8]">
              {atRiskStudent.note}
            </p>
          </div>
        </div>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EFF4FF]">
          <div
            className="h-full rounded-full bg-[#EF4444]"
            style={{ width: `${atRiskStudent.percentage}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          toast.success("Peringatan dikirim ke wali murid", {
            description:
              "Pesan WhatsApp berisi ringkasan kehadiran Jim Anderson telah diteruskan.",
          })
        }
        className="mt-0.5 flex items-center justify-center gap-1.5 rounded-lg bg-[#FEE2E2] py-1.5 text-[9px] font-bold text-[#DC2626] transition hover:bg-[#DC2626] hover:text-white"
      >
        <Send className="size-3.5" />
        Kirim Peringatan WA ke Wali Murid
      </button>
    </section>
  );
}
