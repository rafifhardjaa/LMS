"use client";

import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CloudUpload,
  FileText,
  Loader2,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type IconComponent = ComponentType<{ className?: string }>;

export type UploadSlot =
  | "materi"
  | "tugasFile"
  | "tugasSubmission"
  | "kuisFile"
  | "kuisSubmission";

export type PendingFile = {
  clientId: string;
  file?: File;
  name: string;
  size: number;
  mimeType: string;
  status?: "pending" | "uploading" | "saved" | "failed";
  id?: string;
  fileUrl?: string;
  error?: string;
  studentId?: string | null;
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
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/csv": [".csv"],
  "application/csv": [".csv"],
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

type DropzoneAccent = "materi" | "tugas" | "kuis";

const ACCENT_STYLES: Record<DropzoneAccent, { header: string; title: string }> = {
  materi: {
    header: "bg-[#FFF1F2]",
    title: "text-[#b71422]",
  },
  tugas: {
    header: "bg-[#EFF6FF]",
    title: "text-[#006398]",
  },
  kuis: {
    header: "bg-[#F0FDF4]",
    title: "text-[#5B8C1F]",
  },
};

const FILE_TYPE_BADGE: Record<string, string> = {
  PDF: "bg-[#FFEBEB] text-[#b71422]",
  DOCX: "bg-[#EDF6FF] text-[#006398]",
  XLSX: "bg-[#EDFFF6] text-[#5B8C1F]",
  CSV: "bg-[#EDFFF6] text-[#5B8C1F]",
  ZIP: "bg-[#FEF3C7] text-[#B45309]",
  RAR: "bg-[#FEF3C7] text-[#B45309]",
};

function fileExtension(name: string): string {
  const match = name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return (match?.[1] ?? "file").toUpperCase();
}

function fileBadgeClass(extension: string): string {
  return FILE_TYPE_BADGE[extension] ?? "bg-[#F1F5F9] text-[#64748B]";
}

function rejectionMessage(code: string | undefined): string {
  if (code === "file-too-large") {
    return "Ukuran file terlalu besar! Maksimal 10 MB.";
  }
  if (code === "file-invalid-type") {
    return "Format file tidak didukung. Gunakan PDF, DOCX, XLSX, CSV, ZIP, atau RAR.";
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
  onUploadAll?: (files: PendingFile[]) => void;
  uploading?: boolean;
  readOnly?: boolean;
  onDelete?: (item: PendingFile) => Promise<void> | void;
  deleting?: boolean;
  accent?: DropzoneAccent;
};

export function FileDropzone({
  label,
  hint,
  icon: Icon = FileText,
  files,
  onChange,
  expanded,
  onToggle,
  onUploadAll,
  uploading = false,
  readOnly = false,
  onDelete,
  deleting = false,
  accent = "materi",
}: FileDropzoneProps) {
  const [pendingDelete, setPendingDelete] = useState<PendingFile | null>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPT,
    maxSize: MAX_SIZE,
    multiple: true,
    disabled: readOnly,
    onDrop: (accepted, rejections) => {
      if (accepted.length) {
        const added: PendingFile[] = accepted.map((file) => ({
          clientId: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          mimeType: file.type,
          status: "pending",
        }));
        onChange([...files, ...added]);
      }

      if (rejections.length) {
        const first = rejections[0];
        toast.error(rejectionMessage(first?.errors?.[0]?.code), {
          description: first?.file.name,
        });
      }
    },
  });

  const pendingCount = files.filter(
    (item) => item.status === "pending" || item.status === "failed",
  ).length;

  const savedFiles = readOnly
    ? []
    : files.filter((item) => item.status === "saved");
  const panelFiles = readOnly
    ? files
    : files.filter((item) => item.status !== "saved");

  function removeFile(clientId: string) {
    onChange(files.filter((item) => item.clientId !== clientId));
  }

  function renderChip(item: PendingFile) {
    if (item.status === "saved") {
      const extension = fileExtension(item.name);
      return (
        <motion.li
          key={item.clientId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#EDFFF6] py-1 pl-2.5 pr-1 text-[12px]"
        >
          <span
            className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-extrabold tracking-wide ${fileBadgeClass(extension)}`}
          >
            {extension}
          </span>
          <span className="max-w-[220px] truncate font-semibold text-[#1E293B]">
            {item.name}
          </span>
          <span className="shrink-0 font-medium text-[#5B8C1F]">
            {formatSize(item.size)}
          </span>
          <button
            type="button"
            onClick={() => setPendingDelete(item)}
            disabled={deleting}
            aria-label={`Hapus ${item.name}`}
            className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#5B8C1F] transition hover:bg-[#DCFCE7] hover:text-[#b71422] disabled:opacity-50"
          >
            <X className="size-3" />
          </button>
        </motion.li>
      );
    }

    if (item.status === "uploading") {
      return (
        <motion.li
          key={item.clientId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F1F5F9] py-1 pl-2.5 pr-1 text-[12px]"
        >
          <Loader2 className="size-3 shrink-0 animate-spin text-[#006398]" />
          <span className="max-w-[220px] truncate font-semibold text-[#475569]">
            {item.name}
          </span>
          <span className="shrink-0 font-medium text-[#94A3B8]">
            Mengunggah…
          </span>
        </motion.li>
      );
    }

    if (item.status === "failed") {
      return (
        <motion.li
          key={item.clientId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#FFEBEB] py-1 pl-2.5 pr-1 text-[12px]"
        >
          <TriangleAlert className="size-3 shrink-0 text-[#b71422]" />
          <span className="max-w-[220px] truncate font-semibold text-[#1E293B]">
            {item.name}
          </span>
          <span className="shrink-0 font-medium text-[#b71422]">
            {item.error ?? "Gagal"}
          </span>
          <button
            type="button"
            onClick={() => removeFile(item.clientId)}
            aria-label={`Hapus ${item.name}`}
            className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#b71422] transition hover:bg-[#FEE2E2]"
          >
            <Trash2 className="size-3" />
          </button>
        </motion.li>
      );
    }

    return (
      <motion.li
        key={item.clientId}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F1F5F9] py-1 pl-2.5 pr-1 text-[12px]"
      >
        <FileText className="size-3 shrink-0 text-[#006398]" />
        <span className="max-w-[220px] truncate font-semibold text-[#1E293B]">
          {item.name}
        </span>
        <span className="shrink-0 font-medium text-[#94A3B8]">
          {formatSize(item.size)}
        </span>
        <button
          type="button"
          onClick={() => removeFile(item.clientId)}
          aria-label={`Hapus ${item.name}`}
          className="flex size-4 shrink-0 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#FFEBEB] hover:text-[#b71422]"
        >
          <Trash2 className="size-3" />
        </button>
      </motion.li>
    );
  }

  return (
    <div>
      {savedFiles.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {savedFiles.map((item) => renderChip(item))}
        </ul>
      )}

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
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#1E293B]">
          {label}
        </span>
        {files.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#EDF6FF] px-2 py-0.5 text-[11px] font-bold text-[#006398]">
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
              {!readOnly && (
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
                  <p className="text-[12px] font-semibold text-[#475569]">
                    {isDragActive
                      ? "Lepaskan file di sini"
                      : "Tarik file ke sini, atau klik untuk memilih"}
                  </p>
                  <p className="text-[11px] font-medium text-[#94A3B8]">
                    {hint ?? "PDF, DOCX, XLSX, CSV, ZIP, RAR · maks 10 MB"}
                  </p>
                </div>
              )}

              {panelFiles.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {panelFiles.map((item) => renderChip(item))}
                </ul>
              ) : (
                readOnly && (
                  <p className="mt-2 rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-[12px] font-medium text-[#94A3B8]">
                    Belum ada pengumpulan siswa
                  </p>
                )
              )}

              {!readOnly && pendingCount > 0 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onUploadAll?.(files)}
                  disabled={uploading}
                  className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#b71422] px-4 text-[13px] font-bold text-white transition hover:bg-[#8f0f1a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CloudUpload className="size-4" />
                  )}
                  {uploading ? "Mengunggah…" : `Unggah ${pendingCount} file`}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.35)] ring-black/5 data-open:animate-none data-closed:animate-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col overflow-hidden rounded-2xl"
          >
            <div
              className={`flex items-start gap-3 px-5 py-4 ${ACCENT_STYLES[accent].header}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#64748B] ring-1 ring-[#E2E8F0]">
                <TriangleAlert className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <DialogTitle
                  className={`text-[15px] font-bold ${ACCENT_STYLES[accent].title}`}
                >
                  Hapus file?
                </DialogTitle>
                <DialogDescription className="mt-1 text-[13px] leading-6 text-[#475569]">
                  File ini akan dihapus permanen dan tidak bisa dikembalikan.
                </DialogDescription>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5">
              {pendingDelete && (
                <div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <span
                    className={`flex h-6 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-extrabold tracking-wide ${fileBadgeClass(
                      fileExtension(pendingDelete.name),
                    )}`}
                  >
                    {fileExtension(pendingDelete.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#1E293B]">
                      {pendingDelete.name}
                    </p>
                    <p className="text-[12px] text-[#94A3B8]">
                      {formatSize(pendingDelete.size)}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <DialogClose render={<Button variant="outline" />}>
                  Batal
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={deleting}
                  onClick={() => {
                    const item = pendingDelete;
                    setPendingDelete(null);
                    if (item) void onDelete?.(item);
                  }}
                  className="gap-2"
                >
                  <Trash2 className="size-4" />
                  {deleting ? "Menghapus…" : "Hapus"}
                </Button>
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
