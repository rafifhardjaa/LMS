"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowRight, MailCheck, UserIcon as UserRoundIcon } from "lucide-react";
import { ShieldCheckIcon, UserIcon } from "@/components/auth/auth-icons";
import { TextField } from "@/components/auth/auth-field";
import { api } from "@/lib/api/client";

/**
 * Requests a password-reset link. The backend answers with the same message for
 * known and unknown identifiers, so this screen must not reveal either.
 */
export function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!identifier.trim()) return toast.error("Email atau nomor induk wajib diisi");

    setLoading(true);
    try {
      const { error } = await api.auth.forgotPassword({ identifier: identifier.trim() });

      if (error) {
        toast.error(error.message || error.error || "Gagal mengirim tautan");
        return;
      }

      setSent(true);
      toast.success("Permintaan diterima. Periksa email Anda.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
            <MailCheck className="size-5" />
          </span>
          <h2 className="mt-3 text-xl font-bold text-slate-900">Periksa Email Anda</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Bila identitas yang Anda masukkan terdaftar, tautan pembuatan kata sandi
            baru sudah dikirim ke email akun tersebut.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4" />

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
          <p className="text-[11px] leading-relaxed text-indigo-800">
            Tautan berlaku <span className="font-bold">1 jam</span> dan hanya dapat
            dipakai sekali. Periksa folder spam bila email belum terlihat.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition"
        >
          Kembali ke Halaman Masuk
          <ArrowRight className="size-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => setSent(false)}
          className="w-full text-xs font-semibold text-slate-500 hover:text-slate-700 transition"
        >
          Masukkan identitas lain
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            Pemulihan Akun
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Kirim Tautan Reset</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Tautan pembuatan kata sandi baru akan dikirim ke email akun Anda.
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
          <ShieldCheckIcon className="size-4" />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4" />

      <TextField
        id="identifier"
        label="Email atau Nomor Induk"
        hint="Wajib diisi"
        icon={<UserIcon className="size-3.5" />}
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="nama@smkmataram.sch.id atau 0065849201"
        autoComplete="username"
      />

      <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3">
        <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-600">
          <UserRoundIcon className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
          Alamat email tidak dapat diubah dari halaman ini. Bila email akun sudah
          tidak aktif, hubungi admin sekolah.
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full mt-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition active:scale-[0.99]"
        whileHover={{ scale: loading ? 1 : 1.015 }}
        whileTap={{ scale: loading ? 1 : 0.985 }}
      >
        <span>{loading ? "Mengirim…" : "KIRIM TAUTAN RESET"}</span>
        <ArrowRight className="size-3.5" />
      </motion.button>

      <div className="border-t border-slate-200 pt-4 space-y-3">
        <p className="text-xs text-slate-600">
          Ingat kata sandi Anda?{" "}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </form>
  );
}
