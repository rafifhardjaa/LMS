"use client";

import {
  FileSignature,
  FileText,
  Flag,
  GraduationCap,
  HelpCircle,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { meetings } from "./data";

const capaianPembelajaranDefault =
  "Capaian pembelajaran mata pelajaran ini mengacu pada kurikulum yang berlaku dan akan disesuaikan dengan karakteristik peserta didik.";

const bobotPenilaian = [
  { persen: "15%", label: "Keaktifan", icon: Users, color: "#7A941F" },
  { persen: "20%", label: "Tugas Akhir", icon: Flag, color: "#b71422" },
  { persen: "15%", label: "Tugas", icon: FileText, color: "#006398" },
  { persen: "5%", label: "Kuis", icon: HelpCircle, color: "#D97706" },
  { persen: "20%", label: "UTS", icon: FileSignature, color: "#7C3AED" },
  { persen: "25%", label: "UAS", icon: GraduationCap, color: "#b71422" },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type CourseInfoContentProps = {
  subjectName: string;
  capaianPembelajaran?: string | null;
  pesertaCount?: number;
};

export function CourseInfoContent({
  subjectName,
  capaianPembelajaran,
  pesertaCount,
}: CourseInfoContentProps) {
  const user = useAuthStore((state) => state.user);

  const capaianText = capaianPembelajaran?.trim() || capaianPembelajaranDefault;
  const capaianItems = capaianText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const match = line.match(/^\d+[.)]\s*(.*)$/);
      return { nomor: match ? Number(line.match(/^\d+/)![0]) : index + 1, teks: match ? match[1] : line };
    });

  const stats = [
    { label: "Peserta", value: pesertaCount === undefined ? "-" : String(pesertaCount) },
    { label: "Pertemuan", value: String(meetings.length) },
    { label: "Semester", value: "Genap 2024/2025" },
  ];

  return (
    <section className="flex min-h-64 flex-1 flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="bg-gradient-to-r from-[#b71422] to-[#8f0f1a] px-5 py-4">
        <h2 className="text-[15px] font-bold text-white">Info Pembelajaran</h2>
        <p className="mt-0.5 text-[12px] font-medium text-white/80">
          {subjectName}
        </p>
      </div>

      <div className="flex flex-col gap-5 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#FFEBEB] text-[15px] font-bold text-[#b71422]">
            {initials(user?.full_name ?? "")}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
              Guru Pengampu
            </p>
            <p className="truncate text-[14px] font-bold text-[#1E293B]">
              {user?.full_name ?? "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-3">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 text-center">
              <p className="text-[18px] font-bold text-[#1E293B]">{stat.value}</p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#94A3B8]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div>
          <p className="text-[14px] font-semibold text-[#1E293B]">
            Capaian Pembelajaran
          </p>
          <ol className="mt-2.5 flex flex-col gap-2.5">
            {capaianItems.map((item) => (
              <li key={item.nomor} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full bg-[#b71422] text-[11px] font-bold text-white">
                  {item.nomor}
                </span>
                <p className="text-[13px] leading-6 text-[#475569]">{item.teks}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <p className="text-[14px] font-semibold text-[#1E293B]">
            Bobot Penilaian
          </p>
          <div className="mt-2.5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {bobotPenilaian.map((item) => {
              const Icon = item.icon;
              const nilai = parseInt(item.persen, 10);
              return (
                <div
                  key={item.label}
                  className="border-b border-[#E2E8F0] pb-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0" style={{ color: item.color }} />
                    <span className="text-[16px] font-bold text-[#1E293B]">
                      {item.persen}
                    </span>
                    <span className="text-[13px] text-[#475569]">{item.label}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${nilai}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
