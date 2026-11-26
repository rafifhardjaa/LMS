"use client";

import { useAuthStore } from "@/lib/store/auth-store";

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileWidget() {
  const user = useAuthStore((state) => state.user);
  const name = user?.full_name ?? "Profil siswa";
  const nis = user?.nomor_induk ?? "—";
  const kelas = user?.kelas ?? "—";

  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)]">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {user?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar_url}
              alt={name}
              className="size-11 rounded-full object-cover"
            />
          ) : (
            <div className="size-11 rounded-full bg-[#e0f2f1] flex items-center justify-center">
              <span className="text-sm font-semibold text-[#0d5c52]">
                {initialsOf(name)}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-[#071f1c] truncate">{name}</h3>
          <p className="text-xs text-[#536360]">
            {nis} | {kelas}
          </p>
          <p className="mt-1 text-xs text-[#787584]">
            Status SSO:{" "}
            <span className={user?.is_active ? "text-[#06b759]" : "text-[#f97316]"}>
              {user?.is_active ? "Aktif" : "Butuh Aktivasi"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
