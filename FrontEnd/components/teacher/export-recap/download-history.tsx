"use client";

import {
  FileText,
  FolderArchive,
  History,
  Table2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ExportHistoryIcon,
  ExportHistoryItem,
  ExportHistoryTone,
} from "./types";

type DownloadHistoryProps = {
  items: ExportHistoryItem[];
  onViewAll: () => void;
};

const historyIconMap = {
  sheet: Table2,
  zip: FolderArchive,
  pdf: FileText,
};

const toneClassName: Record<ExportHistoryTone, string> = {
  green: "bg-[#DCFCE7] text-[#16A34A]",
  blue: "bg-[#E0F2FE] text-[#0284C7]",
  slate: "bg-[#F1F5F9] text-[#475569]",
  red: "bg-[#FFEBEB] text-[#b71422]",
};

const statusClassName: Record<ExportHistoryTone, string> = {
  green: "text-[#16A34A]",
  blue: "text-[#0284C7]",
  slate: "text-[#94A3B8]",
  red: "text-[#b71422]",
};

function HistoryIcon({ icon }: { icon: ExportHistoryIcon }) {
  const Icon = historyIconMap[icon];
  return <Icon className="size-4" />;
}

export function DownloadHistory({
  items,
  onViewAll,
}: DownloadHistoryProps) {
  return (
    <section
      id="download-history"
      className="scroll-mt-24 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <History className="size-4 text-[#b71422]" />
          <h2 className="text-[13px] font-bold text-[#1E293B]">
            Riwayat Unduhan Terbaru
          </h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[9px] font-bold text-[#b71422] transition hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-2 rounded-xl bg-[#F8FAFC] p-2.5 transition-colors hover:bg-[#F1F5F9]"
          >
            <div className="flex min-w-0 items-start gap-2">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  toneClassName[item.tone],
                )}
              >
                <HistoryIcon icon={item.icon} />
              </span>
              <div className="flex min-w-0 flex-col">
                <span
                  title={item.fileName}
                  className="truncate text-[10px] font-bold text-[#1E293B]"
                >
                  {item.fileName}
                </span>
                <span className="truncate text-[9px] text-[#94A3B8]">
                  {item.meta}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <span
                className={cn(
                  "text-[9px] font-bold",
                  statusClassName[item.tone],
                )}
              >
                {item.status}
              </span>
              <span className="font-mono text-[9px] text-[#94A3B8]">
                {item.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
