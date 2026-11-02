import type { Metadata } from "next";
import { ToolPanel } from "@/components/ToolPanel";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("English Pronunciation Finder", "Find phonetic transcriptions and available audio pronunciations for English words.", "/pronunciation");

export default function PronunciationPage() {
  return <div className="container page-main"><ToolPanel toolId="pronunciation-finder" /><p className="source-note">Audio and phonetic transcriptions are shown only when the Free Dictionary API returns them. This site does not synthesize missing recordings or estimate syllable counts.</p></div>;
}
