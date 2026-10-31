/**
 * Password policy shared by the authentication screens (reset + register).
 * Single source of truth so the meter, the checklist and the submit
 * guard can never drift apart.
 */

export interface PasswordRule {
  id: string;
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "Min. 8 Karakter", test: (v) => v.length >= 8 },
  { id: "case", label: "Huruf Besar & Kecil", test: (v) => /[A-Z]/.test(v) && /[a-z]/.test(v) },
  { id: "digit", label: "Mengandung Angka", test: (v) => /\d/.test(v) },
  { id: "symbol", label: "Simbol Khusus (!@#$)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const STRENGTH_LEVELS = [
  { label: "Belum Diisi", bar: "bg-slate-200", text: "text-slate-400" },
  { label: "Lemah", bar: "bg-rose-500", text: "text-rose-600" },
  { label: "Cukup", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Kuat", bar: "bg-indigo-600", text: "text-indigo-600" },
  { label: "Sangat Kuat", bar: "bg-emerald-500", text: "text-emerald-600" },
] as const;

export type StrengthLevel = (typeof STRENGTH_LEVELS)[number];

export interface PasswordAssessment {
  score: number;
  level: StrengthLevel;
  ruleResults: boolean[];
  isStrong: boolean;
}

export function assessPassword(value: string): PasswordAssessment {
  const ruleResults = PASSWORD_RULES.map((rule) => rule.test(value));
  const score = ruleResults.filter(Boolean).length;
  const level = STRENGTH_LEVELS[value.length === 0 ? 0 : Math.max(score, 1)];
  return { score, level, ruleResults, isStrong: score === PASSWORD_RULES.length };
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
