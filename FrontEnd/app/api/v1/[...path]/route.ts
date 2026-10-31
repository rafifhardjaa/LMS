import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BACKEND_URL } from "@/lib/auth/backend";
import { TOKEN_COOKIE } from "@/lib/auth/cookie";

const BODYLESS_METHODS = new Set(["GET", "HEAD"]);

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  const target = `${BACKEND_URL}/api/v1/${path
    .map(encodeURIComponent)
    .join("/")}${req.nextUrl.search}`;

  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);
  if (token) headers.set("authorization", `Bearer ${token}`);

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: BODYLESS_METHODS.has(req.method)
      ? undefined
      : await req.arrayBuffer(),
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  if (upstreamType) responseHeaders.set("content-type", upstreamType);

  const res = new NextResponse(
    upstream.status === 204 ? null : await upstream.arrayBuffer(),
    { status: upstream.status, headers: responseHeaders }
  );

  if (upstream.status === 401 && token) {
    res.cookies.delete(TOKEN_COOKIE);
  }

  return res;
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
  proxy as HEAD,
};
