"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { initialPhotos } from "./data";
import type { AttendancePhoto } from "./types";

export function DocumentationPanel() {
  const [photos, setPhotos] = useState<AttendancePhoto[]>(initialPhotos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPhotos((current) => [
      ...current,
      {
        id: `upload-${Date.now()}`,
        src: previewUrl,
        label: "Bukti Tatap Muka",
      },
    ]);
    toast.success("Bukti tatap muka ditambahkan", {
      description: `${file.name} tersimpan pada dokumentasi sesi ini.`,
    });
    event.target.value = "";
  }

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[12px] font-bold text-[#1E293B]">
          Dokumentasi Lab Hari Ini
        </h2>
        <span className="text-[9px] font-bold uppercase tracking-[0.04em] text-[#94A3B8]">
          {photos.length} Foto Tersimpan
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative h-24 overflow-hidden rounded-lg shadow-inner"
          >
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              unoptimized
              sizes="(min-width: 1280px) 220px, 50vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-[#1E293B]/30 p-1.5 transition-colors group-hover:bg-[#1E293B]/10">
              <span className="text-[8px] font-bold uppercase tracking-[0.06em] text-white">
                {photo.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-[#F1F5F9] py-1.5 text-[10px] font-bold text-[#475569] transition hover:bg-[#F8FAFC] hover:text-[#b71422]"
      >
        {photos.length > 2 ? (
          <ImagePlus className="size-3.5" />
        ) : (
          <Camera className="size-3.5" />
        )}
        + Unggah Bukti Tatap Muka
      </button>
    </section>
  );
}
