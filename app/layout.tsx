import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { publicSiteUrl, SITE_DESCRIPTION, SITE_IMAGE_ALT, SITE_IMAGE_PATH, SITE_NAME } from "@/lib/seo/site";
import "./globals.css";

const origin = publicSiteUrl();
const imageUrl = origin ? new URL(SITE_IMAGE_PATH, origin).toString() : undefined;
const shareImage = imageUrl ? [{ url: imageUrl, alt: SITE_IMAGE_ALT }] : undefined;

export const metadata: Metadata = {
  metadataBase: origin,
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  keywords: ["English dictionary", "word meanings", "synonyms", "antonyms", "writing tools", "English grammar"],
  icons: { icon: "/wordwise-mark.svg" },
  openGraph: { siteName: SITE_NAME, type: "website", title: SITE_NAME, description: SITE_DESCRIPTION, ...(origin ? { url: origin.toString() } : {}), ...(shareImage ? { images: shareImage } : {}) },
  twitter: { card: shareImage ? "summary_large_image" : "summary", title: SITE_NAME, description: SITE_DESCRIPTION, ...(shareImage ? { images: shareImage } : {}) },
  formatDetection: { email: false, telephone: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader /><main id="main-content">{children}</main><SiteFooter /></body></html>;
}
