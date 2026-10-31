export const TOKEN_COOKIE = "lms_token";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

/** Cookie sesi HttpOnly — token tidak pernah bisa dibaca JavaScript. */
export function sessionCookie(token: string) {
  return {
    name: TOKEN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
