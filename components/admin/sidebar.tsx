import {
  Award,
  BookOpen,
  Folder,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  MessageCircle,
  ReceiptText,
  School,
  Settings,
  User,
  Users,
  X,
} from "lucide-react";

const mainMenu = [
  { label: "Dashboard", icon: LayoutGrid, active: true },
  { label: "Teachers (Guru)", icon: User },
  { label: "Students (Siswa)", icon: Users },
  { label: "Course (Mapel)", icon: BookOpen },
  { label: "Resource (Modul)", icon: Folder },
  { label: "Certificate (LSP)", icon: Award },
  { label: "Chat Konseling", icon: MessageCircle },
  { label: "Transaction", icon: ReceiptText },
];

const helpMenu = [
  { label: "Settings", icon: Settings },
  { label: "Support & Log", icon: LifeBuoy },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white z-50 flex flex-col justify-between shadow-[0_1px_12px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col flex-1 overflow-y-auto px-4 pt-5 gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#6c5dd3] flex items-center justify-center shadow-[0_6px_14px_-2px_rgba(108,93,211,0.4)]">
            <School className="text-white size-[22px]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[19px] text-[#181c20] tracking-tight font-bold">
                SiManis
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#e5deff] text-[#4331a8] text-[10px] font-bold uppercase tracking-wider">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-[#787584] font-semibold tracking-wider uppercase">
              Admin Console
            </span>
          </div>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-1">
          <div className="px-2.5 py-1">
            <span className="text-[11px] text-[#787584] uppercase tracking-wider font-semibold">
              Menu
            </span>
          </div>
          <nav className="space-y-1">
            {mainMenu.map(({ label, icon: Icon, active }) => (
              <a
                key={label}
                href="#"
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  active
                    ? "bg-[#6c5dd3] text-white font-semibold shadow-[0_4px_12px_-2px_rgba(108,93,211,0.35)]"
                    : "text-[#4e566c] hover:bg-[#eceef3] hover:text-[#181c20]"
                }`}
              >
                <Icon className="size-5" />
                <span className="text-sm font-semibold">{label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Help */}
        <div className="flex flex-col gap-1">
          <div className="px-2.5 py-1">
            <span className="text-[11px] text-[#787584] uppercase tracking-wider font-semibold">
              Help
            </span>
          </div>
          <nav className="space-y-1">
            {helpMenu.map(({ label, icon: Icon }) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-[#4e566c] hover:bg-[#eceef3] hover:text-[#181c20] transition-all"
              >
                <Icon className="size-5" />
                <span className="text-sm font-semibold">{label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Promo banner */}
        {/* <div className="relative p-4 rounded-2xl bg-[#f1f4f9] border border-[#e0e2e7]/30 flex flex-col gap-2 mt-auto overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 rounded-lg bg-[#e5deff] flex items-center justify-center text-[#6c5dd3]">
              <School className="size-4" />
            </div>
            <X className="size-4 text-[#787584] cursor-pointer hover:text-[#181c20]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#181c20] block">
              New Dashboard UI
            </span>
            <p className="text-[11px] text-[#4e566c] leading-tight mt-0.5">
              Check out the new dashboard view. Pages now load faster.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button type="button" className="text-[11px] font-semibold text-[#787584] hover:text-[#181c20]">
              Dismiss
            </button>
            <button type="button" className="text-[11px] font-bold text-[#6c5dd3] hover:underline">
              What&apos;s new?
            </button>
          </div>
        </div> */}
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-[#eceef3] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#e5deff] flex items-center justify-center shrink-0 font-bold text-[#180065] text-xs">
            PW
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm text-[#181c20] font-bold truncate">Pawell</span>
            <span className="text-xs text-[#787584] truncate">Super Admin SMK</span>
          </div>
        </div>
        <LogOut className="size-[18px] text-[#787584] hover:text-[#93000a]" />
      </div>
    </aside>
  );
}