import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, decryptSession } from "@/lib/session";

// Optimistic check only (cookie read, no DB hit) — the real, authoritative
// check happens per-request in each admin page/layout (requireAdminSession)
// and each /api/admin/* route handler (getAdminSession), per Next's
// recommended defense-in-depth pattern. This just keeps unauthenticated
// visitors from ever reaching the admin UI.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
