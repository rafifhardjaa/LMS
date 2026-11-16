import { CheckCircle2, ClipboardCheck, Clock3 } from "lucide-react";
import type { AdminItem } from "./types";

export function AdminPanel({ items }: { items: AdminItem[] }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#E0F2FE] text-[#0284C7]">
            <ClipboardCheck className="size-5" />
          </div>
          <h3 className="text-[16px] font-semibold text-[#1E293B]">
            Administrasi Guru Pengampu
          </h3>
        </div>
        <span className="rounded bg-[#DCFCE7] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#16A34A]">
          4 / 5 Lengkap
        </span>
      </div>

      <div className="flex flex-col gap-1.5 text-[12px]">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 ${
              item.done ? "hover:bg-[#F8FAFC]" : "bg-[#FEF3C7]/30"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              {item.done ? (
                <CheckCircle2 className="size-[18px] flex-shrink-0 text-[#22C55E]" />
              ) : (
                <Clock3 className="size-[18px] flex-shrink-0 text-[#F59E0B]" />
              )}
              <span className="truncate font-semibold text-[#1E293B]">
                {item.label}
              </span>
            </div>
            <span
              className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide ${
                item.done ? "text-[#94A3B8]" : "text-[#D97706]"
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
