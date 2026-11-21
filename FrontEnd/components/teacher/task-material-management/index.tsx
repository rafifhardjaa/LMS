"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { AssignmentList } from "./assignment-list";
import { CompletionTrendChart } from "./completion-trend-chart";
import { EmptyState } from "./empty-state";
import { GradingManagementTable } from "./grading-management-table";
import { GradingQueue } from "./grading-queue";
import { GradingStatusChart } from "./grading-status-chart";
import { TaskMaterialHeader } from "./page-header";
import { ResourceToolbar } from "./resource-toolbar";
import {
  assignments,
  completionTrend,
  gradingQueue,
  gradingStatus,
  gradingTableRows,
} from "./data";
import type { Assignment, ResourceTab } from "./types";

type PanelView =
  | { mode: "tasks" }
  | { mode: "grading"; assignment: Assignment | null };

export function TaskMaterialManagement() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("tugas");
  const [panelView, setPanelView] = useState<PanelView>({ mode: "tasks" });
  const [gradingRowsState, setGradingRowsState] = useState(gradingTableRows);

  const activeAssignment =
    panelView.mode === "grading" ? panelView.assignment : null;
  const gradingRows = activeAssignment
    ? gradingRowsState.filter(
        (row) => row.assignmentId === activeAssignment.id,
      )
    : gradingRowsState;

  function updateScore(id: string, score: number) {
    setGradingRowsState((current) =>
      current.map((row) =>
        row.id === id ? { ...row, score, status: "graded" } : row,
      ),
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <TaskMaterialHeader />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FadeIn delay={0.06}>
          <CompletionTrendChart data={completionTrend} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <GradingStatusChart data={gradingStatus} />
        </FadeIn>
      </div>

      {panelView.mode === "grading" ? (
        <FadeIn delay={0.04}>
          <GradingManagementTable
            key={activeAssignment?.id ?? "all"}
            rows={gradingRows}
            filter={activeAssignment}
            onBack={() => setPanelView({ mode: "tasks" })}
            onUpdateScore={updateScore}
          />
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-8">
            <ResourceToolbar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-5">
              {activeTab === "tugas" ? (
                <FadeIn delay={0.1}>
                  <AssignmentList
                    assignments={assignments}
                    onOpenQueue={(assignment) =>
                      setPanelView({ mode: "grading", assignment })
                    }
                  />
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
            <GradingQueue
              items={gradingQueue}
              onOpenAll={() =>
                setPanelView({ mode: "grading", assignment: null })
              }
            />
          </FadeIn>
        </div>
      )}
    </div>
  );
}
