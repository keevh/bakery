import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { loadAppEnv } from "@/modules/shared/infrastructure/env/load-app-env";
import * as schema from "./schema";

loadAppEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const connection = postgres(databaseUrl, {
  prepare: false,
  max: 1,
});

export const db = drizzle(connection, { schema });
