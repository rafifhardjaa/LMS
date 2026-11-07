"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type JurusanOption = { value: string; label: string };

const JURUSAN_OPTIONS: JurusanOption[] = [
  { value: "TJKT & PPLG", label: "TJKT & PPLG" },
  { value: "DKV & Multimedia", label: "DKV & Multimedia" },
  { value: "AKL (Akuntansi)", label: "AKL (Akuntansi)" },
  { value: "TKR (Teknik Otomotif)", label: "TKR (Teknik Otomotif)" },
  { value: "Bisnis Digital", label: "Bisnis Digital" },
  { value: "Perhotelan", label: "Perhotelan" },
  { value: "Kuliner / Tata Boga", label: "Kuliner / Tata Boga" },
];

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: JurusanOption[];
  label?: string;
  disabled?: boolean;
}

export function SearchableDropdown({
  value,
  onChange,
  options = JURUSAN_OPTIONS,
  label = "Jurusan",
  disabled = false,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) ?? { value: "", label };
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const closeOnClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => document.removeEventListener("mousedown", closeOnClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => searchRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [open]);

  const toggle = (forced?: boolean) => {
    const next = forced ?? !open;
    if (!next) setQuery("");
    setOpen(next);
  };

  return (
    <div ref={containerRef} className={`relative w-full font-sans text-slate-800 ${open ? "z-50" : ""}`}>
      <span className="sr-only">{label}</span>
      <button
        type="button"
        id="dropdownTrigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => { if (!disabled) toggle(); }}
        disabled={disabled}
        className={`flex h-11 w-full items-center justify-between rounded-full bg-[#f1f4f9] px-4 text-left text-sm text-[#181c20] transition-all focus:outline-none focus:ring-2 focus:ring-[#6c5dd3]/30 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
          open ? "shadow-[0_2px_10px_-2px_rgba(32,44,90,0.12)]" : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="truncate font-semibold text-slate-800">{selected?.label}</span>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 z-50 mt-2 space-y-2 rounded-2xl border border-[#eef0f5] bg-white p-2.5 shadow-[0_18px_40px_-12px_rgba(32,44,90,0.2),0_4px_12px_-4px_rgba(32,44,90,0.08)]">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="size-4" />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari jurusan atau keahlian..."
              autoComplete="off"
              className="w-full rounded-xl bg-slate-50 py-2 pl-9 pr-3.5 text-xs text-slate-800 transition-all placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <ul role="listbox" className="max-h-56 space-y-1 overflow-y-auto pr-1 text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filtered.map((option) => {
              const active = option.value === value;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={active}
                  data-value={option.value}
                  onClick={() => {
                    onChange(option.value);
                    toggle(false);
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                    active
                      ? "bg-[#6C5DD3]/10 font-semibold text-[#6C5DD3]"
                      : "font-medium text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`size-2 rounded-full ${active ? "bg-[#6C5DD3]" : "bg-slate-300"}`} />
                    <span className="truncate">{option.label}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {active && <Check className="size-4 text-[#6C5DD3]" />}
                  </div>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-slate-500">Jurusan tidak ditemukan.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}