"use client";

import { Trajectory } from "@/components/student/trajectory";
import { LearningModules } from "@/components/student/learning-modules";
import { TasksQuizzes } from "@/components/student/tasks-quizzes";
import { Counseling } from "@/components/student/counseling";
import { ProfileWidget } from "@/components/student/profile-widget";
import { AcademicMetrics } from "@/components/student/academic-metrics";
import { Schedule } from "@/components/student/schedule";
import { SlideIn, FadeIn } from "@/components/ui/animations";

export default function MuridDashboardPage() {
  return (
    <FadeIn>
      <div className="flex flex-col w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT MAIN REGION */}
            <SlideIn direction="left" className="xl:col-span-8 flex flex-col gap-6 min-w-0">
              <Trajectory />
              <LearningModules />
              <TasksQuizzes />
              <Counseling />
            </SlideIn>

            {/* RIGHT PANEL (WIDGETS STACK) */}
            <SlideIn direction="right" delay={0.1} className="xl:col-span-4 flex flex-col gap-6 min-w-0">
              <ProfileWidget />
              <AcademicMetrics />
              <Schedule />
            </SlideIn>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
