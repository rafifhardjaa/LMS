"use client";

import { useAuthStore } from "@/lib/store/auth-store";

const capaianPembelajaranDefault =
  "Capaian pembelajaran mata pelajaran ini mengacu pada kurikulum yang berlaku dan akan disesuaikan dengan karakteristik peserta didik.";

const bobotPenilaian = [
  { persen: "15%", label: "Keaktifan" },
  { persen: "20%", label: "Tugas Akhir" },
  { persen: "15%", label: "Tugas" },
  { persen: "5%", label: "Kuis" },
  { persen: "20%", label: "UTS" },
  { persen: "25%", label: "UAS" },
];

type CourseInfoContentProps = {
  capaianPembelajaran?: string | null;
};

export function CourseInfoContent({
  capaianPembelajaran,
}: CourseInfoContentProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="flex min-h-64 flex-1 flex-col gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-4">
        <p className="text-[14px] font-semibold text-[#1E293B]">
          Guru pengampu :{" "}
          <span className="font-medium text-[#475569]">
            {user?.full_name ?? "-"}
          </span>
        </p>
        <div>
          <p className="text-[14px] font-semibold text-[#1E293B]">
            Capaian Pembelajaran
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[13px] leading-6 text-[#475569]">
            {capaianPembelajaran?.trim() || capaianPembelajaranDefault}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[14px] font-semibold text-[#1E293B]">
          Bobot Penilaian
        </p>
        <div className="mt-2 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {bobotPenilaian.map((item) => (
            <div
              key={item.label}
              className="flex items-baseline gap-2 border-b border-[#E2E8F0] pb-2.5"
            >
              <span className="text-[16px] font-bold text-[#1E293B]">
                {item.persen}
              </span>
              <span className="text-[13px] text-[#475569]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
