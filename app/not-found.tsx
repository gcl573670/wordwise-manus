import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return <div className="container error-page"><p className="eyebrow">404 · Not found</p><h1>We couldn't find that page.</h1><p className="page-description">The address may have changed, or the requested word or article is not available.</p><div className="button-row" style={{ marginTop: 24 }}><Link className="button-primary" href="/">Back to WordWise Hub</Link><Link className="button-secondary" href="/dictionary">Search the dictionary</Link><Link className="button-secondary" href="/blog">Browse guides</Link></div></div>;
}
