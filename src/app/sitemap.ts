import type { MetadataRoute } from "next";
import { getNews } from "@/lib/site";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/academics", "/admissions", "/boarding", "/gallery", "/news", "/fees", "/contact"];
  const now = new Date();
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/news" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const articles: MetadataRoute.Sitemap = getNews().map((item) => {
    const parsed = new Date(item.created_at.includes("T") ? item.created_at : item.created_at.replace(" ", "T") + "Z");
    return {
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: Number.isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  return [...pages, ...articles];
}
