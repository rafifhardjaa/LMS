"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Logs the user out: best-effort server session invalidation (which also
 * clears the HttpOnly cookie), resets the local profile, then redirects
 * to the login page.
 */
export function useLogout() {
  const router = useRouter();

  return useCallback(async () => {
    try {
      await authApi.users.logout.delete();
    } catch {
      // ignore network errors — local session is cleared regardless
    } finally {
      useAuthStore.getState().clearAuth();
      router.replace("/auth/login");
    }
  }, [router]);
}
