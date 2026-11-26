"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";

export function MuridTopbar() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.full_name?.split(" ")[0] ?? "Siswa";

  return (
    <header className="fixed top-0 right-0 left-64 z-40 h-20 bg-white/90 backdrop-blur-xl border-b border-[#cee8e1]/60 shadow-[0_1px_8px_rgba(7,31,28,0.03)]">
      <div className="h-20 w-full px-6 flex items-center justify-between gap-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-[18px] font-semibold text-[#071f1c] leading-tight tracking-tight">
            Selamat datang kembali, {firstName}!
          </p>
          <p className="text-[12px] leading-[18px] text-[#536360] truncate">
            Pantau progres belajar dan jadwal Anda di satu tempat.
          </p>
        </div>

        <motion.div
          title={user?.full_name ?? "Profil siswa"}
          className="flex min-w-0 shrink-0 items-center gap-3"
        >
          <div className="size-9 shrink-0 rounded-full bg-[#0d5c52] flex items-center justify-center shadow-sm">
            <User className="size-[14px] text-white" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="max-w-[180px] truncate text-[12px] font-semibold text-[#071f1c]">
              {user?.full_name ?? "Siswa"}
            </span>
            <span className="max-w-[180px] truncate text-[10px] text-[#536360]">
              NISN {user?.nomor_induk ?? "-"}
            </span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
