import { CalendarClock } from "lucide-react";
import type { DeadlineItem } from "./types";

export function DeadlinePanel({ deadlines }: { deadlines: DeadlineItem[] }) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-[22px] text-[#b71422]" />
          <h2 className="text-[18px] font-semibold tracking-tight text-[#1E293B]">
            Agenda &amp; Tenggat Pekan Ini
          </h2>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#94A3B8]">
          Maret 2025
        </span>
      </div>

      <div className="relative flex flex-col gap-3 pl-4 before:absolute before:bottom-1 before:left-1.5 before:top-1 before:w-0.5 before:bg-[#E2E8F0]">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="relative flex flex-col gap-0.5">
            <span
              className={`absolute -left-[19px] top-1 size-2.5 rounded-full ring-4 ring-white ${deadline.dotClassName}`}
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold leading-4 text-[#1E293B]">
                {deadline.title}
              </span>
              <span
                className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide ${deadline.badgeClassName}`}
              >
                {deadline.badge}
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              {deadline.note}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
