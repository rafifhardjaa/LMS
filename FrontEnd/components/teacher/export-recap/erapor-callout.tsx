import { BadgeCheck } from "lucide-react";

export function ERaporCallout() {
  return (
    <section className="flex items-start gap-2.5 rounded-[20px] border border-[#F1F5F9] bg-gradient-to-br from-[#FFEBEB] via-white to-[#F8FAFC] p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#b71422] text-white shadow-sm">
        <BadgeCheck className="size-5" />
      </span>
      <div className="flex flex-col gap-1">
        <h3 className="text-[11px] font-bold text-[#1E293B]">
          Format e-Rapor Otomatis
        </h3>
        <p className="text-[9px] leading-4 text-[#475569]">
          Seluruh berkas ledger nilai telah diselaraskan dengan skema resmi{" "}
          <span className="font-semibold text-[#1E293B]">
            e-Rapor Kurikulum Merdeka Kemendikbudristek v2024.1
          </span>
          . Data tidak perlu dikonversi ulang sebelum diunggah ke server pusat.
        </p>
      </div>
    </section>
  );
}
