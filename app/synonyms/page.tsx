import type { Metadata } from "next";
import { ToolPanel } from "@/components/ToolPanel";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("Synonym Finder", "Find related synonyms and explore how close alternatives differ by context.", "/synonyms");

export default function SynonymsPage() {
  return <div className="container page-main"><ToolPanel toolId="synonym-finder" /><p className="source-note">Datamuse ranks likely related words; a high-ranked word is not necessarily an interchangeable substitute. Read each word in context.</p></div>;
}
