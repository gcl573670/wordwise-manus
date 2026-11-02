# WordWise Hub

A responsive English vocabulary, dictionary, and writing-tools site built with Next.js App Router, TypeScript, and Tailwind CSS. Editorial content and finite reference data are kept in the repository; dictionary, related-word, optional encyclopedia, and optional grammar requests run through server-side adapters. The project does not require a database or a paid API.

## Requirements and local development

- Node.js 22 or newer.
- pnpm 11.25.0 (pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
cp .env.example .env.local
# Set NEXT_PUBLIC_SITE_URL to the real public HTTPS origin before building for deployment.
pnpm dev
```

The development script validates article frontmatter and reference JSON before starting Next.js on port 3000. Available checks and build commands:

```sh
pnpm typecheck
pnpm validate:content
pnpm build                  # Standard Next.js production build
pnpm cf:typegen             # Generate Cloudflare Worker environment types
pnpm cf:build               # OpenNext Cloudflare production build
pnpm cf:preview             # Local preview of the generated Worker
pnpm cf:deploy              # Deploy using the authenticated Wrangler account
```

## Environment

- `NEXT_PUBLIC_SITE_URL` — set to the actual public HTTPS origin (for example `https://example.org`, with no path). Canonical links, absolute Open Graph/X images, sitemap, and robots sitemap address are intentionally omitted until this is configured. It is a browser-safe public value and must be present in the Cloudflare build environment so statically generated metadata and sitemap use the real origin.
- `MEDIAWIKI_CONTACT` — a genuine operator contact URL or email. Without it, the server-side lookup route returns an explicit unavailable state to the tool UI. The fixed tool accepts no arbitrary topics. Excerpts are bounded and show the source article, page history, and CC BY-SA license information.
- `DATAMUSE_API_KEY` — optional server-only key if Datamuse's access policy changes or a key is required for your use. Never expose it as `NEXT_PUBLIC_*`.

Free Dictionary and Datamuse are accessed through server-side adapters. LanguageTool is called only after the user explicitly requests an external grammar check; the submitted text is sent to that provider, not persisted by WordWise Hub, and is never cached. A limited browser-local fallback remains available if that service is unavailable. Basic writing tools run locally in the browser; search history, when enabled in a browser, stays in local storage.

API response caches use Cloudflare Cache API when available and bounded in-process fallback storage otherwise. In-process rate limits are best-effort per instance, not a global quota. Provider data may be incomplete or unavailable; the interface distinguishes missing data, rate limiting, and service failure and does not invent missing definitions, pronunciations, examples, or results. Local word discovery uses a finite repository-owned word list, not a complete dictionary.

## Editorial and reference data

Articles are Markdown files in `content/articles/` with validated YAML frontmatter. Run `pnpm validate:content` after editing them. The script checks the slug/filename, category, description bounds, date, HTTPS sources, and a minimum substantive body length, then emits `content/articles.generated.json` for the server-rendered routes. Reference datasets are in `data/`; each entry needs a meaning, example, source, attribution, and license note. Keep list counts and source links accurate, do not add invented etymologies, and distinguish near-synonyms by context.

## Cloudflare Workers and GitHub main-branch builds

This project is configured for the OpenNext Cloudflare adapter and Cloudflare Workers, not a static-only Pages export, because it includes server Route Handlers. The local Git remote currently belongs to Manus; no owner GitHub repository, Cloudflare account, production hostname, or DNS zone has been connected by this project. A production deployment has therefore **not** been made.

To connect production after choosing the owner repository and Cloudflare account:

1. Push the approved source to the intended GitHub repository's `main` branch; do not use the current Manus checkpoint remote as a substitute for the owner repository.
2. In Cloudflare, create a Workers Builds project connected to that GitHub repository and select `main` as the production branch.
3. Use the pinned pnpm toolchain and committed lockfile. Set the build command to `pnpm install --frozen-lockfile && pnpm cf:build` and the deploy command to `pnpm exec opennextjs-cloudflare deploy` (or the equivalent current Workers Builds fields). `wrangler.jsonc` points to `.open-next/worker.js` and `.open-next/assets`; these separate commands follow [OpenNext's Workers Builds guidance](https://opennext.js.org/cloudflare/howtos/dev-deploy) and [Cloudflare's adapter guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/).
4. Set `NEXT_PUBLIC_SITE_URL` as a production build variable. Add `MEDIAWIKI_CONTACT` only after the owner has selected a public contact method, as a runtime Worker variable. Add `DATAMUSE_API_KEY` only if needed, as a protected runtime secret, never in source control.
5. Configure a production custom domain and DNS in Cloudflare. Verify the domain, sitemap, robots response, API availability, analytics/log retention, and all owner-specific legal/contact copy before announcing launch.

Alternatively, after authenticating Wrangler locally with `pnpm exec wrangler login`, use `pnpm cf:preview` and `pnpm cf:deploy`. Check current Cloudflare plan limits and OpenNext compatibility before production; this repository configuration does not create or authorize an owner account or domain.

## Pre-launch checklist

- [ ] Confirm the real public HTTPS domain and DNS target.
- [ ] Supply the actual public owner/organization identity and approved operator contact method.
- [ ] Have the owner review Privacy and Terms, including jurisdiction, effective date, and contact details; do not publish the current unconfigured drafts as final legal copy.
- [ ] Connect the chosen owner GitHub repository to Workers Builds on `main`; use the documented OpenNext build and deploy commands.
- [ ] Set `NEXT_PUBLIC_SITE_URL` at build time. Add `MEDIAWIKI_CONTACT` as a runtime Worker variable only after contact approval; add `DATAMUSE_API_KEY` only if the provider requires it.
- [ ] Attach the custom domain and verify sitemap, robots, API source attribution, external grammar disclosure, provider failures, and responsive layouts on the production origin.

## Owner launch inputs still needed

Before public launch, supply the real public origin/domain, a genuine operator contact URL or email, the desired public owner/organization identity, and legal jurisdiction/effective-date/contact information for owner-reviewed Terms and Privacy. Also connect the owner GitHub repository and Cloudflare Workers Builds project, then choose DNS/domain settings. Pages that need those facts intentionally disclose the missing details instead of making them up.
