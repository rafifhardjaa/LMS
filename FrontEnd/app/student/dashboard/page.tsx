"use client";

import { FadeIn } from "@/components/ui/animations";
import { Trajectory } from "@/components/student/trajectory";
import { LearningModules } from "@/components/student/learning-modules";
import { TasksQuizzes } from "@/components/student/tasks-quizzes";
import { Counseling } from "@/components/student/counseling";

export default function MuridDashboardPage() {
  return (
    <FadeIn>
      <h1 className="sr-only">Dashboard Siswa</h1>
      <div className="flex flex-col gap-6">
        <Trajectory />
        <LearningModules />
        <TasksQuizzes />
        <Counseling />
      </div>
    </FadeIn>
  );
}
