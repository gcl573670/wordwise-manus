import type { Metadata } from "next";

export const SITE_NAME = "FindWord";
export const SITE_DESCRIPTION = "Clear word meanings, related words, pronunciation help, and practical writing tools.";
export const SITE_IMAGE_PATH = "/wordwise-share.webp";
export const SITE_IMAGE_ALT = "An editorial illustration of a dictionary page and word marks in FindWord's paper, deep teal, and copper palette.";

export function publicSiteUrl(): URL | undefined {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export function siteSocialImageUrl(): string | undefined {
  const origin = publicSiteUrl();
  return origin ? new URL(SITE_IMAGE_PATH, origin).toString() : undefined;
}

export function pageMetadata(title: string, description: string, path = "/", type: "website" | "article" = "website"): Metadata {
  const origin = publicSiteUrl();
  const absolute = origin ? new URL(path, origin).toString() : undefined;
  const image = siteSocialImageUrl();
  const imageMetadata = image ? [{ url: image, alt: SITE_IMAGE_ALT }] : undefined;
  return {
    title,
    description,
    ...(absolute ? { alternates: { canonical: absolute } } : {}),
    openGraph: {
      title, description, siteName: SITE_NAME, type,
      ...(absolute ? { url: absolute } : {}),
      ...(imageMetadata ? { images: imageMetadata } : {}),
    },
    twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(imageMetadata ? { images: imageMetadata } : {}) },
  };
}
