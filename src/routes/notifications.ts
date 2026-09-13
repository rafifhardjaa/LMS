import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  listUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/reviews-notifications-services";

function toError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "Notifikasi tidak ditemukan") {
      return { status: 404 as const, body: { error: error.message } };
    }
    if (error.message === "Akses ditolak") {
      return { status: 403 as const, body: { error: error.message } };
    }
    if (error.message === "ID tidak valid") {
      return { status: 400 as const, body: { error: error.message } };
    }
  }
  throw error;
}

export const notificationsRoute = new Elysia({
  prefix: "/api/v1/notifications",
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ user, status }: any) => {
      try {
        const notificationsList = await listUserNotifications(user.id);
        return status(200, {
          success: true,
          message: "Daftar notifikasi berhasil diambil",
          data: notificationsList,
        });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
    }
  )
  .patch(
    "/read-all",
    async ({ user, status }: any) => {
      try {
        await markAllNotificationsAsRead(user.id);
        return status(200, {
          success: true,
          message: "Semua notifikasi ditandai telah dibaca",
        });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
    }
  )
  .patch(
    "/:id/read",
    async ({ params, user, status }: any) => {
      try {
        const updated = await markNotificationAsRead(params.id, user.id);
        return status(200, {
          success: true,
          message: "Notifikasi ditandai telah dibaca",
          data: updated,
        });
      } catch (error) {
        const m = toError(error);
        return status(m.status, { success: false, message: m.body.error });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      params: t.Object({
        id: t.String(),
      }),
    }
  );
