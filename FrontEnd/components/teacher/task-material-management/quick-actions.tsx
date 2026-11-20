"use client";

import { ArrowRight, Zap } from "lucide-react";
import { toast } from "sonner";
import type { QuickAction } from "./types";

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section className="flex flex-col rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 px-1 pb-1">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#E8F4FB] text-[#006398]">
          <Zap className="size-4" />
        </span>
        <h2 className="text-[14px] font-bold text-[#1E293B]">
          Aksi Cepat Pengampu
        </h2>
      </div>
      <div className="mt-1 divide-y divide-[#F1F5F9]">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() =>
                toast.info(
                  "Aksi cepat ini akan dihubungkan ke layanan pendukung.",
                )
              }
              className={`group flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-[12px] font-semibold text-[#1E293B] transition-colors ${action.hoverClassName}`}
            >
              <span className="flex items-center gap-2">
                <Icon className={`size-5 ${action.iconClassName}`} />
                <span>{action.label}</span>
              </span>
              <ArrowRight className="size-4 text-[#94A3B8] transition-colors group-hover:text-current" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
