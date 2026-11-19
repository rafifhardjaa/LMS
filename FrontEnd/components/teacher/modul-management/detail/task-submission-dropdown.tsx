"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Info,
  MoreVertical,
  PencilLine,
  PlusCircle,
  Trash2,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import Calendar from "./Calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type TaskKind = "tugas" | "kuis";

export type TaskDraft = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  deadline: string;
  startTime?: string;
  deadlineTime?: string;
};

type TaskSubmissionDropdownProps = {
  kind: TaskKind;
  label: string;
  tasks: TaskDraft[];
  onTasksChange: (tasks: TaskDraft[]) => void;
  submissionCount: number;
  totalStudents: number;
};

const KIND_STYLES: Record<
  TaskKind,
  { icon: typeof ClipboardList; iconBox: string; selected: string; accent: string }
> = {
  tugas: {
    icon: ClipboardList,
    iconBox: "bg-[#EDF6FF] text-[#006398]",
    selected: "border-[#006398]/40 bg-[#F5FAFF]",
    accent: "bg-[#006398]",
  },
  kuis: {
    icon: ClipboardCheck,
    iconBox: "bg-[#EDFFF6] text-[#7A941F]",
    selected: "border-[#7A941F]/40 bg-[#F6FBF0]",
    accent: "bg-[#7A941F]",
  },
};

function formatDate(date: string): string {
  return moment(date, ["YYYY-MM-DD", "YYYY-MM-DDTHH:mm"])
    .locale("id")
    .format("D MMM YYYY");
}

function formatDateTime(date: string, time?: string): string {
  if (!date) return "-";
  const base = formatDate(date);
  return time ? `${base} · ${time}` : base;
}

function dateToValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function valueToDate(value: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function deadlineTone(deadline: string, deadlineTime?: string): {
  label: string;
  className: string;
} {
  const now = moment();
  const due = moment(
    `${deadline} ${deadlineTime || "23:59"}`,
    ["YYYY-MM-DD HH:mm", "YYYY-MM-DD"],
  );

  if (due.isBefore(now)) {
    return { label: "Lewat", className: "bg-[#FFEBEB] text-[#b71422]" };
  }
  if (due.diff(now, "hours") <= 48) {
    return { label: "Mepet", className: "bg-[#FEF3C7] text-[#D97706]" };
  }
  return { label: "Aman", className: "bg-[#EDFFF6] text-[#7A941F]" };
}

type ModalMode = "add" | "edit" | "delete" | null;

const EMPTY_FORM = {
  title: "",
  description: "",
  startDate: "",
  startTime: "",
  deadline: "",
  deadlineTime: "",
};

export function TaskSubmissionDropdown({
  kind,
  label,
  tasks,
  onTasksChange,
  submissionCount,
  totalStudents,
}: TaskSubmissionDropdownProps) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [openDate, setOpenDate] = useState<"startDate" | "deadline" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const datePopoverRef = useRef<HTMLDivElement>(null);

  const style = KIND_STYLES[kind];
  const Icon = style.icon;

  const selectedTask =
    tasks.find((task) => task.id === selectedTaskId) ?? tasks[0] ?? null;

  const submitted = Math.min(submissionCount, totalStudents);
  const notSubmitted = Math.max(totalStudents - submitted, 0);
  const percent = totalStudents > 0 ? Math.round((submitted / totalStudents) * 100) : 0;

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (!openDate) return;

    const handleOutside = (event: MouseEvent) => {
      if (
        datePopoverRef.current &&
        !datePopoverRef.current.contains(event.target as Node)
      ) {
        setOpenDate(null);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [openDate]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setModalMode("add");
    setMenuOpen(false);
  }

  function openEdit() {
    if (!selectedTask) return;
    setForm({
      title: selectedTask.title,
      description: selectedTask.description,
      startDate: selectedTask.startDate,
      startTime: selectedTask.startTime ?? "",
      deadline: selectedTask.deadline,
      deadlineTime: selectedTask.deadlineTime ?? "",
    });
    setModalMode("edit");
    setMenuOpen(false);
  }

  function handleDateSelect(field: "startDate" | "deadline", date: Date) {
    setForm((current) => ({ ...current, [field]: dateToValue(date) }));
    setOpenDate(null);
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim() || !form.deadline || !form.deadlineTime) {
      toast.error("Judul, deadline, dan jam deadline wajib diisi");
      return;
    }

    if (form.startTime && !isValidTime(form.startTime)) {
      toast.error("Jam mulai tidak valid");
      return;
    }

    if (!isValidTime(form.deadlineTime)) {
      toast.error("Jam deadline tidak valid");
      return;
    }

    if (modalMode === "edit" && selectedTask) {
      onTasksChange(
        tasks.map((task) =>
          task.id === selectedTask.id ? { ...task, ...form } : task,
        ),
      );
      toast.success("Tugas berhasil diperbarui");
    } else {
      onTasksChange([
        ...tasks,
        { id: crypto.randomUUID(), ...form },
      ]);
      toast.success("Tugas berhasil ditambahkan");
    }

    setModalMode(null);
    setForm(EMPTY_FORM);
  }

  function handleDelete() {
    if (!selectedTask) return;

    onTasksChange(tasks.filter((task) => task.id !== selectedTask.id));
    setSelectedTaskId(null);
    setModalMode(null);
    toast.success("Tugas berhasil dihapus");
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
        className={`flex h-11 w-full items-center gap-2.5 rounded-xl border px-3 text-left transition-colors ${
          expanded
            ? "border-[#b71422]/30 bg-[#F8FAFC]"
            : "border-[#E2E8F0] bg-white hover:border-[#b71422]/25 hover:bg-[#F8FAFC]"
        }`}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${style.iconBox}`}
        >
          <Icon className="size-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1E293B]">
          {label}
        </span>
        <span className="shrink-0 rounded-full bg-[#F1F5F9] px-2.5 py-1 text-[11px] font-bold text-[#475569]">
          {submissionCount} siswa
        </span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex size-5 shrink-0 items-center justify-center"
        >
          <ChevronDown className="size-4 text-[#94A3B8]" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 gap-2.5 pt-2.5 md:grid-cols-3">
              <div className="relative rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <div ref={menuRef} className="absolute right-3 top-3">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((current) => !current)}
                    aria-label="Opsi tugas"
                    aria-expanded={menuOpen}
                    className="flex size-8 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569]"
                  >
                    <MoreVertical className="size-4" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-[0_12px_24px_-4px_rgba(30,41,59,0.15)]">
                      <button
                        type="button"
                        onClick={openAdd}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#1E293B] transition hover:bg-[#F8FAFC]"
                      >
                        <PlusCircle className="size-4 text-[#006398]" />
                        Tambah
                      </button>
                      <button
                        type="button"
                        onClick={openEdit}
                        disabled={!selectedTask}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#1E293B] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <PencilLine className="size-4 text-[#D97706]" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModalMode("delete");
                          setMenuOpen(false);
                        }}
                        disabled={!selectedTask}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-[#b71422] transition hover:bg-[#FFEBEB] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="size-4" />
                        Hapus
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {kind === "tugas" ? "Manage Tugas" : "Manage Kuis"}
                </p>
                <div className="mt-3 flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
                  <Info className="size-10 text-[#006398]" />
                  <p className="max-w-[220px] text-[12px] leading-5 text-[#475569]">
                    Buat {kind} untuk siswa · Klik titik tiga di pojok kanan
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  {kind === "tugas" ? "Tugas Dibuat" : "Kuis Dibuat"}
                </p>

                {tasks.length === 0 ? (
                  <div className="mt-3 flex min-h-[120px] flex-col items-center justify-center gap-2 text-center">
                    <Info className="size-10 text-[#006398]" />
                    <p className="max-w-[220px] text-[12px] leading-5 text-[#475569]">
                      Belum ada {kind} dibuat · Tambah lewat menu titik tiga
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 flex h-[216px] flex-col gap-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {tasks.map((task) => {
                      const selected = selectedTask?.id === task.id;
                      const tone = task.deadline
                        ? deadlineTone(task.deadline, task.deadlineTime)
                        : null;
                      return (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => setSelectedTaskId(task.id)}
                          className={`min-h-[104px] rounded-xl border p-3 text-left transition ${
                            selected
                              ? style.selected
                              : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                          }`}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-[12px] font-bold text-[#1E293B]">
                              {task.title}
                            </span>
                            {tone && (
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${tone.className}`}
                              >
                                {tone.label}
                              </span>
                            )}
                          </span>
                          {task.description && (
                            <span className="mt-1 line-clamp-2 block text-[11px] leading-5 text-[#64748B]">
                              {task.description}
                            </span>
                          )}
                          <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-[#64748B]">
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3 text-[#006398]" />
                              {formatDateTime(task.startDate, task.startTime)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock3 className="size-3 text-[#D97706]" />
                              {formatDateTime(task.deadline, task.deadlineTime)}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                  Nilai {kind === "tugas" ? "Tugas" : "Kuis"}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-[#EDFFF6] p-3">
                    <p className="text-[18px] font-extrabold text-[#5B8C1F]">
                      {submitted}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5B8C1F]">
                      Mengumpulkan
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FFEBEB] p-3">
                    <p className="text-[18px] font-extrabold text-[#b71422]">
                      {notSubmitted}
                    </p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#b71422]">
                      Belum
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
                    <span>Progres</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#F1F5F9]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`h-full rounded-full ${style.accent}`}
                    />
                  </div>
                </div>

                <Link
                  href="/teacher/tugas-materi"
                  className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-[#DCE5EE] bg-[#F8FAFC] text-[12px] font-bold text-[#475569] transition hover:border-[#b71422]/30 hover:text-[#b71422]"
                >
                  Periksa Jawaban
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={modalMode !== null}
        onOpenChange={(next) => {
          if (!next) setModalMode(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-lg rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.35)] ring-black/5 data-open:animate-none data-closed:animate-none"
        >
          {modalMode === "delete" ? (
            <div className="flex flex-col gap-4 p-5">
              <div>
                <DialogTitle className="text-[15px] font-bold text-[#1E293B]">
                  Hapus {kind}?
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-6 text-[#475569]">
                  {selectedTask?.title ?? ""} akan dihapus dari daftar {kind}.
                </DialogDescription>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose
                  render={<button type="button" className="inline-flex h-9 items-center justify-center rounded-xl border border-[#DCE5EE] bg-white px-4 text-[12px] font-bold text-[#475569] transition hover:bg-[#F8FAFC]" />}
                >
                  Batal
                </DialogClose>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#b71422] px-4 text-[12px] font-bold text-white transition hover:bg-[#8f0f1a]"
                >
                  <Trash2 className="size-4" />
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col gap-4 p-5">
              <div>
                <DialogTitle className="text-[15px] font-bold text-[#1E293B]">
                  {modalMode === "edit" ? "Edit" : "Tambah"} {kind}
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-6 text-[#475569]">
                  Data ini disimpan di frontend untuk sementara.
                </DialogDescription>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                  Judul
                </span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder={`Judul ${kind}`}
                  className="h-9 w-full rounded-xl border border-[#DCE5EE] bg-white px-3 text-[13px] text-[#1E293B] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                  Deskripsi
                </span>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Deskripsi singkat"
                  className="w-full rounded-xl border border-[#DCE5EE] bg-white px-3 py-2 text-[13px] text-[#1E293B] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                />
              </label>

              <div
                ref={datePopoverRef}
                className="relative grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                    Tanggal Mulai
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDate((current) =>
                        current === "startDate" ? null : "startDate",
                      )
                    }
                    className="h-9 w-full rounded-xl border border-[#DCE5EE] bg-white px-3 text-left text-[13px] text-[#1E293B] transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                  >
                    {form.startDate ? (
                      formatDate(form.startDate)
                    ) : (
                      <span className="text-[#94A3B8]">Pilih tanggal</span>
                    )}
                  </button>
                  {openDate === "startDate" && (
                    <div className="absolute left-0 top-10 z-30">
                      <Calendar
                        value={valueToDate(form.startDate)}
                        onChange={(date) => handleDateSelect("startDate", date)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                    Deadline
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDate((current) =>
                        current === "deadline" ? null : "deadline",
                      )
                    }
                    className="h-9 w-full rounded-xl border border-[#DCE5EE] bg-white px-3 text-left text-[13px] text-[#1E293B] transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                  >
                    {form.deadline ? (
                      formatDate(form.deadline)
                    ) : (
                      <span className="text-[#94A3B8]">Pilih tanggal</span>
                    )}
                  </button>
                  {openDate === "deadline" && (
                    <div className="absolute left-0 top-10 z-30">
                      <Calendar
                        value={valueToDate(form.deadline)}
                        onChange={(date) => handleDateSelect("deadline", date)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                    Jam Mulai
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="--:--"
                    value={form.startTime}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        startTime: formatTimeInput(event.target.value),
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCE5EE] bg-white px-3 text-[13px] text-[#1E293B] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#94A3B8]">
                    Jam Deadline
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="--:--"
                    value={form.deadlineTime}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        deadlineTime: formatTimeInput(event.target.value),
                      }))
                    }
                    className="h-9 w-full rounded-xl border border-[#DCE5EE] bg-white px-3 text-[13px] text-[#1E293B] outline-none transition focus:border-[#b71422] focus:ring-2 focus:ring-[#b71422]/20"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <DialogClose
                  render={<button type="button" className="inline-flex h-9 items-center justify-center rounded-xl border border-[#DCE5EE] bg-white px-4 text-[12px] font-bold text-[#475569] transition hover:bg-[#F8FAFC]" />}
                >
                  Batal
                </DialogClose>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#b71422] px-4 text-[12px] font-bold text-white transition hover:bg-[#8f0f1a]"
                >
                  Simpan
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
