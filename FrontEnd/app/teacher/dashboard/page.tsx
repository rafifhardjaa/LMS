"use client";

import { CourseCards } from "@/components/teacher/course-cards";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { useAuthStore } from "@/lib/store/auth-store";

export default function GuruDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const fullName = user?.full_name?.trim() || "Guru";

  return (
    <div className="flex w-full flex-col gap-6 text-[#1E293B]">
      <FadeIn>
        <SlideIn direction="left">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#1E293B] sm:text-[32px]">
            Selamat datang, {fullName}!
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Ringkasan pengelolaan pembelajaran SMK Mataram • Tahun Ajaran 2026/2027
          </p>
        </SlideIn>
      </FadeIn>

      <SlideIn direction="left" className="flex flex-col gap-6">
        <CourseCards />
      </SlideIn>
    </div>
  );
}
