import { NextResponse } from "next/server";

// Middleware dinonaktifkan sementara selama development UI
// Aktifkan kembali setelah halaman login & dashboard selesai dibuat
export function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
