"use client";

import {
  BadgeCheck,
  Ban,
  Eye,
  Key,
  LockOpen,
  Pencil,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/animations";

type RowAction = {
  icon: "eye" | "edit" | "lock" | "ban" | "verify" | "delete";
  title: string;
};

type UserRow = {
  initials: string;
  avatarClassName: string;
  name: string;
  identifier: string;
  role: string;
  detail: string;
  contact: string;
  contactSub: string;
  security: {
    button?: { icon: "key" | "lock"; label: string };
    text?: { label: string; className: string };
  };
  status: { label: string; className: string };
  actions: RowAction[];
};

const users: UserRow[] = [
  {
    initials: "BS",
    avatarClassName: "bg-[#e5deff] text-[#4331a8]",
    name: "Drs. Bambang Sutrisno",
    identifier: "NIP. 19780312 200501 1 004",
    role: "Guru Mapel Kejuruan",
    detail: "Guru Otomotif • XI TKR 2",
    contact: "bambang.s@smkmataram.sch.id",
    contactSub: "+62 812-4456-7890",
    security: {
      button: { icon: "key", label: "Reset Password" },
      text: { label: "Aktif", className: "text-[#4e566c] font-mono" },
    },
    status: {
      label: "Aktif",
      className: "bg-emerald-100 text-emerald-800",
    },
    actions: [
      { icon: "eye", title: "Detail Akun" },
      { icon: "edit", title: "Edit Akun" },
      { icon: "lock", title: "Kunci Akun" },
    ],
  },
  {
    initials: "DW",
    avatarClassName: "bg-[#e0e2e7] text-[#181c20]",
    name: "Dimas Wahyu Pratama",
    identifier: "NISN. 008472910",
    role: "Siswa SMK",
    detail: "Tata Boga • X Boga 1",
    contact: "dimas.wahyu@student.smkmataram.sch.id",
    contactSub: "Dapodik Sinkron",
    security: {
      button: { icon: "lock", label: "Kirim PIN Baru" },
    },
    status: {
      label: "Aktif",
      className: "bg-emerald-100 text-emerald-800",
    },
    actions: [
      { icon: "eye", title: "Detail Siswa" },
      { icon: "edit", title: "Edit Siswa" },
      { icon: "ban", title: "Nonaktifkan" },
    ],
  },
  {
    initials: "SN",
    avatarClassName: "bg-[#e4dfff] text-[#433995]",
    name: "Siti Nurhaliza, S.Psi",
    identifier: "NIP. 19850421 201001 2 018",
    role: "Guru Bimbingan Konseling",
    detail: "Konselor X Boga & XI TKR",
    contact: "siti.bk@smkmataram.sch.id",
    contactSub: "+62 813-8877-2211",
    security: {
      button: { icon: "key", label: "Reset Password" },
      text: { label: "2FA Aktif", className: "text-emerald-700 font-semibold" },
    },
    status: {
      label: "Aktif",
      className: "bg-emerald-100 text-emerald-800",
    },
    actions: [
      { icon: "eye", title: "Detail Guru BK" },
      { icon: "edit", title: "Edit Konselor" },
      { icon: "lock", title: "Kunci Akun" },
    ],
  },
  {
    initials: "ER",
    avatarClassName: "bg-[#6c5dd3] text-white",
    name: "Eka Rahmawati",
    identifier: "NISN. 007391823",
    role: "Siswa SMK (Mutasi Masuk)",
    detail: "Desain Komunikasi Visual • XII DKV 1",
    contact: "eka.r@student.smkmataram.sch.id",
    contactSub: "Menunggu Sync Dapodik",
    security: {
      text: {
        label: "Token Verifikasi: #99214",
        className: "bg-amber-100 text-amber-900 font-mono",
      },
    },
    status: {
      label: "Pending Verifikasi",
      className: "bg-pink-100 text-pink-700",
    },
    actions: [
      { icon: "eye", title: "Detail" },
      { icon: "verify", title: "Verifikasi Akun" },
      { icon: "delete", title: "Tolak" },
    ],
  },
];

const actionIconMap = {
  eye: Eye,
  edit: Pencil,
  lock: LockOpen,
  ban: Ban,
  verify: BadgeCheck,
  delete: Trash2,
} as const;

const actionClassMap = {
  eye: "bg-[#f4f2ff] text-[#6c5dd3] hover:bg-[#6c5dd3] hover:text-white",
  edit: "bg-[#ecfdf5] text-emerald-700 hover:bg-emerald-600 hover:text-white",
  lock: "bg-[#fff1f2] text-red-600 hover:bg-red-600 hover:text-white",
  ban: "bg-[#fff1f2] text-red-600 hover:bg-red-600 hover:text-white",
  verify: "bg-[#ecfdf5] text-emerald-700 hover:bg-emerald-600 hover:text-white",
  delete: "bg-[#fff1f2] text-red-600 hover:bg-red-600 hover:text-white",
} as const;

export function UsersTable() {
  return (
    <FadeIn>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e0e2e7]/40 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#181c20]">
              Manajemen Pengguna &amp; Master Data (Guru, Siswa, BK)
            </h2>
            <p className="text-xs text-[#4e566c]">
              Kelola hak akses akun, status aktif/nonaktif, reset password cepat,
              dan verifikasi dapodik
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <motion.button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#eceef3] border border-[#e0e2e7]/50 text-xs font-semibold shadow-sm transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Upload className="size-4" /> + Import Excel/CSV
            </motion.button>
            <motion.button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#6c5dd3] text-white hover:opacity-95 text-xs font-semibold shadow-[0_4px_12px_-2px_rgba(108,93,211,0.35)] transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <UserPlus className="size-4" /> Tambah Pengguna Baru
            </motion.button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f4f9] text-[#4e566c] font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Pengguna / NIP/NISN</th>
                <th className="py-3.5 px-4">Peran &amp; Jurusan / Rombel</th>
                <th className="py-3.5 px-4">Kontak / Email</th>
                <th className="py-3.5 px-4">Reset Password &amp; Keamanan</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceef3]">
              {users.map((u) => (
                <tr
                  key={u.name}
                  className="hover:bg-[#f1f4f9]/40 transition-colors"
                >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full font-bold flex items-center justify-center shrink-0 ${u.avatarClassName}`}
                        >
                          {u.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#181c20] text-sm">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-[#787584] font-medium">
                            {u.identifier}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#181c20]">{u.role}</span>
                        <span className="text-[11px] text-[#4e566c]">{u.detail}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#181c20] font-medium">{u.contact}</span>
                        <span className="text-[11px] text-[#787584]">{u.contactSub}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {u.security.button ? (
                          <button
                            type="button"
                            className="px-2 py-1 rounded bg-[#f4f2ff] text-[#6c5dd3] hover:bg-[#6c5dd3] hover:text-white transition-all text-[11px] font-bold inline-flex items-center gap-1"
                          >
                            {u.security.button.icon === "key" ? (
                              <Key className="size-[13px]" />
                            ) : (
                              <LockOpen className="size-[13px]" />
                            )}
                            {u.security.button.label}
                          </button>
                        ) : null}
                        {u.security.text ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              u.security.text.className.includes("bg")
                                ? u.security.text.className
                                : u.security.text.className
                            }`}
                          >
                            {u.security.text.label}
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${u.status.className}`}
                      >
                        {u.status.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {u.actions.map((a) => {
                          const Icon = actionIconMap[a.icon];
                          return (
                            <motion.button
                              key={a.title}
                              type="button"
                              title={a.title}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${actionClassMap[a.icon]}`}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Icon className="size-[15px]" />
                            </motion.button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FadeIn>
  );
}
