"use client";

import { motion } from "framer-motion";
import { Bell, Search, User } from "lucide-react";
import { toast } from "sonner";
import { PulseDot } from "@/components/ui/animations";
import { useAuthStore } from "@/lib/store/auth-store";

export function MuridTopbar() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.full_name?.split(" ")[0] ?? "Siswa";

  function handleSearch() {
    toast.info("Pencarian akan tersedia setelah integrasi data.");
  }

  function handleNotifications() {
    toast.info("Notifikasi akan tersedia setelah integrasi data.");
  }

  return (
    <header className="fixed top-0 right-0 left-64 z-40 h-20 bg-white/90 backdrop-blur-xl border-b border-[#cee8e1]/60 shadow-[0_1px_8px_rgba(7,31,28,0.03)]">
      <div className="h-20 w-full px-6 flex items-center justify-between gap-6">
        <div className="flex flex-col min-w-[240px]">
          <h1 className="text-[18px] font-semibold text-[#071f1c] leading-tight tracking-tight">
            Selamat datang kembali, {firstName}!
          </h1>
          <p className="text-[12px] leading-[18px] text-[#536360] truncate">
            Pantau progres belajar dan jadwal Anda di satu tempat.
          </p>
        </div>

        <div className="flex-1 max-w-[425px]">
          <div className="relative flex items-center">
            <Search className="absolute left-4 size-[15px] text-[#536360]" />
            <input
              type="text"
              readOnly
              onClick={handleSearch}
              placeholder="Cari materi, modul, atau bimbingan..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-[#f2f9f7] text-[#071f1c] text-[14px] placeholder:text-[#536360] outline-none border border-transparent focus:border-[#0d5c52]/40 focus:bg-white shadow-[0_2px_6px_-1px_rgba(7,31,28,0.03)] transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            type="button"
            title="Notifikasi"
            aria-label="Notifikasi"
            onClick={handleNotifications}
            whileTap={{ scale: 0.94 }}
            className="relative w-10 h-10 rounded-full bg-[#f2f9f7] flex items-center justify-center text-[#536360] hover:bg-[#edf7f4] transition-colors"
          >
            <Bell className="size-[18px]" />
            <PulseDot
              className="bg-[#14b8a6] ring-2 ring-white"
              wrapClassName="absolute top-2 right-2"
            />
          </motion.button>
          <motion.div
            title={user?.full_name ?? "Profil siswa"}
            className="w-9 h-9 rounded-full bg-[#0d5c52] flex items-center justify-center shadow-sm"
          >
            <User className="size-[14px] text-white" />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
