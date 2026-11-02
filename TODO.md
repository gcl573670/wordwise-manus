# WordWise Hub — Delivery TODO

Acceptance criteria below preserve the requested product behavior. An item remains open until its outcome exists in the project and has evidence.

## 1. Project stack, documentation, and deployment setup
- [ ] Use Next.js with App Router, TypeScript, Tailwind CSS, accessible reusable UI components, and responsive mobile-first design.
- [ ] Use server-side API routes for external API calls; validate input and apply basic rate limiting.
- [ ] Store articles and editorial content as Markdown/MDX files with frontmatter metadata and static generation where suitable. Store structured reference data (abbreviations, idioms, vocabulary entries) as repository JSON files.
- [ ] Edit content directly in the GitHub repository with no admin panel or CMS. Document how every commit to main triggers an automatic rebuild and deploy once the owner's GitHub/Cloudflare connection is configured.
- [ ] Validate content at build time (correct frontmatter, required fields, valid JSON); a typo must fail gracefully with a clear error instead of breaking the site without explanation.
- [ ] Prepare Cloudflare Pages or Workers Builds deployment for fully static output or free-tier serverless functions only; avoid mandatory paid hosting dependencies. Keep API keys server-side in environment variables.
- [ ] Provide `.env.example`, `README.md`, API integration notes, deployment instructions, and local run instructions. Explain which capabilities work without credentials, which credentials are needed if any, and how to deploy.
- [ ] Do not claim an owner GitHub repository, Cloudflare account, production domain, DNS, production build, or launch has been connected/completed unless it actually is. These currently require owner-provided details.

## 2. Shared external API integration and reliability
- [ ] Centralize integrations under `/lib/api` (`dictionary.ts`, `datamuse.ts`, `wiktionary.ts`/MediaWiki adapter, `grammar.ts`) with cache, validation, SEO, and utility modules.
- [ ] Make server-side external requests only; validate all user inputs; set request timeouts; handle HTTP 429 and unavailable APIs; use exponential backoff where appropriate.
- [ ] Cache dictionary and related-word results for about 7 days; cache reference data for about 30 days where permitted; provide sensible provider fallbacks.
- [ ] Display source attribution. Never display fabricated results or silently turn an API failure into false information.
- [ ] Apply basic abuse prevention and rate limiting on API routes. Clearly explain any per-instance/best-effort limits rather than implying a distributed quota.
- [ ] Free Dictionary API (`https://dictionaryapi.dev/`): use for definitions, parts of speech, phonetics, audio pronunciation, examples, synonyms and antonyms when available; require no API key; handle missing words gracefully; do not invent unavailable audio or examples; cache responses.
- [ ] Datamuse API (`https://www.datamuse.com/api/`): use for synonyms, related words, rhymes and similar-sounding words; respect usage limits; cache results; attribute Datamuse in documentation and the site; allow any future key only on the server.
- [ ] MediaWiki API (`https://www.mediawiki.org/wiki/API:Main_page`): use carefully selected encyclopedic reference material only; send a descriptive User-Agent; respect rate limits and licenses; include source links; never automatically copy entire articles into the site. A real operator contact is required before live requests are enabled; absent it, report that integration as unavailable rather than inventing contact details.
- [ ] LanguageTool free API (`https://languagetool.org/`) is optional, not a required dependency. If unavailable, provide local text-analysis functionality and label its limitations accurately. Do not permanently store text submitted to grammar tools; explain external processing before it occurs.

## 3. Information architecture, homepage, and SEO
- [ ] Main navigation contains Home, Dictionary, Synonyms, Antonyms, Pronunciation, Word Finder, Grammar, Writing Tools, Abbreviations, Idioms, and Blog.
- [ ] Homepage includes a prominent word search; popular word searches; functional interactive tools; category exploration; recently published articles; popular grammar explanations; popular synonyms/antonyms; and footer policy links.
- [ ] Keep the design clean, modern and trustworthy, inspired by dictionary sites and educational platforms; avoid excessive gradients, distracting animation, intrusive popups and decorative clutter.
- [ ] Implement semantic HTML; statically generate or server-render indexable content; provide unique titles and descriptions per page, canonical URLs, XML sitemap, robots.txt, breadcrumbs, Open Graph and Twitter/X metadata, and Schema.org Article, BreadcrumbList and WebApplication data only where accurate.
- [ ] Provide descriptive image alt text, internal links, clean URLs and a custom 404 page.
- [ ] Do not index internal search result URLs, empty results, duplicates, or thin auto-generated pages. Do not create fake review, rating, or FAQ structured data.
- [ ] Support examples `/dictionary/important/`, `/synonyms/important/`, `/antonyms/important/`, `/pronunciation/important/`, `/tools/word-counter/`, `/grammar/affect-vs-effect/`, `/writing/how-to-write-a-professional-email/`, `/abbreviations/`, and `/idioms/` as appropriate to curated content. Use an actual public origin for canonical/share/sitemap absolute URLs only after the owner supplies it; never guess one.

## 4. Core dictionary, word-discovery, and reference tools
- [ ] Word Meaning Finder: show API-backed definitions, parts of speech, phonetics, audio when available, examples, and related-word links.
- [ ] Synonym Finder: show synonyms sorted by relevance and note that alternatives differ by context.
- [ ] Antonym Finder: show opposites with contextual distinctions where possible.
- [ ] Pronunciation Finder: show phonetic transcription, audio, and syllable information only when reliable.
- [ ] Rhyming Word Finder: distinguish perfect rhymes, near rhymes, and sound-related words.
- [ ] Word Unscrambler.
- [ ] Words That Start With a Letter.
- [ ] Words That End With a Letter.
- [ ] Words Containing Specific Letters.
- [ ] Random Word Generator.
- [ ] Word Length Finder.
- [ ] Vocabulary Quiz Generator.
- [ ] Word Association Finder.
- [ ] Acronym Finder.
- [ ] Abbreviation Finder.
- [ ] Idiom Finder.
- [ ] Curated vocabulary, abbreviation, acronym, and idiom data must be seeded/maintained in repository data. Each curated vocabulary entry supports word, definition, part of speech, phonetic spelling, example sentences, related words, synonyms, antonyms, source, attribution, and license information.
- [ ] Do not automatically publish every API response as an indexable page. Create reference pages only where they add substantial original value.

## 5. Browser-side writing tools and honest API states
- [ ] Word Counter.
- [ ] Character Counter.
- [ ] Sentence Counter.
- [ ] Paragraph Counter.
- [ ] Reading Time Calculator.
- [ ] Sentence Case Converter.
- [ ] Uppercase / Lowercase Converter.
- [ ] Text Formatter.
- [ ] Basic Grammar Checker.
- [ ] Writing tools run in the browser where possible. Do not store submitted text permanently. For external LanguageTool processing, explain the external processing accurately and only submit on explicit user action.
- [ ] Every API-based tool shows loading states, error messages, empty states and source attribution. No fake interface or nonfunctional button.

## 6. Editorial silo landing pages and article corpus
- [ ] Create five silo category pages, each with a useful introduction and links to related tools and articles: Vocabulary (vocabulary development, commonly confused words, positive/negative words, words by letter/context, professional communication); Synonyms and Antonyms (synonyms by meaning/context, commonly confused alternatives, antonyms with examples, formal vs informal vocabulary); Grammar (common mistakes, usage differences, punctuation, sentence construction, explanations); Writing (professional writing, emails, paragraph structure, clarity/readability, academic and business writing); Reference (abbreviations, acronyms, idioms, common expressions, verified word origins, pronunciation resources).
- [ ] Write 25 complete, original articles, not outlines. Use approximately 900–1,400 words where the topic warrants it, without filler. Include a clear informative introduction, useful H2/H3 headings, original examples, tables where genuinely helpful, practical usage, exceptions and context, internal links to relevant tools/articles, author and review date, descriptive title and meta description, and fact-check linguistic claims. Do not fabricate etymologies. Similar words such as “important,” “essential,” “significant,” and “crucial” must not be represented as always interchangeable.
- [ ] Vocabulary articles: (1) 100 Commonly Confused English Words; (2) 50 Positive Words to Describe Someone; (3) Words That Start With A: Meanings and Examples; (4) Words That Start With B: Meanings and Examples; (5) 100 Powerful Words to Improve Your Vocabulary.
- [ ] Synonyms articles: (6) 50 Synonyms for Important With Examples; (7) Other Ways to Say Thank You; (8) 30 Different Ways to Say Happy; (9) Synonyms for Beautiful: Different Contexts and Examples; (10) Other Ways to Say I Agree.
- [ ] Grammar articles: (11) Common English Grammar Mistakes and How to Fix Them; (12) Affect vs Effect: Meaning and Examples; (13) Their vs There vs They're; (14) Your vs You're; (15) Then vs Than.
- [ ] Writing articles: (16) How to Write a Professional Email; (17) How to Write a Clear and Effective Paragraph; (18) How to Improve Your English Writing Skills; (19) How to Avoid Repetition in Writing; (20) Active Voice vs Passive Voice.
- [ ] Reference articles: (21) Common English Abbreviations and Their Meanings; (22) Common Acronyms Used in Everyday English; (23) 50 Common English Idioms and Their Meanings; (24) Common English Phrases and Their Meanings; (25) How to Use a Dictionary Effectively.

## 7. Legal, editorial, contact, and trust pages
- [ ] Create About Us, Contact Us, Privacy Policy, Terms of Service, Editorial Policy, API Sources and Attribution, and Disclaimer pages. They must contain real owner-supplied information, with no placeholder text and no invented details.
- [ ] Do not publish owner identity, contact method, jurisdiction, legal statements, public URL, or production contact values until supplied/confirmed. Owner-specific pages or fields must remain explicitly unconfigured and be treated as launch blockers, not filled with fictional data.
- [ ] No fake testimonials, copied articles, misleading buttons, intrusive popups, or forced redirects.

## 8. User experience, accessibility, and final delivery
- [ ] Mobile-first, responsive, fast, accessible, keyboard navigable, consistent, and compatible with modern browsers.
- [ ] Use clear search boxes, useful empty states, copy buttons, related-word suggestions and related tools. Show clear API source attribution.
- [ ] Keep search history local-only where appropriate. Do not require registration to use basic tools.
- [ ] Test functionality, broken links, mobile layouts, API failure handling, performance, metadata, and structured data. Prepare and provide a launch checklist.
- [ ] At handoff, state what is built and works without API credentials, which keys are required if any, how to run locally, and how to deploy. Do not claim launch or publication without confirmation.
