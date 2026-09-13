"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/ui/animations";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Semua kolom harus diisi");
      return;
    }

    setLoading(true);
    // Dummy authentication — belum terhubung ke backend.
    setTimeout(() => {
      localStorage.setItem("lms_demo_user", JSON.stringify({ username }));
      setLoading(false);
      toast.success("Login berhasil — menyambungkan ke portal…");
      router.push("/admin/dashboard");
    }, 1200);
  }

  return (
    <StaggerChildren staggerDelay={0.07} delayChildren={0}>
      <StaggerItem>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              Selamat Datang Kembali <span className="text-xl">👋</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Masuk menggunakan kredensial SSO SMK Mataram atau akun resmi
              terintegrasi.
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
            <Lock className="size-4" />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <motion.button
            type="button"
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GoogleIcon className="size-4 shrink-0" />
            <span>Google Edu</span>
          </motion.button>
          <motion.button
            type="button"
            className="flex items-center justify-center gap-2.5 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MicrosoftIcon className="size-4 shrink-0" />
            <span>Microsoft 365</span>
          </motion.button>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 absolute uppercase tracking-wider">
            Atau gunakan identitas sekolah
          </span>
        </div>
      </StaggerItem>

      <StaggerItem>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              className="text-xs font-semibold text-slate-700"
              htmlFor="username"
            >
              Nomor Induk / Identitas Akun (NISN / NIP / Email Institusi)
            </label>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Universal ID
            </span>
          </div>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh: 0065849201 atau user@smkmataram.sch.id"
            className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              className="text-xs font-semibold text-slate-700"
              htmlFor="password"
            >
              Kata Sandi Portal
            </label>
            <span className="text-[10px] font-medium text-slate-400">
              Minimal 8 Karakter
            </span>
          </div>
          <div className="relative flex items-center">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Lock className="size-3" />
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 placeholder:text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition"
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            >
              {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-offset-0 transition cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              Ingat 30 hari
            </span>
          </label>
          <a
            href="#"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Lupa Kata Sandi?
          </a>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.99]"
          whileHover={{ scale: loading ? 1 : 1.015 }}
          whileTap={{ scale: loading ? 1 : 0.985 }}
        >
          <span>{loading ? "Memverifikasi…" : "Masuk ke LMS Portal"}</span>
          <ArrowRight className="size-3.5" />
        </motion.button>
      </form>
      </StaggerItem>

      <StaggerItem>
      <div className="mt-4 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2">
        <CheckCircle2 className="size-3.5 text-indigo-500" />
        <span className="text-[11px] font-medium text-slate-500 text-center">
          Dilindungi Sistem Verifikasi OTP &amp; SSO Dapodik Terintegrasi
        </span>
      </div>
      </StaggerItem>

      <StaggerItem>
      <div className="mt-5 text-center">
        <p className="text-xs text-slate-600">
          Belum memiliki akun terverifikasi?{" "}
          <a
            href="#"
            className="font-bold text-indigo-600 hover:underline"
          >
            Hubungi Admin Dapodik
          </a>
        </p>
        <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-medium text-slate-500">
          <a href="#" className="hover:text-slate-700 transition">
            Panduan SSO
          </a>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-slate-700 transition">
            Kebijakan Privasi
          </a>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-slate-700 transition">
            Pusat Bantuan IT
          </a>
        </div>
      </div>
      </StaggerItem>
    </StaggerChildren>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 21 21">
      <path d="M1 1h9v9H1z" fill="#f25022" />
      <path d="M1 11h9v9H1z" fill="#00a4ef" />
      <path d="M11 1h9v9h-9z" fill="#7fba00" />
      <path d="M11 11h9v9h-9z" fill="#ffb900" />
    </svg>
  );
}