"use client";

import { FadeIn } from "@/components/ui/animations";
import { StudentPageHeader } from "@/components/student/page-header";
import { Schedule } from "@/components/student/schedule";
import { Trajectory } from "@/components/student/trajectory";
import { LearningModules } from "@/components/student/learning-modules";
import { TasksQuizzes } from "@/components/student/tasks-quizzes";
import { Counseling } from "@/components/student/counseling";

export default function MuridDashboardPage() {
  return (
    <FadeIn>
      <div className="flex flex-col gap-6">
        <StudentPageHeader
          title={"Dashboard Siswa"}
          description="Pantau jadwal pelajaran kelasmu dan lanjutkan kegiatan belajar dari satu tempat."
        />
        <Schedule />
        <Trajectory />
        <LearningModules />
        <TasksQuizzes />
        <Counseling />
      </div>
    </FadeIn>
  );
}
