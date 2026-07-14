import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, decryptSession } from "@/lib/session";

/**
 * Non-redirecting session read — use this in Route Handlers (and anywhere
 * else you need to decide the response yourself, e.g. a 401 JSON body
 * instead of a redirect).
 */
export const getAdminSession = cache(async () => {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return decryptSession(token);
});

/**
 * Redirecting session check — use this in Server Components/layouts/pages
 * under /admin, where an unauthenticated visitor should simply be bounced
 * to the login page rather than shown a JSON error.
 */
export const requireAdminSession = cache(async () => {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
});
