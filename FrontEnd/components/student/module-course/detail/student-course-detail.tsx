"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import {
  masterDataApi,
  type Assignment,
  type CourseMeeting,
  type JadwalPelajaran,
  type StudentSummary,
} from "@/lib/api/master-data";
import { uploadsApi, type UploadedFile } from "@/lib/api/uploads";
import { CourseSidebar } from "@/components/teacher/modul-management/detail/course-sidebar";
import { CourseInfoContent } from "@/components/teacher/modul-management/detail/course-info-content";
import { PesertaTable } from "@/components/teacher/modul-management/detail/peserta-table";
import type { PendingFile } from "@/components/teacher/modul-management/detail/file-dropzone";
import { StudentPertemuanContent } from "./student-pertemuan-content";

type SubmissionSlot = "tugasSubmission" | "kuisSubmission";
type FileKind =
  | "materi"
  | "tugasFile"
  | "kuisFile"
  | SubmissionSlot;

type MeetingFiles = Record<FileKind, PendingFile[]>;

type MeetingTasks = { tugas: Assignment[]; kuis: Assignment[] };

const EMPTY_MEETING_FILES: MeetingFiles = {
  materi: [],
  tugasFile: [],
  kuisFile: [],
  tugasSubmission: [],
  kuisSubmission: [],
};

const EMPTY_TASKS: MeetingTasks = { tugas: [], kuis: [] };

function toProxyFileUrl(fileUrl: string): string {
  try {
    const url = new URL(fileUrl);
    return `${url.pathname}${url.search}`;
  } catch {
    return fileUrl;
  }
}

function toPendingFile(item: UploadedFile): PendingFile {
  return {
    clientId: item.id,
    name: item.name,
    size: item.size,
    mimeType: item.mimeType,
    status: "saved",
    id: item.id,
    fileUrl: toProxyFileUrl(item.fileUrl),
    studentId: item.studentId,
    assignmentId: item.assignmentId ?? null,
  };
}

export function StudentCourseDetail({
  classId,
  subjectId,
}: {
  classId: string;
  subjectId: string;
}) {
  const [course, setCourse] = useState<JadwalPelajaran | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [meetings, setMeetings] = useState<CourseMeeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(false);
  const [meetingsError, setMeetingsError] = useState<string | null>(null);

  const [selectedKey, setSelectedKey] = useState("info");
  const [meetingFiles, setMeetingFiles] = useState<
    Record<string, MeetingFiles>
  >({});
  const [tasksByMeeting, setTasksByMeeting] = useState<
    Record<string, MeetingTasks>
  >({});
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
        setCourse(
          all.find(
            (row) => row.classId === classId && row.subjectId === subjectId,
          ) ?? null,
        );
        setError(null);
      } catch (err) {
        console.error("Error loading student course detail:", err);
        if (active) {
          setCourse(null);
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

  useEffect(() => {
    if (!classId || !subjectId) return;
    let active = true;
    const loadStudents = async () => {
      try {
        setStudentsLoading(true);
        const res = await masterDataApi.studentCourses.participants.list(
          subjectId,
          classId,
        );
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat daftar peserta");
        }
        setStudents(res.data?.data ?? []);
        setStudentsError(null);
      } catch (err) {
        console.error("Error loading student course participants:", err);
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
  }, [classId, subjectId]);

  useEffect(() => {
    if (!classId || !subjectId) return;
    let active = true;
    const loadMeetings = async () => {
      try {
        setMeetingsLoading(true);
        const res = await masterDataApi.studentCourses.meetings.list(
          subjectId,
          classId,
        );
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat pertemuan");
        }
        const nextMeetings = res.data?.data ?? [];
        setMeetings(nextMeetings);
        setMeetingsError(null);

        const stillExists = nextMeetings.some(
          (meeting) =>
            `Pertemuan ${meeting.meetingNumber}` === selectedKey,
        );
        if (
          selectedKey !== "info" &&
          selectedKey !== "peserta" &&
          !stillExists
        ) {
          setSelectedKey("info");
        }
      } catch (err) {
        console.error("Error loading student course meetings:", err);
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
  }, [classId, subjectId, selectedKey]);

  const sidebarMeetings = useMemo(
    () =>
      meetings.map((meeting) => ({
        label: `Pertemuan ${meeting.meetingNumber}`,
        date: moment(meeting.meetingDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY"),
      })),
    [meetings],
  );

  const selectedMeeting = useMemo(
    () =>
      meetings.find(
        (meeting) => `Pertemuan ${meeting.meetingNumber}` === selectedKey,
      ) ?? null,
    [meetings, selectedKey],
  );

  const selectedMeetingId = selectedMeeting?.id ?? null;
  const currentFiles =
    (selectedMeetingId ? meetingFiles[selectedMeetingId] : undefined) ??
    EMPTY_MEETING_FILES;
  const currentTasks =
    (selectedMeetingId ? tasksByMeeting[selectedMeetingId] : undefined) ??
    EMPTY_TASKS;

  const fetchMeetingData = useCallback(
    async (meetingId: string, isActive: () => boolean = () => true) => {
      const results = await Promise.all([
        uploadsApi.list("materi", meetingId),
        uploadsApi.list("tugasFile", meetingId),
        uploadsApi.list("kuisFile", meetingId),
        uploadsApi.list("tugasSubmission", meetingId),
        uploadsApi.list("kuisSubmission", meetingId),
        masterDataApi.courseDetails.assignments.list(
          subjectId,
          classId,
          meetingId,
        ),
      ]);

      if (!isActive()) return;

      const [
        materiRes,
        tugasFileRes,
        kuisFileRes,
        tugasRes,
        kuisRes,
        assignmentsRes,
      ] = results;

      if (
        materiRes.error ||
        tugasFileRes.error ||
        kuisFileRes.error ||
        tugasRes.error ||
        kuisRes.error ||
        assignmentsRes.error
      ) {
        toast.error("Gagal memuat data pertemuan");
        return;
      }

      setMeetingFiles((current) => ({
        ...current,
        [meetingId]: {
          materi: (materiRes.data?.data ?? []).map(toPendingFile),
          tugasFile: (tugasFileRes.data?.data ?? []).map(toPendingFile),
          kuisFile: (kuisFileRes.data?.data ?? []).map(toPendingFile),
          tugasSubmission: (tugasRes.data?.data ?? []).map(toPendingFile),
          kuisSubmission: (kuisRes.data?.data ?? []).map(toPendingFile),
        },
      }));

      const nextTasks: MeetingTasks = { tugas: [], kuis: [] };
      for (const assignment of assignmentsRes.data?.data ?? []) {
        nextTasks[assignment.type].push(assignment);
      }
      setTasksByMeeting((current) => ({
        ...current,
        [meetingId]: nextTasks,
      }));
    },
    [classId, subjectId],
  );

  useEffect(() => {
    if (!selectedMeetingId) return;
    let active = true;
    void (async () => {
      await fetchMeetingData(selectedMeetingId, () => active);
    })();
    return () => {
      active = false;
    };
  }, [selectedMeetingId, fetchMeetingData]);

  function updateMeetingFile(
    slot: FileKind,
    clientId: string,
    patch: Partial<PendingFile>,
  ) {
    if (!selectedMeetingId) return;
    setMeetingFiles((current) => {
      const entry = current[selectedMeetingId] ?? EMPTY_MEETING_FILES;
      return {
        ...current,
        [selectedMeetingId]: {
          ...entry,
          [slot]: (entry[slot] ?? []).map((item) =>
            item.clientId === clientId ? { ...item, ...patch } : item,
          ),
        },
      };
    });
  }

  function replaceAssignmentFiles(
    slot: SubmissionSlot,
    assignmentId: string,
    next: PendingFile[],
  ) {
    if (!selectedMeetingId) return;
    setMeetingFiles((current) => {
      const entry = current[selectedMeetingId] ?? EMPTY_MEETING_FILES;
      const others = (entry[slot] ?? []).filter(
        (item) => item.assignmentId !== assignmentId,
      );
      const tagged = next.map((item) => ({ ...item, assignmentId }));
      return {
        ...current,
        [selectedMeetingId]: {
          ...entry,
          [slot]: [...others, ...tagged],
        },
      };
    });
  }

  async function handleUpload(
    slot: SubmissionSlot,
    items: PendingFile[],
    assignmentId: string,
  ) {
    if (!selectedMeetingId) return;

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

        const result = await uploadsApi.upload(
          slot,
          item.file,
          selectedMeetingId,
          assignmentId,
        );

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

      await fetchMeetingData(selectedMeetingId);

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

  async function handleDelete(slot: SubmissionSlot, item: PendingFile) {
    if (!selectedMeetingId || !item.id) return;

    setDeleting(true);
    try {
      const result = await uploadsApi.remove(slot, item.id);

      if (result.error || !result.data?.success) {
        toast.error(result.error?.message ?? "Gagal menghapus file");
        return;
      }

      toast.success("File berhasil dihapus");
      await fetchMeetingData(selectedMeetingId);
    } finally {
      setDeleting(false);
    }
  }

  const classLabel = course?.className || "-";

  return (
    <div className="flex w-full flex-col gap-5 bg-transparent text-[#1E293B]">
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
                accent="student"
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
                    teacherName={course.teacherName}
                    meetingCount={meetings.length}
                    accent="student"
                  />
                ) : selectedKey === "peserta" ? (
                  <PesertaTable
                    students={students}
                    teacherName={course.teacherName}
                    classLabel={classLabel}
                    majorName={course.majorName}
                    loading={studentsLoading}
                    error={studentsError}
                    accent="student"
                  />
                ) : selectedMeeting ? (
                  <StudentPertemuanContent
                    meeting={selectedMeeting}
                    materiFiles={currentFiles.materi}
                    tugasTeacherFiles={currentFiles.tugasFile}
                    kuisTeacherFiles={currentFiles.kuisFile}
                    tugasFiles={currentFiles.tugasSubmission}
                    kuisFiles={currentFiles.kuisSubmission}
                    tugas={currentTasks.tugas}
                    kuis={currentTasks.kuis}
                    onTugasFilesChange={(assignmentId, next) =>
                      replaceAssignmentFiles(
                        "tugasSubmission",
                        assignmentId,
                        next,
                      )
                    }
                    onKuisFilesChange={(assignmentId, next) =>
                      replaceAssignmentFiles(
                        "kuisSubmission",
                        assignmentId,
                        next,
                      )
                    }
                    onUpload={handleUpload}
                    uploading={uploading}
                    onDelete={handleDelete}
                    deleting={deleting}
                  />
                ) : meetingsLoading ? (
                  <div className="flex min-h-64 flex-1 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white px-6 text-center shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                    <p className="text-[13px] font-semibold text-[#94A3B8]">
                      Memuat pertemuan…
                    </p>
                  </div>
                ) : (
                  <div className="flex min-h-64 flex-1 items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 text-center">
                    <p className="text-[13px] font-semibold text-[#94A3B8]">
                      {meetingsError ?? "Belum ada pertemuan pada course ini"}
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
