import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch, readJson } from "@/lib/auth/backend";
import { TOKEN_COOKIE } from "@/lib/auth/cookie";

interface BackendMessage {
  data?: unknown;
  success?: boolean;
  message?: string;
}

export async function POST() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  if (token) {
    const logoutRes = await backendFetch("/api/v1/users/logout", {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    });
    await readJson<BackendMessage>(logoutRes);
  }

  const res = NextResponse.json({ success: true, data: "OK" });
  res.cookies.delete(TOKEN_COOKIE);
  return res;
}
