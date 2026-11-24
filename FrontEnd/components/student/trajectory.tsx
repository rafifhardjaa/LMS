"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Clock } from "lucide-react";
import moment from "moment";
import "moment/locale/id";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";
import { masterDataApi, type JadwalPelajaran } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";

type CourseItem = {
  key: string;
  classId: string;
  subjectId: string;
  className: string;
  majorName: string;
  subjectName: string;
  hari: string;
  sesi: number;
  waktuLabel: string;
  isToday: boolean;
};

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function formatTime(value: string) {
  return moment(value, ["HH:mm:ss", "HH:mm"]).format("HH:mm");
}

function mapCourses(jadwal: JadwalPelajaran[]): CourseItem[] {
  const todayName = moment().locale("id").format("dddd");

  return jadwal
    .map((item) => ({
      key: item.id,
      classId: item.classId,
      subjectId: item.subjectId,
      className: item.className?.trim() || "-",
      majorName: item.majorName || "-",
      subjectName: item.subjectName,
      hari: item.hari,
      sesi: item.sesi,
      waktuLabel: `${formatTime(item.waktuMulai)} - ${formatTime(item.waktuSelesai)}`,
      isToday: item.hari === todayName,
    }))
    .sort(
      (first, second) =>
        (DAY_ORDER.indexOf(first.hari) === -1 ? 99 : DAY_ORDER.indexOf(first.hari)) -
          (DAY_ORDER.indexOf(second.hari) === -1 ? 99 : DAY_ORDER.indexOf(second.hari)) ||
        first.sesi - second.sesi,
    );
}

export function Trajectory() {
  const user = useAuthStore((state) => state.user);
  const [classId, setClassId] = useState("");
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [classLoading, setClassLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.kelas) return;

    let active = true;
    const load = async () => {
      try {
        setClassLoading(true);
        setCourseError(null);
        const res = await masterDataApi.classes.list();
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat kelas siswa.");
        }

        const found = (res.data?.data ?? []).find(
          (item) => item.name === user.kelas,
        );
        if (!active) return;
        if (!found) {
          setClassId("");
          setCourses([]);
          setCourseError("Kelas siswa tidak ditemukan.");
          return;
        }

        setClassId(found.id);
      } catch (err) {
        if (active) {
          setClassId("");
          setCourses([]);
          setCourseError(
            err instanceof Error ? err.message : "Gagal memuat kelas siswa.",
          );
        }
      } finally {
        if (active) setClassLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [user?.kelas]);

  useEffect(() => {
    if (!classId) return;

    let active = true;
    const load = async () => {
      try {
        setCoursesLoading(true);
        setCourseError(null);
        const res = await masterDataApi.jadwalPelajaran.list({
          classId,
          activeOnly: true,
        });
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat jadwal kelas.");
        }
        setCourses(mapCourses(res.data?.data ?? []));
      } catch (err) {
        if (active) {
          setCourses([]);
          setCourseError(
            err instanceof Error ? err.message : "Gagal memuat jadwal kelas.",
          );
        }
      } finally {
        if (active) setCoursesLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [classId]);

  return (
    <FadeIn>
      <section className="rounded-[20px] border border-[#cee8e1]/60 bg-white p-5 shadow-[0_1px_8px_rgba(7,31,28,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-6 w-2.5 rounded-full bg-[#0d5c52]" />
            <h3 className="text-[20px] font-semibold tracking-tight text-[#071f1c]">
              My Course
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#536360]">
            {classLoading || coursesLoading
              ? "Memuat..."
              : `${courses.length} Jadwal Aktif`}
          </span>
        </div>

        <div className="mt-5">
          {classLoading || coursesLoading ? (
            <div className="max-h-[474px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 12 }, (_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-xl bg-[#F1F5F9]"
                  />
                ))}
              </div>
            </div>
          ) : courseError ? (
            <div className="rounded-xl bg-[#FEE2E2] p-4 text-sm font-medium text-[#b91c1c]">
              {courseError}
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-xl bg-[#F8FAFC] p-6 text-center text-sm text-[#64748B]">
              Belum ada jadwal aktif untuk kelas ini.
            </div>
          ) : (
            <div className="max-h-[474px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <StaggerChildren
                staggerDelay={0.06}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
              >
                {courses.map((course) => (
                  <StaggerItem key={course.key}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      className={`flex h-full min-h-[150px] flex-col justify-between rounded-xl border p-3 shadow-[0_1px_8px_rgba(7,31,28,0.04)] ${
                        course.isToday
                          ? "border-[#b7e831] bg-[#f0fae5]"
                          : "border-[#cee8e1]/60 bg-[#F8FAFC]"
                      }`}
                    >
                      <div>
                        <h5 className="text-[14px] font-semibold text-[#071f1c]">
                          {course.className}
                        </h5>
                        <p className="mt-1 truncate text-xs text-[#475569]">
                          {course.subjectName}
                        </p>
                        <p className="truncate text-[11px] text-[#64748B]">
                          {course.majorName}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e6f2ef] pt-3">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#94A3B8]">
                          <Clock className="size-3" />
                          {course.hari}, {course.waktuLabel}
                        </span>
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <Link
                            href={`/student/module-course/${course.classId}--${course.subjectId}`}
                            className="flex items-center gap-1 text-[12px] font-semibold text-[#0d5c52]"
                          >
                            Lihat Course
                            <ChevronRight className="size-4" />
                          </Link>
                        </motion.div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end border-t border-[#e6f2ef] pt-3">
          <Link
            href="/student/module-course"
            className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0d5c52] hover:text-[#0a4a42]"
          >
            GO TO COURSE page
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </section>
    </FadeIn>
  );
}
