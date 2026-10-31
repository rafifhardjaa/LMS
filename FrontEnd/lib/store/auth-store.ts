import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/lib/api/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  clearAuth: () => void;
}

const STORAGE_KEY = "lms_auth";

/**
 * Versi lama menyimpan JWT di localStorage. Hapus sisa token itu sebelum
 * store dihidrasi agar tidak ada lagi kredensial yang bisa dicuri XSS.
 */
function purgeLegacyToken() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };
    if (parsed.state && "token" in parsed.state) {
      delete parsed.state.token;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

purgeLegacyToken();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Hanya profil user yang dipersist — token hidup di cookie HttpOnly.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<AuthState> | undefined;
        if (!state?.user) {
          return { user: null, isAuthenticated: false };
        }
        return { user: state.user, isAuthenticated: true };
      },
    }
  )
);
