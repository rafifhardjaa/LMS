import { FileText, SlidersHorizontal, TrendingUp } from "lucide-react";

const courses = [
  { name: "VI-A Mathematics", avg: "93.21%", tasks: "35/38" },
  { name: "VI-A Science", avg: "88.29%", tasks: "21/40" },
  { name: "VII-B English", avg: "86.34%", tasks: "35/42" },
  { name: "VII-A Social Science", avg: "86.27%", tasks: "33/39" },
  { name: "VII-A Mathematics", avg: "85.76%", tasks: "34/35" },
];

export function CoursePerformance() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="text-[11px] font-bold tracking-wider text-[#b71422] uppercase">
            Analitik Komparasi Rombel
          </span>
          <h4 className="text-[16px] font-semibold text-[#1E293B]">
            COURSE PERFORMANCE
          </h4>
        </div>
        <SlidersHorizontal className="size-5 text-[#94A3B8] cursor-pointer hover:text-[#1E293B]" />
      </div>

      <div className="flex flex-col gap-1">
        {courses.map((c) => (
          <div
            key={c.name}
            className="flex items-center justify-between p-2.5 hover:bg-[#F1F5F9]/70 rounded-xl transition-colors"
          >
            <div className="min-w-0">
              <h5 className="text-[14px] font-semibold text-[#1E293B]">
                {c.name}
              </h5>
              <div className="flex items-center gap-2 text-[12px] text-[#94A3B8] mt-0.5">
                <span>
                  Rerata: <strong className="text-[#1E293B]">{c.avg}</strong>
                </span>
                <span>•</span>
                <span>Tugas: {c.tasks}</span>
              </div>
            </div>
            <button
              type="button"
              title="Lihat Rapor Detail"
              className="w-8 h-8 rounded-lg bg-[#F8FAFC] hover:bg-[#FFEBEB] text-[#475569] hover:text-[#b71422] flex items-center justify-center shadow-xs"
            >
              <FileText className="size-[18px]" />
            </button>
          </div>
        ))}
      </div>

      <div className="pt-1 text-center">
        <a
          className="text-[#b71422] hover:text-[#db3237] text-[12px] font-semibold inline-flex items-center gap-1"
          href="#"
        >
          Buka Laporan Agregat Lengkap
          <TrendingUp className="size-4" />
        </a>
      </div>
    </div>
  );
}