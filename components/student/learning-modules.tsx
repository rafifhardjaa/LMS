"use client";

import { useState } from "react";
import { Download, FileText } from "lucide-react";

const filters = ["All", "Mathematics", "Physics", "Informatics"];

const modules = [
  {
    title: "Advanced Graph Algorithms & Big O Notation.pdf",
    chip: "Informatics",
    chipClassName: "bg-[#e0f2f1] text-[#00796b]",
    size: "3.4 MB",
    updated: "Updated 2 days ago",
  },
  {
    title: "Quantum Mechanics & Wave Functions Fundamentals.pdf",
    chip: "Physics",
    chipClassName: "bg-[#ccfbf1] text-[#0f766e]",
    size: "5.1 MB",
    updated: "Updated yesterday",
  },
  {
    title: "Linear Algebra for Machine Learning & Neural Tensors.pdf",
    chip: "Mathematics",
    chipClassName: "bg-[#e6f4f1] text-[#0d5c52]",
    size: "4.8 MB",
    updated: "Updated 4 days ago",
  },
];

export function LearningModules() {
  const [active, setActive] = useState("All");

  return (
    <section className="bg-white rounded-xl p-6 border border-[#cee8e1]/60 shadow-[0_4px_20px_-2px_rgba(7,31,28,0.03)] flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-[18px] font-semibold text-[#071f1c]">
            Learning Modules
          </h2>
          <p className="text-[12px] text-[#536360]">
            Official syllabus handouts, reading chapters &amp; lecture slide
            decks
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#edf7f4] p-1 rounded-full self-start sm:self-auto">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`px-4 py-1 rounded-full text-[11px] font-semibold transition-all ${
                active === f
                  ? "bg-[#0d5c52] text-white shadow-sm"
                  : "text-[#536360] hover:text-[#0d5c52]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {modules.map((m) => (
          <div
            key={m.title}
            className="flex items-center justify-between p-4 rounded-xl bg-[#edf7f4]/70 border border-[#cee8e1]/50 hover:bg-[#edf7f4] transition-colors group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-[#ffdad6]/70 text-[#ba1a1a] flex items-center justify-center flex-shrink-0">
                <FileText className="size-[26px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-[#071f1c] group-hover:text-[#0d5c52] transition-colors truncate">
                  {m.title}
                </span>
                <div className="flex items-center gap-2 text-[#536360] text-[12px]">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${m.chipClassName}`}
                  >
                    {m.chip}
                  </span>
                  <span>•</span>
                  <span>{m.size}</span>
                  <span>•</span>
                  <span>{m.updated}</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              className="flex-shrink-0 ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white hover:bg-[#0d5c52] hover:text-white text-[#0d5c52] text-[13px] font-semibold border border-[#cee8e1] transition-all duration-200 shadow-sm"
            >
              <Download className="size-[18px]" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}