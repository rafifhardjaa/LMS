import { Calendar, Download, Table } from "lucide-react";

export function ExportCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="w-8 h-8 rounded-lg bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center font-bold">
            <Table className="size-[18px]" />
          </span>
          <div>
            <h4 className="text-[16px] font-semibold text-[#1E293B]">
              Ekspor Rekapitulasi
            </h4>
            <span className="text-[12px] text-[#94A3B8]">
              Data Lengkap Rapor &amp; Kurikulum
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold rounded-full uppercase">
          Format .XLSX
        </span>
      </div>

      <div className="mt-1 flex flex-col gap-1">
        <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
          Pilih Periode Semester
        </label>
        <div className="relative">
          <select
            defaultValue="Bulan Maret 2025 (Semester Genap)"
            className="w-full appearance-none bg-[#F8FAFC] px-4 py-2 rounded-lg text-[#1E293B] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#FFB3B3] cursor-pointer shadow-xs"
          >
            {[
              "Bulan Maret 2025 (Semester Genap)",
              "Bulan Februari 2025",
              "Bulan Januari 2025",
              "Rekap Semester Ganjil 2024",
            ].map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none size-[18px] text-[#94A3B8]" />
        </div>
      </div>

      <button
        type="button"
        className="mt-2 w-full py-2.5 px-4 bg-[#006B2C] hover:bg-[#00873A] text-white text-[14px] font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <Download className="size-5" />
        📥 Unduh Rekap Nilai &amp; Absensi (.xlsx)
      </button>
      <span className="text-center text-[12px] text-[#94A3B8]">
        Termasuk formula persentase otomatis &amp; status KKM
      </span>
    </div>
  );
}