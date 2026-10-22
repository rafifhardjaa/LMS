"use client";

import { useState } from "react";
import { Activity, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { distributionTiers } from "./data";

type DistributionView = "histogram" | "curve";

export function DistributionPanel() {
  const [view, setView] = useState<DistributionView>("histogram");

  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFEBEB] text-[#b71422]">
            <BarChart3 className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#1E293B]">
              Distribusi Capaian &amp; Sebaran Nilai
            </h2>
            <p className="mt-0.5 text-[11px] leading-4 text-[#64748B]">
              Formatif, STS, dan unjuk kerja praktikum laboratorium.
            </p>
          </div>
        </div>

        <div className="inline-flex self-start rounded-lg bg-[#F1F5F9] p-1">
          <button
            type="button"
            onClick={() => setView("histogram")}
            className={cn(
              "rounded-md px-3 py-1.5 text-[11px] font-semibold transition",
              view === "histogram"
                ? "bg-white text-[#1E293B] shadow-sm"
                : "text-[#64748B] hover:text-[#334155]",
            )}
          >
            Histogram
          </button>
          <button
            type="button"
            onClick={() => setView("curve")}
            className={cn(
              "rounded-md px-3 py-1.5 text-[11px] font-semibold transition",
              view === "curve"
                ? "bg-white text-[#1E293B] shadow-sm"
                : "text-[#64748B] hover:text-[#334155]",
            )}
          >
            Kurva Normal
          </button>
        </div>
      </div>

      {view === "histogram" ? (
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {distributionTiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col rounded-xl border border-[#E2E8F0] p-3",
                tier.cardClassName,
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="min-w-0 text-[10px] font-semibold leading-4 text-[#334155]">
                  {tier.label}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-[9px] font-bold",
                    tier.labelClassName,
                  )}
                >
                  {tier.predicate}
                </span>
              </div>

              <div className="mt-2 flex h-24 items-end rounded-lg bg-[#E2E8F0]/45 px-1.5">
                <div
                  className={cn(
                    "relative w-full rounded-t-md transition-all duration-500",
                    tier.barClassName,
                  )}
                  style={{ height: `${tier.height}%` }}
                >
                  <span
                    className={cn(
                      "absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold",
                      tier.labelClassName,
                    )}
                  >
                    {tier.share}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-xl font-bold leading-none tracking-[-0.04em] text-[#1E293B]">
                  {tier.students}
                </span>
                <span className="text-[10px] font-medium text-[#94A3B8]">
                  siswa
                </span>
              </div>
              <p className="mt-1 text-[9px] font-medium text-[#94A3B8]">
                {tier.range}
              </p>
              <p
                className={cn(
                  "mt-1.5 text-[9px] font-semibold",
                  tier.statusClassName,
                )}
              >
                {tier.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#334155]">
            <Activity className="size-3.5 text-[#006398]" />
            Kurva sebaran nilai rombel
          </div>
          <svg
            viewBox="0 0 640 240"
            role="img"
            aria-label="Kurva normal sebaran nilai dengan rata-rata 86,8 dan batas KKTP 75"
            className="mt-2 h-[220px] w-full"
          >
            <defs>
              <linearGradient
                id="analytics-normal-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#5bb8fe" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#006398" stopOpacity="0.08" />
              </linearGradient>
              <clipPath id="analytics-below-kktp">
                <rect x="0" y="0" width="250" height="240" />
              </clipPath>
            </defs>

            <line
              x1="40"
              y1="205"
              x2="600"
              y2="205"
              stroke="#CBD5E1"
              strokeWidth="1"
            />

            <path
              d="M 40 205 C 180 205 250 42 410 42 C 565 42 540 205 600 205"
              fill="url(#analytics-normal-gradient)"
            />
            <path
              d="M 40 205 C 180 205 250 42 410 42 C 565 42 540 205 600 205"
              fill="#FCA5A5"
              fillOpacity="0.38"
              clipPath="url(#analytics-below-kktp)"
            />
            <path
              d="M 40 205 C 180 205 250 42 410 42 C 565 42 540 205 600 205"
              fill="none"
              stroke="#006398"
              strokeWidth="2.5"
            />

            <line
              x1="250"
              y1="28"
              x2="250"
              y2="205"
              stroke="#b71422"
              strokeWidth="1.5"
              strokeDasharray="5 4"
            />
            <text
              x="250"
              y="20"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#b71422"
            >
              KKTP 75.0
            </text>
            <text
              x="410"
              y="32"
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="#006398"
            >
              μ 86.8
            </text>

            {[
              { x: 40, label: "60" },
              { x: 250, label: "75" },
              { x: 460, label: "90" },
              { x: 600, label: "100" },
            ].map((tick) => (
              <g key={tick.label}>
                <line
                  x1={tick.x}
                  y1="205"
                  x2={tick.x}
                  y2="210"
                  stroke="#94A3B8"
                  strokeWidth="1"
                />
                <text
                  x={tick.x}
                  y="224"
                  textAnchor="middle"
                  fontSize="8.5"
                  fill="#64748B"
                >
                  {tick.label}
                </text>
              </g>
            ))}
          </svg>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-medium text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#006398]" />
              Sebaran capaian
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#FCA5A5]" />
              Wilayah di bawah KKTP
            </span>
            <span className="ml-auto text-[#94A3B8]">
              Mean 86.8 • σ 8.4
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3">
        <p className="text-[10px] font-medium text-[#94A3B8]">
          Ambang batas ketuntasan:{" "}
          <span className="font-bold text-[#b71422]">KKTP 75.0</span>
          <span className="mx-1.5 text-[#CBD5E1]">•</span>
          σ = 8.4
        </p>
        <span className="rounded-full bg-[#F1F5F9] px-2 py-1 text-[9px] font-semibold text-[#64748B]">
          35 siswa terdaftar
        </span>
      </div>
    </section>
  );
}
