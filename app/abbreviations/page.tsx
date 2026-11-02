import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ReferenceDirectory } from "@/components/ReferenceDirectory";
import { ABBREVIATIONS, ACRONYMS } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("Common English Abbreviations and Acronyms", "Search common abbreviations, acronyms, and initialisms with examples and source links.", "/abbreviations");

export default function AbbreviationsPage() {
  return <div className="container page-main"><PageIntro eyebrow="Reference" title="Abbreviations and acronyms" description="Search a curated starter collection. Acronyms and initialisms are grouped separately from general abbreviations; the list is not exhaustive." currentHref="/abbreviations" />
    <section className="section"><h2>Abbreviations</h2><ReferenceDirectory entries={ABBREVIATIONS} label="Search abbreviations" /></section>
    <section className="section"><h2>Acronyms and initialisms</h2><ReferenceDirectory entries={ACRONYMS} label="Search acronyms and initialisms" /></section>
  </div>;
}
