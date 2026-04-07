import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function loadLocalEnv() {
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const candidatePaths = [
    resolve(process.cwd(), ".env.local"),
    resolve(currentDirectory, "../../../../../.env.local"),
  ];

  const envPath = candidatePaths.find((candidatePath) => existsSync(candidatePath));

  if (!envPath) {
    return;
  }

  const content = readFileSync(envPath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");

    process.env[key] = value;
  }
}

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const connection = postgres(databaseUrl, {
  prepare: false,
});

export const db = drizzle(connection, { schema });
