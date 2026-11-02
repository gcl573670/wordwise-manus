import { withTtlCache } from "@/lib/cache/ttl";
import { ProviderError, requestJson } from "@/lib/api/http";

export interface WikiReference { title: string; extract: string; url: string; historyUrl: string; attribution: string; license: string; licenseUrl: string }
type WikiResponse = { query?: { pages?: Array<{ title?: string; extract?: string }> } };
const LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/";
let requestQueue: Promise<void> = Promise.resolve();
let lastRequestAt = 0;

function isValidContact(value: string | undefined): value is string {
  if (!value || value.length > 250 || /[\r\n\u0000-\u001f\u007f]/.test(value)) return false;
  const email = value.startsWith("mailto:") ? value.slice("mailto:".length) : value;
  if (/^[^\s<>@]+@[^\s<>@]+\.[A-Za-z]{2,}$/.test(email)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isMediaWikiEnabled(): boolean {
  return isValidContact(process.env.MEDIAWIKI_CONTACT?.trim());
}

function serializedRequest<T>(operation: () => Promise<T>): Promise<T> {
  const result = requestQueue.then(async () => {
    const waitMs = Math.max(0, 1000 - (Date.now() - lastRequestAt));
    if (waitMs) await new Promise((resolve) => setTimeout(resolve, waitMs));
    lastRequestAt = Date.now();
    return operation();
  });
  requestQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function lookupWikiReference(term: string): Promise<WikiReference | null> {
  const contact = process.env.MEDIAWIKI_CONTACT?.trim();
  if (!isValidContact(contact)) throw new ProviderError("MediaWiki", null, "MediaWiki lookup is not enabled until the site operator supplies a valid contact URL or email.");
  const key = `mediawiki:${term.toLocaleLowerCase("en-US")}`;
  return withTtlCache(key, 30 * 24 * 60 * 60, async () => {
    const params = new URLSearchParams({
      action: "query", format: "json", formatversion: "2", prop: "extracts",
      exintro: "1", explaintext: "1", exchars: "1800", redirects: "1", titles: term,
    });
    const response = await serializedRequest(() => requestJson<WikiResponse>("MediaWiki", `https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { Accept: "application/json", "User-Agent": `WordWiseHub/1.0 (${contact})` },
    }));
    const page = response.query?.pages?.[0];
    if (!page?.title || !page.extract) return null;
    const encodedTitle = encodeURIComponent(page.title.replace(/ /g, "_"));
    return {
      title: page.title,
      extract: page.extract.slice(0, 1800),
      url: `https://en.wikipedia.org/wiki/${encodedTitle}`,
      historyUrl: `https://en.wikipedia.org/w/index.php?title=${encodedTitle}&action=history`,
      attribution: `Excerpt from Wikipedia contributors, “${page.title}”; shortened for display.`,
      license: "Creative Commons Attribution-ShareAlike 4.0 International",
      licenseUrl: LICENSE_URL,
    };
  });
}
