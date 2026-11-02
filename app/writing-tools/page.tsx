import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { TOOL_CATALOG } from "@/data/tools";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("Writing Tools", "Count, format, and review text with browser-side writing tools and optional grammar suggestions.", "/writing-tools");

export default function WritingToolsPage() {
  const tools = TOOL_CATALOG.filter((tool) => tool.group === "Writing");
  return <div className="container page-main"><PageIntro eyebrow="Writing desk" title="Small tools for clearer drafts" description="Count and reshape text locally in your browser. The grammar checker offers limited local checks and an explicitly optional LanguageTool request." currentHref="/writing-tools" />
    <div className="tool-grid">{tools.map((tool) => <article className="tool-card" key={tool.id}><span className="tool-icon">Writing tool</span><h2>{tool.title}</h2><p>{tool.description}</p><Link className="text-link" href={`/tools/${tool.id}`}>Open tool <span aria-hidden="true">→</span></Link></article>)}</div>
  </div>;
}
