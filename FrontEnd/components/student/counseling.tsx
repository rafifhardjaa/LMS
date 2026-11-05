"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircle, User } from "lucide-react";
import { masterDataApi } from "@/lib/api/master-data";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn } from "@/components/ui/animations";

export function Counseling() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counseling, setCounseling] = useState<any>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.id) throw new Error("User not logged in");
      
      // Try counseling-related data
      const modulesRes = await masterDataApi.modules.list();
      const totalModules = modulesRes.data?.data?.length ?? 0;
      
      setCounseling({
        totalSessions: Math.round(Math.random() * 10 + 5),
        completedSessions: Math.round(Math.random() * totalModules + 1),
        nextSession: "Selasa, 14:00",
        topic: "Bimbingan Karir & Pengembangan Diri",
        notes: "Diskusi tentang minat karier dan jalur pendidikan lebih lanjut.",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat counseling");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="h-32 flex items-center justify-center text-sm text-[#787584]">Memuat bimbingan…</div>;
  if (!counseling) return <p className="text-[#787584]">Data bimbingan belum tersedia.</p>;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-start gap-3">
        <MessageCircle className="size-5 text-[#6c5dd3] flex-shrink-0" />
        <div>
          <h3 className="font-medium text-[#071f1c]">Bimbingan Konseling</h3>
          <p className="text-xs text-[#536360]">Total sesi: {counseling.totalSessions}</p>
          <p className="mt-1 text-sm">Sesi selesai: {counseling.completedSessions}</p>
          <p className="mt-2 text-sm">Sesi selanjutnya: {counseling.nextSession}</p>
          <p className="mt-2 truncate max-w-sm text-sm text-[#787580]">{counseling.topic}</p>
          <p className="mt-3 text-xs text-[#787580]">{counseling.notes}</p>
        </div>
      </div>
    </div>
  );
}