"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { AssignmentList } from "./assignment-list";
import { EmptyState } from "./empty-state";
import { GradingQueue } from "./grading-queue";
import { TaskMaterialHeader } from "./page-header";
import { QuickActions } from "./quick-actions";
import { ResourceToolbar } from "./resource-toolbar";
import {
  assignments,
  gradingQueue,
  quickActions,
} from "./data";
import type { ResourceTab } from "./types";

export function TaskMaterialManagement() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("tugas");

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <TaskMaterialHeader />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-8">
          <ResourceToolbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-5">
            {activeTab === "tugas" ? (
              <FadeIn delay={0.1}>
                <AssignmentList assignments={assignments} />
              </FadeIn>
            ) : (
              <EmptyState
                bare
                icon={ClipboardList}
                title="Belum ada kuis aktif"
                description="Kuis dan asesmen formatif akan tampil di sini setelah tersedia."
                actionLabel="Lihat tugas"
                onAction={() => setActiveTab("tugas")}
              />
            )}
          </div>
        </section>

        <FadeIn delay={0.16} className="flex flex-col gap-4 lg:col-span-4">
          <GradingQueue items={gradingQueue} />
          <QuickActions actions={quickActions} />
        </FadeIn>
      </div>
    </div>
  );
}
