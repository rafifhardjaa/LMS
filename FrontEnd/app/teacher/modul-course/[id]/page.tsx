"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { masterDataApi } from "@/lib/api/master-data";
import type { JadwalPelajaran, StudentSummary } from "@/lib/api/master-data";
import { CourseSidebar } from "@/components/teacher/modul-management/detail/course-sidebar";
import { CourseInfoContent } from "@/components/teacher/modul-management/detail/course-info-content";
import { PesertaTable } from "@/components/teacher/modul-management/detail/peserta-table";
import { meetings } from "@/components/teacher/modul-management/detail/data";

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

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      {error ? (
        <div className="rounded-2xl bg-[#FEE2E2] px-4 py-3 text-[13px] text-[#b91c1c] shadow-sm">
          {error}
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="h-64 w-full animate-pulse rounded-2xl bg-white lg:w-72" />
          <div className="h-64 flex-1 animate-pulse rounded-2xl bg-white" />
        </div>
      ) : course ? (
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <CourseSidebar
            subjectName={course.subjectName}
            classLabel={classLabel}
            majorName={course.majorName}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
            pesertaCount={students.length}
          />
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
          ) : (
            <div className="flex min-h-64 flex-1 items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 px-6 text-center">
              <p className="text-[13px] font-semibold text-[#94A3B8]">
                Konten {meetings.find((m) => m.label === selectedKey)?.label ?? "pertemuan"}{" "}
                menyusul
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
          <p className="text-[14px] font-semibold text-[#1E293B]">
            Course tidak ditemukan
          </p>
          <p className="mt-1 text-[12px] text-[#64748B]">
            Data course dengan id tersebut tidak tersedia.
          </p>
        </div>
      )}
    </div>
  );
}
