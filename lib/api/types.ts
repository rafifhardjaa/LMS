/**
 * Type definitions mirroring the Elysia backend schema.
 * Keep this in sync with LMS/src/db/schema.ts and LMS/src/routes/*.ts
 */

// ─── User & Session ──────────────────────────────────────────────────────────

export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

// ─── Request / Response shapes ───────────────────────────────────────────────

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: string; // Bearer token (UUID)
}

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiError {
  error: string;
}
