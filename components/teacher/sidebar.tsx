import {
  BookOpen,
  BarChart3,
  ClipboardList,
  Download,
  LayoutGrid,
  LogOut,
  School,
  Settings,
  UserCheck,
} from "lucide-react";

const menu = [
  { label: "Dashboard", icon: LayoutGrid, active: true, title: "Dashboard" },
  {
    label: "Mata Pelajaran",
    icon: BookOpen,
    title: "Mata Pelajaran & Kurikulum",
  },
  { label: "Tugas & Materi", icon: ClipboardList, title: "Tugas & Modul Ajar" },
  { label: "Analitik & Nilai", icon: BarChart3, title: "Nilai Siswa & Capaian" },
  { label: "Presensi & Siswa", icon: UserCheck, title: "Presensi Siswa" },
  { label: "Ekspor Rekap", icon: Download, title: "Ekspor Data Raport" },
];

export function GuruSidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 flex flex-col justify-between py-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3 px-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FFEBEB] flex items-center justify-center relative shadow-[0_1px_8px_rgba(0,0,0,0.04)] flex-shrink-0">
            <School className="size-6 text-[#b71422]" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#b71422] ring-2 ring-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-semibold text-[#1E293B] truncate">
              SiManis
            </span>
            <span className="text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase truncate">
              Workspace Guru
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 w-full px-2">
          {menu.map(({ label, icon: Icon, active, title }) => (
            <a
              key={label}
              href="#"
              title={title}
              aria-current={active ? "page" : undefined}
              className={`relative w-full h-11 flex items-center gap-3 px-3 rounded-xl transition-all ${
                active
                  ? "bg-[#FFEBEB] text-[#b71422] font-bold before:content-[''] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-[3px] before:bg-[#b71422] before:rounded-r"
                  : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0d1c2e]"
              }`}
            >
              <Icon className="size-[22px] flex-shrink-0" />
              <span className="text-[14px] font-semibold truncate">{label}</span>
            </a>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-1 w-full px-2 pt-2 border-t border-[#EBF0F5]">
        <a
          href="#"
          title="Pengaturan Akun"
          className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0d1c2e] transition-all"
        >
          <Settings className="size-[22px] flex-shrink-0" />
          <span className="text-[14px] font-semibold truncate">Pengaturan</span>
        </a>
        <button
          type="button"
          title="Keluar Akun"
          className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-[#EF4444] hover:bg-[#FFEBEB] transition-all text-left"
        >
          <LogOut className="size-[22px] flex-shrink-0" />
          <span className="text-[14px] font-semibold truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
}