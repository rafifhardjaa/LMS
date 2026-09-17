"use client";

import { useState } from "react";
import {
  CheckCircle,
  ChevronsUpDown,
  Eye,
  MessageSquare,
  Save,
  Send,
} from "lucide-react";

type Student = {
  id: number;
  initials: string;
  avatarClassName: string;
  name: string;
  nisn: string;
  roll: string;
  dotClassName: string;
  dotTitle: string;
  tugas: number;
  quiz: number;
  rowClassName?: string;
  status: { label: string; className: string; dotClassName: string };
  actions: { icon: "eye" | "comment"; title: string; className?: string }[];
};

const initialStudents: Student[] = [
  {
    id: 1,
    initials: "JH",
    avatarClassName: "bg-[#E0F2FE] text-[#0284C7]",
    name: "Jack Huntsman",
    nisn: "NISN: 0098234112",
    roll: "#01",
    dotClassName: "bg-[#22C55E]",
    dotTitle: "Kehadiran 100% & On Track",
    tugas: 90,
    quiz: 87,
    status: {
      label: "Tuntas KKM",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      dotClassName: "bg-[#22C55E]",
    },
    actions: [
      { icon: "eye", title: "Buka Detail Portofolio" },
      { icon: "comment", title: "Kirim Catatan Guru" },
    ],
  },
  {
    id: 2,
    initials: "JK",
    avatarClassName: "bg-[#FFEBEB] text-[#b71422]",
    name: "John Kurt",
    nisn: "NISN: 0098234125",
    roll: "#02",
    dotClassName: "bg-[#EF4444]",
    dotTitle: "Perlu Intervensi Remedial",
    tugas: 88,
    quiz: 68,
    rowClassName: "bg-[#FFEBEB]/10",
    status: {
      label: "Remedial Kuis 1",
      className: "bg-[#FEE2E2] text-[#DC2626]",
      dotClassName: "bg-[#EF4444]",
    },
    actions: [
      {
        icon: "eye",
        title: "Tugaskan Remedial",
        className: "text-[#b71422] hover:bg-[#FFEBEB] hover:text-[#b71422]",
      },
      { icon: "comment", title: "Kirim Pesan ke Orang Tua" },
    ],
  },
  {
    id: 3,
    initials: "PQ",
    avatarClassName: "bg-[#F3E8FF] text-[#9333EA]",
    name: "Peter Quill",
    nisn: "NISN: 0098234140",
    roll: "#03",
    dotClassName: "bg-[#22C55E]",
    dotTitle: "Kehadiran 100% & On Track",
    tugas: 84,
    quiz: 82,
    status: {
      label: "Tuntas KKM",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      dotClassName: "bg-[#22C55E]",
    },
    actions: [
      { icon: "eye", title: "Buka Detail Portofolio" },
      { icon: "comment", title: "Kirim Catatan Guru" },
    ],
  },
  {
    id: 4,
    initials: "NH",
    avatarClassName: "bg-[#FEF3C7] text-[#D97706]",
    name: "Natasha Hughes",
    nisn: "NISN: 0098234156",
    roll: "#04",
    dotClassName: "bg-[#22C55E]",
    dotTitle: "Kehadiran 100% & On Track",
    tugas: 80,
    quiz: 78,
    status: {
      label: "Tuntas KKM",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      dotClassName: "bg-[#22C55E]",
    },
    actions: [
      { icon: "eye", title: "Buka Detail Portofolio" },
      { icon: "comment", title: "Kirim Catatan Guru" },
    ],
  },
  {
    id: 5,
    initials: "LH",
    avatarClassName: "bg-[#CCE5FF] text-[#006398]",
    name: "Lisa Hilton",
    nisn: "NISN: 0098234188",
    roll: "#05",
    dotClassName: "bg-[#22C55E]",
    dotTitle: "Kehadiran 100% & On Track",
    tugas: 79,
    quiz: 77,
    status: {
      label: "Tuntas KKM",
      className: "bg-[#DCFCE7] text-[#16A34A]",
      dotClassName: "bg-[#22C55E]",
    },
    actions: [
      { icon: "eye", title: "Buka Detail Portofolio" },
      { icon: "comment", title: "Kirim Catatan Guru" },
    ],
  },
  {
    id: 6,
    initials: "JA",
    avatarClassName: "bg-[#D5E3FC] text-[#1E293B]",
    name: "Jim Anderson",
    nisn: "NISN: 0098234201",
    roll: "#06",
    dotClassName: "bg-[#F59E0B]",
    dotTitle: "Mendekati Batas KKM",
    tugas: 76,
    quiz: 75,
    status: {
      label: "Ambang KKM",
      className: "bg-[#FEF3C7] text-[#D97706]",
      dotClassName: "bg-[#F59E0B]",
    },
    actions: [
      { icon: "eye", title: "Buka Detail Portofolio" },
      { icon: "comment", title: "Kirim Catatan Guru" },
    ],
  },
];

export function StudentGrades() {
  const [students, setStudents] = useState(initialStudents);
  const [showToast, setShowToast] = useState(false);

  function update(id: number, field: "tugas" | "quiz", value: number) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }

  function handleSave() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-[#22C55E] rounded-full" />
          <div>
            <h3 className="text-[20px] font-semibold text-[#1E293B] tracking-tight">
              STUDENT PERFORMANCE &amp; INPUT NILAI
            </h3>
            <p className="text-[12px] text-[#94A3B8]">
              Kelola nilai tugas berkala, kuis adaptif, dan evaluasi capaian
              kompetensi
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              defaultValue="VII-A, Science (Fisika)"
              className="appearance-none bg-[#F8FAFC] pl-4 pr-8 py-1.5 rounded-lg text-[#1E293B] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFB3B3] cursor-pointer shadow-xs"
            >
              {[
                "VII-A, Science (Fisika)",
                "VII-B, Science (Fisika)",
                "VI-A, Mathematics",
                "VI-B, Science",
              ].map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8] text-[18px]">
              ▾
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#b71422] hover:bg-[#db3237] text-white px-4 py-1.5 rounded-lg text-[14px] font-semibold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Save className="size-[18px]" /> Simpan Perubahan Nilai
          </button>
        </div>
      </div>

      {showToast && (
        <div className="p-2 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-[12px] flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-[18px]" />
            <span>
              Data nilai berhasil disimpan ke server LMS dan disinkronkan ke
              Raport Digital.
            </span>
          </div>
          <button
            type="button"
            className="text-[11px] font-bold hover:underline"
            onClick={() => setShowToast(false)}
          >
            TUTUP
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase">
              <th className="py-3 px-4 rounded-l-xl">Nama Siswa</th>
              <th className="py-3 px-3">Roll No.</th>
              <th className="py-3 px-3">Tugas Harian</th>
              <th className="py-3 px-3">Nilai Kuis</th>
              <th className="py-3 px-3">
                <span className="flex items-center gap-1 cursor-pointer hover:text-[#1E293B]">
                  Avg. Score <ChevronsUpDown className="size-[14px]" />
                </span>
              </th>
              <th className="py-3 px-3">Status KKM</th>
              <th className="py-3 px-4 rounded-r-xl text-center">
                Aksi / Portofolio
              </th>
            </tr>
          </thead>
          <tbody className="text-[13px]">
            {students.map((s) => {
              const avg = ((s.tugas + s.quiz) / 2).toFixed(2);
              return (
                <tr
                  key={s.id}
                  className={`hover:bg-[#F1F5F9]/60 transition-colors ${
                    s.rowClassName ?? ""
                  }`}
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-semibold ${s.avatarClassName}`}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[14px] font-semibold text-[#1E293B]">
                          {s.name}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${s.dotClassName}`}
                          title={s.dotTitle}
                        />
                      </div>
                      <span className="text-[12px] text-[#94A3B8]">{s.nisn}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[14px] font-semibold text-[#94A3B8]">
                    {s.roll}
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={s.tugas}
                      onChange={(e) =>
                        update(s.id, "tugas", Number(e.target.value))
                      }
                      className={`w-16 h-8 px-2 rounded-md bg-white text-[14px] font-semibold text-[#1E293B] shadow-xs focus:ring-2 focus:ring-[#FFB3B3] focus:outline-none ${
                        s.quiz >= 75 ? "" : ""
                      }`}
                    />
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="number"
                      value={s.quiz}
                      onChange={(e) =>
                        update(s.id, "quiz", Number(e.target.value))
                      }
                      className={`w-16 h-8 px-2 rounded-md font-semibold text-[14px] shadow-xs focus:ring-2 focus:ring-[#FFB3B3] focus:outline-none ${
                        s.quiz >= 75
                          ? "bg-white text-[#1E293B]"
                          : "bg-[#FEE2E2] text-[#DC2626]"
                      }`}
                    />
                  </td>
                  <td className="py-3 px-3 text-[26px] font-bold text-[#1E293B]">
                    {avg}%
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-full flex items-center gap-1 w-max ${s.status.className}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${s.status.dotClassName}`}
                      />
                      {s.status.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {s.actions.map((a) =>
                        a.icon === "eye" ? (
                          <button
                            key={a.title}
                            type="button"
                            title={a.title}
                            className={`w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-[#FFEBEB] hover:text-[#b71422] flex items-center justify-center text-[#475569] transition-colors ${
                              a.className ?? ""
                            }`}
                          >
                            <Eye className="size-[18px]" />
                          </button>
                        ) : (
                          <button
                            key={a.title}
                            type="button"
                            title={a.title}
                            className={`w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] flex items-center justify-center text-[#475569] transition-colors ${
                              a.className ?? ""
                            }`}
                          >
                            {s.roll === "#02" ? (
                              <Send className="size-[18px]" />
                            ) : (
                              <MessageSquare className="size-[18px]" />
                            )}
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}