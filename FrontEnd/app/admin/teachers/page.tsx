"use client";

import { useState } from "react";
import { TeachersTable } from "@/components/admin/teachers-table";
import { AddTeacherDialog } from "@/components/admin/add-teacher-dialog";
import { AddPlacementDialog } from "@/components/admin/add-placement-dialog";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { useAuthStore } from "@/lib/store/auth-store";

export default function TeachersPage() {
  const role = useAuthStore((state) => state.user?.role ?? "admin");
  const isAdmin = role === "admin";
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="flex w-full flex-col gap-7 pt-4">
      <FadeIn>
        <div className="flex flex-col gap-5">
          <SlideIn direction="left">
            <div className="max-w-[440px]">
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[32px]">Manajemen Tenaga Pendidik & Guru</h1>
              <p className="mt-2 text-sm leading-6 text-[#4e566c]">Kelola data guru pengampu, distribusi mata pelajaran, status beban mengajar (Jam Pelajaran), dan akun Dapodik SMK Mataram.</p>
            </div>
          </SlideIn>
        </div>
      </FadeIn>

      <FadeIn>
        <TeachersTable
          key={refreshKey}
          isAdmin={isAdmin}
          onTeacherAdded={() => setRefreshKey(k => k + 1)}
          onAddTeacher={() => setAddTeacherOpen(true)}
          onPlacement={() => setPlacementOpen(true)}
        />
      </FadeIn>

      <AddTeacherDialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen} onSuccess={() => setRefreshKey(k => k + 1)} />
      <AddPlacementDialog open={placementOpen} onOpenChange={setPlacementOpen} onSuccess={() => setRefreshKey(k => k + 1)} />
    </div>
  );
}