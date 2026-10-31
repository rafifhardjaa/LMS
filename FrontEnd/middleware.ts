import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/cookie";

interface ProtectedArea {
  prefix: string;
  roles: readonly string[];
}

const PROTECTED_AREAS: readonly ProtectedArea[] = [
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/teacher", roles: ["guru", "teacher"] },
  { prefix: "/student", roles: ["siswa", "student"] },
];

const AUTH_PAGES = [
  "/auth/login",
  "/auth/activate",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/login",
];

const ROLE_HOME: Record<string, string> = {
  admin: "/admin/dashboard",
  guru: "/teacher/dashboard",
  teacher: "/teacher/dashboard",
  siswa: "/student/dashboard",
  student: "/student/dashboard",
};

interface Session {
  role: string;
}

/**
 * Decode the (already server-issued) JWT payload to read the role claim and
 * reject tokens that are malformed or past their `exp`.
 */
function readSession(token: string): Session | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const payload = JSON.parse(atob(padded)) as {
      role?: unknown;
      exp?: unknown;
    };

    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return typeof payload.role === "string" ? { role: payload.role } : null;
  } catch {
    return null;
  }
}

/** Nearest protected area owning the requested path, if any. */
function findArea(pathname: string): ProtectedArea | undefined {
  return PROTECTED_AREAS.find(
    (area) =>
      pathname === area.prefix || pathname.startsWith(`${area.prefix}/`)
  );
}

function redirectToLogin(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.search = "";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API routes (including the same-origin auth proxy) enforce their own auth.
  if (pathname === "/api" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  const session = token ? readSession(token) : null;
  const area = findArea(pathname);

  // Protected page: a valid session is required and the role must match the area.
  if (area) {
    if (!session) {
      return redirectToLogin(req, pathname);
    }

    const home = ROLE_HOME[session.role];
    if (!home) {
      return redirectToLogin(req, pathname);
    }

    if (!area.roles.includes(session.role)) {
      const url = req.nextUrl.clone();
      url.pathname = home;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Authenticated user hitting login -> their dashboard.
  if (session && AUTH_PAGES.includes(pathname)) {
    const home = ROLE_HOME[session.role] ?? "/student/dashboard";
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
