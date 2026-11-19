"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import { uploadsApi, type UploadedFile } from "@/lib/api/uploads";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
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
  };
}

export default function ModulCourseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [classId, subjectId] = id.split("--");
  const user = useAuthStore((state) => state.user);

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
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const [meetingFiles, setMeetingFiles] = useState<
    Record<string, Record<UploadSlot, PendingFile[]>>
  >({});
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [taskDrafts, setTaskDrafts] = useState<
    Record<string, Record<TaskKind, TaskDraft[]>>
  >({});
  const taskDraftsLoaded = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem("simanis_task_drafts_v1");
        if (raw) {
          setTaskDrafts(
            JSON.parse(raw) as Record<string, Record<TaskKind, TaskDraft[]>>,
          );
        }
      } catch {
        setTaskDrafts({});
      }
      taskDraftsLoaded.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!taskDraftsLoaded.current) return;
    try {
      window.localStorage.setItem(
        "simanis_task_drafts_v1",
        JSON.stringify(taskDrafts),
      );
    } catch {
      taskDraftsLoaded.current = false;
    }
  }, [taskDrafts]);

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
    if (!meetingClassId) return;
    let active = true;
    const loadAdvisor = async () => {
      try {
        const res = await masterDataApi.classes.list();
        if (!active) return;
        if (res.error) return;
        const found = (res.data?.data ?? []).find(
          (item) => item.id === meetingClassId,
        );
        setAdvisorId(found?.advisorId ?? null);
      } catch {
        // abaikan, fallback ke false
      }
    };
    void loadAdvisor();
    return () => {
      active = false;
    };
  }, [meetingClassId]);

  const canOpenAttendance =
    user?.role === "admin" || (advisorId !== null && advisorId === user?.id);

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

  function updateTaskDrafts(kind: TaskKind, next: TaskDraft[]) {
    if (!meetingFileKey) return;
    setTaskDrafts((current) => ({
      ...current,
      [meetingFileKey]: {
        ...(current[meetingFileKey] ?? EMPTY_TASK_DRAFTS),
        [kind]: next,
      },
    }));
  }

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

  useEffect(() => {
    if (!meetingFileKey) return;
    let active = true;
    void (async () => {
      await fetchAndMergeMeetingFiles(meetingFileKey, () => active);
    })();
    return () => {
      active = false;
    };
  }, [meetingFileKey, fetchAndMergeMeetingFiles]);

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

  const submissionCounts = useMemo(() => {
    const entry = meetingFileKey ? meetingFiles[meetingFileKey] : null;
    const countBySlot = (slot: "tugasSubmission" | "kuisSubmission") => {
      const studentIds = new Set(
        (entry?.[slot] ?? [])
          .filter((item) => item.status === "saved" && item.studentId)
          .map((item) => item.studentId),
      );
      return studentIds.size;
    };

    return {
      tugasSubmission: countBySlot("tugasSubmission"),
      kuisSubmission: countBySlot("kuisSubmission"),
    };
  }, [meetingFiles, meetingFileKey]);

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
                    canOpenAttendance={canOpenAttendance}
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
                    submissionCounts={submissionCounts}
                    tasks={
                      meetingFileKey
                        ? taskDrafts[meetingFileKey] ?? EMPTY_TASK_DRAFTS
                        : EMPTY_TASK_DRAFTS
                    }
                    onTasksChange={updateTaskDrafts}
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
