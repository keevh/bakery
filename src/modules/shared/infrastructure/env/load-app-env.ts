import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENV_FILE_NAMES = [".env", ".env.local"];

function applyEnvFile(envPath: string, protectedKeys: Set<string>) {
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

    if (protectedKeys.has(key)) {
      continue;
    }

    process.env[key] = value;
  }
}

export function loadAppEnv() {
  const protectedKeys = new Set(Object.keys(process.env));
  const currentDirectory = dirname(fileURLToPath(import.meta.url));
  const projectRoot = resolve(currentDirectory, "../../../../../");
  const candidateRoots = [projectRoot, process.cwd()];
  const visitedPaths = new Set<string>();

  for (const root of candidateRoots) {
    for (const fileName of ENV_FILE_NAMES) {
      const envPath = resolve(root, fileName);

      if (visitedPaths.has(envPath) || !existsSync(envPath)) {
        continue;
      }

      applyEnvFile(envPath, protectedKeys);
      visitedPaths.add(envPath);
    }
  }
}
