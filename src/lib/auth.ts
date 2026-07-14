import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/** Verifies email/password against the AdminUser table. Returns the user (sans hash) on success, null otherwise. */
export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.name };
}
