// Prisma 7 CLI config — replaces the `datasource.url`/`directUrl` fields
// that used to live in schema.prisma. Only used by the CLI (generate,
// migrate, studio, db seed); the running app connects separately via the
// driver adapter in src/lib/prisma.ts.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations run DDL, which pgbouncer's transaction-pooling mode (the
    // port the app uses at runtime) can't reliably execute — so the CLI
    // talks to Supabase's direct connection (port 5432) instead.
    url: env("DIRECT_URL"),
  },
});
