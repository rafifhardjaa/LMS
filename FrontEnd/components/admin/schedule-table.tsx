"use client";

import { type ReactNode, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  LayoutGrid,
  PencilLine,
  Printer,
  RefreshCw,
  Rows3,
  Search,
  Timer,
} from "lucide-react";

type Session = {
  id: string;
  sesi: number;
  mulai: string;
  selesai: string;
  waktu: string;
  kelas: string;
  tingkat: "X" | "XI" | "XII";
  rombel: string;
  mapel: string;
  kategori: string;
  fase: string;
  durasi: number;
  status: "Bebas Bentrok";
};

const sessions: Session[] = [
  { id: "s1", sesi: 1, mulai: "07:00", selesai: "08:00", waktu: "Pagi Utama", kelas: "X TJKT", tingkat: "X", rombel: "Ruang Teori 1", mapel: "Dasar-dasar TJKT", kategori: "Kejuruan", fase: "Fase E", durasi: 60, status: "Bebas Bentrok" },
  { id: "s2", sesi: 2, mulai: "08:00", selesai: "09:00", waktu: "Pagi", kelas: "X TJKT", tingkat: "X", rombel: "Lab Komputer 1", mapel: "Informatika", kategori: "Umum", fase: "Fase E", durasi: 60, status: "Bebas Bentrok" },
  { id: "s3", sesi: 3, mulai: "09:15", selesai: "10:45", waktu: "Menengah", kelas: "X TJKT", tingkat: "X", rombel: "Ruang Teori 1", mapel: "Pendidikan Agama dan Budi Pekerti", kategori: "Normatif", fase: "Fase E", durasi: 90, status: "Bebas Bentrok" },
  { id: "s4", sesi: 4, mulai: "10:45", selesai: "12:00", waktu: "Menengah", kelas: "X TJKT", tingkat: "X", rombel: "Ruang Teori 1", mapel: "Matematika", kategori: "Umum", fase: "Fase E", durasi: 75, status: "Bebas Bentrok" },
  { id: "s5", sesi: 5, mulai: "12:15", selesai: "13:45", waktu: "Siang", kelas: "X TJKT", tingkat: "X", rombel: "Ruang Teori 1", mapel: "Bahasa Indonesia", kategori: "Umum", fase: "Fase E", durasi: 90, status: "Bebas Bentrok" },
  { id: "s6", sesi: 6, mulai: "13:45", selesai: "15:00", waktu: "Sore", kelas: "X TJKT", tingkat: "X", rombel: "Studio Kewirausahaan", mapel: "Projek Kreatif dan Kewirausahaan (PKK)", kategori: "Kejuruan", fase: "Fase E", durasi: 75, status: "Bebas Bentrok" },
  { id: "s7", sesi: 3, mulai: "09:15", selesai: "10:45", waktu: "Menengah", kelas: "XI PPLG", tingkat: "XI", rombel: "Ruang Teori 3", mapel: "Sejarah", kategori: "Umum", fase: "Fase F", durasi: 90, status: "Bebas Bentrok" },
  { id: "s8", sesi: 4, mulai: "10:45", selesai: "12:00", waktu: "Menengah", kelas: "XI PPLG", tingkat: "XI", rombel: "Lab RPL 2", mapel: "Pemrograman Berorientasi Objek", kategori: "Kejuruan", fase: "Fase F", durasi: 75, status: "Bebas Bentrok" },
  { id: "s9", sesi: 5, mulai: "12:15", selesai: "13:45", waktu: "Siang", kelas: "XI PPLG", tingkat: "XI", rombel: "Lab RPL 2", mapel: "Pemrograman Web & Bergerak", kategori: "Kejuruan", fase: "Fase F", durasi: 90, status: "Bebas Bentrok" },
  { id: "s10", sesi: 3, mulai: "09:15", selesai: "10:45", waktu: "Menengah", kelas: "XII DKV", tingkat: "XII", rombel: "Studio Animasi", mapel: "Animasi 2D dan 3D", kategori: "Kejuruan", fase: "Fase F Lanjutan", durasi: 90, status: "Bebas Bentrok" },
];

const days = [
  { label: "Semua Hari (810)", value: "Semua" },
  { label: "Senin (162)", value: "Senin" },
  { label: "Selasa (162)", value: "Selasa" },
  { label: "Rabu (162)", value: "Rabu" },
  { label: "Kamis (162)", value: "Kamis" },
  { label: "Jumat (162)", value: "Jumat" },
];

const PAGE_COUNT = 81;

export function ScheduleTable({ aside }: { aside: ReactNode }) {
  const [query, setQuery] = useState("");
  const [tingkat, setTingkat] = useState("Semua Tingkat");
  const [jurusan, setJurusan] = useState("Semua Jurusan (810 Sesi)");
  const [sesi, setSesi] = useState("Semua Sesi (1-6)");
  const [day, setDay] = useState("Semua");
  const [view, setView] = useState<"Tabel" | "Grid">("Tabel");
  const [page, setPage] = useState(1);

  const rows = useMemo(
    () =>
      sessions.filter((s) => {
        const q = query.trim().toLowerCase();
        return (
          (!q || [s.kelas, s.mapel, s.rombel, s.kategori].some((v) => v.toLowerCase().includes(q))) &&
          (tingkat === "Semua Tingkat" || s.tingkat === tingkat) &&
          (jurusan.startsWith("Semua") || s.kelas.includes(jurusan.split(" ")[0])) &&
          (sesi.startsWith("Semua") || s.sesi === Number(sesi.match(/\d/)?.[0]))
        );
      }),
    [query, tingkat, jurusan, sesi]
  );

  const reset = () => {
    setQuery("");
    setTingkat("Semua Tingkat");
    setJurusan("Semua Jurusan (810 Sesi)");
    setSesi("Semua Sesi (1-6)");
    setDay("Semua");
  };

  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eef0f5] bg-white p-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div role="tablist" aria-label="Filter hari jadwal" className="flex flex-wrap items-center gap-1.5">
            {days.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={day === item.value}
                onClick={() => setDay(item.value)}
                className={`inline-flex h-11 items-center whitespace-nowrap rounded-full px-4 text-xs font-semibold transition-all ${
                  day === item.value
                    ? "bg-[#5343b9] text-white shadow-[0_4px_12px_rgba(108,93,211,0.25)]"
                    : "text-[#4e566c] hover:bg-[#eceef3] hover:text-[#181c20]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex h-11 shrink-0 items-center gap-1 rounded-full bg-[#f1f4f9] p-1">
            {(["Tabel", "Grid"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-label={`Tampilan ${mode}`}
                aria-pressed={view === mode}
                onClick={() => setView(mode)}
                className={`flex size-9 items-center justify-center rounded-full ${
                  view === mode ? "bg-white text-[#6c5dd3] shadow-sm" : "text-[#4e566c]"
                }`}
              >
                {mode === "Tabel" ? <Rows3 className="size-4" /> : <LayoutGrid className="size-4" />}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-[#eef0f5] pt-4 lg:flex-row lg:gap-3">
          <label className="relative flex-1">
            <span className="sr-only">Cari jadwal</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari mata pelajaran, kelas, atau sesi..."
              className="h-11 w-full rounded-full bg-[#f1f4f9] pl-11 pr-4 text-sm outline-none placeholder:text-[#787584] focus:ring-2 focus:ring-[#6c5dd3]/30"
            />
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:w-[520px]">
            <label className="sr-only" htmlFor="schedule-tingkat">Filter tingkat</label>
            <div className="relative">
              <select
                id="schedule-tingkat"
                value={tingkat}
                onChange={(e) => setTingkat(e.target.value)}
                className="h-11 w-full appearance-none rounded-full bg-[#f1f4f9] px-4 pr-9 text-sm text-[#181c20] outline-none"
              >
                <option>Semua Tingkat</option>
                <option>X</option>
                <option>XI</option>
                <option>XII</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
            </div>
            <label className="sr-only" htmlFor="schedule-jurusan">Filter jurusan</label>
            <div className="relative">
              <select
                id="schedule-jurusan"
                value={jurusan}
                onChange={(e) => setJurusan(e.target.value)}
                className="h-11 w-full appearance-none rounded-full bg-[#f1f4f9] px-4 pr-9 text-sm text-[#181c20] outline-none"
              >
                <option>Semua Jurusan (810 Sesi)</option>
                <option>TJKT</option>
                <option>PPLG</option>
                <option>DKV</option>
                <option>AKL</option>
                <option>TKR</option>
                <option>TKI</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
            </div>
            <label className="sr-only" htmlFor="schedule-sesi">Filter sesi</label>
            <div className="relative">
              <select
                id="schedule-sesi"
                value={sesi}
                onChange={(e) => setSesi(e.target.value)}
                className="h-11 w-full appearance-none rounded-full bg-[#f1f4f9] px-4 pr-9 text-sm text-[#181c20] outline-none"
              >
                <option>Semua Sesi (1-6)</option>
                <option>Sesi 1 (07:00 - 08:00)</option>
                <option>Sesi 2 (08:00 - 09:00)</option>
                <option>Sesi 3 (09:15 - 10:45)</option>
                <option>Sesi 4 (10:45 - 12:00)</option>
                <option>Sesi 5 (12:15 - 13:45)</option>
                <option>Sesi 6 (13:45 - 15:00)</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#4e566c]" />
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#f1f4f9] px-4 text-xs font-semibold text-[#4e566c] transition-colors hover:bg-[#e5deff] hover:text-[#4331a8]"
          >
            <Filter className="size-4" /> Reset
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-2xl border border-[#eef0f5] bg-white shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
          <div className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <h2 className="max-w-[300px] text-base font-bold leading-5 text-[#181c20]">Daftar Sesi Pembelajaran Alokasi Jam</h2>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Muat ulang jadwal" onClick={() => window.alert("Muat ulang jadwal")} className="flex size-9 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]">
                <RefreshCw className="size-4" />
              </button>
              <button type="button" aria-label="Cetak jadwal" onClick={() => window.alert("Cetak jadwal")} className="flex size-9 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff]">
                <Printer className="size-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-[#f1f4f9] text-[11px] font-semibold uppercase tracking-wider text-[#4e566c]">
                <tr>
                  <th className="px-3 py-3 pl-5">Sesi &amp; Jam</th>
                  <th className="px-3 py-3">Rombel / Kelas</th>
                  <th className="px-3 py-3">Mata Pelajaran (Mapel)</th>
                  <th className="px-3 py-3">Durasi</th>
                  <th className="px-3 py-3">Status Validasi</th>
                  <th className="px-3 py-3 text-center">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef3]">
                {rows.map((s) => (
                  <tr key={s.id} className="hover:bg-[#fbfcfd]">
                    <td className="px-3 py-5 pl-5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold ${
                            s.sesi <= 2
                              ? "bg-[#6c5dd3] text-white"
                              : s.sesi <= 4
                                ? "bg-[#e5deff] text-[#4331a8]"
                                : "bg-[#dae2fd] text-[#131b2e]"
                          }`}
                        >
                          Sesi {s.sesi}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#181c20]">{s.mulai} - {s.selesai}</span>
                          <span className="text-[10px] text-[#787584]">{s.waktu}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e5deff] text-[10px] font-bold text-[#4331a8]">{s.tingkat}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#181c20]">{s.kelas}</span>
                          <span className="text-[10px] text-[#787584]">{s.rombel}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-[#6c5dd3]">{s.mapel}</span>
                        <span className="text-[10px] text-[#4e566c]">{s.kategori} • {s.fase}</span>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f4f9] px-2.5 py-1 text-[10px] font-semibold text-[#4e566c]">
                        <Timer className="size-3.5" /> {s.durasi} Menit
                      </span>
                    </td>
                    <td className="px-3 py-5">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#ecfdf5] px-2.5 py-1 text-[10px] font-bold text-[#059669]">
                        <CheckCircle2 className="size-3.5" /> {s.status}
                      </span>
                    </td>
                    <td className="px-3 py-5 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button type="button" aria-label="Detail sesi" onClick={() => window.alert(`Detail sesi ${s.sesi} ${s.kelas}`)} className="rounded-full p-1.5 text-[#6c5dd3] hover:bg-[#6c5dd3]/10">
                          <Eye className="size-[18px]" />
                        </button>
                        <button type="button" aria-label="Edit sesi" onClick={() => window.alert(`Edit sesi ${s.sesi} ${s.kelas}`)} className="rounded-full p-1.5 text-[#4e566c] hover:bg-[#eceef3]">
                          <PencilLine className="size-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!rows.length && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#787584]">
                      Tidak ada sesi yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 bg-[#f8f9fc] px-5 py-3 text-[11px] text-[#4e566c] sm:flex-row sm:items-center sm:justify-between">
            <span>
              Menampilkan <b className="text-[#181c20]">1 – {rows.length}</b> dari <b className="text-[#181c20]">810</b>
              <br />Total Sesi Terjadwal
            </span>
            <nav aria-label="Paginasi jadwal" className="flex items-center gap-1">
              <button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => setPage(page - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] disabled:opacity-40">
                <ChevronLeft className="size-4" />
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={page === n ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className={`size-8 rounded-full font-semibold ${page === n ? "bg-[#5343b9] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}
                >
                  {n}
                </button>
              ))}
              <span className="px-1">…</span>
              <button type="button" onClick={() => setPage(PAGE_COUNT)} className="size-8 rounded-full text-[#181c20]">{PAGE_COUNT}</button>
              <button type="button" aria-label="Halaman berikutnya" disabled={page >= PAGE_COUNT} onClick={() => setPage(page + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] disabled:opacity-40">
                <ChevronRight className="size-4" />
              </button>
            </nav>
          </div>
        </section>
        {aside}
      </div>
    </>
  );
}