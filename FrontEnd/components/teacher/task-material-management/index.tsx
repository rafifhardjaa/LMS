"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { AssignmentList } from "./assignment-list";
import { DeadlinePanel } from "./deadline-panel";
import { EmptyState } from "./empty-state";
import { GradingQueue } from "./grading-queue";
import { MaterialLibrary } from "./material-library";
import { MaterialPanel } from "./material-panel";
import { TaskMaterialHeader } from "./page-header";
import { QuickActions } from "./quick-actions";
import { ResourceToolbar } from "./resource-toolbar";
import { SummaryGrid } from "./summary-grid";
import {
  assignments,
  deadlines,
  gradingQueue,
  materials,
  quickActions,
  summaryMetrics,
  tabCounts,
} from "./data";
import type {
  ClassFilter,
  ResourceTab,
  SubjectFilter,
} from "./types";

export function TaskMaterialManagement() {
  const [activeTab, setActiveTab] = useState<ResourceTab>("all");
  const [classFilter, setClassFilter] = useState<ClassFilter>("all");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>("all");
  const [search, setSearch] = useState("");

  const resetFilters = () => {
    setActiveTab("all");
    setClassFilter("all");
    setSubjectFilter("all");
    setSearch("");
  };

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      if (classFilter !== "all" && !assignment.classes.includes(classFilter)) {
        return false;
      }
      if (
        subjectFilter !== "all" &&
        assignment.subjectKey !== subjectFilter
      ) {
        return false;
      }
      if (!query) return true;

      return [
        assignment.title,
        assignment.subject,
        assignment.description,
        assignment.badge,
        ...assignment.classes,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [classFilter, search, subjectFilter]);

  const filteredMaterials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return materials.filter((material) => {
      if (
        subjectFilter !== "all" &&
        material.subjectKey !== subjectFilter
      ) {
        return false;
      }
      if (!query) return true;

      return [material.title, material.meta, material.subject].some((value) =>
        value.toLowerCase().includes(query),
      );
    });
  }, [search, subjectFilter]);

  const showTaskWorkspace =
    activeTab === "all" || activeTab === "tugas";

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <TaskMaterialHeader />

      <SummaryGrid metrics={summaryMetrics} />

      <ResourceToolbar
        activeTab={activeTab}
        classFilter={classFilter}
        subjectFilter={subjectFilter}
        search={search}
        counts={tabCounts}
        onTabChange={setActiveTab}
        onClassChange={setClassFilter}
        onSubjectChange={setSubjectFilter}
        onSearchChange={setSearch}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-5 lg:col-span-8">
          {showTaskWorkspace && (
            <>
              <FadeIn delay={0.1}>
                <AssignmentList
                  assignments={filteredAssignments}
                  onReset={resetFilters}
                />
              </FadeIn>
              <GradingQueue items={gradingQueue} />
            </>
          )}

          {activeTab === "materi" && (
            <MaterialLibrary
              materials={filteredMaterials}
              onReset={resetFilters}
            />
          )}

          {activeTab === "kuis" && (
            <EmptyState
              icon={ClipboardList}
              title="Belum ada kuis aktif"
              description="Kuis dan asesmen formatif akan tampil di sini setelah dibuat melalui menu Buat Tugas Baru."
              actionLabel="Lihat semua berkas"
              onAction={() => setActiveTab("all")}
            />
          )}
        </div>

        <FadeIn delay={0.16} className="flex flex-col gap-4 lg:col-span-4">
          {activeTab !== "materi" && (
            <MaterialPanel materials={filteredMaterials} />
          )}
          <DeadlinePanel deadlines={deadlines} />
          <QuickActions actions={quickActions} />
        </FadeIn>
      </div>
    </div>
  );
}
