const DEFAULT_PRODUCTION_SITE_URL = "https://bakery.keevh.dev";
const DEFAULT_DEVELOPMENT_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
  const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  if (envSiteUrl) {
    return envSiteUrl;
  }

  return process.env.NODE_ENV === "development"
    ? DEFAULT_DEVELOPMENT_SITE_URL
    : DEFAULT_PRODUCTION_SITE_URL;
}
