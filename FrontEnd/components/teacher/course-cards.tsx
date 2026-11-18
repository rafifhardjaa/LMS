"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Bookmark, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import moment from "moment";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import type { JadwalPelajaran } from "@/lib/api/master-data";

type Course = {
  key: string;
  className: string;
  majorName: string;
  subjectName: string;
  badge: string;
  badgeClassName: string;
  hari: string;
  sesi: number;
  waktuLabel: string;
  isToday: boolean;
};

const BADGE_PALETTE = [
  "bg-[#E0F2FE] text-[#0284C7]",
  "bg-[#FEF3C7] text-[#D97706]",
  "bg-[#F3E8FF] text-[#9333EA]",
  "bg-[#DCFCE7] text-[#16A34A]",
  "bg-[#FEE2E2] text-[#DC2626]",
];

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function formatTime(value: string) {
  return moment(value, ["HH:mm:ss", "HH:mm"]).format("HH:mm");
}

function badgeText(j: JadwalPelajaran) {
  const code = j.subjectCode?.trim();
  if (code) return code.slice(0, 3).toUpperCase();
  const words = (j.subjectName ?? "").trim().split(/\s+/);
  return (
    words
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase() || "?"
  );
}

function badgeColor(subjectCode: string | null) {
  const source = (subjectCode ?? "").trim() || "?";
  let hash = 0;
  for (let i = 0; i < source.length; i++) hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  return BADGE_PALETTE[hash % BADGE_PALETTE.length];
}

function classLabel(j: JadwalPelajaran) {
  return j.className?.trim() || "-";
}

function mapCourses(jadwal: JadwalPelajaran[], todayName: string): Course[] {
  return jadwal
    .map((j) => ({
      key: j.id,
      className: classLabel(j),
      majorName: j.majorName || "-",
      subjectName: j.subjectName,
      badge: badgeText(j),
      badgeClassName: badgeColor(j.subjectCode),
      hari: j.hari,
      sesi: j.sesi,
      waktuLabel: `${formatTime(j.waktuMulai)} - ${formatTime(j.waktuSelesai)}`,
      isToday: j.hari === todayName,
    }))
    .sort(
      (a, b) =>
        (DAY_ORDER.indexOf(a.hari) === -1 ? 99 : DAY_ORDER.indexOf(a.hari)) -
          (DAY_ORDER.indexOf(b.hari) === -1 ? 99 : DAY_ORDER.indexOf(b.hari)) ||
        a.sesi - b.sesi
    );
}

export function CourseCards() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await masterDataApi.jadwalPelajaran.list({ activeOnly: true });
        if (!active) return;
        if (res.error) {
          throw new Error(res.error.message ?? "Gagal memuat jadwal pelajaran");
        }
        setCourses(mapCourses(res.data?.data ?? [], moment().locale("id").format("dddd")));
        setError(null);
      } catch (err) {
        console.error("Error loading teacher courses:", err);
        if (active) {
          setCourses([]);
          setError("Tidak dapat memuat data kursus. Silakan coba lagi.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <FadeIn delay={0.05}>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 bg-[#b71422] rounded-full" />
            <h3 className="text-[20px] font-semibold text-[#1E293B] tracking-tight">
              Rombel &amp; Mata Pelajaran Aktif (My Courses)
            </h3>
            <span className="bg-[#F8FAFC] px-2 py-0.5 text-[#94A3B8] text-[12px] font-semibold rounded-full">
              {loading ? "Memuat..." : `${courses.length} Sesi Aktif`}
            </span>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl bg-[#FEE2E2] text-[#b91c1c] text-[13px] px-4 py-3">
            {error}
          </div>
        ) : (
          <StaggerChildren
            staggerDelay={0.06}
            delayChildren={0.05}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <StaggerItem key={`skeleton-${i}`}>
                    <div className="bg-[#F8FAFC] rounded-xl p-2 shadow-sm h-full animate-pulse">
                      <div className="flex items-start justify-between">
                        <span className="w-7 h-7 rounded-lg bg-[#E2E8F0]" />
                        <Bookmark className="size-[18px] text-[#E2E8F0]" />
                      </div>
                      <div className="mt-2 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-[#E2E8F0]" />
                        <div className="h-3 w-1/2 rounded bg-[#E2E8F0]" />
                      </div>
                      <div className="mt-4 h-3 w-2/3 rounded bg-[#E2E8F0]" />
                    </div>
                  </StaggerItem>
                ))
              : courses.map((course) => (
                  <StaggerItem key={course.key}>
                    <motion.div
                      className={`rounded-xl p-2 shadow-sm flex flex-col justify-between h-full border ${
                        course.isToday
                          ? "bg-[#b7e831]/20 border-[#b7e831]"
                          : "bg-[#F8FAFC] border-transparent"
                      }`}
                      whileHover={{
                        y: -4,
                        backgroundColor: "#ffffff",
                        boxShadow: "0 8px 20px -4px rgba(0,0,0,0.10)",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center ${course.badgeClassName}`}
                        >
                          {course.badge}
                        </span>
                        <motion.div whileHover={{ scale: 1.2, color: "#b71422" }}>
                          <Bookmark className="size-[18px] text-[#94A3B8] cursor-pointer" />
                        </motion.div>
                      </div>
                      <div className="mt-2">
                        <h4 className="text-[14px] font-semibold text-[#1E293B]">
                          {course.className}
                        </h4>
                        <p className="text-[12px] text-[#475569] truncate">{course.subjectName}</p>
                        <p className="text-[11px] text-[#64748B] truncate">{course.majorName}</p>
                      </div>
                      <div className="mt-4 pt-1 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#94A3B8] flex items-center gap-1">
                          <Clock className="size-3" /> {course.hari}, {course.waktuLabel}
                        </span>
                        <motion.button
                          type="button"
                          className="text-[12px] font-semibold text-[#b71422] flex items-center gap-0.5"
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          View Course <ChevronRight className="size-[14px]" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
          </StaggerChildren>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="rounded-xl bg-[#F8FAFC] text-[#64748B] text-[13px] px-4 py-6 text-center">
            Belum ada jadwal pelajaran yang diampu.
          </div>
        )}

        <div className="mt-4 pt-1 flex justify-end border-t border-[#EBF0F5]">
          <motion.a
            href="/teacher/modul-course"
            className="text-[#b71422] hover:text-[#db3237] text-[12px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            GO TO MODULES PAGE <ArrowRight className="size-4" />
          </motion.a>
        </div>
      </div>
    </FadeIn>
  );
}
