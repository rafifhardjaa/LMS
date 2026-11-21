"use client";

import { FadeIn } from "@/components/ui/animations";
import { SearchableDropdown } from "@/components/admin/searchable-dropdown";
import type { ResourceTab } from "./types";

const typeOptions = [
  { value: "tugas", label: "Tugas" },
  { value: "kuis", label: "Kuis" },
];

type ResourceToolbarProps = {
  activeTab: ResourceTab;
  onTabChange: (tab: ResourceTab) => void;
};

export function ResourceToolbar({
  activeTab,
  onTabChange,
}: ResourceToolbarProps) {
  return (
    <FadeIn delay={0.08}>
      <div className="border-b border-[#E2E8F0] pb-3">
        <div className="w-56 max-w-full">
          <SearchableDropdown
            value={activeTab}
            onChange={(value) => onTabChange(value === "kuis" ? "kuis" : "tugas")}
            options={typeOptions}
            label="Jenis Penilaian"
            searchPlaceholder="Cari jenis penilaian..."
            emptyMessage="Jenis penilaian tidak ditemukan."
            id="jenis-penilaian"
            variant="light"
          />
        </div>
      </div>
    </FadeIn>
  );
}
