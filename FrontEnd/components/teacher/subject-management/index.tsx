"use client";

import { useMemo, useState } from "react";
import { Award, BookOpen, FileText, Users } from "lucide-react";
import { FadeIn } from "@/components/ui/animations";
import { AdminPanel } from "./admin-panel";
import { CourseGrid } from "./course-grid";
import { CurriculumPanel } from "./curriculum-panel";
import { DapodikPanel } from "./dapodik-panel";
import { KpiGrid } from "./kpi-grid";
import { SubjectFilters } from "./subject-filters";
import { SubjectHeader } from "./subject-header";
import { adminItems, courses, curriculumModules } from "./data";
import type {
  CategoryCounts,
  CategoryTab,
  Kpi,
  LevelFilter,
  StatusFilter,
} from "./types";

export function SubjectManagement() {
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const totalStudents = courses.reduce(
    (total, course) => total + course.students,
    0,
  );
  const subjectCount = new Set(courses.map((course) => course.subject)).size;

  const categoryCounts = useMemo<CategoryCounts>(() => {
    const counts: CategoryCounts = {
      all: courses.length,
      fisika: 0,
      sains: 0,
      informatika: 0,
      arsip: 0,
    };

    for (const course of courses) {
      counts[course.category] += 1;
    }

    return counts;
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      if (activeTab === "arsip") return false;
      if (activeTab !== "all" && course.category !== activeTab) return false;
      if (levelFilter !== "all" && course.level !== levelFilter) return false;
      if (statusFilter !== "all" && course.status !== statusFilter) return false;
      if (!query) return true;

      return [
        course.className,
        course.subject,
        course.chapter,
        course.room,
        course.badge,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [activeTab, levelFilter, statusFilter, search]);

  const resetFilters = () => {
    setActiveTab("all");
    setLevelFilter("all");
    setStatusFilter("all");
    setSearch("");
  };

  const kpis: Kpi[] = [
    {
      label: "Total Mata Pelajaran",
      value: String(subjectCount),
      unit: "Mapel Inti",
      unitClassName: "text-[#b71422]",
      icon: BookOpen,
      tone: "primary",
      footerLeft: "Fisika, Sains, Informatika",
      dotClassName: "bg-[#22C55E]",
    },
    {
      label: "Rombel Kelas Diajar",
      value: String(courses.length),
      unit: "Kelas Aktif",
      unitClassName: "text-[#006398]",
      icon: Users,
      tone: "blue",
      footerLeft: "Fase E & F",
      footerRight: `${totalStudents} Total Siswa`,
      footerRightClassName: "text-[#1E293B]",
    },
    {
      label: "Modul Ajar & RPP",
      value: "28/32",
      unit: "Rilis",
      unitClassName: "text-[#16A34A]",
      icon: FileText,
      tone: "green",
      footerLeft: "Verifikasi Waka",
      footerRight: "90% Lengkap",
      footerRightClassName: "text-[#16A34A]",
    },
    {
      label: "Status CP / KKTP",
      value: "86.4%",
      unit: "Tuntas",
      unitClassName: "text-[#16A34A]",
      icon: Award,
      tone: "amber",
      footerLeft: "KKM Target 75.0",
      footerRight: "Tercapai (+11.4)",
      footerRightClassName: "text-[#1E293B]",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-5 bg-[#EBF0F5] text-[#1E293B]">
      <SubjectHeader courseCount={courses.length} />

      <KpiGrid kpis={kpis} />

      <SubjectFilters
        activeTab={activeTab}
        levelFilter={levelFilter}
        statusFilter={statusFilter}
        search={search}
        categoryCounts={categoryCounts}
        onTabChange={setActiveTab}
        onLevelChange={setLevelFilter}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearch}
      />

      <CourseGrid
        courses={filteredCourses}
        filterKey={`${activeTab}-${levelFilter}-${statusFilter}-${search}`}
        onReset={resetFilters}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
        <FadeIn delay={0.1} className="lg:col-span-7">
          <CurriculumPanel modules={curriculumModules} />
        </FadeIn>

        <FadeIn delay={0.16} className="flex flex-col gap-4 lg:col-span-5">
          <AdminPanel items={adminItems} />
          <DapodikPanel courseCount={courses.length} />
        </FadeIn>
      </div>
    </div>
  );
}
