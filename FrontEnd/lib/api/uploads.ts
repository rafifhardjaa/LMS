import { apiFetch, apiUpload } from "./client";

export type UploadSlot =
  | "materi"
  | "tugasFile"
  | "tugasSubmission"
  | "kuisFile"
  | "kuisSubmission";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  checksumSha256: string;
  fileUrl: string;
  studentId: string | null;
  submissionId: string | null;
  assignmentId?: string | null;
  createdAt: string;
}

interface UploadListResponse {
  success: boolean;
  data: UploadedFile[];
}

interface UploadResponse {
  success: boolean;
  message?: string;
  data: {
    id: string;
    fileUrl: string;
    slot: UploadSlot;
    submissionId?: string;
    assignmentId?: string | null;
    checksumSha256: string;
    sizeBytes: number;
  };
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

export const uploadsApi = {
  upload: (
    slot: UploadSlot,
    file: File,
    meetingId: string,
    assignmentId?: string,
  ) => {
    const form = new FormData();
    form.append("file", file, file.name);
    form.append("meetingId", meetingId);
    if (assignmentId) form.append("assignmentId", assignmentId);
    return apiUpload<UploadResponse>(`/api/v1/uploads/storage/${slot}`, form);
  },

  list: (slot: UploadSlot, meetingId: string) =>
    apiFetch<UploadListResponse>(
      `/api/v1/uploads/storage/${slot}?meetingId=${encodeURIComponent(meetingId)}`,
    ),

  remove: (slot: UploadSlot, id: string) =>
    apiFetch<DeleteResponse>(
      `/api/v1/uploads/storage/${slot}/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),
};
