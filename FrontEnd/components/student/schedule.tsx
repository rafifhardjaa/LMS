"use client";

import { Calendar, Clock } from "lucide-react";

const schedule = [
  { id: "senin", day: "Senin", title: "Jaringan Komputer", time: "08:00 - 09:30" },
  { id: "selasa", day: "Selasa", title: "Pemrograman Web", time: "10:00 - 11:30" },
  { id: "rabu", day: "Rabu", title: "Basis Data", time: "08:00 - 09:30" },
  { id: "kamis", day: "Kamis", title: "Sistem Operasi", time: "13:00 - 14:30" },
  { id: "jumat", day: "Jumat", title: "Keamanan Jaringan", time: "09:00 - 10:30" },
  { id: "sabtu", day: "Sabtu", title: "Proyek Akhir", time: "08:00 - 10:00" },
];

export function Schedule() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-start gap-3">
        <Calendar className="size-5 text-[#0d5c52]" />
        <div>
          <h3 className="text-sm font-semibold text-[#071f1c]">Jadwal Minggu Ini</h3>
          <p className="text-xs text-[#536360]">Data pratinjau</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-[#f8f9fc] border-b border-[#cee8e1]/50"
          >
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#0d5c52]" />
              <span className="font-medium text-[#071f1c]">{item.day}</span>
            </div>
            <div className="mt-1 text-sm">
              <p className="font-medium text-[#071f1c]">{item.title}</p>
              <p className="flex items-center gap-1 text-xs text-[#536360]">
                <Clock className="size-3.5" />
                {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
