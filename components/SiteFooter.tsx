import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link href="/" className="brand-name">WordWise <em>Hub</em></Link>
          <p>Clear word meanings, related words, and practical writing tools.</p>
        </div>
        <div className="footer-links">
          <div><h2>Explore</h2><Link href="/dictionary">Dictionary</Link><Link href="/word-finder">Word finder</Link><Link href="/writing-tools">Writing tools</Link></div>
          <div><h2>Learn</h2><Link href="/topics/vocabulary">Vocabulary</Link><Link href="/topics/grammar">Grammar</Link><Link href="/blog">Articles</Link></div>
          <div><h2>About</h2><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/editorial-policy">Editorial policy</Link><Link href="/api-sources">API sources</Link><Link href="/disclaimer">Disclaimer</Link></div>
        </div>
      </div>
      <div className="footer-bottom"><span>WordWise Hub</span><span>Provider results are attributed and may vary by context.</span></div>
    </footer>
  );
}
