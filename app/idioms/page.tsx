import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ReferenceDirectory } from "@/components/ReferenceDirectory";
import { IDIOMS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("Common English Idioms and Meanings", "Search common English idioms, short explanations, and example sentences.", "/idioms");

export default function IdiomsPage() {
  return <div className="container page-main"><PageIntro eyebrow="Reference" title="Common English idioms" description="Browse idiomatic expressions with a plain-language meaning and a short example. Usage can vary between regions and situations." currentHref="/idioms" /><ReferenceDirectory entries={IDIOMS} label="Search idioms or meanings" /></div>;
}
