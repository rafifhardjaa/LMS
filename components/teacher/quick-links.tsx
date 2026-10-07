import {
  Brain,
  Folder,
  HelpCircle,
  Link,
  FileText,
  Pencil,
  Presentation,
  SquarePen,
  Users,
  Video,
} from "lucide-react";

const links = [
  { label: "Document", action: "+ Create", icon: FileText },
  { label: "Presentation", action: "+ Create", icon: Presentation },
  { label: "Online Class", action: "+ Start Live", icon: Video },
  { label: "Reference", action: "+ Add new", icon: Link },
  { label: "Subjective Q", action: "+ Create", icon: SquarePen },
  { label: "Objective Q", action: "+ Create", icon: HelpCircle },
  { label: "Activity Q", action: "+ Add new", icon: Brain },
  { label: "Activity", action: "+ Create", icon: Users },
  { label: "Collection", action: "+ Create", icon: Folder },
];

export function QuickLinks() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[16px] font-semibold text-[#1E293B] uppercase tracking-wide">
          QUICK LINKS
        </span>
        <button
          type="button"
          title="Edit Quick Links"
          className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] hover:text-[#1E293B] transition-colors"
        >
          <Pencil className="size-[18px]" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {links.map(({ label, action, icon: Icon }) => (
          <div
            key={label}
            className="bg-[#F8FAFC] hover:bg-[#FFEBEB]/30 rounded-xl p-2.5 flex flex-col items-center justify-between text-center transition-all group shadow-xs cursor-pointer"
          >
            <Icon className="size-6 text-[#475569] group-hover:text-[#b71422] transition-colors" />
            <span className="text-[12px] font-semibold text-[#1E293B] mt-1 leading-tight">
              {label}
            </span>
            <span className="text-[11px] font-bold text-[#b71422] mt-1">
              {action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}