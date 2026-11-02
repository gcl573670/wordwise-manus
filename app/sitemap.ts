import type { MetadataRoute } from "next";
import { TOOL_CATALOG } from "@/data/tools";
import { getArticles } from "@/lib/content";
import { publicSiteUrl } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = publicSiteUrl();
  if (!origin) return [];
  const paths = [
    "/", "/dictionary", "/synonyms", "/antonyms", "/pronunciation", "/word-finder",
    "/grammar", "/writing-tools", "/abbreviations", "/idioms", "/blog",
    ...["vocabulary", "synonyms", "grammar", "writing", "reference"].map((topic) => `/topics/${topic}`),
    ...TOOL_CATALOG.map((tool) => `/tools/${tool.id}`),
    ...getArticles().map((article) => `/${article.category}/${article.slug}`),
  ];
  return [...new Set(paths)].map((path) => ({
    url: new URL(path, origin).toString(),
    changeFrequency: path.startsWith("/tools/") ? "monthly" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/topics/") ? 0.8 : 0.7,
  }));
}
