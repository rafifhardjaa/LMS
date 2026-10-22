"use client";

import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <FadeIn>
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#FFEBEB] text-[#b71422]">
          <Icon className="size-6" />
        </div>
        <h3 className="mt-3 text-[16px] font-semibold text-[#1E293B]">
          {title}
        </h3>
        <p className="mt-1 max-w-md text-[13px] leading-5 text-[#475569]">
          {description}
        </p>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 rounded-lg bg-[#F1F5F9] px-4 py-2 text-[13px] font-semibold text-[#1E293B] transition-colors hover:bg-[#E2E8F0]"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </FadeIn>
  );
}
