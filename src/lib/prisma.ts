import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

export { OrderStatus, DeliveryRegion } from "../../generated/prisma/enums";
export { Prisma } from "../../generated/prisma/client";
export type { Order } from "../../generated/prisma/client";

// Next.js dev-mode hot-reloads modules on every file change, which would
// otherwise spin up a fresh PrismaClient (and DB connection pool) per
// reload. Stashing the instance on `globalThis` survives the reload.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 ships no bundled query engine — it talks to Postgres through this
// driver adapter instead. Runtime queries go through Supabase's pooled
// (pgbouncer) connection string; the CLI/migrations use DIRECT_URL, set in
// prisma.config.ts.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
