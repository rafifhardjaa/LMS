"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import { modulesApi } from "@/lib/api/client";
import type { BackendModule } from "@/lib/api/types";
import { useAuthStore } from "@/lib/store/auth-store";

type ModuleItem = BackendModule;

export function LearningModules() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [classId, setClassId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const [modulesRes, classesRes] = await Promise.all([
          modulesApi.list(),
          user?.kelas ? masterDataApi.classes.list() : Promise.resolve(null),
        ]);
        if (!active) return;

        if (modulesRes.error) {
          setError(modulesRes.error.message ?? "Gagal memuat modul.");
          return;
        }

        const foundClass = classesRes?.data?.data.find(
          (item) => item.name === user?.kelas,
        );
        setClassId(foundClass?.id ?? "");
        setModules(modulesRes.data?.data ?? []);
        setError(null);
      } catch {
        if (active) setError("Gagal memuat modul.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [user?.kelas]);

  const visibleModules = selectedModuleId
    ? modules.filter((module) => module.id === selectedModuleId)
    : modules;
  const selectedModule = modules.find((module) => module.id === selectedModuleId);

  function courseHref(module: ModuleItem) {
    return classId && module.subject_id
      ? `/student/module-course/${classId}--${module.subject_id}`
      : null;
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-[#787584]">
        <Loader2 className="mr-2 size-5 animate-spin text-[#0d5c52]" />
        Memuat modul…
      </div>
    );
  }

  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-[18px] font-semibold text-[#071f1c]">Modul</h2>
          <p className="text-xs text-[#536360]">Pilih modul untuk melihat detail.</p>
        </div>
        <select
          value={selectedModuleId}
          onChange={(event) => setSelectedModuleId(event.target.value)}
          className="h-10 rounded-full bg-[#f1f4f9] px-3 text-sm text-[#181c20] outline-none focus:ring-2 focus:ring-[#0d5c52]/30"
        >
          <option value="">Semua modul</option>
          {modules.map((module) => (
            <option key={module.id} value={module.id}>
              {module.title}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="rounded-xl bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">{error}</div>
      ) : visibleModules.length === 0 ? (
        <div className="rounded-xl bg-[#f8faf9] p-6 text-center text-sm text-[#787584]">
          Belum ada modul tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleModules.map((module) => {
            const href = courseHref(module);
            const content = (
              <div className="flex items-start gap-3">
                <BookOpen className="size-4 text-[#0d5c52] flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-medium text-[#071f1c]">{module.title}</h3>
                  <p className="text-xs text-[#536360]">
                    {module.description ?? "Tanpa deskripsi"}
                  </p>
                </div>
              </div>
            );

            return href ? (
              <Link
                key={module.id}
                href={href}
                className="rounded-xl bg-[#f8f9fc] p-4 transition-colors hover:border hover:border-[#0d5c52]/30"
              >
                {content}
              </Link>
            ) : (
              <div
                key={module.id}
                className="rounded-xl bg-[#f8f9fc] p-4 opacity-60"
              >
                {content}
              </div>
            );
          })}
        </div>
      )}

      {selectedModule && (
        <div className="p-4 rounded-xl bg-[#e0f2f1] border border-[#0d5c52]">
          <h3 className="font-semibold text-[#071f1c]">{selectedModule.title}</h3>
          <p className="text-xs text-[#536360]">
            {selectedModule.description ?? "Tanpa deskripsi"}
          </p>
          <p className="mt-2 text-sm">
            Status: <span className="font-medium">Belum diakses</span>
          </p>
          {courseHref(selectedModule) ? (
            <Link
              href={courseHref(selectedModule)!}
              className="mt-3 inline-flex text-sm font-semibold text-[#0d5c52] hover:underline"
            >
              Buka modul
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}
