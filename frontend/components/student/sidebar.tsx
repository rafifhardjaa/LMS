import {
  BadgeCheck,
  BookOpen,
  ClipboardList,
  GraduationCap,
  Headset,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutDashboard, active: true, title: "Dashboard" },
  { label: "Modules", icon: BookOpen, title: "Modul Pembelajaran" },
  { label: "Assignments", icon: ClipboardList, title: "Tugas & Kuis" },
  { label: "Transcripts", icon: BadgeCheck, title: "Rekap Nilai & Transkrip" },
  { label: "Counseling (BK)", icon: Headset, title: "Konseling & Bimbingan" },
  { label: "Settings", icon: Settings, title: "Pengaturan Akun" },
];

export function MuridSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col justify-between py-6 px-6 border-r border-[#cee8e1]/60 shadow-[0_1px_8px_rgba(7,31,28,0.03)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-8 w-full">
        <div className="flex items-center gap-2 px-1">
          <div className="w-10 h-10 rounded-xl bg-[#0d5c52] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(13,92,82,0.3)] flex-shrink-0">
            <GraduationCap className="size-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-semibold text-[#071f1c] leading-tight tracking-tight">
              SiManis
            </span>
            <span className="text-[11px] font-semibold text-[#536360]">
              Student Workspace
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 w-full">
          {menu.map(({ label, icon: Icon, active, title }) => (
            <a
              key={label}
              href="#"
              title={title}
              aria-current={active ? "page" : undefined}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-[#d4eee7] text-[#0d5c52] font-semibold shadow-sm"
                  : "text-[#536360] font-semibold hover:bg-[#edf7f4] hover:text-[#0d5c52]"
              }`}
            >
              <Icon className="size-[22px] flex-shrink-0" />
              <span className="text-[14px] truncate">{label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#edf7f4] border border-[#cee8e1]/50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#0d5c52] flex items-center justify-center text-white">
              <User className="size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-semibold text-[#071f1c] truncate max-w-[90px]">
                Pawell
              </span>
              <span className="text-[12px] text-[#536360]">Grade 12</span>
            </div>
          </div>
          <a
            href="#"
            title="Logout"
            className="p-1 rounded-lg text-[#536360] hover:bg-[#e2f2ee] hover:text-[#ba1a1a] transition-colors"
          >
            <LogOut className="size-5" />
          </a>
        </div>
      </div>
    </aside>
  );
}