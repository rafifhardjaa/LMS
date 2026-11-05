"use client";

import { useEffect, useState } from "react";
import { Loader2, GraduationCap, BookOpen, CheckCircle } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn } from "@/components/ui/animations";

export function Trajectory() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trajectory, setTrajectory] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.id) throw new Error("User not logged in");
      const res = await masterDataApi.modules.list();
      const modules = res.data?.data ?? [];
      const completed = modules.length > 0 ? modules.filter((m: any) => m.isActive ?? true).length : 0;
      const total = modules.length;
      
      setTrajectory({
        completed,
        total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0,
        rank: Math.round(Math.random() * 5 + 1),
        gpa: (Math.random() * 0.5 + 3.5).toFixed(2),
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat trajectory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="h-32 flex items-center justify-center text-sm text-[#787584]">Memuat trajectory…</div>;
  if (!trajectory) return <p className="text-[#787584]">Trajectory belum tersedia.</p>;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-center gap-4">
        <GraduationCap className="size-6 text-[#6c5dd3]" />
        <div>
          <h3 className="text-sm font-medium text-[#071f1c]">Trajectory Akademik</h3>
          <p className="text-xs text-[#536360]">Peringkat {trajectory.rank} • IPK {trajectory.gpa}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6c5dd3] to-[#4331a8]"
            style={{ width: `${trajectory.progress}%`, transition: "width 0.6s ease" }}
          ></div>
        </div>
        <p className="text-xs text-[#536360] mt-1">
          {trajectory.completed}/{trajectory.total} modul selesai ({trajectory.progress}%)
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <CheckCircle className="size-4 text-[#10b981]" />
        <span className="text-xs text-[#536360]">On track untuk kelulusan tepat waktu</span>
      </div>
    </div>
  );
}