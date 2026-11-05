"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const PAGE_SIZE = 10;

export function LearningModules() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [currentModule, setCurrentModule] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await masterDataApi.modules.list();
      if (res.error) throw new Error((res.error as { message?: string }).message ?? "Gagal memuat modul");
      setModules(res.data?.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat modul");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const moduleOptions = useMemo(() => modules.map((m) => ({
    value: m.id,
    label: m.title,
  })), [modules]);

  const moduleTabOptions = useMemo(() => ["All", ...new Set(modules.map((m) => m.title.split(" ")[0] || "All"))], [modules]);

  if (loading) return <div className="h-64 flex items-center justify-center text-sm text-[#787584]">Memuat modul…</div>;
  if (modules.length === 0) return <p className="text-[#787584]">Belum ada modul.</p>;

  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-[18px] font-semibold text-[#071f1c]">Modul</h2>
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => setCurrentModule(e.target.value ? { id: e.target.value } : null)}
            className="h-10 rounded-full bg-[#f1f4f9] px-3 text-sm text-[#181c20] outline-none focus:ring-2 focus:ring-[#6c5dd3]/30"
          >
            <option value="">Semua modul</option>
            {moduleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((m) => (
          <motion.div
            key={m.id}
            whileHover={{ y: -4, boxShadow: "0 8px 20px -4px rgba(0,0,0,0.08)" }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="group rounded-xl bg-[#f8f9fc] p-4 hover:border-[#cee8e1] cursor-pointer"
            onClick={() => setCurrentModule(m)}
          >
            <div className="flex items-start gap-3">
              <Download className="size-4 text-[#6c5dd3] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#071f1c]">{m.title}</h3>
                <p className="text-xs text-[#536360]">{m.description ?? "Tanpa deskripsi"}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentModule && (
        <div className="mt-6 p-4 rounded-xl bg-[#f0edff] border border-[#6c5dd3]">
          <h3 className="font-semibold text-[#071f1c]">{currentModule.title}</h3>
          <p className="text-xs text-[#536360]">{currentModule.description ?? "Tanpa deskripsi"}</p>
          <p className="mt-2 text-sm">Status: <span className="font-medium">Belum diakses</span></p>
        </div>
      )}
    </section>
  );
}