"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, BadgeCheck } from "lucide-react";
import { assessPassword } from "@/lib/auth/password";
import { ShieldCheckIcon } from "@/components/auth/auth-icons";
import { PasswordField, RuleChecklist, StrengthMeter } from "@/components/auth/password-field";
import { api } from "@/lib/api/client";

interface ActivateFormProps {
  token: string;
}

/**
 * Creates the password for a freshly registered account using the single-use
 * token taken from the activation email (`/auth/activate?token=...`).
 */
export function ActivateForm({ token }: ActivateFormProps) {
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
      return toast.error("Kata sandi belum memenuhi semua syarat keamanan");
    if (!passwordsMatch) return toast.error("Konfirmasi kata sandi tidak cocok");

    setLoading(true);
    try {
      const { error } = await api.auth.activate({ token: token.trim(), password });

      if (error) {
        toast.error(error.message || error.error || "Aktivasi gagal");
        return;
      }

      setDone(true);
      toast.success("Akun berhasil diaktivasi. Silakan login.");
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
            Halaman ini memerlukan tautan aktivasi dari email. Buka kembali email
            pendaftaran Anda dan klik tombol aktivasi di dalamnya.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Tautan hanya berlaku 24 jam. Bila sudah kedaluwarsa, minta tautan baru
            lewat halaman kirim ulang.
          </p>
        </div>

        <Link
          href="/auth/forgot-password"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          Kirim Ulang Tautan Aktivasi
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
          <h2 className="mt-3 text-xl font-bold text-slate-900">Akun Aktif</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Kata sandi Anda sudah tersimpan. Silakan masuk untuk mulai menggunakan
            portal SiManis.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <Link
          href="/auth/login"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          Masuk ke Portal
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Langkah Terakhir
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Buat Kata Sandi</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Tentukan kata sandi untuk mengaktifkan akun SiManis Anda.
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
          label="Kata Sandi"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="Buat kata sandi yang kuat"
        />
        <StrengthMeter assessment={assessment} />
        <RuleChecklist results={assessment.ruleResults} />
      </div>

      <PasswordField
        id="confirmPassword"
        label="Konfirmasi Kata Sandi"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        placeholder="Ketik ulang kata sandi"
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
        <span>{loading ? "Mengaktifkan…" : "AKTIFKAN AKUN"}</span>
        <ArrowRight className="size-3.5" />
      </motion.button>

      <div className="border-t border-slate-200 pt-4">
        <p className="text-xs text-slate-600">
          Sudah punya kata sandi?{" "}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </form>
  );
}
