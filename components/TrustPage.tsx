import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

const pages = {
  about: {
    title: "About WordWise Hub",
    intro: "WordWise Hub is a reference and writing-tools website for people who want clearer English word choices.",
    sections: [
      ["What the site offers", "The site brings together word lookups, related-word search, pronunciation details when a provider supplies them, practical writing utilities, and original language guides."],
      ["How information is presented", "External dictionary and related-word results are identified by source. Editorial explanations and provider data are kept distinct. A missing provider result is not replaced with invented information."],
      ["Owner information", "The project owner has not supplied a public operator name or organization. No owner identity is stated here."],
    ],
  },
  contact: {
    title: "Contact WordWise Hub",
    intro: "No public contact address or contact form has been supplied for this project.",
    sections: [
      ["Current contact status", "There is no published support email, mailing address, or contact form on this site. Do not submit private or sensitive information expecting a response."],
      ["Before public launch", "The site owner must choose and provide a real public contact method. This page intentionally does not invent one."],
    ],
  },
  privacy: {
    title: "Privacy information",
    intro: "This page describes what the current WordWise Hub application does with the information entered into its tools. It is an operational summary, not a jurisdiction-specific legal review.",
    sections: [
      ["Writing tools", "Word, character, sentence, paragraph, reading-time, formatting, and conversion tools run in your browser. The application does not save that text to an account or database. Search history, if your browser permits it, is kept only in local browser storage."],
      ["Dictionary and related-word requests", "A word lookup sends the requested word to the Free Dictionary API. Synonym, antonym, rhyme, and association searches send the requested word to Datamuse. These providers receive the query as part of answering it and are subject to their own policies."],
      ["Optional grammar service", "Local grammar checks run in your browser. Only if you choose the LanguageTool button is the entered text sent to LanguageTool. WordWise Hub does not persist the submitted text; the external provider's processing is governed by its own terms and privacy policy."],
      ["Reference requests", "Wikipedia/MediaWiki lookup is disabled until a real operator contact is configured. When enabled, the requested curated topic is sent to the reference provider."],
      ["Technical operation", "Network requests pass through the configured hosting infrastructure. The project owner has not supplied a jurisdiction, legal entity, or privacy contact, and the hosting provider's production logging/retention configuration must be reviewed before launch."],
      ["Owner review required", "The application source contains no advertising or site-owned analytics integration. Hosting-level logs and any analytics or metrics settings depend on the selected deployment; before public launch, the owner must verify their operation and retention, review this summary against the legal requirements, and supply a real privacy contact."],
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "WordWise Hub is a language-learning and writing reference. The project owner has not supplied a legal identity, jurisdiction, or governing-law choice, so this page does not invent them.",
    sections: [
      ["Use of the tools", "You may use the public tools for ordinary personal and educational word and writing tasks. Do not use them to overload providers, evade their limits, or submit information you are not authorized to share."],
      ["External services", "Some results come from third-party APIs and may be incomplete, unavailable, or subject to provider-specific terms. Source labels identify those providers. The site does not promise that a result is exhaustive or suitable for every context."],
      ["No professional advice", "Language examples and basic local checks are informational. They are not legal, medical, financial, or other professional advice, and an automated suggestion does not replace human review."],
      ["Owner review required", "The site owner must provide the operating entity, jurisdiction, effective date, contact details, and any governing terms before treating this draft as final legal terms."],
    ],
  },
  editorial: {
    title: "Editorial Policy",
    intro: "WordWise Hub separates editorial explanations from externally supplied reference data.",
    sections: [
      ["Original writing", "Articles are prepared for this site with original examples. Close synonyms are explained in context rather than presented as automatic substitutes. Claims about word history are omitted unless supported by a reliable source."],
      ["Sources and review", "When a guide relies on external factual information, its sources are linked on the page. The published review date is stored in its article metadata. Dictionary and related-word API responses are labeled as provider data, not edited into original definitions."],
      ["Corrections", "No public correction contact has been supplied. The owner must publish one before readers can submit corrections or request a review."],
      ["Byline", "Articles use the role byline “WordWise Hub Editorial Team”; no individual author or credential is claimed."],
    ],
  },
  sources: {
    title: "API Sources and Attribution",
    intro: "WordWise Hub labels third-party results and links to provider documentation. Provider data is not fabricated when a source omits a field or is unavailable.",
    sections: [
      ["Free Dictionary API", "Used for English definitions, parts of speech, phonetics, audio, examples, synonyms, and antonyms when returned. No API key is used. Source: https://dictionaryapi.dev/."],
      ["Datamuse", "Used for meaning-related words, synonyms, antonyms, associations, rhymes, and sound similarity. Source: https://www.datamuse.com/api/. Usage and key requirements can change; an optional server-only key is supported."],
      ["Wikipedia / MediaWiki", "Selected excerpts may be used only after a real operator contact is configured. Requests use an informative User-Agent and are cached; excerpts include source, page-history, and CC BY-SA 4.0 links. API etiquette: https://www.mediawiki.org/wiki/API:Etiquette."],
      ["LanguageTool", "The external check is optional and only runs after an explicit user action. It receives the submitted text. The public service may change limits or availability and requires a visible link to LanguageTool. Source: https://dev.languagetool.org/public-http-api.html."],
      ["Curated reference entries", "Local vocabulary, abbreviation, acronym, and idiom entries include source links, attribution notes, and license notes in repository JSON. Those finite lists are not presented as exhaustive."],
    ],
  },
  disclaimer: {
    title: "Disclaimer",
    intro: "WordWise Hub provides general English-language reference and writing tools.",
    sections: [
      ["Context matters", "Definitions and related words may cover only some senses or regional uses. Synonym and antonym suggestions can differ in tone, grammar, or meaning; review the full sentence before choosing a word."],
      ["Automated tools", "Local grammar checks are limited pattern checks, not comprehensive proofreading. LanguageTool suggestions can be incorrect or incomplete. Pronunciation audio and phonetic spelling appear only when a provider returns them."],
      ["Availability and sources", "Third-party APIs may be unavailable or change their data. WordWise Hub does not guarantee that a result is current, complete, or fit for a particular purpose. Check the linked provider when accuracy is important."],
      ["Owner review", "The owner has not supplied a legal entity, public contact, or jurisdiction. This page is a product disclaimer summary, not reviewed legal advice."],
    ],
  },
} as const;

export type TrustPageKey = keyof typeof pages;
const pagePaths: Record<TrustPageKey, string> = { about: "/about", contact: "/contact", privacy: "/privacy", terms: "/terms", editorial: "/editorial-policy", sources: "/api-sources", disclaimer: "/disclaimer" };

export function TrustPage({ page }: { page: TrustPageKey }) {
  const content = pages[page];
  const needsOwnerDetails = ["about", "contact", "privacy", "terms", "editorial"].includes(page);
  return <div className="container page-main"><div className="narrow trust-content">
    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: content.title, href: pagePaths[page] }]} currentHref={pagePaths[page]} />
    <p className="eyebrow">WordWise Hub · site information</p><h1>{content.title}</h1><p className="page-description">{content.intro}</p>
    {needsOwnerDetails ? <p className="trust-note"><strong>Owner details are not yet configured.</strong> This page avoids invented contact and legal facts. The owner must review it before production launch.</p> : null}
    {content.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body.includes("https://") ? body.split(/(https:\/\/[^ ]+)/g).map((part, index) => part.startsWith("https://") ? <a key={`${part}-${index}`} href={part} target="_blank" rel="noreferrer">{part}</a> : part) : body}</p></section>)}
    {page === "sources" ? <p><Link href="/writing-tools">Explore the writing tools</Link></p> : null}
  </div></div>;
}
