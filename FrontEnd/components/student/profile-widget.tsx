"use client";

import { useEffect, useState } from "react";
import { User, Loader2, Settings } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { FadeIn } from "@/components/ui/animations";

export function ProfileWidget() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(false);
    }
  }, [user?.id]);

  if (loading) return <div className="h-32 flex items-center justify-center text-sm text-[#787584]">Memuat profil…</div>;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="rounded-full bg-[#e0f2f1] p-3">
            <User className="size-6 text-[#06b759]" />
          </div>
        </div>
        <div>
          <h3 className="font-medium text-[#071f1c]">{user?.full_name}</h3>
          <p className="text-xs text-[#536360]">{user?.nomor_induk ?? "—"} | {user?.kelas ?? "—"}</p>
          <p className="mt-1 text-xs text-[#787584]">Status SSO: <span className={user?.is_active ? "text-[#06b759]" : "text-[#f97316]"}>
            {user?.is_active ? "Aktif" : "Butuh Aktivasi"}
          </span>
          </p>
        </div>
      </div>
    </div>
  );
}