"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BadgeCheck } from "lucide-react";
import { assessPassword } from "@/lib/auth/password";
import { ShieldCheckIcon } from "@/components/auth/auth-icons";
import { PasswordField, RuleChecklist, StrengthMeter } from "@/components/auth/password-field";
import { api } from "@/lib/api/client";

interface ResetPasswordFormProps {
  token: string;
}

/**
 * Sets a new password from the single-use token in the reset email
 * (`/auth/reset-password?token=...`).
 */
export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const assessment = useMemo(() => assessPassword(password), [password]);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const hasToken = token.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!assessment.isStrong)
      return toast.error("Kata sandi baru belum memenuhi semua syarat keamanan");
    if (!passwordsMatch) return toast.error("Konfirmasi kata sandi tidak cocok");

    setLoading(true);
    try {
      const { error } = await api.auth.resetPassword({ token: token.trim(), password });

      if (error) {
        toast.error(error.message || error.error || "Gagal menyimpan kata sandi");
        return;
      }

      setDone(true);
      toast.success("Kata sandi berhasil direset. Silakan login kembali.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  if (!hasToken) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600">
            <AlertTriangle className="size-5" />
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Tautan Tidak Lengkap</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Halaman ini harus dibuka dari tautan reset password di email Anda. Buka
            kembali email tersebut, atau minta tautan baru.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Tautan reset hanya berlaku 1 jam dan tidak dapat dipakai dua kali.
          </p>
        </div>

        <Link
          href="/auth/forgot-password"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          Minta Tautan Baru
          <ArrowRight className="size-3.5" />
        </Link>

        <Link
          href="/auth/login"
          className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Kembali ke halaman masuk
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <BadgeCheck className="size-5" />
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Kata Sandi Tersimpan</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Semua sesi lama telah diakhiri. Masuk kembali memakai kata sandi baru
            Anda.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          Masuk ke Portal
          <ArrowRight className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Reset Kata Sandi
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Kata Sandi Baru</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Buat kata sandi baru untuk mengakses kembali akun SiManis Anda.
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
          <ShieldCheckIcon className="size-4" />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4" />

      <div className="space-y-3">
        <PasswordField
          id="password"
          label="Kata Sandi Baru"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="Buat kata sandi baru yang kuat"
        />
        <StrengthMeter assessment={assessment} />
        <RuleChecklist results={assessment.ruleResults} />
      </div>

      <PasswordField
        id="confirmPassword"
        label="Konfirmasi Kata Sandi Baru"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        placeholder="Ketik ulang kata sandi baru"
        action={
          confirmPassword.length > 0 ? (
            <span
              className={
                passwordsMatch
                  ? "text-[10px] font-semibold rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700"
                  : "text-[10px] font-semibold rounded-full bg-rose-100 px-2 py-0.5 text-rose-700"
              }
            >
              {passwordsMatch ? "Cocok" : "Tidak Sama"}
            </span>
          ) : null
        }
      />

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full mt-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.99]"
        whileHover={{ scale: loading ? 1 : 1.015 }}
        whileTap={{ scale: loading ? 1 : 0.985 }}
      >
        <span>{loading ? "Menyimpan…" : "SIMPAN KATA SANDI BARU"}</span>
        <ArrowRight className="size-3.5" />
      </motion.button>

      <div className="border-t border-slate-200 pt-4 space-y-3">
        <p className="text-xs text-slate-600">
          Tautan sudah kedaluwarsa?{" "}
          <Link
            href="/auth/forgot-password"
            className="font-bold text-indigo-600 hover:underline"
          >
            Minta tautan baru
          </Link>
        </p>
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <Link href="/auth/login" className="hover:text-slate-700 transition">
            Kembali ke Login
          </Link>
          <span className="text-slate-300">•</span>
          <a href="#" className="hover:text-slate-700 transition">
            Panduan SSO
          </a>
        </div>
      </div>
    </form>
  );
}
