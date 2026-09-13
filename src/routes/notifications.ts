import { Elysia, t } from "elysia";
import { authMiddleware, requireRole } from "../middleware/auth-middleware";
import {
  listUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/reviews-notifications-services";
import { handleError } from "../utils/response";

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
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
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
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
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
        const err = handleError(error);
        return status(err.status, { success: false, message: err.message });
      }
    },
    {
      beforeHandle: requireRole(["admin", "guru", "siswa"]),
      params: t.Object({
        id: t.String(),
      }),
    }
  );
