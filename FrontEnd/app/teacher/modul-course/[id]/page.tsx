"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import { uploadsApi, type UploadedFile } from "@/lib/api/uploads";
import type {
  Assignment,
  AssignmentSummary,
  CourseMeeting,
  JadwalPelajaran,
  StudentSummary,
} from "@/lib/api/master-data";
import { CourseSidebar } from "@/components/teacher/modul-management/detail/course-sidebar";
import { CourseInfoContent } from "@/components/teacher/modul-management/detail/course-info-content";
import { PesertaTable } from "@/components/teacher/modul-management/detail/peserta-table";
import { PertemuanContent } from "@/components/teacher/modul-management/detail/pertemuan-content";
import {
  EMPTY_UPLOAD_FILES,
  type PendingFile,
  type UploadSlot,
} from "@/components/teacher/modul-management/detail/file-dropzone";
import { meetings as fallbackMeetings } from "@/components/teacher/modul-management/detail/data";
import type {
  TaskDraft,
  TaskKind,
} from "@/components/teacher/modul-management/detail/task-submission-dropdown";

const EMPTY_TASK_DRAFTS: Record<TaskKind, TaskDraft[]> = {
  tugas: [],
  kuis: [],
};

const UPLOAD_SLOTS: UploadSlot[] = [
  "materi",
  "tugasFile",
  "tugasSubmission",
  "kuisFile",
  "kuisSubmission",
];

function toPendingFile(item: UploadedFile): PendingFile {
  return {
    clientId: item.id,
    name: item.name,
    size: item.size,
    mimeType: item.mimeType,
    status: "saved",
    id: item.id,
    fileUrl: item.fileUrl,
    studentId: item.studentId,
    assignmentId: item.assignmentId ?? null,
  };
}

const WIB_DATE = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const WIB_TIME = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function wibIso(dateStr: string, timeStr: string) {
  return `${dateStr}T${timeStr}:00+07:00`;
}

function wibDateValue(iso?: string | null): string {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  return WIB_DATE.format(parsed);
}

function wibTimeValue(iso?: string | null): string {
  if (!iso) return "";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";
  const time = WIB_TIME.format(parsed);
  return time.startsWith("24:") ? `00:${time.slice(3)}` : time;
}

function toTaskDraftFromAssignment(assignment: Assignment): TaskDraft {
  return {
    id: assignment.id,
    serverId: assignment.id,
    title: assignment.title,
    description: assignment.description ?? "",
    startDate: wibDateValue(assignment.startAt),
    startTime: wibTimeValue(assignment.startAt),
    deadline: wibDateValue(assignment.deadlineAt),
    deadlineTime: wibTimeValue(assignment.deadlineAt),
  };
}

const UUID_RE_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function taskDraftChanged(a: TaskDraft, b: TaskDraft | undefined) {
  if (!b) return true;

  const aFileIds = a.fileIds ?? [];
  const bFileIds = b.fileIds ?? [];
  if (
    aFileIds.length !== bFileIds.length ||
    aFileIds.some((id) => !bFileIds.includes(id))
  ) {
    return true;
  }

  return (
    b.title !== a.title ||
    b.description !== a.description ||
    b.startDate !== a.startDate ||
    (b.startTime ?? "") !== (a.startTime ?? "") ||
    b.deadline !== a.deadline ||
    (b.deadlineTime ?? "") !== (a.deadlineTime ?? "")
  );
}

export default function ModulCourseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [classId, subjectId] = id.split("--");

  const [rows, setRows] = useState<JadwalPelajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState("info");
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<CourseMeeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [meetingsError, setMeetingsError] = useState<string | null>(null);
  const [meetingsVersion, setMeetingsVersion] = useState(0);
  const [meetingFiles, setMeetingFiles] = useState<
    Record<string, Record<UploadSlot, PendingFile[]>>
  >({});
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [taskDrafts, setTaskDrafts] = useState<
    Record<string, Record<TaskKind, TaskDraft[]>>
  >({});
  const [taskSummaries, setTaskSummaries] = useState<
    Record<string, AssignmentSummary>
  >({});
  const legacyMigratedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await masterDataApi.jadwalPelajaran.list({ activeOnly: true });
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat detail course");
        }
        const all = res.data?.data ?? [];
        setRows(
          all.filter((row) => row.classId === classId && row.subjectId === subjectId),
        );
        setError(null);
      } catch (err) {
        console.error("Error loading course detail:", err);
        if (active) {
          setRows([]);
          setError("Tidak dapat memuat detail course. Silakan coba lagi.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [classId, subjectId]);

  const courseClassId = rows[0]?.classId;

  useEffect(() => {
    if (!courseClassId) return;
    let active = true;
    const loadStudents = async () => {
      try {
        setStudentsLoading(true);
        const res = await masterDataApi.students.list({ classId: courseClassId });
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat daftar peserta");
        }
        setStudents(res.data?.data ?? []);
        setStudentsError(null);
      } catch (err) {
        console.error("Error loading course participants:", err);
        if (active) {
          setStudents([]);
          setStudentsError("Tidak dapat memuat daftar peserta. Silakan coba lagi.");
        }
      } finally {
        if (active) setStudentsLoading(false);
      }
    };
    void loadStudents();
    return () => {
      active = false;
    };
  }, [courseClassId]);

  const course = rows[0];
  const classLabel = course?.className || "-";

  const meetingSubjectId = course?.subjectId ?? null;
  const meetingClassId = course?.classId ?? null;

  useEffect(() => {
    if (!meetingSubjectId || !meetingClassId) return;
    let active = true;
    const loadMeetings = async () => {
      try {
        setMeetingsLoading(true);
        const res = await masterDataApi.courseDetails.meetings.list(
          meetingSubjectId,
          meetingClassId
        );
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat pertemuan");
        }
        setMeetings(res.data?.data ?? []);
        setMeetingsError(null);

        const nextMeetings = res.data?.data ?? [];
        const stillExists = nextMeetings.some(
          (meeting) =>
            `Pertemuan ${meeting.meetingNumber}` === selectedKey
        );
        if (
          selectedKey !== "info" &&
          selectedKey !== "peserta" &&
          !stillExists
        ) {
          setSelectedKey("info");
        }
      } catch (err) {
        console.error("Error loading course meetings:", err);
        if (active) {
          setMeetings([]);
          setMeetingsError("Tidak dapat memuat daftar pertemuan.");
        }
      } finally {
        if (active) setMeetingsLoading(false);
      }
    };
    void loadMeetings();
    return () => {
      active = false;
    };
  }, [meetingClassId, meetingSubjectId, meetingsVersion, selectedKey]);

  const sidebarMeetings = useMemo(
    () =>
      meetings.length
        ? meetings.map((meeting) => ({
            label: `Pertemuan ${meeting.meetingNumber}`,
            date: moment(meeting.meetingDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY"),
          }))
        : fallbackMeetings.map((meeting) => ({
            label: meeting.label,
            date: meeting.date,
          })),
    [meetings]
  );

  const selectedMeeting = useMemo(
    () =>
      meetings.find(
        (meeting) => `Pertemuan ${meeting.meetingNumber}` === selectedKey
      ) ?? null,
    [meetings, selectedKey]
  );

  const meetingFileKey =
    selectedMeeting?.id ??
    (selectedMeeting && classId && subjectId
      ? `${classId}__${subjectId}__P${selectedMeeting.meetingNumber}`
      : null);

  const fetchAssignments = useCallback(
    async (key: string) => {
      if (!meetingSubjectId || !meetingClassId) {
        setTaskDrafts((current) => ({ ...current, [key]: EMPTY_TASK_DRAFTS }));
        return;
      }

      const result = await masterDataApi.courseDetails.assignments.list(
        meetingSubjectId,
        meetingClassId,
        key,
      );

      if (result.error) {
        setTaskDrafts((current) => ({
          ...current,
          [key]: EMPTY_TASK_DRAFTS,
        }));
        return;
      }

      const nextDrafts: Record<TaskKind, TaskDraft[]> = {
        tugas: [],
        kuis: [],
      };
      const nextSummaries: Record<string, AssignmentSummary> = {};

      for (const assignment of result.data?.data ?? []) {
        nextDrafts[assignment.type].push(toTaskDraftFromAssignment(assignment));
        if (assignment.summary) {
          nextSummaries[assignment.id] = assignment.summary;
        }
      }

      setTaskDrafts((current) => ({ ...current, [key]: nextDrafts }));
      setTaskSummaries((current) => ({ ...current, ...nextSummaries }));
    },
    [meetingSubjectId, meetingClassId],
  );

  const migrateLegacyTaskDrafts = useCallback(async () => {
    if (!meetingSubjectId || !meetingClassId) return;
    const raw = window.localStorage.getItem("simanis_task_drafts_v1");
    if (!raw) return;

    try {
      const legacy = JSON.parse(raw) as Record<
        string,
        Partial<Record<TaskKind, TaskDraft[]>>
      >;
      const nextDrafts: Record<string, Record<TaskKind, TaskDraft[]>> = {};
      let migrated = false;

      for (const [meetingId, kinds] of Object.entries(legacy)) {
        if (!meetingId || !meetingId.match(UUID_RE_PATTERN)) continue;
        nextDrafts[meetingId] = { tugas: [], kuis: [] };
        for (const kind of ["tugas", "kuis"] as const) {
          for (const draft of kinds?.[kind] ?? []) {
            if (!draft.title?.trim()) continue;
            const res = await masterDataApi.courseDetails.assignments.create(
              meetingSubjectId,
              {
                classId: meetingClassId,
                meetingId,
                type: kind,
                title: draft.title.trim(),
                description: draft.description?.trim() || undefined,
                startAt: wibIso(
                  draft.startDate,
                  draft.startTime || "08:00",
                ),
                deadlineAt: wibIso(
                  draft.deadline,
                  draft.deadlineTime || "23:59",
                ),
              },
            );
            if (res.error) continue;
            const created = res.data?.data;
            if (!created) continue;
            nextDrafts[meetingId][kind].push(toTaskDraftFromAssignment(created));
            const summary = created.summary;
            if (summary) {
              setTaskSummaries((current) => ({
                ...current,
                [created.id]: summary,
              }));
            }
            migrated = true;
          }
        }
      }

      if (migrated) setTaskDrafts((current) => ({ ...current, ...nextDrafts }));
    } catch {
      // Abaikan data lama yang gagal dimigrasi; sistem masih bisa diisi ulang.
    } finally {
      window.localStorage.removeItem("simanis_task_drafts_v1");
    }
  }, [meetingSubjectId, meetingClassId]);

  const fetchAndMergeMeetingFiles = useCallback(
    async (key: string, isActive: () => boolean = () => true) => {
      const results = await Promise.all(
        UPLOAD_SLOTS.map((slot) => uploadsApi.list(slot, key)),
      );
      if (!isActive()) return;

      if (results.some((result) => result.error)) {
        toast.error("Gagal memuat daftar file pertemuan");
        return;
      }

      setMeetingFiles((current) => {
        const currentEntry = current[key] ?? EMPTY_UPLOAD_FILES;
        const nextEntry = { ...currentEntry };
        UPLOAD_SLOTS.forEach((slot, index) => {
          const saved = (results[index].data?.data ?? []).map(toPendingFile);
          const unsaved = (currentEntry[slot] ?? []).filter(
            (item) => item.status !== "saved",
          );
          nextEntry[slot] = [...unsaved, ...saved];
        });
        return { ...current, [key]: nextEntry };
      });
    },
    [],
  );

  const handleTasksChange = useCallback(
    async (kind: TaskKind, next: TaskDraft[]) => {
      const key = meetingFileKey;
      if (!meetingSubjectId || !meetingClassId || !key) return;

      const current = taskDrafts[key]?.[kind] ?? [];
      const nextIds = new Set(next.map((draft) => draft.id));

      const baseBody = (draft: TaskDraft) => ({
        title: draft.title.trim(),
        description: draft.description.trim(),
        startAt: draft.startDate
          ? wibIso(draft.startDate, draft.startTime || "08:00")
          : undefined,
        deadlineAt: wibIso(draft.deadline, draft.deadlineTime || "23:59"),
        fileIds: draft.fileIds,
      });

      try {
        for (const draft of next) {
          if (!draft.serverId) {
            const created = await masterDataApi.courseDetails.assignments.create(
              meetingSubjectId,
              {
                classId: meetingClassId,
                meetingId: key,
                type: kind,
                ...baseBody(draft),
              },
            );
            const createdRow = created.data?.data;
            if (created.error || !createdRow) {
              throw new Error(created.error?.message ?? "Gagal membuat tugas");
            }

            setTaskDrafts((currentDrafts) => {
              const entry = currentDrafts[key]?.[kind] ?? [];
              return {
                ...currentDrafts,
                [key]: {
                  ...(currentDrafts[key] ?? EMPTY_TASK_DRAFTS),
                  [kind]: entry.map((item) =>
                    item.id === draft.id
                      ? { ...item, id: createdRow.id, serverId: createdRow.id }
                      : item,
                  ),
                },
              };
            });

            const summary = createdRow.summary;
            if (summary) {
              setTaskSummaries((currentSummaries) => ({
                ...currentSummaries,
                [createdRow.id]: summary,
              }));
            }
            continue;
          }

          const existing =
            current.find((item) => item.serverId === draft.serverId) ??
            current.find((item) => item.id === draft.serverId);
          if (!taskDraftChanged(draft, existing)) continue;

          const updated = await masterDataApi.courseDetails.assignments.update(
            meetingSubjectId,
            draft.serverId,
            baseBody(draft),
          );
          if (updated.error || !updated.data?.data) {
            throw new Error(updated.error?.message ?? "Gagal memperbarui tugas");
          }
        }

        for (const draft of current) {
          if (!draft.serverId || nextIds.has(draft.id)) continue;
          const removed = await masterDataApi.courseDetails.assignments.remove(
            meetingSubjectId,
            draft.serverId,
          );
          if (removed.error) {
            throw new Error(removed.error.message ?? "Gagal menghapus tugas");
          }
        }

        toast.success(
          `${kind === "tugas" ? "Tugas" : "Kuis"} berhasil disimpan`,
        );
      } catch (error) {
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : `Gagal menyimpan ${kind}; data terlihat di server`,
        );
      } finally {
        void fetchAssignments(key);
        void fetchAndMergeMeetingFiles(key);
      }
    },
    [
      meetingFileKey,
      meetingSubjectId,
      meetingClassId,
      taskDrafts,
      fetchAssignments,
      fetchAndMergeMeetingFiles,
    ],
  );

  useEffect(() => {
    if (!meetingFileKey) return;
    let active = true;
    void (async () => {
      if (!legacyMigratedRef.current) {
        legacyMigratedRef.current = true;
        await migrateLegacyTaskDrafts();
      }
      await fetchAssignments(meetingFileKey);
      await fetchAndMergeMeetingFiles(meetingFileKey, () => active);
    })();
    return () => {
      active = false;
    };
  }, [
    meetingFileKey,
    fetchAndMergeMeetingFiles,
    fetchAssignments,
    migrateLegacyTaskDrafts,
  ]);

  function updateMeetingFile(
    slot: UploadSlot,
    clientId: string,
    patch: Partial<PendingFile>,
  ) {
    if (!meetingFileKey) return;
    setMeetingFiles((current) => {
      const slotFiles = current[meetingFileKey]?.[slot] ?? [];
      return {
        ...current,
        [meetingFileKey]: {
          ...(current[meetingFileKey] ?? EMPTY_UPLOAD_FILES),
          [slot]: slotFiles.map((item) =>
            item.clientId === clientId ? { ...item, ...patch } : item,
          ),
        },
      };
    });
  }

  async function handleUpload(slot: UploadSlot, items: PendingFile[]) {
    if (!meetingFileKey) return;

    const targets = items.filter(
      (item) =>
        (item.status === "pending" || item.status === "failed") && item.file,
    );

    if (!targets.length) return;

    setUploading(true);
    let succeeded = 0;

    try {
      for (const item of targets) {
        if (!item.file) continue;
        updateMeetingFile(slot, item.clientId, {
          status: "uploading",
          error: undefined,
        });

        const result = await uploadsApi.upload(slot, item.file, meetingFileKey);

        if (result.error || !result.data?.success || !result.data.data) {
          updateMeetingFile(slot, item.clientId, {
            status: "failed",
            error: result.error?.message ?? "Upload gagal",
          });
          continue;
        }

        const uploaded = result.data.data;
        updateMeetingFile(slot, item.clientId, {
          status: "saved",
          id: uploaded.id,
          fileUrl: uploaded.fileUrl,
        });
        succeeded += 1;
      }

      await fetchAndMergeMeetingFiles(meetingFileKey);

      if (succeeded === targets.length) {
        toast.success(`${succeeded} file berhasil diunggah`);
      } else {
        toast.error(
          `Upload selesai: ${succeeded} berhasil, ${targets.length - succeeded} gagal`,
        );
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(slot: UploadSlot, item: PendingFile) {
    if (!meetingFileKey || !item.id) return;

    setDeleting(true);
    try {
      const result = await uploadsApi.remove(slot, item.id);

      if (result.error || !result.data?.success) {
        toast.error(result.error?.message ?? "Gagal menghapus file");
        return;
      }

      setMeetingFiles((current) => {
        const currentEntry = current[meetingFileKey] ?? EMPTY_UPLOAD_FILES;
        return {
          ...current,
          [meetingFileKey]: {
            ...currentEntry,
            [slot]: (currentEntry[slot] ?? []).filter(
              (file) => file.id !== item.id && file.clientId !== item.clientId,
            ),
          },
        };
      });

      toast.success("File berhasil dihapus");
      await fetchAndMergeMeetingFiles(meetingFileKey);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <AnimatePresence mode="wait">
        {error ? (
          <FadeIn key="error">
            <div className="rounded-2xl bg-[#FEE2E2] px-4 py-3 text-[13px] text-[#b91c1c] shadow-sm">
              {error}
            </div>
          </FadeIn>
        ) : loading ? (
          <FadeIn key="loading">
            <div className="flex flex-col gap-4 lg:flex-row">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="h-64 w-full animate-pulse rounded-2xl bg-white lg:w-72"
              />
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="h-64 flex-1 animate-pulse rounded-2xl bg-white"
              />
            </div>
          </FadeIn>
        ) : course ? (
          <div key="content" className="flex flex-col items-start gap-4 lg:flex-row">
            <SlideIn direction="left" className="w-full lg:w-72">
              <CourseSidebar
                subjectName={course.subjectName}
                classLabel={classLabel}
                majorName={course.majorName}
                selectedKey={selectedKey}
                onSelect={setSelectedKey}
                pesertaCount={students.length}
                meetings={sidebarMeetings}
              />
            </SlideIn>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-0 flex-1 flex-col"
              >
                {selectedKey === "info" ? (
                  <CourseInfoContent
                    subjectName={course.subjectName}
                    capaianPembelajaran={course.capaianPembelajaran}
                    pesertaCount={students.length}
                  />
                ) : selectedKey === "peserta" ? (
                  <PesertaTable
                    students={students}
                    teacherName={course.teacherName}
                    classLabel={classLabel}
                    majorName={course.majorName}
                    loading={studentsLoading}
                    error={studentsError}
                  />
                ) : selectedMeeting ? (
                  <PertemuanContent
                    key={selectedKey}
                    meeting={selectedMeeting}
                    subjectId={course.subjectId}
                    classId={course.classId}
                    meetings={meetings}
                    onMeetingsChanged={() => setMeetingsVersion((value) => value + 1)}
                    files={
                      (meetingFileKey
                        ? meetingFiles[meetingFileKey]
                        : undefined) ?? EMPTY_UPLOAD_FILES
                    }
                    onFilesChange={(slot, next) => {
                      if (!meetingFileKey) return;
                      setMeetingFiles((current) => ({
                        ...current,
                        [meetingFileKey]: {
                          ...(current[meetingFileKey] ?? EMPTY_UPLOAD_FILES),
                          [slot]: next,
                        },
                      }));
                    }}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onDelete={handleDelete}
                    deleting={deleting}
                      summaries={taskSummaries}
                    tasks={
                      meetingFileKey
                        ? taskDrafts[meetingFileKey] ?? EMPTY_TASK_DRAFTS
                        : EMPTY_TASK_DRAFTS
                    }
                    onTasksChange={handleTasksChange}
                    totalStudents={students.length}
                  />
                ) : meetingsLoading && selectedKey !== "info" && selectedKey !== "peserta" ? (
                  <div className="flex min-h-64 flex-1 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 text-center shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                    <p className="text-[13px] font-semibold text-[#94A3B8]">
                      Memuat pertemuan…
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-64 flex-1 items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 text-center">
                    <p className="text-[13px] font-semibold text-[#94A3B8]">
                      {meetingsError
                        ? meetingsError
                        : `Konten ${selectedKey} menyusul`}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <FadeIn key="not-found">
            <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
              <p className="text-[14px] font-semibold text-[#1E293B]">
                Course tidak ditemukan
              </p>
              <p className="mt-1 text-[12px] text-[#64748B]">
                Data course dengan id tersebut tidak tersedia.
              </p>
            </div>
          </FadeIn>
        )}
      </AnimatePresence>
    </div>
  );
}
