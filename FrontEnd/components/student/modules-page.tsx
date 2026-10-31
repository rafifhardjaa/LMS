"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueries, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { modulesApi, progressApi } from "@/lib/api/client";
import {
  ArrowDownUp,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Download,
  Home,
  LayoutGrid,
  Library,
  List,
  PlayCircle,
  Search,
  SearchX,
  Users,
} from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem, CountUp } from "@/components/ui/animations";
import {
  buildSubjectTabs,
  progressDisplay,
  toModuleCard,
  type ModuleCard,
  type ModuleProgress,
} from "@/components/student/module-catalog";

type StatusFilter = "all" | "in_progress" | "completed" | "new";

const inter = { fontFamily: "var(--font-inter), system-ui, sans-serif" } as const;
const jakarta = { fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" } as const;

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "in_progress", label: "Sedang Berjalan" },
  { value: "completed", label: "Selesai Dipelajari" },
  { value: "new", label: "Modul Baru (New)" },
];

const classOptions = [
  "Kelas XII MIPA 1 / Kejuruan",
  "Kelas XII MIPA 2 / Kejuruan",
  "Kelas XI Industri & Rekayasa",
  "Materi Ekstrakurikuler Khusus",
];

export function StudentModules() {
  const router = useRouter();
  const [subject, setSubject] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const modulesQuery = useQuery({
    queryKey: ["modules"],
    queryFn: async () => {
      const result = await modulesApi.list();
      if (result.error) {
        throw new Error(
          result.error.message || result.error.error || "Gagal memuat daftar modul."
        );
      }
      if (!result.data) {
        throw new Error("Respons daftar modul tidak valid.");
      }
      return result.data.data;
    },
    staleTime: 30_000,
  });
  const backendModules = modulesQuery.data ?? [];
  const progressQueries = useQueries({
    queries: backendModules.map((module) => ({
      queryKey: ["progress", "module", module.id],
      queryFn: async () => {
        const result = await progressApi.byModule(module.id);
        if (result.error) {
          const error = new Error(
            result.error.message || result.error.error || "Gagal memuat progress modul."
          ) as Error & { status?: number };
          error.status = result.status;
          throw error;
        }
        return result.data?.data.percentage ?? 0;
      },
      staleTime: 30_000,
      retry: 0,
    })),
  });
  const progressByModule = new Map<string, ModuleProgress>(
    backendModules.map((module, index) => {
      const query = progressQueries[index];
      return [
        module.id,
        {
          percentage: query?.isError ? null : (query?.data ?? null),
          loading: query?.isLoading ?? false,
          errorStatus:
            query?.isError && query.error instanceof Error
              ? (query.error as Error & { status?: number }).status
              : undefined,
        },
      ];
    })
  );
  const subjectTabs = buildSubjectTabs(backendModules);
  const displayModules = backendModules.map((module) =>
    toModuleCard(
      module,
      progressByModule.get(module.id) ?? { percentage: null, loading: false }
    )
  );
  const totalModules = displayModules.length;
  const completedModules = displayModules.filter(
    (module) => module.status === "completed"
  ).length;
  const inProgressModules = displayModules.filter(
    (module) => module.status === "in_progress"
  ).length;
  const completionPercent =
    totalModules === 0
      ? 0
      : Math.floor((completedModules / totalModules) * 100);

  function openModule(module: ModuleCard) {
    router.push(`/student/modules/${module.id}`);
  }

  const filteredModules = displayModules.filter((module) => {
    const q = query.trim().toLowerCase();
    const matchesSubject = subject === "all" || module.subjectId === subject;
    const matchesStatus = status === "all" || module.status === status;
    const haystack = [
      module.title,
      module.desc,
      module.kicker,
      module.subjectLabel,
      ...module.info.map((item) => item.text),
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = q === "" || haystack.includes(q);
    return matchesSubject && matchesStatus && matchesQuery;
  });
  const visibleModules = [...filteredModules].sort((a, b) => {
    const diff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
    return sort === "newest" ? -diff : diff;
  });

  return (
    <FadeIn className="w-full">
      <div className="flex w-full flex-col gap-6" style={inter}>
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex max-w-3xl flex-col gap-1">
            <nav className="flex items-center gap-1 text-[13px] font-semibold leading-[18px] text-[#3f4946]">
              <a
                href="/student/dashboard"
                className="flex items-center gap-1 transition-colors hover:text-[#0d5c52]"
              >
                <Home className="size-4" />
                Dashboard
              </a>
              <span className="text-[#bec9c5]">/</span>
              <span className="text-[#0d5c52]">Modules &amp; Learning Materials</span>
            </nav>
            <h1
              className="mt-1 flex flex-wrap items-center gap-2 text-[26px] font-bold leading-[34px] tracking-tight text-[#071f1c]"
              style={jakarta}
            >
              Katalog Modul &amp; Materi Pembelajaran
              <span className="rounded-full bg-[#cee8e1] px-2.5 py-0.5 text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#0d5c52]">
                Semester Ganjil 2025/2026
              </span>
            </h1>
            <p className="mt-1 text-[14px] leading-5 text-[#3f4946]">
              Akses seluruh modul ajar Kurikulum Merdeka, silabus terstruktur, rekaman video
              praktikum, dan materi pengayaan berbasis kejuruan &amp; sains SMK Mataram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[210px]">
              <Users className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#3f4946]" />
              <select
                aria-label="Pilih kelas"
                defaultValue={classOptions[0]}
                className="h-11 w-full cursor-pointer appearance-none rounded-lg bg-white pl-10 pr-8 text-[13px] font-semibold leading-[18px] text-[#071f1c] shadow-sm transition-colors hover:bg-[#edf7f4] focus:outline-none focus:ring-2 focus:ring-[#0d5c52]/20"
              >
                {classOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#3f4946]" />
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                alert("Arsip silabus (.zip) sedang disiapkan. Fitur unduh aktif setelah integrasi backend.")
              }
              className="flex h-11 items-center gap-1 rounded-lg bg-[#0d5c52] px-4 text-[14px] font-semibold leading-5 text-white shadow-md transition-colors duration-200 hover:bg-[#004d40]"
            >
              <Download className="size-[19px]" />
              Unduh Semua Silabus (.zip)
            </motion.button>
          </div>
        </div>

        {/* Metric Cards */}
        <StaggerChildren staggerDelay={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Total Modul Tersedia
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d4eee7] text-[#0d5c52]">
                  <BookOpen className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={totalModules} duration={1.2} />
                  </span>
                  <span className="text-[13px] font-semibold leading-[18px] text-[#0d5c52]">
                    Modul Aktif
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[12px] leading-[18px] text-[#3f4946]">
                  <span className="size-2 rounded-full bg-[#0d5c52]" />
                  <span>{Math.max(subjectTabs.length - 1, 0)} Mata Pelajaran</span>
                  <span className="text-[#bec9c5]">•</span>
                  <span className="size-2 rounded-full bg-[#00796b]" />
                  <span>Data Backend</span>
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Telah Dipelajari
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#004d40]">
                  <CheckCircle2 className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={completedModules} duration={1.2} />{" "}
                    <span className="text-[15px] font-normal leading-[22px] text-[#3f4946]">
                      / {totalModules}
                    </span>
                  </span>
                  <span className="rounded-full bg-[#a6f2cf] px-2 py-0.5 text-[11px] font-bold leading-[14px] text-[#002115]">
                    {completionPercent}% Tuntas
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#cee8e1]">
                  <motion.div
                    className="h-full rounded-full bg-[#0d5c52]"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${completionPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Sedang Berjalan
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#d4eee7] text-[#0d5c52]">
                  <PlayCircle className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={inProgressModules} duration={1.2} />
                  </span>
                  <span className="text-[13px] leading-[18px] text-[#3f4946]">Modul</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[12px] leading-[18px] text-[#3f4946]">
                  <PlayCircle className="size-[15px] text-[#0d5c52]" />
                  Modul dengan progress di atas 0%
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-xl bg-white p-4 shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow hover:shadow-md">
              <div className="pointer-events-none absolute -bottom-4 -right-4 size-20 rounded-full bg-[#edf7f4]/60 transition-transform duration-300 group-hover:scale-125" />
              <div className="relative flex items-center justify-between gap-3">
                <span className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.04em] text-[#3f4946]">
                  Mata Pelajaran
                </span>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#a6f2cf] text-[#002115]">
                  <Library className="size-5" />
                </span>
              </div>
              <div className="relative mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-bold leading-10 text-[#071f1c]">
                    <CountUp to={Math.max(subjectTabs.length - 1, 0)} duration={1.2} />
                  </span>
                  <span className="text-[13px] font-semibold leading-[18px] text-[#0d5c52]">
                    Mapel Aktif
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[12px] leading-[18px] text-[#3f4946]">
                  <Library className="size-[15px] text-[#0d5c52]" />
                  Diambil dari katalog backend
                </p>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Filter Toolbar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
            <div className="flex min-w-max items-center gap-1">
              {subjectTabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSubject(t.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold leading-[18px] transition-all ${
                    subject === t.id
                      ? "bg-[#0d5c52] text-white shadow-sm"
                      : "bg-white text-[#3f4946] hover:bg-[#d4eee7] hover:text-[#0d5c52]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex shrink-0 items-center rounded-lg bg-white p-1 shadow-sm">
              <button
                type="button"
                title="Tampilan Kisi"
                aria-label="Tampilan kisi"
                onClick={() => setView("grid")}
                className={`rounded-md p-1.5 transition-colors ${
                  view === "grid"
                    ? "bg-[#d4eee7] text-[#0d5c52]"
                    : "text-[#3f4946] hover:text-[#0d5c52]"
                }`}
              >
                <LayoutGrid className="size-5" />
              </button>
              <button
                type="button"
                title="Tampilan Daftar"
                aria-label="Tampilan daftar"
                onClick={() => setView("list")}
                className={`rounded-md p-1.5 transition-colors ${
                  view === "list"
                    ? "bg-[#d4eee7] text-[#0d5c52]"
                    : "text-[#3f4946] hover:text-[#0d5c52]"
                }`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-2 px-4 shadow-sm md:flex-row">
            <div className="relative w-full md:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-[#3f4946]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul modul, bab materi, kode KD, atau keyword praktikum..."
                aria-label="Cari modul"
                className="h-10 w-full rounded-lg bg-[#edf7f4] pl-9 pr-4 text-[13px] leading-[18px] text-[#071f1c] placeholder:text-[#6f7976] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d5c52]/20"
              />
            </div>
            <div className="flex w-full items-center justify-end gap-2 md:w-auto">
              <span className="text-[11px] font-semibold leading-[14px] text-[#3f4946]">Status:</span>
              <select
                aria-label="Filter status"
                value={status}
                onChange={(event) => setStatus(event.target.value as StatusFilter)}
                className="h-10 cursor-pointer rounded-lg bg-[#edf7f4] px-3 text-[13px] font-semibold leading-[18px] text-[#071f1c] focus:outline-none"
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="h-6 w-px bg-[#cee8e1]" />
              <button
                type="button"
                onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
                className="flex h-10 items-center gap-1 rounded-lg bg-[#edf7f4] px-3 text-[13px] font-semibold leading-[18px] text-[#071f1c] transition-colors hover:bg-[#d4eee7]"
              >
                <ArrowDownUp className="size-[18px]" />
                {sort === "newest" ? "Terbaru" : "Terlama"}
              </button>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {modulesQuery.isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-xl bg-white shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)]"
              />
            ))}
          </div>
        ) : modulesQuery.isError ? (
          <FadeIn>
            <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-10 text-center text-[#3f4946]">
              <span className="text-[15px] font-semibold leading-[22px]">
                {modulesQuery.error instanceof Error
                  ? modulesQuery.error.message
                  : "Gagal memuat daftar modul."}
              </span>
              <button
                type="button"
                onClick={() => void modulesQuery.refetch()}
                className="rounded-lg bg-[#0d5c52] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#004d40]"
              >
                Coba lagi
              </button>
            </div>
          </FadeIn>
        ) : backendModules.length === 0 ? (
          <FadeIn>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-10 text-center text-[#3f4946]">
              <BookOpen className="size-8 text-[#bec9c5]" />
              <span className="text-[15px] font-semibold leading-[22px]">
                Belum ada modul yang tersedia.
              </span>
              <span className="text-[13px] leading-[18px]">
                Modul akan tampil di sini setelah guru menambahkannya.
              </span>
            </div>
          </FadeIn>
        ) : visibleModules.length === 0 ? (
          <FadeIn>
            <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-10 text-center text-[#3f4946]">
              <SearchX className="size-8 text-[#bec9c5]" />
              <span className="text-[15px] font-semibold leading-[22px]">
                Tidak ada modul yang cocok dengan filter Anda.
              </span>
              <span className="text-[13px] leading-[18px]">
                Coba ubah kata kunci, status, atau pilih mata pelajaran lain.
              </span>
            </div>
          </FadeIn>
        ) : (
          <StaggerChildren
            as="div"
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "grid grid-cols-1 gap-4"
            }
          >
            {visibleModules.map((m) => {
              const pDisplay = progressDisplay(m);
              const ActionIcon = m.actionIcon;
              return (
                <StaggerItem key={m.id}>
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_-2px_rgba(13,92,82,0.05)] transition-shadow duration-200 hover:shadow-md">
                    <div className="relative h-44 w-full overflow-hidden bg-[#e2f2ee]">
                      {m.image ? (
                        <Image
                          src={m.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 304px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#d4eee7] via-[#cee8e1] to-[#00796b]" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[14px] ${m.subjectClass}`}
                        >
                          {m.subjectLabel}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold leading-[14px] ${m.tagClass}`}
                        >
                          {m.tag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.02em] opacity-90">
                          {m.kicker}
                        </span>
                        <h3
                          className="truncate text-[15px] font-semibold leading-[22px]"
                          style={jakarta}
                        >
                          {m.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <p className="line-clamp-2 text-[12px] leading-[18px] text-[#3f4946]">
                        {m.desc}
                      </p>
                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#edf7f4] p-2">
                        {m.info.map((info) => (
                          <div key={info.text} className="flex items-center gap-1.5">
                            <info.icon
                              className={`size-4 shrink-0 ${m.accentTextClass}`}
                            />
                            <span className="text-[11px] font-semibold leading-[14px] text-[#3f4946]">
                              {info.text}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-col gap-1 pt-1">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold leading-[14px] text-[#3f4946]">
                          <span className="min-w-0">Status Pemahaman</span>
                          <span
                            className={`shrink-0 whitespace-nowrap text-right font-semibold ${pDisplay.textClass}`}
                          >
                            {m.status === "completed" && <CheckCircle2 className="size-3.5" />}
                            {pDisplay.text}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#cee8e1]">
                          <motion.div
                            className={`h-full rounded-full ${pDisplay.barClass}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.max(m.progress ?? 0, 3)}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-4 pt-0">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openModule(m)}
                        className={`flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-[14px] font-semibold leading-5 transition-colors ${
                          m.status === "new"
                            ? "bg-[#0d5c52] text-white hover:bg-[#004d40]"
                            : "bg-[#d4eee7] text-[#0d5c52] hover:bg-[#cee8e1]"
                        }`}
                      >
                        <ActionIcon className="size-[18px]" />
                        {m.action}
                      </motion.button>
                      <button
                        type="button"
                        title={`Unduh materi ${m.title}`}
                        aria-label={`Unduh materi ${m.title}`}
                        onClick={() =>
                          alert(`Unduhan "${m.title}" aktif setelah integrasi storage backend.`)
                        }
                        className="rounded-lg bg-[#edf7f4] p-2 text-[#3f4946] transition-colors hover:bg-[#e2f2ee] hover:text-[#0d5c52]"
                      >
                        <Download className="size-5" />
                      </button>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>
        )}
      </div>
    </FadeIn>
  );
}
