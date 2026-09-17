import { Calculator, Video } from "lucide-react";

export function Schedule() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[#071f1c]">
          Next Live Session
        </h3>
        <span className="flex items-center gap-1 text-[11px] font-bold text-[#ba1a1a]">
          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
          Live in 15m
        </span>
      </div>

      <div className="p-4 rounded-xl bg-[#0d5c52] text-white flex flex-col gap-4 relative overflow-hidden shadow-md">
        <div className="flex flex-col gap-1 z-10">
          <span className="px-2 py-0.5 rounded bg-white/20 w-max text-[11px] font-semibold">
            Lecture Hall A • Virtual Stream
          </span>
          <h4 className="text-[15px] font-bold">AI &amp; Data Ethics</h4>
          <p className="text-[12px] text-white/90">
            Prof. Marcus Vance • Topic: Algorithmic Fairness &amp; Governance
          </p>
        </div>
        <div className="flex items-center justify-between pt-1 z-10">
          <span className="text-[13px] font-semibold font-mono bg-white/20 px-2.5 py-1 rounded-full">
            10:00 AM - 11:30 AM
          </span>
          <button
            type="button"
            className="px-4 py-1.5 rounded-full bg-white text-[#0d5c52] hover:bg-[#edf7f4] text-[13px] font-semibold shadow-sm transition-all duration-200 flex items-center gap-1 font-bold"
          >
            <Video className="size-[18px]" />
            Connect to Class
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none z-0" />
      </div>

      <div className="flex items-center justify-between p-2 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 text-[#071f1c]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#e6f4f1] text-[#0d5c52] flex items-center justify-center">
            <Calculator className="size-[18px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold truncate">
              Calculus Problem Lab
            </span>
            <span className="text-[12px] text-[#536360]">
              01:30 PM - Room 102
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-white text-[#536360] text-[11px] font-semibold border border-[#cee8e1]/50">
          In 3.5h
        </span>
      </div>
    </div>
  );
}