import { createHash, randomUUID } from "node:crypto";
import { Elysia, t } from "elysia";
import { and, desc, eq } from "drizzle-orm";
import {
  authMiddleware,
  canonicalRole,
  requireRole,
} from "../middleware/auth-middleware";
import { db } from "../db/index";
import { courseMeetings } from "../db/schema";
import { storageDb } from "../db/storage";
import {
  uploadedFiles,
  guruSubmissionKuis,
  guruSubmissionTugas,
  guruUploadsKuis,
  guruUploadsMateri,
  guruUploadsTugas,
  siswaUpSubmissionKuis,
  siswaUpSubmissionTugas,
} from "../db/storage-schema";
import { handleError } from "../utils/response";

const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

const ACCEPTED_MIME = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv",
  "application/zip",
  "application/x-rar-compressed",
]);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type UploadSlot =
  | "materi"
  | "tugasFile"
  | "tugasSubmission"
  | "kuisFile"
  | "kuisSubmission";

const SLOTS: UploadSlot[] = [
  "materi",
  "tugasFile",
  "tugasSubmission",
  "kuisFile",
  "kuisSubmission",
];

const slotTables: Record<UploadSlot, any> = {
  materi: guruUploadsMateri,
  tugasFile: guruUploadsTugas,
  tugasSubmission: siswaUpSubmissionTugas,
  kuisFile: guruUploadsKuis,
  kuisSubmission: siswaUpSubmissionKuis,
};

const submissionMirrorTables: Partial<Record<UploadSlot, any>> = {
  tugasSubmission: guruSubmissionTugas,
  kuisSubmission: guruSubmissionKuis,
};

function isSubmissionSlot(slot: UploadSlot) {
  return slot === "tugasSubmission" || slot === "kuisSubmission";
}

function streamFile(
  data: Uint8Array,
  filename: string,
  mimeType: string,
) {
  const disposition = `inline; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": disposition,
      "Content-Length": String(data.byteLength),
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export const uploadsRoute = new Elysia({ prefix: "/api/v1/uploads" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, user, status, request }: any) => {
      try {
        const file = body.file;

        if (!file) {
          return status(400, {
            success: false,
            message: "File tidak ditemukan",
          });
        }

        if (file.size > FILE_SIZE_LIMIT) {
          return status(400, {
            success: false,
            message: "Ukuran file terlalu besar! Maksimal 10 MB.",
          });
        }

        const fileBuffer = await file.arrayBuffer();
        const blob = new Uint8Array(fileBuffer);

        const [inserted] = await storageDb
          .insert(uploadedFiles)
          .values({
            filename: file.name,
            mimeType: file.type,
            size: blob.byteLength,
            data: blob,
            uploadedBy: user.id,
          })
          .returning({ id: uploadedFiles.id });

        const origin = new URL(request.url).origin;

        if (!inserted) {
          return status(500, { success: false, message: "Gagal menyimpan file" });
        }

        return status(201, {
          success: true,
          message: "File berhasil diunggah",
          data: { fileUrl: `${origin}/api/v1/uploads/${inserted.id}` },
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Uploads"],
        summary: "Upload file",
        description:
          "Menerima multipart/form-data. Maksimal ukuran file 10 MB. Mengembalikan URL file yang dapat diakses.",
        security: [{ BearerAuth: [] }],
      },
      body: t.Object({
        file: t.File(),
      }),
    }
  )
  .post(
    "/storage/:slot",
    async ({ body, params, user, status, request }: any) => {
      try {
        const slot = params.slot as UploadSlot;

        if (!SLOTS.includes(slot)) {
          return status(400, {
            success: false,
            message: "Slot upload tidak valid",
          });
        }

        const role = canonicalRole(user.role);

        if (!isSubmissionSlot(slot) && role === "siswa") {
          return status(403, {
            success: false,
            message: "Akses ditolak: Peran tidak valid",
          });
        }

        const file = body.file;

        if (!file) {
          return status(400, {
            success: false,
            message: "File tidak ditemukan",
          });
        }

        if (file.size > FILE_SIZE_LIMIT) {
          return status(400, {
            success: false,
            message: "Ukuran file terlalu besar! Maksimal 10 MB.",
          });
        }

        if (!ACCEPTED_MIME.has(file.type)) {
          return status(400, {
            success: false,
            message:
              "Format file tidak didukung. Gunakan PDF, DOCX, XLSX, CSV, ZIP, atau RAR.",
          });
        }

        const meetingId = body.meetingId;

        if (!meetingId || !UUID_RE.test(meetingId)) {
          return status(400, {
            success: false,
            message: "meetingId tidak valid",
          });
        }

        const [meeting] = await db
          .select({ id: courseMeetings.id })
          .from(courseMeetings)
          .where(eq(courseMeetings.id, meetingId))
          .limit(1);

        if (!meeting) {
          return status(400, {
            success: false,
            message: "Pertemuan tidak ditemukan",
          });
        }

        const blob = new Uint8Array(await file.arrayBuffer());
        const checksumSha256 = createHash("sha256").update(blob).digest("hex");

        const base = {
          filename: file.name,
          mimeType: file.type,
          size: blob.byteLength,
          checksumSha256,
          uploadedBy: user.id,
          uploaderRole: role,
          meetingId,
        };

        const origin = new URL(request.url).origin;
        const table = slotTables[slot];

        if (isSubmissionSlot(slot)) {
          const studentId =
            role === "siswa" ? user.id : body.studentId;

          if (!studentId || !UUID_RE.test(studentId)) {
            return status(400, {
              success: false,
              message: "studentId tidak valid",
            });
          }

          const submissionId =
            body.submissionId && UUID_RE.test(body.submissionId)
              ? body.submissionId
              : randomUUID();

          const mirrorTable = submissionMirrorTables[slot]!;

          const [inserted] = await storageDb.transaction(async (tx) => {
            const [row] = await tx
              .insert(table)
              .values({ ...base, data: blob, studentId, submissionId })
              .returning({ id: table.id });

            if (!row) {
              throw new Error("Gagal menyimpan file siswa");
            }

            await tx
              .insert(mirrorTable)
              .values({
                ...base,
                studentId,
                submissionId,
                studentFileId: row.id,
              })
              .returning({ id: mirrorTable.id });

            return [row];
          });

          if (!inserted) {
            return status(500, {
              success: false,
              message: "Gagal menyimpan file",
            });
          }

          return status(201, {
            success: true,
            message: "File berhasil diunggah",
            data: {
              id: inserted.id,
              fileUrl: `${origin}/api/v1/uploads/storage/${slot}/${inserted.id}`,
              slot,
              submissionId,
              checksumSha256,
              sizeBytes: blob.byteLength,
            },
          });
        }

        const [inserted] = await storageDb
          .insert(table)
          .values({ ...base, data: blob })
          .returning({ id: table.id });

        if (!inserted) {
          return status(500, { success: false, message: "Gagal menyimpan file" });
        }

        return status(201, {
          success: true,
          message: "File berhasil diunggah",
          data: {
            id: inserted.id,
            fileUrl: `${origin}/api/v1/uploads/storage/${slot}/${inserted.id}`,
            slot,
            checksumSha256,
            sizeBytes: blob.byteLength,
          },
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Uploads"],
        summary: "Upload file ke penyimpanan slot pertemuan",
        description:
          "Menerima multipart/form-data (file, meetingId, submissionId opsional). Maksimal 10 MB, format PDF/DOCX/XLSX/CSV/ZIP/RAR.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ slot: t.String() }),
      body: t.Object({
        file: t.File(),
        meetingId: t.String(),
        submissionId: t.Optional(t.String()),
        studentId: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/storage/:slot",
    async ({ params, query, user, status, request }: any) => {
      try {
        const slot = params.slot as UploadSlot;

        if (!SLOTS.includes(slot)) {
          return status(400, {
            success: false,
            message: "Slot upload tidak valid",
          });
        }

        const meetingId = query.meetingId;

        if (!meetingId || !UUID_RE.test(meetingId)) {
          return status(400, {
            success: false,
            message: "meetingId tidak valid",
          });
        }

        const [meeting] = await db
          .select({ id: courseMeetings.id })
          .from(courseMeetings)
          .where(eq(courseMeetings.id, meetingId))
          .limit(1);

        if (!meeting) {
          return status(400, {
            success: false,
            message: "Pertemuan tidak ditemukan",
          });
        }

        const role = canonicalRole(user.role);
        const origin = new URL(request.url).origin;
        const submission = isSubmissionSlot(slot);
        const table = submission
          ? submissionMirrorTables[slot]!
          : slotTables[slot];
        const filters = [eq(table.meetingId, meetingId)];

        if (submission && role === "siswa") {
          filters.push(eq(table.studentId, user.id));
        }

        const rows: any[] = submission
          ? await storageDb
              .select({
                id: table.id,
                filename: table.filename,
                mimeType: table.mimeType,
                size: table.size,
                checksumSha256: table.checksumSha256,
                studentId: table.studentId,
                submissionId: table.submissionId,
                studentFileId: table.studentFileId,
                createdAt: table.createdAt,
              })
              .from(table)
              .where(and(...filters))
              .orderBy(desc(table.createdAt))
          : await storageDb
              .select({
                id: table.id,
                filename: table.filename,
                mimeType: table.mimeType,
                size: table.size,
                checksumSha256: table.checksumSha256,
                createdAt: table.createdAt,
              })
              .from(table)
              .where(and(...filters))
              .orderBy(desc(table.createdAt));

        const data = rows.map((row) => ({
          id: row.id,
          name: row.filename,
          size: row.size,
          mimeType: row.mimeType,
          checksumSha256: row.checksumSha256,
          fileUrl: `${origin}/api/v1/uploads/storage/${slot}/${
            submission ? row.studentFileId : row.id
          }`,
          studentId: submission ? row.studentId : null,
          submissionId: submission ? row.submissionId : null,
          createdAt: row.createdAt,
        }));

        return { success: true, data };
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Uploads"],
        summary: "Daftar file storage slot pertemuan",
        description:
          "Mengembalikan metadata file per slot. Slot submission membaca mirror guru; fileUrl menunjuk ke file siswa.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ slot: t.String() }),
      query: t.Object({ meetingId: t.String() }),
    }
  )
  .get(
    "/:id",
    async ({ params, status }: any) => {
      try {
        const [found] = await storageDb
          .select({
            filename: uploadedFiles.filename,
            mimeType: uploadedFiles.mimeType,
            data: uploadedFiles.data,
          })
          .from(uploadedFiles)
          .where(eq(uploadedFiles.id, params.id))
          .limit(1);

        if (!found) {
          return status(404, { success: false, message: "File tidak ditemukan" });
        }

        return streamFile(found.data, found.filename, found.mimeType);
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Uploads"],
        summary: "Ambil file berdasarkan ID",
        description:
          "Mengembalikan file langsung (stream) dengan Content-Type sesuai format file asli.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ id: t.String() }),
    }
  )
  .get(
    "/storage/:slot/:id",
    async ({ params, status }: any) => {
      try {
        const slot = params.slot as UploadSlot;

        if (!SLOTS.includes(slot)) {
          return status(400, {
            success: false,
            message: "Slot upload tidak valid",
          });
        }

        const table = slotTables[slot];

        const [found] = await storageDb
          .select({
            filename: table.filename,
            mimeType: table.mimeType,
            data: table.data,
          })
          .from(table)
          .where(eq(table.id, params.id))
          .limit(1);

        if (!found) {
          return status(404, { success: false, message: "File tidak ditemukan" });
        }

        return streamFile(found.data, found.filename, found.mimeType);
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      detail: {
        tags: ["Uploads"],
        summary: "Ambil file storage slot pertemuan",
        description:
          "Mengembalikan file dari tabel slot (guru/siswa) dengan Content-Type dan Content-Disposition asli.",
        security: [{ BearerAuth: [] }],
      },
      params: t.Object({ slot: t.String(), id: t.String() }),
    }
  );
