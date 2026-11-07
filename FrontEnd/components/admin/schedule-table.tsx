"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Loader2,
  PencilLine,
  RefreshCw,
  Search,
  TriangleAlert,
  Timer,
} from "lucide-react";
import { masterDataApi, type JadwalPelajaran } from "@/lib/api/master-data";
import { SearchableDropdown, type JurusanOption } from "@/components/admin/searchable-dropdown";

const HARI_LIST = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] as const;
const PAGE_SIZE = 10;

function hhmm(value: string) {
  return (value ?? "").slice(0, 5);
}

function statusPelajaran(row: JadwalPelajaran): { label: string; className: string } {
  if ((row.bentrokKelas ?? 0) > 0) {
    return { label: "Bentrok Kelas", className: "bg-[#fef2f2] text-[#dc2626]" };
  }
  if ((row.diLuarJamKerja ?? 0) > 0) {
    return { label: "Di Luar Jam Kerja", className: "bg-[#fffbeb] text-[#d97706]" };
  }
  if ((row.jatuhDiIstirahat ?? 0) > 0) {
    return { label: "Jatuh di Istirahat", className: "bg-[#fffbeb] text-[#d97706]" };
  }
  if ((row.durasiLebihDari90 ?? 0) > 0) {
    return { label: "Durasi > 90 Menit", className: "bg-[#fffbeb] text-[#d97706]" };
  }
  return { label: "Bebas Bentrok", className: "bg-[#ecfdf5] text-[#059669]" };
}

export function ScheduleTable({ aside, refreshKey, onDataLoaded, onEdit }: { aside: ReactNode; refreshKey?: number; onDataLoaded?: (rows: JadwalPelajaran[]) => void; onEdit?: (row: JadwalPelajaran) => void }) {
  const [query, setQuery] = useState("");
  const [tingkat, setTingkat] = useState("Tingkat");
  const [subGrade, setSubGrade] = useState("Sub Grade");
  const [jurusan, setJurusan] = useState("Jurusan");
  const [sesi, setSesi] = useState("Sesi 1-6");
  const [day, setDay] = useState("Semua");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<JadwalPelajaran[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [internalRefreshKey, setInternalRefreshKey] = useState(0);
  const activeRefreshKey = refreshKey ?? internalRefreshKey;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await masterDataApi.jadwalPelajaran.list();
        if (cancelled) return;
        if (res.error) {
          throw new Error(
            (res.error as { message?: string }).message ?? "Gagal memuat jadwal pelajaran"
          );
        }
        setData(res.data?.data ?? []);
        onDataLoaded?.(res.data?.data ?? []);
      } catch (e) {
        if (!cancelled) {
          setData([]);
          setError(e instanceof Error ? e.message : "Gagal memuat jadwal pelajaran");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeRefreshKey]);

  const reload = () => {
    setLoading(true);
    setError(null);
    setInternalRefreshKey((k) => k + 1);
  };

  const tingkatOptions: JurusanOption[] = [{ value: "Tingkat", label: "Tingkat" }, ...[...new Set(data.map((r) => r.gradeCode))].sort().map((code) => ({ value: code, label: code }))];
  const subGradeOptions: JurusanOption[] = [{ value: "Sub Grade", label: "Sub Grade" }, ...[...new Set(data.map((r) => r.classSection))].sort().map((code) => ({ value: code, label: code }))];
  const sesiOptions: JurusanOption[] = [{ value: "Sesi 1-6", label: "Sesi 1-6" }, ...[...new Set(data.map((r) => r.sesi))].sort((a, b) => a - b).map((n) => ({ value: String(n), label: `Sesi ${n}` }))];
  const jurusanOptions: JurusanOption[] = [{ value: "Jurusan", label: "Jurusan" }, ...[...new Set(data.map((r) => r.majorCode))].sort().map((code) => ({ value: code, label: code }))];
  const dayTabs = useMemo(
    () => [
      { value: "Semua", label: `Semua Hari (${data.length})` },
      ...HARI_LIST.map((hari) => ({
        value: hari,
        label: `${hari} (${data.filter((d) => d.hari === hari).length})`,
      })),
    ],
    [data]
  );

  const rows = useMemo(
    () =>
      data.filter((s) => {
        const q = query.trim().toLowerCase();
        return (
          (!q || [s.className, s.subjectName, s.majorName, s.hari].some((v) => (v ?? "").toLowerCase().includes(q))) &&
          (day === "Semua" || s.hari === day) &&
          (tingkat === "Tingkat" || s.gradeCode === tingkat) &&
          (subGrade === "Sub Grade" || s.classSection === subGrade) &&
          (jurusan === "Jurusan" || s.majorCode === jurusan) &&
          (sesi === "Sesi 1-6" || s.sesi === Number(sesi.match(/\d/)?.[0]))
        );
      }),
    [data, query, tingkat, subGrade, jurusan, sesi, day]
  );

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const reset = () => {
    setQuery("");
    setTingkat("Tingkat");
    setSubGrade("Sub Grade");
    setJurusan("Jurusan");
    setSesi("Sesi 1-6");
    setDay("Semua");
  };

  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl border border-[#eef0f5] bg-white p-4 shadow-[0_8px_24px_rgba(32,44,90,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div role="tablist" aria-label="Filter hari jadwal" className="flex flex-wrap items-center gap-1.5">
            {dayTabs.map((item) => (
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
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-[720px] lg:grid-cols-4">
            <label className="sr-only" htmlFor="schedule-tingkat">Filter tingkat</label>
            <SearchableDropdown
              value={tingkat}
              onChange={setTingkat}
              options={tingkatOptions}
              label="Tingkat"
            />
            <label className="sr-only" htmlFor="schedule-sub-grade">Filter sub grade</label>
            <SearchableDropdown
              value={subGrade}
              onChange={setSubGrade}
              options={subGradeOptions}
              label="Sub Grade"
            />
            <label className="sr-only" htmlFor="schedule-jurusan">Filter jurusan</label>
          <SearchableDropdown
            value={jurusan}
            onChange={setJurusan}
            options={jurusanOptions}
            label="Jurusan"
          />
            <label className="sr-only" htmlFor="schedule-sesi">Filter sesi</label>
            <SearchableDropdown
              value={sesi}
              onChange={setSesi}
              options={sesiOptions}
              label="Sesi 1-6"
            />
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
              <h2 className="max-w-[400px] text-base font-bold leading-5 text-[#181c20]">Daftar Sesi Pembelajaran Dan Alokasi Jam</h2>
              <span className="rounded-full bg-[#e5deff] px-2 py-1 text-[10px] font-semibold text-[#4331a8]">{rows.length} Sesi Ditampilkan</span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Muat ulang jadwal" onClick={() => reload()} disabled={loading} className="flex size-9 items-center justify-center rounded-full bg-[#f1f4f9] text-[#4e566c] hover:bg-[#e5deff] disabled:opacity-50">
                <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
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
                {paged.map((s) => {
                  const status = statusPelajaran(s);
                  return (
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
                          <span className="text-xs font-bold text-[#181c20]">{hhmm(s.waktuMulai)} - {hhmm(s.waktuSelesai)}</span>
                          <span className="text-[10px] text-[#787584]">{s.hari}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e5deff] text-[10px] font-bold text-[#4331a8]">{s.gradeCode}</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#181c20]">{s.className}</span>
                          <span className="text-[10px] text-[#787584]">{s.majorName ?? s.majorCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-[#6c5dd3]">{s.subjectName}</span>
                        <span className="text-[10px] text-[#4e566c]">{s.majorCode} • {s.gradeCode}</span>
                      </div>
                    </td>
                    <td className="px-3 py-5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f4f9] px-2.5 py-1 text-[10px] font-semibold text-[#4e566c]">
                        <Timer className="size-3.5" /> {s.durasi} Menit
                      </span>
                    </td>
                    <td className="px-3 py-5">
                      <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-bold ${status.className}`}>
                        <CheckCircle2 className="size-3.5" /> {status.label}
                      </span>
                    </td>
                    <td className="px-3 py-5 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button type="button" aria-label="Detail sesi" onClick={() => window.alert(`Detail sesi ${s.sesi} ${s.className}`)} className="rounded-full p-1.5 text-[#6c5dd3] hover:bg-[#6c5dd3]/10">
                          <Eye className="size-[18px]" />
                        </button>
                        <button type="button" aria-label="Edit sesi" onClick={() => onEdit?.(s)} className="rounded-full p-1.5 text-[#4e566c] hover:bg-[#eceef3]">
                          <PencilLine className="size-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {loading && paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#787584]">
                      <span className="inline-flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Memuat data jadwal pelajaran…</span>
                    </td>
                  </tr>
                )}
                {!loading && error && paged.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#b91c1c]">
                      <span className="inline-flex items-center gap-2"><TriangleAlert className="size-4" /> {error}</span>
                      <button type="button" onClick={() => reload()} className="ml-2 font-semibold underline">Coba lagi</button>
                    </td>
                  </tr>
                )}
                {!loading && !error && paged.length === 0 && (
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
              Menampilkan <b className="text-[#181c20]">{paged.length ? (safePage - 1) * PAGE_SIZE + 1 : 0} – {(safePage - 1) * PAGE_SIZE + paged.length}</b> dari <b className="text-[#181c20]">{rows.length}</b>
              <br />Sesi Terjadwal
            </span>
            <nav aria-label="Paginasi jadwal" className="flex items-center gap-1">
              <button type="button" aria-label="Halaman sebelumnya" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)} className="flex size-8 items-center justify-center rounded-full text-[#787584] disabled:opacity-40">
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: Math.min(pageCount, 3) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-current={safePage === n ? "page" : undefined}
                  onClick={() => setPage(n)}
                  className={`size-8 rounded-full font-semibold ${safePage === n ? "bg-[#5343b9] text-white" : "text-[#181c20] hover:bg-[#eceef3]"}`}
                >
                  {n}
                </button>
              ))}
              {pageCount > 3 && <span className="px-1">…</span>}
              {pageCount > 3 && (
                <button type="button" onClick={() => setPage(pageCount)} className="size-8 rounded-full text-[#181c20]">{pageCount}</button>
              )}
              <button type="button" aria-label="Halaman berikutnya" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)} className="flex size-8 items-center justify-center rounded-full text-[#181c20] disabled:opacity-40">
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
