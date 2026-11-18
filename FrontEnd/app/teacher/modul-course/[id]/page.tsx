"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import type {
  CourseMeeting,
  JadwalPelajaran,
  StudentSummary,
} from "@/lib/api/master-data";
import { CourseSidebar } from "@/components/teacher/modul-management/detail/course-sidebar";
import { CourseInfoContent } from "@/components/teacher/modul-management/detail/course-info-content";
import { PesertaTable } from "@/components/teacher/modul-management/detail/peserta-table";
import { PertemuanContent } from "@/components/teacher/modul-management/detail/pertemuan-content";
import { meetings as fallbackMeetings } from "@/components/teacher/modul-management/detail/data";

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
  const classLabel = course
    ? `${course.className}${course.classSection ? ` ${course.classSection}` : ""}`.trim()
    : "-";

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
  }, [meetingClassId, meetingSubjectId]);

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
