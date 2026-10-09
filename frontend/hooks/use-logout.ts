"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Logs the user out: best-effort server session invalidation, clears the
 * local token + cookie, then redirects to the login page.
 */
export function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    const token = useAuthStore.getState().token;
    try {
      if (token) await authApi(token).users.logout.delete();
    } catch {
      // ignore network errors — local session is cleared regardless
    } finally {
      useAuthStore.getState().clearAuth();
      router.replace("/auth/login");
    }
  }, [router]);
}
