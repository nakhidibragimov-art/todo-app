import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // process.env instead of env(): `prisma generate` (run on npm install) doesn't need
    // a database, so a missing .env must not break installation. Migrate commands
    // still fail with a clear error if DATABASE_URL is not set.
    url: process.env.DATABASE_URL ?? "",
  },
});
