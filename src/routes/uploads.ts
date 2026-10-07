import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { storageDb } from "../db/storage";
import { uploadedFiles } from "../db/storage-schema";
import { handleError } from "../utils/response";

const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

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
      body: t.Object({
        file: t.File(),
      }),
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

        const disposition = `inline; filename="${found.filename}"; filename*=UTF-8''${encodeURIComponent(found.filename)}`;

        return new Response(found.data, {
          status: 200,
          headers: {
            "Content-Type": found.mimeType,
            "Content-Disposition": disposition,
            "Content-Length": String(found.data.byteLength),
            "Cache-Control": "private, max-age=3600",
          },
        });
      } catch (error) {
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      params: t.Object({ id: t.String() }),
    }
  );