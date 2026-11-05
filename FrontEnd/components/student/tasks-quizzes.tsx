"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, FileText, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const PAGE_SIZE = 10;

export function TasksQuizzes() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTask, setCurrentTask] = useState<any>(null);

const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await masterDataApi.modules.list();
      if (res.error) throw new Error("Gagal memuat modul");
      const moduleIds = res.data?.data?.map((m: any) => m.id) ?? [];
      
      // Load progress for each module
      const progressPromises = moduleIds.map((mid: any) =>
        masterDataApi.progress.byModule(mid)
      );
      const progressResults = await Promise.allSettled(progressPromises);
      
      const tasksData = moduleIds.map((mid: any, idx: any) => ({
        id: mid,
        title: `Modul ${mid}`,
        progress: progressResults[idx]?.status === "fulfilled"
          ? ((progressResults[idx] as any).value as any)?.percentage ?? 0
          : 0,
        completed: progressResults[idx]?.status === "fulfilled"
          ? ((progressResults[idx] as any).value as any)?.completed ?? 0
          : 0,
        total: progressResults[idx]?.status === "fulfilled"
          ? ((progressResults[idx] as any).value as any)?.total ?? 0
          : 0,
      }));
      setTasks(tasksData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat tugas/kuis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const statusText = (p: number) => {
    if (p >= 100) return "Selesai";
    if (p >= 75) return "Lanjut";
    if (p >= 50) return "Progress";
    return "Belum mulai";
  };

  if (loading) return <div className="h-64 flex items-center justify-center text-sm text-[#787584]">Memuat tugas/kuis…</div>;
  if (tasks.length === 0) return <p className="text-[#787584]">Belum ada tugas/kuis.</p>;

  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <h2 className="text-[18px] font-semibold text-[#071f1c]">Tugas & Kuis</h2>
        <span className="text-xs text-[#536360]">{tasks.length} item</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((t) => (
          <motion.div
            key={t.id}
            whileHover={{ y: -4, boxShadow: "0 4px 12px -4px rgba(0,0,0,0.05)" }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="rounded-xl bg-[#f8f9fc] p-3 cursor-pointer hover:border-[#cee8e1]"
            onClick={() => setCurrentTask(t)}
          >
            <div className="flex items-start gap-2">
              <CheckCircle className="size-4 text-[#10b981]" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#071f1c]">{t.title}</p>
                <p className="text-xs text-[#536360]">
                  {statusText(t.progress)} {t.progress}% ({t.completed}/{t.total})
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {currentTask && (
        <div className="mt-4 p-4 rounded-xl bg-[#e0f2f1] border border-[#10b981]">
          <h3 className="font-medium text-[#071f1c]">{currentTask.title}</h3>
          <p className="text-xs text-[#536360]">
            Progress: {currentTask.progress}% ({currentTask.completed}/{currentTask.total})
          </p>
          <p className="mt-2 text-sm">Status: <span className="font-medium">{statusText(currentTask.progress)}</span></p>
        </div>
      )}
    </section>
  );
}
