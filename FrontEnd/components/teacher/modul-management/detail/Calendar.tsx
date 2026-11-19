import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

export interface CalendarProps {
  /** Tanggal terpilih (mode controlled). */
  value?: Date | null;
  /** Tanggal awal (mode uncontrolled). */
  defaultValue?: Date | null;
  /** Dipanggil saat tanggal dipilih. */
  onChange?: (date: Date) => void;
  /** Tanggal paling awal yang boleh dipilih. */
  minDate?: Date;
  /** Tanggal paling akhir yang boleh dipilih. */
  maxDate?: Date;
  /** Tanggal yang diberi penanda titik (mis. ada acara). */
  markedDates?: Date[];
  /** Locale untuk nama bulan & hari. Default: "id-ID". */
  locale?: string;
  /** Hari pertama dalam seminggu: 0 = Minggu, 1 = Senin. Default: 1. */
  weekStartsOn?: 0 | 1;
  className?: string;
}

/* ---------- Helper tanggal ---------- */

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

export default function Calendar({
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  markedDates = [],
  locale = "id-ID",
  weekStartsOn = 1,
  className = "",
}: CalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<Date | null>(defaultValue);
  const selected = isControlled ? value : internal;

  const [focused, setFocused] = useState<Date>(startOfDay(selected ?? today));
  const [view, setView] = useState<Date>(addMonths(selected ?? today, 0));
  const shouldFocus = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const min = minDate && startOfDay(minDate);
  const max = maxDate && startOfDay(maxDate);
  const isDisabled = (d: Date) => (!!min && d < min) || (!!max && d > max);
  const marked = useMemo(() => new Set(markedDates.map(dayKey)), [markedDates]);

  /* Nama bulan & hari */
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(view);
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 3 Jan 2021 adalah hari Minggu
    return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2021, 0, 3 + weekStartsOn + i)));
  }, [locale, weekStartsOn]);
  const fullDateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    [locale]
  );

  /* 6 minggu x 7 hari agar tinggi kalender selalu sama */
  const weeks = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const offset = (first.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(first, -offset);
    return Array.from({ length: 6 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));
  }, [view, weekStartsOn]);

  /* Pindahkan fokus DOM setelah navigasi keyboard */
  useEffect(() => {
    if (!shouldFocus.current) return;
    shouldFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus();
  }, [focused, view]);

  const select = (d: Date) => {
    if (isDisabled(d)) return;
    if (!isControlled) setInternal(d);
    setFocused(d);
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) setView(addMonths(d, 0));
    onChange?.(d);
  };

  const moveFocus = (d: Date) => {
    let next = d;
    if (min && next < min) next = min;
    if (max && next > max) next = max;
    shouldFocus.current = true;
    setFocused(next);
    if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
      setView(addMonths(next, 0));
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const startOfWeek = addDays(focused, -((focused.getDay() - weekStartsOn + 7) % 7));
    const moves: Record<string, Date> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -7),
      ArrowDown: addDays(focused, 7),
      Home: startOfWeek,
      End: addDays(startOfWeek, 6),
      PageUp: new Date(focused.getFullYear(), focused.getMonth() - 1, focused.getDate()),
      PageDown: new Date(focused.getFullYear(), focused.getMonth() + 1, focused.getDate()),
    };
    if (moves[e.key]) {
      e.preventDefault();
      moveFocus(moves[e.key]);
    }
  };

  const goToday = () => {
    setView(addMonths(today, 0));
    setFocused(today);
    if (!isDisabled(today)) select(today);
  };

  const prevDisabled = !!min && addDays(view, -1) < min;
  const nextDisabled = !!max && addMonths(view, 1) > max;

  return (
    <div className={`cal ${className}`}>
      <style>{css}</style>

      <div className="cal-header">
        <h2 className="cal-title" aria-live="polite">
          {monthLabel}
        </h2>
        <div className="cal-nav">
          <button
            type="button"
            className="cal-icon-btn"
            aria-label="Bulan sebelumnya"
            disabled={prevDisabled}
            onClick={() => setView(addMonths(view, -1))}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="cal-icon-btn"
            aria-label="Bulan berikutnya"
            disabled={nextDisabled}
            onClick={() => setView(addMonths(view, 1))}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div role="grid" aria-label={monthLabel} ref={gridRef} onKeyDown={onKeyDown}>
        <div role="row" className="cal-row cal-weekdays">
          {weekdays.map((w) => (
            <div key={w} role="columnheader" className="cal-weekday">
              {w}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div role="row" className="cal-row" key={wi}>
            {week.map((d) => {
              const outside = d.getMonth() !== view.getMonth();
              const isSel = !!selected && isSameDay(d, selected);
              const isToday = isSameDay(d, today);
              const isFocus = isSameDay(d, focused);
              const cls = [
                "cal-day",
                outside && "is-outside",
                isSel && "is-selected",
                isToday && "is-today",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <div role="gridcell" key={dayKey(d)} aria-selected={isSel}>
                  <button
                    type="button"
                    className={cls}
                    tabIndex={isFocus ? 0 : -1}
                    disabled={isDisabled(d)}
                    aria-label={fullDateFmt.format(d)}
                    aria-current={isToday ? "date" : undefined}
                    onClick={() => select(d)}
                  >
                    {d.getDate()}
                    {marked.has(dayKey(d)) && <span className="cal-dot" aria-hidden="true" />}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="cal-footer">
        <button type="button" className="cal-today-btn" onClick={goToday}>
          Hari ini
        </button>
      </div>
    </div>
  );
}

/* ---------- Gaya (self-contained, tanpa dependensi) ---------- */

const css = `
.cal {
  --cal-bg: #f8fafc;
  --cal-ink: #1e293b;
  --cal-muted: #94a3b8;
  --cal-line: #e2e8f0;
  --cal-hover: #eef2f8;
  --cal-accent: #b71422;
  --cal-accent-ink: #ffffff;
  width: 100%;
  max-width: 340px;
  padding: 16px;
  background: var(--cal-bg);
  color: var(--cal-ink);
  border: 1px solid var(--cal-line);
  border-radius: 14px;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  box-sizing: border-box;
}
.cal *, .cal *::before, .cal *::after { box-sizing: border-box; }
.cal button { font: inherit; color: inherit; cursor: pointer; }
.cal button:disabled { cursor: not-allowed; }

.cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.cal-title { margin: 0; font-size: 1.05rem; font-weight: 650; text-transform: capitalize; letter-spacing: -0.01em; }
.cal-nav { display: flex; gap: 4px; }

.cal-icon-btn {
  display: grid; place-items: center; width: 32px; height: 32px;
  border: 0; border-radius: 8px; background: transparent;
}
.cal-icon-btn:hover:not(:disabled) { background: var(--cal-hover); }
.cal-icon-btn:disabled { opacity: 0.35; }

.cal-row { display: grid; grid-template-columns: repeat(7, 1fr); }
.cal-row > [role="gridcell"] { display: flex; justify-content: center; padding: 2px 0; }
.cal-weekday { padding: 6px 0 8px; text-align: center; font-size: 0.78rem; color: var(--cal-muted); font-weight: 500; }

.cal-day {
  position: relative; display: grid; place-items: center;
  width: 38px; height: 38px; border: 0; border-radius: 10px;
  background: transparent; font-size: 0.92rem; font-variant-numeric: tabular-nums;
}
.cal-day:hover:not(:disabled):not(.is-selected) { background: var(--cal-hover); }
.cal-day.is-outside { color: var(--cal-muted); opacity: 0.55; }
.cal-day:disabled { opacity: 0.25; text-decoration: line-through; }
.cal-day.is-today:not(.is-selected) { box-shadow: inset 0 0 0 1.5px var(--cal-accent); font-weight: 650; }
.cal-day.is-selected { background: var(--cal-accent); color: var(--cal-accent-ink); font-weight: 650; opacity: 1; }
.cal-dot {
  position: absolute; bottom: 4px; left: 50%; width: 4px; height: 4px;
  margin-left: -2px; border-radius: 50%; background: var(--cal-accent);
}
.cal-day.is-selected .cal-dot { background: var(--cal-accent-ink); }

.cal-footer { display: flex; justify-content: flex-end; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--cal-line); }
.cal-today-btn { padding: 6px 12px; border: 0; border-radius: 8px; background: transparent; color: var(--cal-accent); font-weight: 600; font-size: 0.88rem; }
.cal-today-btn:hover { background: var(--cal-hover); }

.cal button:focus-visible { outline: 2px solid var(--cal-accent); outline-offset: 2px; }
@media (prefers-reduced-motion: no-preference) {
  .cal-day, .cal-icon-btn, .cal-today-btn { transition: background-color 120ms ease; }
}
`;
