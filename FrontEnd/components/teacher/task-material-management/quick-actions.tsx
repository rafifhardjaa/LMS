"use client";

import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { QuickAction } from "./types";

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <section className="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="mb-1 text-[16px] font-semibold text-[#1E293B]">
        Aksi Cepat Pengampu
      </h2>
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
            className={`group flex w-full items-center justify-between rounded-xl bg-[#F8FAFC] p-2.5 text-left text-[12px] font-semibold text-[#1E293B] transition-colors ${action.hoverClassName}`}
          >
            <span className="flex items-center gap-2">
              <Icon className={`size-5 ${action.iconClassName}`} />
              <span>{action.label}</span>
            </span>
            <ArrowRight className="size-4 text-[#94A3B8] transition-colors group-hover:text-current" />
          </button>
        );
      })}
    </section>
  );
}
