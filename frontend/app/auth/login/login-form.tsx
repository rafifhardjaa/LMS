"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, UserPlus } from "lucide-react";
import { StaggerChildren, StaggerItem } from "@/components/ui/animations";
import { api, authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

function homeSegment(role: string) {
  if (role === "admin") return "admin";
  if (role === "teacher" || role === "guru") return "teacher";
  return "student";
}

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Semua kolom harus diisi");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await api.users.login.post({
        email: username,
        password,
      });

      if (error) {
        toast.error(error.error || "Login gagal");
        setLoading(false);
        return;
      }

      if (!data?.data) {
        toast.error("Token tidak diterima dari server");
        setLoading(false);
        return;
      }

      const token = data.data;

      const { data: currentData, error: currentError } =
        await authApi(token).users.current.get();

      if (currentError || !currentData?.data) {
        toast.error("Gagal mengambil data pengguna");
        setLoading(false);
        return;
      }

      const user = currentData.data;
      useAuthStore.getState().setAuth(token, user);

      toast.success("Login berhasil — menyambungkan ke portal…");

      const role = user.role;
      let target =
        role === "admin"
          ? "/admin/dashboard"
          : role === "teacher" || role === "guru"
            ? "/teacher/dashboard"
            : "/student/dashboard";

      // Honour ?redirect= from middleware when it matches the user's area.
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      if (redirect && redirect.startsWith("/") && redirect.startsWith(`/${homeSegment(role)}`)) {
        target = redirect;
      }

      router.push(target);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Kesalahan jaringan");
      } else {
        toast.error("Kesalahan jaringan");
      }
      setLoading(false);
    }
  }

  return (
    <StaggerChildren staggerDelay={0.07} delayChildren={0}>
      <StaggerItem>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              Single Sign On
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
              Login menggunakan akun yang sudah terdaftar atau{" "}
              <a
                href="#"
                className="font-bold text-indigo-600 hover:underline"
              >
                Create Account
              </a>
              .
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
            <Lock className="size-4" />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-200 w-full" />
        </div>
      </StaggerItem>

      <StaggerItem>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <div className="flex justify-between items-center mb-1.5" />
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username / NIS / Email"
              className="w-full bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-2.5 text-xs text-slate-500 font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                className="text-xs font-semibold text-slate-700"
                htmlFor="password"
              >
                Password
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
                className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
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

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.99]"
            whileHover={{ scale: loading ? 1 : 1.015 }}
            whileTap={{ scale: loading ? 1 : 0.985 }}
          >
            <span>{loading ? "Memverifikasi…" : "MASUK"}</span>
            <ArrowRight className="size-3.5" />
          </motion.button>
          <div className="flex justify-start pt-1">
            <a
              href="#"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Lupa Password?
            </a>
          </div>
        </form>
      </StaggerItem>

      <StaggerItem>
        <div className="mt-5 space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <UserPlus className="size-4.5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900">Belum punya akun?</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Daftar akun baru untuk mengakses portal LMS SMK Mataram. Proses
                  registrasi cepat dan aman.
                </p>
                <a
                  href="/auth/register"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition"
                >
                  Buat Akun Sekarang
                  <ArrowRight className="size-3.5" />
                </a>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-600 text-center">
            Butuh bantuan verifikasi akun?{" "}
            <a
              href="#"
              className="font-bold text-indigo-600 hover:underline"
            >
              Hubungi Admin Dapodik
            </a>
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] font-medium text-slate-500">
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
