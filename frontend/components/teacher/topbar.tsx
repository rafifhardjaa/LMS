import {
  Bell,
  ChevronDown,
  Menu,
  MessageSquare,
  Search,
  User,
} from "lucide-react";
import { PulseDot } from "@/components/ui/animations";

export function GuruTopbar() {
  return (
    <header className="fixed top-0 right-0 h-16 bg-white/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] left-64">
      <div className="h-16 w-full px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0d1c2e] transition-colors"
          >
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-semibold text-[#1E293B]">
              LMS - Teacher&apos;s Workspace
            </span>
            <span className="bg-[#FFEBEB] text-[#b71422] text-[11px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
              Semester Genap 2024/2025
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search courses, students, assignments, keywords..."
              className="w-full h-10 pl-9 pr-4 rounded-full bg-[#F8FAFC] text-[13px] text-[#1E293B] placeholder:text-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFB3B3] transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Chat Messages"
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
          >
            <MessageSquare className="size-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#b71422] ring-2 ring-white" />
          </button>
          <button
            type="button"
            title="Notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-[#F8FAFC] text-[#475569] hover:bg-[#F1F5F9] transition-colors"
          >
            <Bell className="size-5" />
            <PulseDot className="bg-[#EF4444] ring-2 ring-white" wrapClassName="absolute top-1 right-1" size="size-2" />
          </button>
          <div className="flex items-center gap-2 pl-2 ml-0.5">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[12px] font-semibold text-[#1E293B]">
                Dr. Sebastian, S.Kom
              </span>
              <span className="text-[12px] text-[#94A3B8]">
                Guru Pengampu Fisika &amp; IPA
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#b71422] flex items-center justify-center">
              <User className="size-[18px] text-white" />
            </div>
            <ChevronDown className="size-[18px] text-[#94A3B8] cursor-pointer hover:text-[#1E293B]" />
          </div>
        </div>
      </div>
    </header>
  );
}