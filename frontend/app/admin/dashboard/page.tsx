"use client";

import { Download, Route, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { ActivityChart } from "@/components/admin/activity-chart";
import { AuditLog } from "@/components/admin/audit-log";
import { MetricCards } from "@/components/admin/metric-cards";
import { PlottingBk } from "@/components/admin/plotting-bk";
import { QuizStatusChart } from "@/components/admin/quiz-status-chart";
import { UsersTable } from "@/components/admin/users-table";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

export default function DashboardPage() {
  return (
    <div className="flex flex-col w-full gap-7 pt-4">
      {/* Greeting header */}
      <FadeIn>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <SlideIn direction="left">
            <div className="flex flex-col">
              <h1 className="text-[26px] font-bold tracking-tight">
                Welcome back, Sebastian! 👋
              </h1>
              <p className="text-sm text-[#4e566c]">
                Track your manage and LMS platform performance • SMK Mataram
              </p>
            </div>
          </SlideIn>
          <StaggerChildren staggerDelay={0.08} delayChildren={0.15} className="flex items-center gap-2.5">
            <StaggerItem>
              <motion.button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#181c20] hover:bg-[#eceef3] border border-[#e0e2e7] transition-all text-xs font-semibold shadow-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Download className="size-4 text-[#4e566c]" />
                📥 Import Data
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e5deff] text-[#4331a8] hover:bg-[#c7bfff] transition-all text-xs font-semibold shadow-sm"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <Route className="size-4" />
                + Plotting Rombel
              </motion.button>
            </StaggerItem>
            <StaggerItem>
              <motion.button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6c5dd3] text-white hover:opacity-95 shadow-[0_6px_14px_-2px_rgba(108,93,211,0.35)] transition-all text-xs font-semibold active:scale-95"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <UserPlus className="size-[18px]" />
                + Tambah Pengguna
              </motion.button>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </FadeIn>

      {/* Row 1: metric cards */}
      <MetricCards />

      {/* Row 2: charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <QuizStatusChart />
      </div>

      {/* Row 3: user table */}
      <UsersTable />

      {/* Row 4: audit log + plotting BK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <AuditLog />
        </div>
        <div className="lg:col-span-6">
          <PlottingBk />
        </div>
      </div>
    </div>
  );
}
