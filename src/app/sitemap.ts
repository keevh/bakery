import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    {
      url: siteUrl,
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/admin`,
      priority: 0.3,
    },
  ];
}
