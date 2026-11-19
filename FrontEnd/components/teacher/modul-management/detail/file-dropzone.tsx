"use client";

import type { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CloudUpload,
  FileText,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

type IconComponent = ComponentType<{ className?: string }>;

export type UploadSlot =
  | "materi"
  | "tugasFile"
  | "tugasSubmission"
  | "kuisFile"
  | "kuisSubmission";

export type PendingFile = {
  clientId: string;
  file: File;
  name: string;
  size: number;
  mimeType: string;
};

export const EMPTY_UPLOAD_FILES: Record<UploadSlot, PendingFile[]> = {
  materi: [],
  tugasFile: [],
  tugasSubmission: [],
  kuisFile: [],
  kuisSubmission: [],
};

const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/zip": [".zip"],
  "application/x-rar-compressed": [".rar"],
};

const MAX_SIZE = 10 * 1024 * 1024;

function formatSize(size: number): string {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
  return `${Math.max(1, Math.ceil(size / 1024))} KB`;
}

function rejectionMessage(code: string | undefined): string {
  if (code === "file-too-large") {
    return "Ukuran file terlalu besar! Maksimal 10 MB.";
  }
  if (code === "file-invalid-type") {
    return "Format file tidak didukung. Gunakan PDF, ZIP, atau RAR.";
  }
  return "File ditolak.";
}

type FileDropzoneProps = {
  label: string;
  hint?: string;
  icon?: IconComponent;
  files: PendingFile[];
  onChange: (files: PendingFile[]) => void;
  expanded: boolean;
  onToggle: () => void;
};

export function FileDropzone({
  label,
  hint,
  icon: Icon = FileText,
  files,
  onChange,
  expanded,
  onToggle,
}: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: true,
    onDrop: (accepted, rejections) => {
      if (accepted.length) {
        const added: PendingFile[] = accepted.map((file) => ({
          clientId: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          mimeType: file.type,
        }));
        onChange([...files, ...added]);
        toast.success(`${added.length} berkas siap diunggah`, {
          description: "File masih di sisi frontend; integrasi backend menyusul.",
        });
      }

      if (rejections.length) {
        const first = rejections[0];
        toast.error(rejectionMessage(first?.errors?.[0]?.code), {
          description: first?.file.name,
        });
      }
    },
  });

  return (
    <div>
      <motion.button
        type="button"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        onClick={onToggle}
        aria-expanded={expanded}
        className={`flex h-10 w-full items-center gap-2.5 rounded-lg border px-3 text-left transition-colors ${
          expanded
            ? "border-[#b71422]/30 bg-[#F8FAFC]"
            : "border-[#E2E8F0] bg-white hover:border-[#b71422]/25 hover:bg-[#F8FAFC]"
        }`}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#F1F5F9] text-[#64748B]">
          <Icon className="size-3.5" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#1E293B]">
          {label}
        </span>
        {files.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#EDF6FF] px-2 py-0.5 text-[10px] font-bold text-[#006398]">
            {files.length} file
          </span>
        )}
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex size-5 shrink-0 items-center justify-center"
        >
          <ChevronDown className="size-4 text-[#94A3B8]" />
        </motion.span>
      </motion.button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <div
                {...getRootProps()}
                role="button"
                tabIndex={0}
                aria-label={label}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed px-3 py-3 text-center transition-colors ${
                  isDragActive
                    ? "border-[#b71422] bg-[#FEF2F2]"
                    : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#b71422]/50 hover:bg-[#F1F5F9]"
                }`}
              >
                <input {...getInputProps()} />
                <span
                  className={`flex size-7 items-center justify-center rounded-lg ${
                    isDragActive
                      ? "bg-[#FFEBEB] text-[#b71422]"
                      : "bg-white text-[#94A3B8]"
                  }`}
                >
                  <CloudUpload className="size-4" />
                </span>
                <p className="text-[11px] font-semibold text-[#475569]">
                  {isDragActive
                    ? "Lepaskan file di sini"
                    : "Tarik file ke sini, atau klik untuk memilih"}
                </p>
                <p className="text-[10px] font-medium text-[#94A3B8]">
                  {hint ?? "PDF, ZIP, RAR · maks 10 MB"}
                </p>
              </div>

              {files.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {files.map((item) => (
                    <li
                      key={item.clientId}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F1F5F9] py-1 pl-2.5 pr-1 text-[10px]"
                    >
                      <FileText className="size-3 shrink-0 text-[#006398]" />
                      <span className="max-w-[160px] truncate font-semibold text-[#1E293B]">
                        {item.name}
                      </span>
                      <span className="shrink-0 font-medium text-[#94A3B8]">
                        {formatSize(item.size)}
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onChange(
                            files.filter(
                              (file) => file.clientId !== item.clientId,
                            ),
                          );
                        }}
                        aria-label={`Hapus ${item.name}`}
                        className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422]"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
