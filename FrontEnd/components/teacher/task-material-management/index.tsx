"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2 } from "lucide-react";
import {
  masterDataApi,
  type Assignment as ApiAssignment,
  type AssignmentGradingRow,
  type CourseMeeting,
  type TeachingAssignment,
} from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn } from "@/components/ui/animations";
import { AssignmentList } from "./assignment-list";
import { CompletionTrendChart } from "./completion-trend-chart";
import { EmptyState } from "./empty-state";
import { GradingManagementTable } from "./grading-management-table";
import { GradingQueue } from "./grading-queue";
import { GradingStatusChart } from "./grading-status-chart";
import {
  deriveCompletionTrend,
  deriveGradingStatus,
  mapAssignment,
  mapGradingRow,
} from "./mappers";
import { TaskMaterialHeader } from "./page-header";
import { ResourceToolbar } from "./resource-toolbar";
import type { Assignment, ResourceTab } from "./types";

type PanelView =
  | { mode: "tasks" }
  | { mode: "grading"; assignment: Assignment | null };

function errorMessage(error: { message?: string | null } | null | undefined) {
  return error?.message ?? "Terjadi kesalahan saat memuat data.";
}

export function TaskMaterialManagement() {
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<ResourceTab>("tugas");
  const [panelView, setPanelView] = useState<PanelView>({ mode: "tasks" });
  const [course, setCourse] = useState<TeachingAssignment | null>(null);
  const [meetings, setMeetings] = useState<CourseMeeting[]>([]);
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [gradingRows, setGradingRows] = useState<AssignmentGradingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await masterDataApi.teacherAssignments.list({
          teacherId: user.id,
        });
        if (!active) return;
        if (res.error) throw new Error(errorMessage(res.error));

        const sorted = [...(res.data?.data ?? [])].sort(
          (first, second) =>
            first.assignedAt.localeCompare(second.assignedAt) ||
            first.id.localeCompare(second.id),
        );
        const selected = sorted[0] ?? null;
        setCourse(selected);

        if (!selected) {
          setMeetings([]);
          return;
        }

        const meetingRes = await masterDataApi.courseDetails.meetings.list(
          selected.subjectId,
          selected.classId,
        );
        if (!active) return;
        if (meetingRes.error) throw new Error(errorMessage(meetingRes.error));
        setMeetings(meetingRes.data?.data ?? []);
      } catch (err) {
        if (active) {
          setCourse(null);
          setMeetings([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat course guru.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!course) return;

    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const responses = await Promise.all(
          meetings.map((meeting) =>
            masterDataApi.courseDetails.assignments.list(
              course.subjectId,
              course.classId,
              meeting.id,
              activeTab,
            ),
          ),
        );
        if (!active) return;

        const apiAssignments = responses.flatMap((res) => {
          if (res.error) return [];
          return res.data?.data ?? [];
        });
        setAssignments(apiAssignments);

        const gradingResponses = await Promise.all(
          apiAssignments.map((assignment) =>
            masterDataApi.courseDetails.assignments.grading(
              course.subjectId,
              assignment.id,
            ),
          ),
        );
        if (!active) return;

        setGradingRows(
          gradingResponses.flatMap((res) => {
            if (res.error) return [];
            return res.data?.data ?? [];
          }),
        );
      } catch (err) {
        if (active) {
          setAssignments([]);
          setGradingRows([]);
          setError(
            err instanceof Error ? err.message : "Gagal memuat data penilaian.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [activeTab, course, meetings]);

  const assignmentCards = useMemo(
    () =>
      course
        ? assignments.map((assignment) =>
            mapAssignment(assignment, {
              subjectName: course.subjectName ?? "-",
              subjectCode: course.subjectCode,
              className: course.className ?? "-",
            }),
          )
        : [],
    [assignments, course],
  );

  const sortedGradingRows = useMemo(
    () =>
      [...gradingRows].sort((first, second) =>
        second.submittedAt.localeCompare(first.submittedAt),
      ),
    [gradingRows],
  );

  const gradingItems = useMemo(
    () => sortedGradingRows.map((row, index) => mapGradingRow(row, index)),
    [sortedGradingRows],
  );

  const gradingQueue = useMemo(
    () => gradingItems.filter((item) => item.status !== "graded").slice(0, 3),
    [gradingItems],
  );

  const completionTrend = useMemo(
    () => deriveCompletionTrend(gradingRows, assignments),
    [assignments, gradingRows],
  );

  const gradingStatus = useMemo(
    () => deriveGradingStatus(gradingRows),
    [gradingRows],
  );

  const activeAssignment =
    panelView.mode === "grading" ? panelView.assignment : null;
  const tableRows = activeAssignment
    ? gradingItems.filter((row) => row.assignmentId === activeAssignment.id)
    : gradingItems;

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

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-16 text-[13px] font-semibold text-[#64748B]">
          <Loader2 className="size-5 animate-spin text-[#b71422]" />
          Memuat data tugas dan penilaian…
        </div>
      ) : error ? (
        <EmptyState
          icon={ClipboardList}
          title="Data tidak dapat dimuat"
          description={error}
        />
      ) : !course ? (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada course"
          description="Course untuk guru ini belum tersedia."
        />
      ) : panelView.mode === "grading" ? (
        <FadeIn delay={0.04}>
          <GradingManagementTable
            key={activeAssignment?.id ?? "all"}
            rows={tableRows}
            filter={activeAssignment}
            onBack={() => setPanelView({ mode: "tasks" })}
          />
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          <section className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-8">
            <ResourceToolbar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setPanelView({ mode: "tasks" });
              }}
            />

            <div className="mt-5">
              {assignmentCards.length ? (
                <FadeIn delay={0.1}>
                  <AssignmentList
                    assignments={assignmentCards}
                    onOpenQueue={(assignment) =>
                      setPanelView({ mode: "grading", assignment })
                    }
                  />
                </FadeIn>
              ) : (
                <EmptyState
                  bare
                  icon={ClipboardList}
                  title={`Belum ada ${activeTab} aktif`}
                  description={`Belum ada ${activeTab} pada course ${course.subjectName ?? "-"}.`}
                  actionLabel="Lihat tugas"
                  onAction={() => setActiveTab("tugas")}
                />
              )}
            </div>
          </section>

          <FadeIn delay={0.16} className="flex flex-col gap-4 lg:col-span-4">
            <GradingQueue
              items={gradingQueue}
              totalCount={gradingItems.length}
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
