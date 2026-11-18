"use client";

import { Eye, Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import moment from "moment";
import { useAuthStore } from "@/lib/store/auth-store";
import type { JadwalPelajaran } from "@/lib/api/master-data";

const DAY_ORDER = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const ROW_BG = ["#FFEDED", "#EDFFF6", "#EDF6FF"];

function formatTime(value: string) {
  return moment(value, ["HH:mm:ss", "HH:mm"]).format("HH:mm");
}

function dayIndex(hari: string) {
  const index = DAY_ORDER.indexOf(hari);
  return index === -1 ? 99 : index;
}

type CourseTableProps = {
  rows: JadwalPelajaran[];
};

export function CourseTable({ rows }: CourseTableProps) {
  const user = useAuthStore((state) => state.user);
  const teacherName = user?.full_name?.trim() || "Guru";
  const todayName = moment().locale("id").format("dddd");

  const majors = [...new Set(rows.map((row) => row.majorName).filter(Boolean))].sort().join(", ") || "-";

  const sorted = [...rows].sort(
    (first, second) => dayIndex(first.hari) - dayIndex(second.hari) || first.sesi - second.sesi,
  );

  return (
    <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-3 border-b border-[#E2E8F0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#1E293B]">{teacherName}</h2>
          <p className="mt-0.5 text-[11px] leading-4 text-[#64748B]">{majors}</p>
        </div>
        <span className="inline-flex h-7 shrink-0 items-center self-start rounded-lg bg-[#F8FAFC] px-2.5 text-[11px] font-semibold text-[#64748B] sm:self-auto">
          {rows.length} Sesi Aktif
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-[#F8FAFC] text-[9px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
              <th className="px-5 py-2.5">Kelas</th>
              <th className="px-3 py-2.5">Mata Pelajaran</th>
              <th className="px-3 py-2.5">Hari</th>
              <th className="px-3 py-2.5">Jam</th>
              <th className="px-3 py-2.5">Durasi</th>
              <th className="px-5 py-2.5 text-right">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F1F5F9]">
            {sorted.map((row, index) => {
              const isToday = row.hari === todayName;
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                  style={{ backgroundColor: ROW_BG[index % 3] }}
                  className="transition-colors hover:brightness-[0.97]"
                >
                  <td className="px-5 py-2.5 text-[11px] font-bold text-[#1E293B]">
                    {row.className || "-"}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-medium text-[#475569]">
                    {row.subjectName}
                  </td>
                  <td className="px-3 py-2.5 text-[11px] font-medium text-[#475569]">
                    {row.hari}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] font-medium tabular-nums text-[#475569]">
                    {`${formatTime(row.waktuMulai)} - ${formatTime(row.waktuSelesai)}`}
                  </td>
                  <td className="px-3 py-2.5 font-mono text-[11px] font-medium tabular-nums text-[#475569]">
                    {row.durasi ? `${row.durasi} mnt` : "—"}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center justify-end">
                      <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="inline-block"
                      >
                        <Link
                          href={`/teacher/modul-course/${row.classId}--${row.subjectId}`}
                          className={`inline-flex h-7 items-center gap-1 rounded-lg border px-2 text-[9px] font-bold transition ${
                            isToday
                              ? "border-[#b7e831] bg-[#b7e831]/20 text-[#7A941F] hover:border-[#b7e831]"
                              : "border-[#DCE5EE] bg-[#F8FAFC] text-[#475569] hover:border-[#b71422]/30 hover:text-[#b71422]"
                          }`}
                        >
                          <Eye className="size-3" />
                          Lihat detail
                        </Link>
                      </motion.div>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#94A3B8]">
            <Search className="size-4" />
          </span>
          <p className="mt-2 text-xs font-semibold text-[#334155]">
            Belum ada sesi yang diampu
          </p>
          <p className="mt-0.5 max-w-sm text-[10px] leading-4 text-[#94A3B8]">
            Guru belum memiliki penugasan mengajar pada rombel aktif.
          </p>
        </div>
      )}
    </section>
  );
}
