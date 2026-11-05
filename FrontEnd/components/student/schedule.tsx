"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn } from "@/components/ui/animations";

export function Schedule() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<any[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.id) throw new Error("User not logged in");
      // Try to get schedule from modules or a hypothetical schedule endpoint
      const modulesRes = await masterDataApi.modules.list();
      const modules = modulesRes.data?.data ?? [];
      
      // Build schedule from module progress
      const scheduleItems = modules.slice(0, 7).map((m: any, i: any) => ({
        id: m.id,
        day: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"][i % 7],
        title: m.title,
        time: "08:00 - 09:30",
        status: "Aktif",
      }));
      setSchedule(scheduleItems);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="h-48 flex items-center justify-center text-sm text-[#787584]">Memuat jadwal…</div>;
  if (schedule.length === 0) return <p className="text-[#787584]">Jadwal belum tersedia.</p>;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="grid grid-cols-2 gap-4">
        {schedule.map((s) => (
          <div key={s.id} className="p-3 rounded-xl bg-[#f8f9fc] border-b border-[#cee8e1]/50">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-[#6c5dd3]" />
              <span className="font-medium text-[#071f1c]">{s.day}</span>
            </div>
            <div className="mt-1 text-sm">
              <p className="font-medium text-[#071f1c]">{s.title}</p>
              <p className="text-xs text-[#536360]">{s.time} • {s.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}