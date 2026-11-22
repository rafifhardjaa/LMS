"use client";

import { useState } from "react";
import { WaliKelasPlacementDialog } from "@/components/admin/wali-kelas-placement-dialog";
import { WaliKelasTable } from "@/components/admin/wali-kelas-table";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function WaliKelasPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [placementOpen, setPlacementOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-7 pt-4">
      <FadeIn>
        <SlideIn direction="left">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.7px] text-[#181c20] sm:text-[32px]">
            Manajemen Wali Kelas
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#4e566c]">
            Tetapkan guru wali kelas untuk setiap rombel, pantau kelas yang belum memiliki wali, dan kelola penugasan wali kelas SMK Mataram.
          </p>
        </SlideIn>
      </FadeIn>

      <FadeIn>
        <WaliKelasTable
          key={refreshKey}
          onPlacement={() => setPlacementOpen(true)}
        />
      </FadeIn>

      <WaliKelasPlacementDialog
        open={placementOpen}
        onOpenChange={setPlacementOpen}
        onSuccess={() => setRefreshKey((key) => key + 1)}
      />
    </div>
  );
}
