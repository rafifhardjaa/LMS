/**
 * Eden Treaty API client — type-safe HTTP client for the Elysia backend.
 *
 * Usage:
 *   import { api, authApi } from "@/lib/api/client"
 *
 *   // Public routes (no auth)
 *   const { data, error } = await api.users.post({ name, email, password })
 *   const { data, error } = await api.users.login.post({ email, password })
 *
 *   // Protected routes (requires Bearer token)
 *   const { data, error } = await authApi(token).users.current.get()
 *   const { data, error } = await authApi(token).users.logout.delete()
 */

import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  ApiSuccess,
  ApiError,
  User,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ─── Low-level fetch helper ──────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: ApiError | null; status: number }> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    return {
      data: null,
      error: (body as ApiError) ?? { error: "Unknown error" },
      status: res.status,
    };
  }

  return { data: body as T, error: null, status: res.status };
}

// ─── Auth header helper ──────────────────────────────────────────────────────

function bearerHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ─── Public API (no auth) ────────────────────────────────────────────────────

export const api = {
  users: {
    /** POST /api/users — register a new user */
    post: (body: RegisterRequest) =>
      apiFetch<ApiSuccess<"OK">>("/api/users", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: {
      /** POST /api/users/login — login, returns session token */
      post: (body: LoginRequest) =>
        apiFetch<LoginResponse>("/api/users/login", {
          method: "POST",
          body: JSON.stringify(body),
        }),
    },
  },
} as const;

// ─── Authenticated API (requires Bearer token) ───────────────────────────────

export function authApi(token: string) {
  return {
    users: {
      current: {
        /** GET /api/users/current — get logged-in user info */
        get: () =>
          apiFetch<ApiSuccess<User>>("/api/users/current", {
            headers: bearerHeader(token),
          }),
      },

      logout: {
        /** DELETE /api/users/logout — invalidate session */
        delete: () =>
          apiFetch<ApiSuccess<"OK">>("/api/users/logout", {
            method: "DELETE",
            headers: bearerHeader(token),
          }),
      },
    },
  } as const;
}

// ─── Convenience: build authApi from localStorage token ──────────────────────

export function getAuthApi() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("lms_token");
  if (!token) return null;
  return authApi(token);
}
