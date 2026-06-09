import { defineConfig } from "drizzle-kit";
import { loadAppEnv } from "./src/modules/shared/infrastructure/env/load-app-env";

loadAppEnv();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/modules/shared/infrastructure/db/schema.ts",
  out: "./drizzle",
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
