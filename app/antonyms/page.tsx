import type { Metadata } from "next";
import { ToolPanel } from "@/components/ToolPanel";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("Antonym Finder", "Search for opposites and check distinctions between the available antonyms.", "/antonyms");

export default function AntonymsPage() {
  return <div className="container page-main"><ToolPanel toolId="antonym-finder" /><p className="source-note">Opposites can depend on the sense of a word. Datamuse results are suggestions, not a guarantee that two terms are exact logical opposites.</p></div>;
}
