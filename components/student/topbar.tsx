import { Bell, Search, Sparkles, User } from "lucide-react";
import { PulseDot } from "@/components/ui/animations";

export function MuridTopbar() {
  return (
    <header className="fixed top-0 right-0 left-64 z-40 h-20 bg-white/90 backdrop-blur-xl border-b border-[#cee8e1]/60 shadow-[0_1px_8px_rgba(7,31,28,0.03)]">
      <div className="h-20 w-full px-6 flex items-center justify-between gap-6">
        <div className="flex flex-col min-w-[240px]">
          <h1 className="text-[18px] font-semibold text-[#071f1c] leading-tight tracking-tight">
            Welcome Back, Sebastian!
          </h1>
          <p className="text-[12px] text-[#536360] truncate">
            Track your progress, master new skills and stay on top of your
            schedule.
          </p>
        </div>

        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center">
            <Search className="absolute left-4 size-5 text-[#536360]" />
            <input
              type="text"
              placeholder="Search Courses, Modules, or Counselors..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-[#f2f9f7] text-[#071f1c] text-[14px] placeholder:text-[#536360] outline-none border border-transparent focus:border-[#0d5c52]/40 focus:bg-white shadow-[0_2px_6px_-1px_rgba(7,31,28,0.03)] transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            title="Notifications"
            className="relative w-10 h-10 rounded-full bg-[#f2f9f7] flex items-center justify-center text-[#536360] hover:bg-[#edf7f4] transition-colors"
          >
            <Bell className="size-[22px]" />
            <PulseDot className="bg-[#14b8a6] ring-2 ring-white" wrapClassName="absolute top-2 right-2" />
          </button>
          <button
            type="button"
            className="flex items-center gap-1 px-6 py-2 bg-[#0d5c52] text-white text-[13px] font-semibold rounded-full shadow-[0_4px_16px_rgba(13,92,82,0.28)] hover:bg-[#00433b] transition-all duration-200"
          >
            <span>+ Ask AI Tutor</span>
            <Sparkles className="size-4" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#0d5c52] flex items-center justify-center shadow-sm">
            <User className="size-[18px] text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}