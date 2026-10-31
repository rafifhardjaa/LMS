import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch, readJson } from "@/lib/auth/backend";
import { TOKEN_COOKIE } from "@/lib/auth/cookie";

interface BackendCurrent {
  data?: unknown;
}

export async function GET() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentRes = await backendFetch("/api/v1/users/current", {
    headers: { authorization: `Bearer ${token}` },
  });
  const current = await readJson<BackendCurrent>(currentRes);

  if (!currentRes.ok || !current?.data) {
    const res = NextResponse.json(
      current ?? { error: "Unauthorized" },
      { status: currentRes.status }
    );
    if (currentRes.status === 401) res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  return NextResponse.json({ data: current.data });
}
