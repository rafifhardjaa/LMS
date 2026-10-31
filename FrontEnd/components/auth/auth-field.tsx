"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "cn";
import { Label } from "@/components/ui/label";

const FIELD_INPUT_CLASS =
  "w-full bg-slate-50 border border-slate-200/90 rounded-xl py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition disabled:opacity-60";

interface FieldFrameProps {
  id: string;
  label?: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}

function FieldFrame({ id, label, hint, action, children }: FieldFrameProps) {
  if (!label && !hint && !action) return <>{children}</>;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        {label ? (
          <Label htmlFor={id} className="text-xs font-semibold text-slate-700">
            {label}
          </Label>
        ) : (
          <span />
        )}
        {action ?? (hint ? <span className="text-[10px] font-medium text-slate-400">{hint}</span> : null)}
      </div>
      {children}
    </div>
  );
}

/* ── Text input ─────────────────────────────────────────────────────────── */

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  id: string;
  label?: string;
  icon?: ReactNode;
  hint?: ReactNode;
  action?: ReactNode;
  suffix?: ReactNode;
  inputClassName?: string;
}

export function TextField({
  id,
  label,
  icon,
  hint,
  action,
  suffix,
  inputClassName,
  ...props
}: TextFieldProps) {
  return (
    <FieldFrame id={id} label={label} hint={hint} action={action}>
      <div className="relative flex items-center">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 text-slate-400">{icon}</span>
        ) : null}
        <input
          id={id}
          {...props}
          className={cn(
            FIELD_INPUT_CLASS,
            icon ? "pl-9" : "pl-4",
            suffix ? "pr-10" : "pr-4",
            inputClassName
          )}
        />
        {suffix ? <span className="absolute right-3.5">{suffix}</span> : null}
      </div>
    </FieldFrame>
  );
}

