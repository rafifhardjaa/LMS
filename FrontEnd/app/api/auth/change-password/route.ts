import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch, readJson } from "@/lib/auth/backend";
import { TOKEN_COOKIE, sessionCookie } from "@/lib/auth/cookie";

interface BackendChangePassword {
  success?: boolean;
  message?: string;
  data?: string;
  must_change_password?: boolean;
}

interface BackendCurrent {
  data?: unknown;
}

export async function PUT(req: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Body tidak valid" },
      { status: 400 }
    );
  }

  const changeRes = await backendFetch("/api/v1/auth/password", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const change = await readJson<BackendChangePassword>(changeRes);

  if (!changeRes.ok) {
    const res = NextResponse.json(
      change ?? { success: false, message: "Gagal mengganti password" },
      { status: changeRes.status }
    );
    if (changeRes.status === 401) res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  const nextToken = change?.data;
  if (typeof nextToken !== "string") {
    return NextResponse.json(
      { success: false, message: "Token baru tidak diterima dari server" },
      { status: 502 }
    );
  }

  const currentRes = await backendFetch("/api/v1/users/current", {
    headers: { authorization: `Bearer ${nextToken}` },
  });
  const current = await readJson<BackendCurrent>(currentRes);

  if (!currentRes.ok || !current?.data) {
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pengguna" },
      { status: 502 }
    );
  }

  const res = NextResponse.json({ success: true, data: current.data });
  res.cookies.set(sessionCookie(nextToken));
  return res;
}
