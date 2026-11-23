"use client";

import { FadeIn, SlideIn } from "@/components/ui/animations";

type StudentPageHeaderProps = {
  title: string;
  description?: string;
};

export function StudentPageHeader({
  title,
  description,
}: StudentPageHeaderProps) {
  return (
    <FadeIn>
      <div className="min-w-0">
        <SlideIn direction="left">
          <h1 className="mt-1 text-[24px] font-semibold leading-8 tracking-tight text-[#1E293B]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-[#475569]">
              {description}
            </p>
          )}
        </SlideIn>
      </div>
    </FadeIn>
  );
}
