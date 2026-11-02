import Link from "next/link";

const links = [
  ["Dictionary", "/dictionary"], ["Synonyms", "/synonyms"], ["Antonyms", "/antonyms"],
  ["Pronunciation", "/pronunciation"], ["Word Finder", "/word-finder"], ["Grammar", "/grammar"],
  ["Writing Tools", "/writing-tools"], ["Abbreviations", "/abbreviations"], ["Idioms", "/idioms"], ["Blog", "/blog"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="WordWise Hub home">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M4 9c6-2 11-1 16 3 5-4 10-5 16-3v23c-6-2-11-1-16 3-5-4-10-5-16-3V9Z"/><path d="M20 12v23M9 15c4-1 7 0 9 2m13-2c-4-1-7 0-9 2M9 22c4-1 7 0 9 2m13-2c-4-1-7 0-9 2"/></svg></span>
          <span className="brand-name">WordWise <em>Hub</em></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <details className="mobile-nav">
          <summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary>
          <nav aria-label="Mobile navigation">
            {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
        </details>
      </div>
    </header>
  );
}
