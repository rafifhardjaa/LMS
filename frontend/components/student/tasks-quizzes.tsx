import {
  ChevronRight,
  ClipboardList,
  FileQuestion,
  FlaskConical,
  RotateCcw,
} from "lucide-react";

export function TasksQuizzes() {
  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] font-semibold text-[#071f1c]">
            Tasks &amp; Quizzes
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#0d5c52] text-white text-[11px] font-semibold">
            3 Active Tasks
          </span>
        </div>
        <a
          href="#"
          className="text-[13px] font-semibold text-[#0d5c52] hover:underline flex items-center gap-0.5"
        >
          View Gradebook <ChevronRight className="size-[18px]" />
        </a>
      </div>

      <div className="flex flex-col gap-2">
        {/* Assignment 1: Urgent deadline */}
        <div className="p-4 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#e6f4f1] text-[#0d5c52] flex items-center justify-center flex-shrink-0 mt-0.5">
              <ClipboardList className="size-[22px]" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-[#e6f4f1] text-[#0d5c52] text-[11px] font-semibold">
                  Mathematics
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[11px] font-semibold flex items-center gap-1 animate-pulse">
                  ⏱️ Ends in 2h 30m
                </span>
                <span className="text-[11px] font-bold text-[#ba1a1a]">
                  Due Today, 11:59 PM
                </span>
              </div>
              <h4 className="text-[14px] font-semibold text-[#071f1c] truncate">
                Calculus Mid-Term Project - Optimization Problems
              </h4>
              <p className="text-[12px] text-[#536360]">
                Comprehensive submission including LaTeX source &amp; graphical
                proofs
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex-shrink-0 px-6 py-2 rounded-full bg-[#0d5c52] text-white hover:bg-[#00433b] text-[13px] font-semibold shadow-[0_4px_16px_rgba(13,92,82,0.25)] transition-all duration-200 text-center"
          >
            Submit Assignment
          </button>
        </div>

        {/* Assignment 2: Remedial active */}
        <div className="p-4 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ccfbf1] text-[#0f766e] flex items-center justify-center flex-shrink-0 mt-0.5">
              <FlaskConical className="size-[22px]" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-[#ccfbf1] text-[#0f766e] text-[11px] font-semibold">
                  Physics
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4eee7] text-[#0d5c52] text-[11px] font-semibold flex items-center gap-1">
                  <RotateCcw className="size-[14px]" />
                  <span className="font-bold">Remedial Available</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#e2f2ee] text-[#536360] text-[11px] font-semibold">
                  ⏱️ Ends in 1d 4h
                </span>
              </div>
              <h4 className="text-[14px] font-semibold text-[#071f1c] truncate">
                Physics Lab Report: Rotational Dynamics &amp; Inertia
              </h4>
              <p className="text-[12px] text-[#536360]">
                Current Score: 68/100. Retake allowed to reach distinction tier
                (Target: &gt;85).
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex-shrink-0 px-6 py-2 rounded-full bg-white hover:bg-[#e2f2ee] text-[#0d5c52] text-[13px] font-semibold border border-[#cee8e1] shadow-sm transition-all duration-200 text-center"
          >
            Start Remedial Attempt
          </button>
        </div>

        {/* Assignment 3: Quiz */}
        <div className="p-4 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#e0f2f1] text-[#00796b] flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileQuestion className="size-[22px]" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-[#e0f2f1] text-[#00796b] text-[11px] font-semibold">
                  Computer Science
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#e2f2ee] text-[#536360] text-[11px] font-semibold">
                  ⏱️ Ends in 3d 12h
                </span>
              </div>
              <h4 className="text-[14px] font-semibold text-[#071f1c] truncate">
                Database Systems &amp; SQL Optimization Quiz
              </h4>
              <p className="text-[12px] text-[#536360]">
                Partially answered: Question 14 of 30 saved in draft state
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex-shrink-0 px-6 py-2 rounded-full bg-white hover:bg-[#e2f2ee] text-[#071f1c] text-[13px] font-semibold border border-[#cee8e1] shadow-sm transition-all duration-200 text-center"
          >
            Resume Quiz
          </button>
        </div>
      </div>
    </section>
  );
}