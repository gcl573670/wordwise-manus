/**
 * The project brief names this adapter path while specifying the MediaWiki API for
 * curated encyclopedia excerpts. The implementation targets Wikipedia through
 * MediaWiki; this facade keeps the requested module boundary explicit.
 */
export { isMediaWikiEnabled, lookupWikiReference, type WikiReference } from "./mediawiki";
