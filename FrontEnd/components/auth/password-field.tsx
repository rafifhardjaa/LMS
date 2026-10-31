"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "cn";
import { PASSWORD_RULES, type PasswordAssessment } from "@/lib/auth/password";
import { TextField } from "./auth-field";

interface PasswordFieldProps {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  hint?: ReactNode;
  action?: ReactNode;
}

/** Password input with a self-contained visibility toggle. */
export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  hint,
  action,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      id={id}
      label={label}
      hint={hint}
      action={action}
      type={show ? "text" : "password"}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={(e) => onChange(e.target.value)}
      icon={<Lock className="size-3.5" />}
      inputClassName="tracking-widest placeholder:tracking-normal"
      suffix={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="text-slate-400 hover:text-slate-600 transition"
          aria-label={show ? `Sembunyikan ${label ?? "kata sandi"}` : `Tampilkan ${label ?? "kata sandi"}`}
        >
          {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </button>
      }
    />
  );
}

/** Four segmented bars reflecting the password score. */
export function StrengthMeter({ assessment }: { assessment: PasswordAssessment }) {
  return (
    <div className="-mt-1">
      <div className="flex items-center justify-between text-[10px] font-semibold">
        <span className="text-slate-500">Kekuatan Sandi:</span>
        <span className={assessment.level.text}>{assessment.level.label}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
        {PASSWORD_RULES.map((rule, i) => (
          <span
            key={rule.id}
            className={cn(
              "h-1.5 rounded-full transition-colors",
              i < assessment.score ? assessment.level.bar : "bg-slate-200"
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** Live per-rule checklist shown under the strength meter. */
export function RuleChecklist({ results }: { results: boolean[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl border border-slate-200/90 bg-slate-50/60 p-3">
      {PASSWORD_RULES.map((rule, i) => (
        <div key={rule.id} className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-3.5 shrink-0 items-center justify-center rounded-full border transition-colors",
              results[i] ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
            )}
          >
            {results[i] ? (
              <svg viewBox="0 0 24 24" fill="none" className="size-2.5 text-white">
                <path
                  d="m5 13 4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium transition-colors",
              results[i] ? "text-slate-700" : "text-slate-400"
            )}
          >
            {rule.label}
          </span>
        </div>
      ))}
    </div>
  );
}
