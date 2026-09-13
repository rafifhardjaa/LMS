"use client";

import { useState } from "react";
import { CheckCircle, DoorOpen, Headset, Lock, Video } from "lucide-react";

const days = [
  { day: "Mon", date: "14" },
  { day: "Tue", date: "15" },
  { day: "Wed", date: "16" },
  { day: "Thu", date: "17" },
  { day: "Fri", date: "18" },
];

const times = ["09:30 AM", "11:00 AM", "01:30 PM", "03:15 PM"];

export function Counseling() {
  const [mode, setMode] = useState<"video" | "offline">("video");
  const [day, setDay] = useState("Wed");
  const [time, setTime] = useState("11:00 AM");
  const [showToast, setShowToast] = useState(false);

  function handleBook() {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  }

  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4 relative overflow-hidden">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <Headset className="size-[22px] text-[#0d5c52]" />
          <h2 className="text-[18px] font-semibold text-[#071f1c]">
            Counseling &amp; Student Wellness (BK)
          </h2>
        </div>
        <p className="text-[12px] text-[#536360]">
          Book private 1-on-1 sessions with certified school guidance counselors
        </p>
      </div>

      <div className="bg-[#edf7f4]/70 border border-[#cee8e1]/60 p-4 rounded-xl flex flex-col gap-4">
        {/* Counselor mini card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-white rounded-xl border border-[#cee8e1]/50">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#0d5c52] flex items-center justify-center text-white flex-shrink-0 ring-2 ring-[#0d5c52]/20">
              <Headset className="size-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-semibold text-[#071f1c]">
                  Mrs. Sarah Jenkins, M.Psi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14b8a6]" />
                  Available Today
                </span>
              </div>
              <span className="text-[12px] text-[#536360]">
                Student Guidance &amp; Academic Wellness Counselor
              </span>
            </div>
          </div>
          {/* Mode toggle */}
          <div className="flex items-center bg-[#edf7f4] p-1 rounded-full text-[11px] font-semibold border border-[#cee8e1]/50">
            <button
              type="button"
              onClick={() => setMode("video")}
              className={`px-4 py-1 rounded-full shadow-sm font-semibold flex items-center gap-1 transition-all ${
                mode === "video"
                  ? "bg-[#0d5c52] text-white"
                  : "text-[#536360] hover:text-[#071f1c]"
              }`}
            >
              <Video className="size-4" />
              Online Video
            </button>
            <button
              type="button"
              onClick={() => setMode("offline")}
              className={`px-4 py-1 rounded-full transition-all flex items-center gap-1 ${
                mode === "offline"
                  ? "bg-[#0d5c52] text-white shadow-sm font-semibold"
                  : "text-[#536360] hover:text-[#071f1c]"
              }`}
            >
              <DoorOpen className="size-4" />
              Offline Room 204
            </button>
          </div>
        </div>

        {/* Date & time picker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#536360] uppercase tracking-wider">
              Select Consultation Date
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {days.map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setDay(d.day)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                    day === d.day
                      ? "bg-[#0d5c52] text-white shadow-[0_4px_12px_rgba(13,92,82,0.3)]"
                      : "bg-white border border-[#cee8e1]/50 hover:bg-[#e2f2ee]"
                  }`}
                >
                  <span
                    className={`text-[11px] ${
                      day === d.day ? "font-bold" : "text-[#536360]"
                    }`}
                  >
                    {d.day}
                  </span>
                  <span
                    className={`text-[14px] ${
                      day === d.day ? "font-bold" : "font-semibold text-[#071f1c]"
                    }`}
                  >
                    {d.date}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#536360] uppercase tracking-wider">
              Available Time Slots
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {times.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold transition-all ${
                    time === t
                      ? "bg-[#0d5c52] text-white shadow-[0_4px_12px_rgba(13,92,82,0.25)]"
                      : "bg-white border border-[#cee8e1]/50 text-[#071f1c] hover:bg-[#e2f2ee]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-1 text-[#536360] text-[12px]">
            <Lock className="size-[18px] text-[#0d5c52]" />
            <span>
              All discussions remain strictly confidential between counselor
              &amp; student.
            </span>
          </div>
          <button
            type="button"
            onClick={handleBook}
            className="w-full sm:w-auto px-10 py-2 rounded-full bg-[#0d5c52] text-white hover:bg-[#00433b] text-[13px] font-semibold shadow-[0_4px_16px_rgba(13,92,82,0.25)] transition-all duration-200"
          >
            Book Consultation Schedule
          </button>
        </div>

        {showToast && (
          <div className="p-2 bg-[#e6f4f1] text-[#0d5c52] rounded-xl text-[12px] flex items-center justify-between transition-all">
            <div className="flex items-center gap-2">
              <CheckCircle className="size-[18px]" />
              <span>
                Jadwal konseling terpilih ({day} • {time} •{" "}
                {mode === "video" ? "Online Video" : "Offline Room 204"}) telah
                dikonfirmasi.
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
      </div>
    </section>
  );
}