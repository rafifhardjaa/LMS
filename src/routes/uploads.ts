import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import { supabase } from "../utils/supabase";
import { handleError } from "../utils/response";

export const uploadsRoute = new Elysia({ prefix: "/api/v1/uploads" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, status }: any) => {
      try {
        const file = body.file;

        if (!file) {
          return status(400, {
            success: false,
            message: "File tidak ditemukan",
          });
        }

        if (file.size > 10 * 1024 * 1024) {
          return status(400, {
            success: false,
            message: "Ukuran file terlalu besar! Maksimal 10 MB.",
          });
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

        const fileBuffer = await file.arrayBuffer();
        const fileBlob = new Uint8Array(fileBuffer);

        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(fileName, fileBlob, {
            contentType: file.type,
            upsert: false,
          });

        if (error) {
          return status(500, {
            success: false,
            message: `Upload gagal: ${error.message}`,
          });
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("uploads").getPublicUrl(data.path);

        return status(201, {
          success: true,
          message: "File berhasil diunggah",
          data: { fileUrl: publicUrl },
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
  );
