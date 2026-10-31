"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

function homeFor(role?: string) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "guru" || role === "teacher") return "/teacher/dashboard";
  return "/student/dashboard";
}

export function ChangePasswordForm() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Semua kolom harus diisi");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    if (newPassword === currentPassword) {
      toast.error("Password baru harus berbeda dari password awal");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authApi.auth.changePassword.put({
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (error || !data?.data) {
        toast.error(error?.error || error?.message || "Gagal mengganti password");
        return;
      }

      const current = data.data;
      useAuthStore.getState().setUser(current);

      toast.success("Password berhasil diganti");
      router.push(homeFor(current.role));
    } catch {
      toast.error("Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await authApi.users.logout.delete();
    } catch {
      // ignore network errors — local session is cleared regardless
    }
    useAuthStore.getState().clearAuth();
    router.replace("/auth/login");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800">
          Akun ini masih memakai password awal. Buat password baru sebelum
          melanjutkan — password lama tidak akan berlaku lagi.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700" htmlFor="current_password">
          Password saat ini
        </label>
        <input
          id="current_password"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700" htmlFor="new_password">
          Password baru
        </label>
        <input
          id="new_password"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <p className="text-[10px] font-medium text-slate-400">Minimal 8 karakter</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700" htmlFor="confirm_password">
          Ulangi password baru
        </label>
        <input
          id="confirm_password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5 text-xs text-slate-800 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <KeyRound className="size-3.5" />
        {loading ? "Menyimpan…" : "Simpan password baru"}
      </button>

      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
      >
        <LogOut className="size-3.5" />
        Keluar
      </button>
    </form>
  );
}
