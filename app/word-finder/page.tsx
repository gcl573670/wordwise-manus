import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { TOOL_CATALOG } from "@/data/tools";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("Word Finder Tools", "Find words by letters, length, meaning, sound, associations, acronyms, abbreviations, and idioms.", "/word-finder");

export default function WordFinderPage() {
  const tools = TOOL_CATALOG.filter((tool) => tool.group === "Word discovery" || tool.id === "synonym-finder" || tool.id === "antonym-finder" || tool.id === "rhyme-finder");
  return <div className="container page-main"><PageIntro eyebrow="Word discovery" title="Find a word by its letters, meaning, or sound" description="Some searches use a finite local word list; meaning and sound suggestions come from Datamuse. Each tool explains its source and limits." currentHref="/word-finder" />
    <div className="tool-grid">{tools.map((tool) => <article className="tool-card" key={tool.id}><span className="tool-icon">{tool.group}</span><h2>{tool.title}</h2><p>{tool.description}</p><Link className="text-link" href={`/tools/${tool.id}`}>Open tool <span aria-hidden="true">→</span></Link></article>)}</div>
  </div>;
}
