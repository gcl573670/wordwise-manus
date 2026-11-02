# WordWise Hub — Implementation Plan

**Status:** Approved to proceed by owner on 2026-11-01; maintained during implementation.  
**Updated:** 2026-11-01

## Product scope

Build WordWise Hub as a fast, accessible English vocabulary, dictionary and writing-tools website for English-speaking audiences. The delivered scope is the complete brief: the responsive homepage and navigation; all 25 usable reference and writing tools; five editorial silos and their landing pages; all 25 full original articles; API integrations and fallbacks; SEO and attribution; trust/legal pages; project documentation; and a launch checklist. No tool will show invented API results or a button that does nothing. Core browser-side writing tools and local reference data will continue to work when third-party services are down.

The site will not publish every API lookup as an indexable word page. Indexable article and category content will be curated; result/search routes will remain noindex or non-indexable. Every provider-dependent view will expose a source and truthful loading, empty and failure states. The 25 requested article topics are preserved verbatim in the content scope below; each article will be a complete, original piece rather than an outline.

## Implementation and deployment approach

Use Next.js App Router, TypeScript, Tailwind CSS and accessible reusable components. Use the Next.js server runtime for Route Handlers, while rendering the fixed editorial and reference data with static generation where practical. This keeps the initial article and silo content in crawler-visible HTML and avoids a database requirement.

For the explicitly requested Cloudflare target, use the OpenNext Cloudflare adapter and Cloudflare Workers rather than a static-only Pages export: the application includes dynamic server API routes. Cloudflare's current adapter guide documents App Router, Route Handlers, static generation and server rendering support. Cloudflare's guide currently recommends vinext as the default for new projects and describes OpenNext as the adapter to use where compatibility calls for it; because this brief explicitly names Next.js, the plan retains Next.js and uses the documented OpenNext path. Revisit the adapter if a real compatibility blocker appears.

Keep the application database-free and avoid required paid services. API keys will not be needed for the first working version of Free Dictionary, MediaWiki, or the on-demand public LanguageTool integration. Datamuse is keyless at present, but its published page contains inconsistent dates for the announced future API-key requirement; implement an optional server-only `DATAMUSE_API_KEY`, document the provider's changing access policy, and do not hard-code assumptions about that future transition.

Cloudflare Workers can be configured for a GitHub main-branch build, but this initialized workspace is currently connected to its Manus-managed Git remote, not an owner-supplied GitHub repository. The implementation will include the Wrangler/OpenNext configuration and a precise connection/deployment guide. Connecting a real owner repository, Cloudflare account, production domain, or DNS is a separate owner-authorized go-live step; none can be inferred from the brief. The preview and the instructions are not a claim that Cloudflare production deployment has already happened.

## Application structure

- `app/` — homepage, category/silo, article, dictionary/result and tool pages; shared metadata; `not-found` response.
- `app/api/` — server Route Handlers for dictionary, related words, reference lookups and optional grammar requests. Validate, bound and normalize all inputs before provider calls.
- `components/` — site shell, navigation, accessible search, result panels, source labels, copy controls, tool inputs and status states.
- `lib/api/` — provider adapters (`dictionary.ts`, `datamuse.ts`, `wiktionary.ts` as the requested facade, `mediawiki.ts` for the MediaWiki-backed Wikipedia excerpt implementation, and `grammar.ts`), each with timeouts and normalized errors.
- `lib/cache/` — bounded, TTL response caching with provider-specific durations; use only runtime-compatible cache primitives and state clearly when fallback cache is instance-local.
- `lib/validation/` — shared schemas and safe query/text limits.
- `lib/seo/` — metadata helpers, structured-data builders, canonical-origin handling and sitemap route inventory.
- `content/articles/` — 25 MDX or Markdown articles with validated frontmatter.
- `data/` — validated, repository-owned abbreviations, acronyms, idioms, quiz vocabulary and small reference data with attribution fields where applicable.
- `public/` — site icon/wordmark assets, `robots.txt` and `manus-routes.json`.
- `README.md`, `.env.example`, `wrangler.jsonc`, `open-next.config.ts` — local setup, configuration, Cloudflare deployment and environment-variable notes.

Content schemas will validate required frontmatter and JSON fields during build. A validation error will identify the file and field clearly. Avoid a database and user accounts; browser-only history will stay in local storage and will not be sent to the server.

## Provider behavior and privacy

- **Free Dictionary API:** server-side lookup of `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`. Show only provider-returned definitions, parts of speech, phonetics, audio, examples and relations. Missing fields stay missing; unknown words show a real not-found state.
- **Datamuse:** use documented meaning, related-word, rhyme and sound query modes. Sort by provider relevance when returned. Attribute Datamuse in the app and docs. Cache responses and cap request/result sizes. Read an optional key from the server environment only.
- **MediaWiki:** use carefully selected, short reference excerpts with a visible source-page link and applicable license attribution; never mirror whole articles. Send sequential requests with a descriptive User-Agent that includes a real operator contact. This requires the owner to supply contact information before enabling live MediaWiki requests. If that is absent, explain the integration as unavailable rather than sending a misleading or generic agent string.
- **LanguageTool:** make a request only after an explicit user action, never on every keystroke or as an automatic background scan. The public endpoint documents limits of 20 requests/minute per IP, 75 KB/minute, and 20 KB/request, says availability/limits may change, and requires a visible link back. Enforce conservative request and text limits. Tell users before submission that the text is sent to LanguageTool; do not store submitted text. If it fails or is not configured/usable, provide clearly labeled local checks (for example repeated words, spacing and simple punctuation heuristics), not a claim of equivalent grammar coverage.

Use `AbortSignal.timeout` or an equivalent supported timeout, conservative retries only for retryable failures, and transparent 429/5xx messages. Start with about seven-day word/related-word caching and shorter configurable durations where provider rules require it. Add basic per-instance rate limits and input bounds; document that this is best-effort abuse protection, not a globally coordinated quota without a paid/distributed limit service.

## Tools and reference data

All listed controls will be operable and connected to either local logic/data or the appropriate API: word meaning, synonyms, antonyms, pronunciation, rhymes, unscrambling, starts/ends/contains-letter searches, random word, word length, vocabulary quiz, word association, acronym/abbreviation and idiom finder; word, character, sentence and paragraph counting; reading-time estimates; sentence case, upper/lowercase and text formatting; and basic grammar checking. All API-backed controls will expose loading, useful empty and failure states, and source attribution. Unreliable syllable counts will not be asserted. Local discovery features will be backed by clearly scoped, repository-curated seed data; they will not pretend to search a complete English lexicon.

The five category silos are Vocabulary, Synonyms and Antonyms, Grammar, Writing, and Reference. Each will have a helpful introduction, links to relevant tools and editorial pages, and no thin auto-generated pages.

## Editorial deliverables

All 25 original full articles requested:

1. 100 Commonly Confused English Words.
2. 50 Positive Words to Describe Someone.
3. Words That Start With A: Meanings and Examples.
4. Words That Start With B: Meanings and Examples.
5. 100 Powerful Words to Improve Your Vocabulary.
6. 50 Synonyms for Important With Examples.
7. Other Ways to Say Thank You.
8. 30 Different Ways to Say Happy.
9. Synonyms for Beautiful: Different Contexts and Examples.
10. Other Ways to Say I Agree.
11. Common English Grammar Mistakes and How to Fix Them.
12. Affect vs Effect: Meaning and Examples.
13. Their vs There vs They're.
14. Your vs You're.
15. Then vs Than.
16. How to Write a Professional Email.
17. How to Write a Clear and Effective Paragraph.
18. How to Improve Your English Writing Skills.
19. How to Avoid Repetition in Writing.
20. Active Voice vs Passive Voice.
21. Common English Abbreviations and Their Meanings.
22. Common Acronyms Used in Everyday English.
23. 50 Common English Idioms and Their Meanings.
24. Common English Phrases and Their Meanings.
25. How to Use a Dictionary Effectively.

Where the topic warrants it, write roughly 900–1,400 words without filler. Include a useful introduction, descriptive headings, original practical examples, contextual distinctions and exceptions, tables only when they aid comparison, and internal links. Each article will have descriptive title/description metadata, a named editorial byline and review date. Do not invent etymologies or claim that close synonyms are interchangeable. Sourced linguistic claims will be linked to reliable references. The article author/byline is a site-owned editorial identity, not an invented named person.

## SEO, trust and launch

Provide meaningful initial HTML for public editorial pages, unique route metadata, canonical URLs only after the owner supplies the real public origin, Open Graph and X/Twitter metadata, breadcrumbs, appropriate Article/BreadcrumbList/WebApplication schema, a sitemap containing only intended indexable pages, robots rules, descriptive image alt text and a custom real-404 page. Search results, empty results, duplicates and thin lookup pages will not be included in the sitemap. No fake review, rating or FAQ schema.

Prepare About, Contact, Privacy, Terms, Editorial Policy, API Sources and Attribution, and Disclaimer routes. The owner has not supplied the operator identity, contact method, jurisdiction or public domain. Therefore do not invent these, publish fabricated contact details, or pretend unprovided legal review is complete. The generic product policies can truthfully describe implemented text handling and API behavior; owner-specific statements and production Contact/legal fields must remain blocked until supplied.

## Design direction

**Design Movement:** Contemporary editorial reference desk: the calm typographic confidence of a well-edited dictionary paired with the clarity of a modern learning product.

**Core Principles:** Legible before decorative; evidence and source labels stay visible; tools lead directly to useful results; the same calm visual hierarchy works on a phone and desktop.

**Color Philosophy:** Warm paper and ink make long-form reading comfortable; deep blue-green lends trust and distinguishes the brand; a small copper accent calls attention to pronunciation, examples and key actions without turning the interface into a dashboard.

**Layout Paradigm:** A clear reading column with a compact persistent desktop navigation and a contextual side shelf for related tools; a single-column mobile flow. Use asymmetrical editorial sections sparingly rather than a generic dashboard grid. Search remains the primary entry point.

**Signature Elements:** A custom wordmark built around an open-book/W ligature; dictionary-style pronunciation and part-of-speech chips; a fine underline/rule motif that echoes a proofreader's mark.

**Interaction Philosophy:** Keyboard-first, direct and reversible. Show what is happening, distinguish “no result” from “provider unavailable,” and offer local alternatives where they genuinely exist.

**Animation:** Restrained 120–180 ms opacity/position transitions for menus and result panels only; no looping motion, scroll-jacking or layout-shifting animation; honor reduced-motion preferences.

**Typography System:** A high-legibility sans-serif for navigation and tools with a restrained editorial serif for article headings and word lemmas; use CSS/system fallbacks so the app does not depend on third-party font availability at runtime.

**Brand Essence:** A dependable word-and-writing desk for people who want precise language help without noise. Personality: clear, curious, trustworthy.

**Brand Voice:** Direct, warm and specific. Example lines: “Find the word you mean.” “Close alternatives. Clear differences.”

**Wordmark & Logo:** A compact open-book/W monogram with a ruled underline, paired with a carefully spaced WordWise Hub wordmark; scalable SVG for the site icon and project branding.

**Signature Brand Color:** Deep blue-green, used as a distinct anchor for WordWise Hub.

## Source notes consulted for planning

- Cloudflare's OpenNext guide documents App Router, Route Handlers, SSG and SSR support, along with current adapter configuration: https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/
- Cloudflare's general Next.js guidance currently identifies vinext as its recommended default for new projects, so the adapter choice should be revisited if compatibility demands it: https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/
- Free Dictionary API endpoint and example fields: https://dictionaryapi.dev/
- Datamuse endpoint parameters, response shape, attribution recommendation and its changing access notes: https://www.datamuse.com/api/
- MediaWiki etiquette calls for an informative User-Agent, sequential request behavior and caching where possible: https://www.mediawiki.org/wiki/API:Etiquette
- Wikimedia's User-Agent policy says automated requests should include a descriptive agent and operator contact: https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy
- LanguageTool public API endpoint, usage restrictions, text/request limits, availability caveat and visible backlink requirement: https://dev.languagetool.org/public-http-api.html
- LanguageTool HTTP API documented free limits: https://languagetool.org/http-api/
