"use client";

import { useAuthStore } from "@/lib/store/auth-store";

function roleLabel(role: string | undefined): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "guru":
    case "teacher":
      return "Guru";
    case "siswa":
    case "student":
      return "Siswa";
    default:
      return "Pengguna";
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function AdminTopbar() {
  const user = useAuthStore((state) => state.user);
  const fullName = user?.full_name?.trim() || "Admin";
  const avatarUrl = user?.avatar_url ?? null;
  const role = roleLabel(user?.role);

  return (
    <header className="fixed left-64 right-0 top-0 z-40 h-16 border-b border-[#eef0f5] bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <p className="min-w-0 truncate text-sm font-semibold text-[#1e293b]">
          LMS - Admin Workspace
        </p>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 flex-col text-right sm:flex">
            <span className="truncate text-xs font-semibold text-[#1e293b]">{fullName}</span>
            <span className="truncate text-[11px] text-[#64748b]">{role}</span>
          </div>

          {avatarUrl ? (
            <span
              role="img"
              aria-label={`Avatar ${fullName}`}
              title={fullName}
              className="size-9 shrink-0 rounded-full bg-cover bg-center ring-2 ring-white"
              style={{ backgroundImage: `url(${avatarUrl})` }}
            />
          ) : (
            <span
              title={fullName}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e5deff] text-[11px] font-bold text-[#4331a8] ring-2 ring-white"
            >
              {initials(fullName)}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
