"use client";

import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  Download,
  FileText,
  Pencil,
  PlusCircle,
  RefreshCw,
  Scale,
  Trash2,
  Upload,
  Video,
} from "lucide-react";

const TOTAL_SECONDS = 2 * 3600 + 47 * 60 + 36;

function format(seconds: number) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}j ${m}m ${s}s`;
}

export function TaskManager() {
  const [left, setLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#b71422] uppercase">
            Tugas Terkini &amp; Sumber Pembelajaran
          </span>
          <h3 className="text-[20px] font-semibold text-[#1E293B] tracking-tight">
            Manajemen Tugas &amp; Modul Ajar
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="bg-[#b71422] hover:bg-[#db3237] text-white px-4 py-2 rounded-lg text-[14px] font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <PlusCircle className="size-[18px]" /> + Buat Tugas Baru
          </button>
          <button
            type="button"
            className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] px-4 py-2 rounded-lg text-[14px] font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Upload className="size-[18px]" /> + Unggah Modul PDF/PPT
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active task card */}
        <div className="bg-[#F8FAFC] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="px-2.5 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold rounded-full uppercase">
                VII-A • Fisika Terapan
              </span>
              <span className="px-2.5 py-0.5 bg-[#FFEBEB] text-[#b71422] text-[11px] font-bold rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b71422] animate-ping" />
                Tersisa: {format(left)}
              </span>
            </div>
            <h4 className="text-[16px] font-semibold text-[#1E293B]">
              Tugas Harian 3: Hukum Termodinamika &amp; Kalor
            </h4>
            <p className="text-[12px] text-[#475569] mt-1">
              Laporan praktikum konveksi kalor dan analisis kalorimeter
              sederhana.
            </p>
            <div className="mt-4 bg-white rounded-lg p-2">
              <div className="flex items-center justify-between text-[12px] mb-1">
                <span className="text-[#94A3B8]">Progres Pengumpulan Siswa</span>
                <span className="text-[14px] font-semibold text-[#1E293B]">
                  34 / 38 Siswa
                </span>
              </div>
              <div className="w-full bg-[#EBF0F5] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#b71422] h-full rounded-full transition-all duration-500"
                  style={{ width: "89.4%" }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 mt-4 pt-1">
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Edit Tugas"
                className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFEBEB] text-[#475569] hover:text-[#b71422] flex items-center justify-center transition-colors"
              >
                <Pencil className="size-[18px]" />
              </button>
              <button
                type="button"
                title="Hapus Tugas"
                className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFEBEB] text-[#EF4444] flex items-center justify-center transition-colors"
              >
                <Trash2 className="size-[18px]" />
              </button>
            </div>
            <button
              type="button"
              className="px-2 py-1.5 bg-[#b71422] text-white text-[12px] font-semibold rounded-lg hover:bg-[#db3237] shadow-xs transition-colors flex items-center gap-1"
            >
              <ClipboardCheck className="size-4" /> Review Pengumpulan (34/38)
            </button>
          </div>
        </div>

        {/* Right stack */}
        <div className="flex flex-col gap-2">
          <div className="bg-[#F8FAFC] rounded-xl p-2 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center">
                  <Scale className="size-4" />
                </span>
                <div>
                  <h5 className="text-[14px] font-semibold text-[#1E293B]">
                    Kuis Bab 2 &amp; Remedial Mandiri
                  </h5>
                  <span className="text-[12px] text-[#94A3B8]">
                    KKM: 75.0 • Target: 5 Siswa Remedial
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="px-2 py-1 bg-[#FEE2E2] hover:bg-[#FFEBEB] text-[#DC2626] text-[11px] font-bold rounded-lg transition-colors"
              >
                Kelola Peserta
              </button>
            </div>
          </div>

          <div className="bg-[#F8FAFC] rounded-xl p-2 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#FFEBEB] text-[#b71422] flex items-center justify-center flex-shrink-0">
                <FileText className="size-[22px]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-[14px] font-semibold text-[#1E293B] truncate">
                  Modul-04-Fisika-Gelombang.pdf
                </h5>
                <p className="text-[12px] text-[#94A3B8]">
                  Ukuran: 4.8 MB • Diperbarui kemarin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                title="Unduh File"
                className="w-8 h-8 rounded-lg bg-white hover:bg-[#F1F5F9] text-[#475569] flex items-center justify-center shadow-xs"
              >
                <Download className="size-[18px]" />
              </button>
              <button
                type="button"
                title="Ganti File Modul"
                className="w-8 h-8 rounded-lg bg-white hover:bg-[#FFEBEB] text-[#b71422] flex items-center justify-center shadow-xs"
              >
                <RefreshCw className="size-[18px]" />
              </button>
            </div>
          </div>

          <div className="bg-[#E0F2FE]/50 rounded-xl p-2 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="size-5 text-[#006398]" />
              <div>
                <span className="text-[14px] font-semibold text-[#1E293B]">
                  Tatap Muka Virtual Siang Ini
                </span>
                <p className="text-[12px] text-[#475569]">
                  13:30 - VII-B Praktikum Online Kalor
                </p>
              </div>
            </div>
            <button
              type="button"
              className="px-2.5 py-1 bg-[#006398] text-white text-[11px] font-bold rounded-lg hover:bg-[#5bb8fe] transition-colors shadow-xs"
            >
              Buka Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}