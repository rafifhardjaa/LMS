"use client";

import { useEffect, useState } from "react";
import { ArrowUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";
import { masterDataApi } from "@/lib/api/master-data";
import type {
  JadwalStats,
  StudentStats,
  SubjectStats,
  TeacherStats,
} from "@/lib/api/master-data";

type InitAvatar = { text: string; className: string };

type Metric = {
  label: string;
  value: number;
  countSuffix?: string;
  countDecimals?: number;
  countLocale?: boolean;
  trend: { icon: "arrow" | "check"; text: string; className: string };
  cardClassName: string;
  footerDividerClassName: string;
  avatars: InitAvatar[];
  footerLeft: string;
  footerRight: string;
  footerRightClassName: string;
};

const FALLBACK: Metric[] = [
  {
    label: "Guru SMK",
    value: 0,
    countLocale: true,
    trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#f4f2ff] border-[#ebe5ff]",
    footerDividerClassName: "border-[#e2dcff]/60",
    avatars: [
      { text: "G", className: "bg-[#6c5dd3] text-white" },
      { text: "+", className: "bg-[#c7bfff] text-[#180065]" },
    ],
    footerLeft: "Memuat…",
    footerRight: "-",
    footerRightClassName: "text-emerald-700",
  },
  {
    label: "Siswa SMK",
    value: 0,
    countLocale: true,
    trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#fff7ed] border-[#ffeed8]",
    footerDividerClassName: "border-[#fed7aa]/50",
    avatars: [
      { text: "S", className: "bg-amber-500 text-white" },
      { text: "+", className: "bg-amber-300 text-amber-900" },
    ],
    footerLeft: "Memuat…",
    footerRight: "-",
    footerRightClassName: "text-amber-800",
  },
  {
    label: "Mata Pelajaran",
    value: 0,
    countLocale: true,
    trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
    cardClassName: "bg-[#eff6ff] border-[#dbeafe]",
    footerDividerClassName: "border-[#bfdbfe]/50",
    avatars: [
      { text: "M", className: "bg-blue-500 text-white" },
      { text: "+", className: "bg-blue-300 text-blue-900" },
    ],
    footerLeft: "Memuat…",
    footerRight: "-",
    footerRightClassName: "text-blue-700",
  },
  {
    label: "Jadwal Mingguan",
    value: 0,
    countLocale: true,
    trend: { icon: "arrow", text: "0 bentrok", className: "bg-red-100 text-red-700" },
    cardClassName: "bg-[#ecfdf5] border-[#d1fae5]",
    footerDividerClassName: "border-[#a7f3d0]/50",
    avatars: [
      { text: "J", className: "bg-emerald-600 text-white" },
      { text: "+", className: "bg-emerald-300 text-emerald-900" },
    ],
    footerLeft: "Memuat…",
    footerRight: "-",
    footerRightClassName: "text-emerald-700",
  },
];

function buildMetrics(
  teachers: TeacherStats,
  students: StudentStats,
  subjects: SubjectStats,
  jadwal: JadwalStats
): Metric[] {
  return [
    {
      label: "Guru SMK",
      value: teachers.total,
      countLocale: true,
      trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
      cardClassName: "bg-[#f4f2ff] border-[#ebe5ff]",
      footerDividerClassName: "border-[#e2dcff]/60",
      avatars: [
        { text: "G", className: "bg-[#6c5dd3] text-white" },
        { text: "+", className: "bg-[#c7bfff] text-[#180065]" },
      ],
      footerLeft: `${teachers.active} aktif`,
      footerRight: `${teachers.subjectsTaught} mapel diampu`,
      footerRightClassName: "text-emerald-700",
    },
    {
      label: "Siswa SMK",
      value: students.total,
      countLocale: true,
      trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
      cardClassName: "bg-[#fff7ed] border-[#ffeed8]",
      footerDividerClassName: "border-[#fed7aa]/50",
      avatars: [
        { text: "S", className: "bg-amber-500 text-white" },
        { text: "+", className: "bg-amber-300 text-amber-900" },
      ],
      footerLeft: `${students.active} aktif`,
      footerRight: `${students.needActivation} butuh aktivasi`,
      footerRightClassName: "text-amber-800",
    },
    {
      label: "Mata Pelajaran",
      value: subjects.total,
      countLocale: true,
      trend: { icon: "check", text: "Aktif", className: "bg-emerald-100 text-emerald-800" },
      cardClassName: "bg-[#eff6ff] border-[#dbeafe]",
      footerDividerClassName: "border-[#bfdbfe]/50",
      avatars: [
        { text: "M", className: "bg-blue-500 text-white" },
        { text: "+", className: "bg-blue-300 text-blue-900" },
      ],
      footerLeft: `${subjects.kejuruan} kejuruan`,
      footerRight: `${subjects.umum} umum`,
      footerRightClassName: "text-blue-700",
    },
    {
      label: "Jadwal Mingguan",
      value: jadwal.totalSesi,
      countLocale: true,
      trend: {
        icon: "arrow",
        text: `${jadwal.bentrok} bentrok`,
        className: jadwal.bentrok > 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-800",
      },
      cardClassName: "bg-[#ecfdf5] border-[#d1fae5]",
      footerDividerClassName: "border-[#a7f3d0]/50",
      avatars: [
        { text: "J", className: "bg-emerald-600 text-white" },
        { text: "+", className: "bg-emerald-300 text-emerald-900" },
      ],
      footerLeft: `${jadwal.kelasTerisi} kelas terisi`,
      footerRight: `${jadwal.durasiLebihDari90} sesi > 90 mnt`,
      footerRightClassName: "text-emerald-700",
    },
  ];
}

export function MetricCards() {
  const [metrics, setMetrics] = useState<Metric[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [teachersRes, studentsRes, subjectsRes, jadwalRes] = await Promise.all([
          masterDataApi.teachers.stats(),
          masterDataApi.students.stats(),
          masterDataApi.subjects.stats(),
          masterDataApi.jadwalPelajaran.stats(),
        ]);
        if (!active) return;
        if (teachersRes.error || studentsRes.error || subjectsRes.error || jadwalRes.error) {
          throw new Error("Gagal memuat statistik dashboard");
        }
        setMetrics(
          buildMetrics(
            teachersRes.data?.data ?? ({} as TeacherStats),
            studentsRes.data?.data ?? ({} as StudentStats),
            subjectsRes.data?.data ?? ({} as SubjectStats),
            jadwalRes.data?.data ?? ({} as JadwalStats)
          )
        );
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {FALLBACK.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-2xl border shadow-sm animate-pulse bg-[#f8f9fc] border-[#eceef3] flex flex-col gap-4 h-full"
          >
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="h-7 w-16 rounded bg-slate-200" />
            <div className="h-2.5 w-full rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <StaggerChildren staggerDelay={0.1} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {metrics.map((m) => (
        <StaggerItem key={m.label}>
          <motion.div
            className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between gap-3 h-full ${m.cardClassName}`}
            whileHover={{ y: -4, boxShadow: "0 8px 24px -4px rgba(0,0,0,0.10)" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#4e566c] font-semibold">{m.label}</span>
              <div className="flex items-center -space-x-1.5">
                {m.avatars.map((a, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white ${a.className}`}
                  >
                    {a.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-[28px] font-bold text-[#181c20] tracking-tight leading-none">
                <CountUp
                  to={m.value}
                  suffix={m.countSuffix}
                  decimals={m.countDecimals ?? 0}
                  locale={m.countLocale}
                  duration={1.4}
                />
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${m.trend.className}`}
              >
                {m.trend.icon === "arrow" ? (
                  <ArrowUp className="size-[13px]" />
                ) : (
                  <CheckCircle2 className="size-[13px]" />
                )}
                {m.trend.text}
              </span>
            </div>
            <div className={`text-[11px] text-[#4e566c] font-medium pt-1 border-t ${m.footerDividerClassName} flex items-center justify-between`}>
              <span>{m.footerLeft}</span>
              <span className={`font-semibold ${m.footerRightClassName}`}>{m.footerRight}</span>
            </div>
          </motion.div>
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
