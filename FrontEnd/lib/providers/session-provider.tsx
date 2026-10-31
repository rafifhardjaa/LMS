"use client";

import { useEffect } from "react";
import { authApi } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Menyelaraskan profil di store dengan cookie sesi HttpOnly setiap halaman
 * dimuat: memulihkan sesi setelah refresh dan membersihkan profil bila
 * cookie sudah tidak berlaku.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;

    authApi.users.current
      .get()
      .then(({ data, status }) => {
        if (cancelled) return;
        if (data?.data) {
          useAuthStore.getState().setUser(data.data);
        } else if (status === 401) {
          useAuthStore.getState().clearAuth();
        }
      })
      .catch(() => {
        // Jaringan bermasalah — biarkan profil persisten apa adanya.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
