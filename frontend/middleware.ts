import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "lms_token";

const PROTECTED_PREFIXES = ["/admin", "/teacher", "/student"];
const AUTH_PAGES = ["/auth/login", "/auth/register", "/login", "/register"];

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  guru: "/teacher/dashboard",
  teacher: "/teacher/dashboard",
  siswa: "/student/dashboard",
  student: "/student/dashboard",
};

/** Decode the (already server-issued) JWT payload to read the role claim. */
function decodeRole(token: string): string | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { role?: unknown };
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Unauthenticated user hitting a protected page -> login (keep intended path).
  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.search = "";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated user hitting login/register -> their dashboard.
  if (token && AUTH_PAGES.includes(pathname)) {
    const role = decodeRole(token);
    const home = (role && ROLE_HOME[role]) || "/student/dashboard";
    const url = req.nextUrl.clone();
    url.pathname = home;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
