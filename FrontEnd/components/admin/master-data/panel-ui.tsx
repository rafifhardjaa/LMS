"use client";

import { type ReactNode } from "react";

export function PanelCard({ children }: { children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  subtitle,
  count,
  actions,
}: {
  title: string;
  subtitle?: string;
  count?: number;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 border-b border-[#eceef3] px-5 py-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-[#181c20]">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[11px] text-[#787584]">{subtitle}</p>
          ) : null}
        </div>
        {typeof count === "number" ? (
          <span className="rounded-full bg-[#e5deff] px-2 py-1 text-[10px] font-semibold text-[#4331a8]">
            {count}
          </span>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${
        active
          ? "bg-[#e7f6ec] text-[#1a7f3c]"
          : "bg-[#eceef3] text-[#4e566c]"
      }`}
    >
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

export function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-12 text-center text-sm text-[#787584]">
        {message}
      </td>
    </tr>
  );
}

export const thClass =
  "px-3 py-3 text-left text-[11px] font-semibold text-[#4e566c]";
export const tdClass = "px-3 py-3.5 text-xs text-[#181c20]";
