"use client";

import { motion } from "framer-motion";
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
            Selamat datang, {fullName}! 👋
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Ringkasan pengelolaan pembelajaran SMK Mataram • Tahun Ajaran 2026/2027
          </p>
        </SlideIn>
      </FadeIn>

      <motion.div
        className="w-full bg-white rounded-[20px] shadow-[0_1px_8px_rgba(0,0,0,0.04)] min-h-[calc(100vh-2rem-4rem)] p-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <SlideIn direction="left" className="flex flex-col gap-6">
          <CourseCards />
        </SlideIn>
      </motion.div>
    </div>
  );
}
