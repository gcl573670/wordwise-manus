import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const origin = publicSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ...(origin ? { sitemap: new URL("/sitemap.xml", origin).toString() } : {}),
  };
}
