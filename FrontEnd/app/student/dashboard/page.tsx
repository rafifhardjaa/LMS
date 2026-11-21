"use client";

import { FadeIn } from "@/components/ui/animations";
import { Trajectory } from "@/components/student/trajectory";
import { LearningModules } from "@/components/student/learning-modules";
import { TasksQuizzes } from "@/components/student/tasks-quizzes";
import { Counseling } from "@/components/student/counseling";
import { ProfileWidget } from "@/components/student/profile-widget";
import { AcademicMetrics } from "@/components/student/academic-metrics";
import { Schedule } from "@/components/student/schedule";

export default function MuridDashboardPage() {
  return (
    <FadeIn>
      <h1 className="sr-only">Dashboard Siswa</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        <div className="flex flex-col gap-6 lg:col-span-8 min-w-0">
          <Trajectory />
          <LearningModules />
          <TasksQuizzes />
          <Counseling />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-4 min-w-0">
          <ProfileWidget />
          <AcademicMetrics />
          <Schedule />
        </div>
      </div>
    </FadeIn>
  );
}
