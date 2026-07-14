import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminCredentials } from "@/lib/auth";
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, encryptSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await verifyAdminCredentials(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await encryptSession({ sub: user.id, email: user.email });
  (await cookies()).set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions);

  return NextResponse.json({ ok: true });
}
