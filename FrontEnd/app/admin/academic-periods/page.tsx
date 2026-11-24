"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/animations";
import {
  masterDataApi,
  type AcademicPeriod,
} from "@/lib/api/master-data";

export default function AdminAcademicPeriodsPage() {
  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isActive: false,
  });

  async function load() {
    try {
      setLoading(true);
      const res = await masterDataApi.academicPeriods.list();
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal memuat periode akademik");
      }
      setPeriods(res.data?.data ?? []);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal memuat periode akademik",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await masterDataApi.academicPeriods.create(form);
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal menyimpan periode");
      }
      toast.success("Periode akademik ditambahkan");
      setForm({ name: "", startDate: "", endDate: "", isActive: false });
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan periode");
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      const res = await masterDataApi.academicPeriods.activate(id);
      if (res.error) {
        throw new Error(res.error.message ?? "Gagal mengaktifkan periode");
      }
      toast.success("Periode akademik diaktifkan");
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengaktifkan periode",
      );
    }
  }

  return (
    <FadeIn>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-[24px] font-semibold tracking-tight text-[#181c20]">
            Periode Akademik
          </h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Kelola periode aktif yang dipakai untuk presensi harian siswa.
          </p>
        </div>

        <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-bold text-[#1E293B]">
            Tambah Periode
          </h2>
          <form
            onSubmit={handleSubmit}
            className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Nama Periode
              </span>
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Ganjil 2026/2027"
                className="h-9 rounded-xl border border-[#DCE5EE] px-3 text-[13px] outline-none focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Tanggal Mulai
              </span>
              <input
                required
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
                className="h-9 rounded-xl border border-[#DCE5EE] px-3 text-[13px] outline-none focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                Tanggal Selesai
              </span>
              <input
                required
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
                className="h-9 rounded-xl border border-[#DCE5EE] px-3 text-[13px] outline-none focus:border-[#6c5dd3] focus:ring-2 focus:ring-[#6c5dd3]/20"
              />
            </label>
            <div className="flex items-end gap-2">
              <label className="flex h-9 flex-1 items-center gap-2 rounded-xl border border-[#DCE5EE] px-3 text-[12px] font-semibold text-[#475569]">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="size-3.5 accent-[#6c5dd3]"
                />
                Jadikan aktif
              </label>
              <button
                type="submit"
                disabled={saving}
                className="h-9 rounded-xl bg-[#6c5dd3] px-4 text-[12px] font-bold text-white transition hover:bg-[#5a4dbb] disabled:opacity-60"
              >
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-sm">
          <div className="border-b border-[#E2E8F0] px-5 py-4">
            <h2 className="text-[15px] font-bold text-[#1E293B]">
              Daftar Periode
            </h2>
          </div>
          {loading ? (
            <div className="p-6 text-[13px] text-[#6b7280]">
              Memuat periode akademik…
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#F8FAFC] text-[10px] font-bold uppercase tracking-wide text-[#94A3B8]">
                  <th className="px-5 py-3">Nama</th>
                  <th className="px-3 py-3">Rentang</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {periods.map((period) => (
                  <tr key={period.id}>
                    <td className="px-5 py-3 text-[12px] font-semibold text-[#1E293B]">
                      {period.name}
                    </td>
                    <td className="px-3 py-3 text-[12px] text-[#475569]">
                      {period.startDate} s.d. {period.endDate}
                    </td>
                    <td className="px-3 py-3">
                      {period.isActive ? (
                        <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10px] font-bold text-[#15803D]">
                          Aktif
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[10px] font-bold text-[#64748B]">
                          Nonaktif
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {!period.isActive && (
                        <button
                          type="button"
                          onClick={() => handleActivate(period.id)}
                          className="h-8 rounded-lg border border-[#DCE5EE] px-3 text-[11px] font-bold text-[#475569] transition hover:border-[#6c5dd3]/40 hover:text-[#6c5dd3]"
                        >
                          Aktifkan
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </FadeIn>
  );
}
