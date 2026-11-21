"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Circle, Clock3, Loader2 } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";

type TaskItem = {
  id: string;
  title: string;
  progress: number;
  completed: number;
  total: number;
};

function statusText(progress: number) {
  if (progress >= 100) return "Selesai";
  if (progress >= 75) return "Lanjut";
  if (progress >= 50) return "Progress";
  if (progress > 0) return "Dalam pengerjaan";
  return "Belum mulai";
}

export function TasksQuizzes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const res = await masterDataApi.modules.list();
        if (!active) return;
        if (res.error) {
          setError(res.error.message ?? "Gagal memuat tugas/kuis.");
          return;
        }

        const modules = res.data?.data ?? [];
        const progressResults = await Promise.all(
          modules.map((module) => masterDataApi.progress.byModule(module.id)),
        );

        const items = modules.map((module, index) => {
          const percentage = progressResults[index]?.data?.data?.percentage ?? 0;
          return {
            id: module.id,
            title: module.title,
            progress: percentage,
            completed: Math.round((percentage / 100) * 10),
            total: 10,
          };
        });

        setTasks(items);
        setError(null);
      } catch {
        if (active) setError("Gagal memuat tugas/kuis.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, []);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-[#787584]">
        <Loader2 className="mr-2 size-5 animate-spin text-[#0d5c52]" />
        Memuat tugas/kuis…
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <h2 className="text-[18px] font-semibold text-[#071f1c]">Tugas & Kuis</h2>
          <p className="text-xs text-[#536360]">Ringkasan progres tiap modul.</p>
        </div>
        <span className="text-xs text-[#536360]">{tasks.length} item</span>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl bg-[#f8faf9] p-6 text-center text-sm text-[#787584]">
          Belum ada tugas/kuis.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const StatusIcon = task.progress >= 100 ? CheckCircle : task.progress > 0 ? Clock3 : Circle;
            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                className="rounded-xl bg-[#f8f9fc] p-3 text-left transition-colors hover:border hover:border-[#0d5c52]/30"
              >
                <div className="flex items-start gap-2">
                  <StatusIcon className="size-4 text-[#0d5c52]" />
                  <div className="min-w-0">
                    <p className="font-medium text-[#071f1c]">{task.title}</p>
                    <p className="text-xs text-[#536360]">
                      {statusText(task.progress)} {task.progress}% ({task.completed}/{task.total})
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedTask && (
        <div className="mt-4 p-4 rounded-xl bg-[#e0f2f1] border border-[#10b981]">
          <h3 className="font-medium text-[#071f1c]">{selectedTask.title}</h3>
          <p className="text-xs text-[#536360]">
            Progress: {selectedTask.progress}% ({selectedTask.completed}/{selectedTask.total})
          </p>
          <p className="mt-2 text-sm">
            Status: <span className="font-medium">{statusText(selectedTask.progress)}</span>
          </p>
        </div>
      )}
    </section>
  );
}
