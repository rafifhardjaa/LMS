/** Base URL backend Elysia, hanya dipakai di server (route handler). */
export const BACKEND_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000";

/** Fetch ke backend tanpa cache — dipakai oleh route handler BFF. */
export async function backendFetch(path: string, init: RequestInit = {}) {
  return fetch(`${BACKEND_URL}${path}`, {
    ...init,
    cache: "no-store",
  });
}

export async function readJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
