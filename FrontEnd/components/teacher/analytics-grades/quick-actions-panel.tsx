"use client";

import { ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { quickActions } from "./data";

const actionMessages: Record<string, string> = {
  print: "Leger nilai resmi disiapkan dalam format PDF.",
  predicate: "Konversi predikat A, B, C, dan D berhasil dihitung ulang.",
  lock: "Nilai semester akan dikunci setelah rapat pleno guru.",
};

export function QuickActionsPanel() {
  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <h2 className="text-[13px] font-bold text-[#1E293B]">Aksi Cepat</h2>
      <p className="mt-0.5 text-[10px] font-medium text-[#94A3B8]">
        Alat bantu administrasi nilai guru
      </p>

      <div className="mt-3 space-y-2">
        {quickActions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              type="button"
              onClick={() =>
                toast.info(action.title, {
                  description: actionMessages[action.id],
                })
              }
              className={cn(
                "group flex w-full items-center gap-2.5 rounded-xl border p-2.5 text-left transition",
                action.danger
                  ? "border-[#F3C6C3] bg-[#FFFBFB] hover:bg-[#FFF1F0]"
                  : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#DCE5EE] hover:bg-white",
              )}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                  action.iconBgClassName,
                  action.iconTextClassName,
                  action.hoverGroupClassName,
                )}
              >
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block truncate text-[10px] font-bold",
                    action.danger ? "text-[#b71422]" : "text-[#334155]",
                  )}
                >
                  {action.title}
                </span>
                <span className="mt-0.5 block text-[9px] leading-3.5 text-[#94A3B8]">
                  {action.description}
                </span>
              </span>
              <ChevronRight
                className={cn(
                  "size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5",
                  action.danger ? "text-[#b71422]" : "text-[#94A3B8]",
                )}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
