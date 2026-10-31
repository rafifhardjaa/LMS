import { NextResponse } from "next/server";
import { backendFetch, readJson } from "@/lib/auth/backend";
import { sessionCookie } from "@/lib/auth/cookie";

interface BackendLogin {
  success?: boolean;
  message?: string;
  data?: string;
  must_change_password?: boolean;
}

interface BackendCurrent {
  data?: unknown;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Body tidak valid" },
      { status: 400 }
    );
  }

  const loginRes = await backendFetch("/api/v1/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const login = await readJson<BackendLogin>(loginRes);

  if (!loginRes.ok) {
    return NextResponse.json(
      login ?? { success: false, message: "Login gagal" },
      { status: loginRes.status }
    );
  }

  const token = login?.data;
  if (typeof token !== "string") {
    return NextResponse.json(
      { success: false, message: "Token tidak diterima dari server" },
      { status: 502 }
    );
  }

  const currentRes = await backendFetch("/api/v1/users/current", {
    headers: { authorization: `Bearer ${token}` },
  });
  const current = await readJson<BackendCurrent>(currentRes);

  if (!currentRes.ok || !current?.data) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pengguna" },
      { status: 502 }
    );
  }

  const res = NextResponse.json({
    success: true,
    data: current.data,
    must_change_password: login?.must_change_password ?? false,
  });
  res.cookies.set(sessionCookie(token));
  return res;
}
