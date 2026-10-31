import { Bell, ChevronDown, Landmark, Menu, MessageSquare, Search, Settings } from "lucide-react";
import { PulseDot } from "@/components/ui/animations";

interface TopbarProps {
  onMenuOpen: () => void;
}

export function Topbar({ onMenuOpen }: TopbarProps) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[65] flex h-16 items-center justify-between bg-white/80 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl sm:px-6 lg:left-64">
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Buka menu navigasi"
        className="mr-3 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#f1f4f9] text-[#474553] hover:bg-[#eceef3] lg:hidden"
      >
        <Menu className="size-[19px]" />
      </button>
      <div className="min-w-0 flex-1 max-w-md">
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3.5 size-5 text-[#787584] pointer-events-none" />
          <input
            type="text"
            placeholder="Search... (Cari guru, siswa, kelas, modul)"
            className="w-full h-10 pl-10 pr-4 bg-[#f1f4f9] rounded-full text-sm text-[#181c20] placeholder:text-[#787584] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#6c5dd3] transition-all"
          />
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2 sm:ml-6 sm:gap-3">
        <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1f4f9] text-xs text-[#474553]">
          <Landmark className="size-4 text-[#6c5dd3]" />
          <span className="font-semibold">Tahun Ajaran 2026/2027 • Semester Ganjil</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
            Semester Berjalan (Aktif)
          </span>
        </div>

        <button
          type="button"
          title="Notifikasi"
          className="relative w-9 h-9 rounded-full flex items-center justify-center bg-[#f1f4f9] hover:bg-[#eceef3] text-[#474553] transition-colors"
        >
          <Bell className="size-[19px]" />
          <PulseDot className="bg-[#ba1a1a] ring-2 ring-[#f1f4f9]" wrapClassName="absolute top-1 right-1" />
        </button>

        <button
          type="button"
          title="Pesan Bantuan"
          className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center bg-[#f1f4f9] hover:bg-[#eceef3] text-[#474553] transition-colors"
        >
          <MessageSquare className="size-[19px]" />
        </button>

        <button
          type="button"
          title="Pengaturan"
          className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center bg-[#f1f4f9] hover:bg-[#eceef3] text-[#474553] transition-colors"
        >
          <Settings className="size-[19px]" />
        </button>

        <div className="hidden sm:block w-px h-6 bg-[#e0e2e7] mx-1" />

        <div className="flex items-center gap-2 cursor-pointer pl-1">
          <div className="w-8 h-8 rounded-full bg-[#6c5dd3] text-white font-bold text-[10px] flex items-center justify-center shadow-sm">
            PW
          </div>
          <ChevronDown className="size-[18px] text-[#787584] hover:text-[#181c20] transition-colors" />
        </div>
      </div>
    </header>
  );
}