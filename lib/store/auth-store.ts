import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/lib/api/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

/** Sync token to cookie so Next.js middleware can read it server-side */
function setTokenCookie(token: string | null) {
  if (typeof document === "undefined") return;
  if (token) {
    // Expire in 7 days; path=/ so middleware matches all routes
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `lms_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = "lms_token=; path=/; max-age=0";
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) => {
        setTokenCookie(token);
        set({ token, user, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      clearAuth: () => {
        setTokenCookie(null);
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "lms_auth",
      storage: createJSONStorage(() => localStorage),
      // Only persist token — user will be re-fetched on mount
      partialize: (state) => ({ token: state.token }),
      // Re-sync cookie when store rehydrates from localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setTokenCookie(state.token);
          state.isAuthenticated = true;
        }
      },
    }
  )
);
