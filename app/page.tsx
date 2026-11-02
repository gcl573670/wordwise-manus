import Link from "next/link";
import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { RecentSearches } from "@/components/RecentSearches";
import { SearchBox } from "@/components/SearchBox";
import { TOOL_CATALOG } from "@/data/tools";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("English Dictionary, Synonyms & Writing Tools", "Look up English words, explore context-aware synonyms, and use practical writing tools in one clear reference hub.");

const topics = [
  { slug: "vocabulary", title: "Vocabulary", description: "Build a stronger word choice for everyday and professional writing." },
  { slug: "synonyms", title: "Synonyms & antonyms", description: "Find close alternatives and understand where meanings differ." },
  { slug: "grammar", title: "Grammar", description: "Clear explanations for common English usage questions." },
  { slug: "writing", title: "Writing", description: "Practical guidance for clearer emails, paragraphs, and documents." },
  { slug: "reference", title: "Reference", description: "Browse abbreviations, acronyms, idioms, and language resources." },
];
const tryWords = ["affect", "eloquent", "concise", "resilient", "serendipity"];

export default function HomePage() {
  const articles = getArticles().slice(0, 3);
  const grammarArticles = getArticles("grammar").slice(0, 3);
  const featuredTools = TOOL_CATALOG.slice(0, 6);
  return <>
    <section className="hero"><div className="container hero-copy">
      <p className="eyebrow">A clear desk for language</p>
      <h1>Find the word <span>you mean.</span></h1>
      <p>Look up definitions, hear a pronunciation when audio is available, compare close alternatives, and make your writing easier to read.</p>
      <SearchBox />
      <RecentSearches />
      <div className="quick-words"><span>Common words to explore:</span>{tryWords.map((word) => <Link href={`/dictionary/${word}`} key={word}>{word}</Link>)}</div>
      <p className="hero-note">These are curated examples, not live popularity rankings. Dictionary results come from a free external source and may not include every sense or regional usage.</p>
    </div></section>
    <section className="section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Useful from the first click</p><h2>Tools for curious writers</h2><p>Start with a word lookup, find a sound match, or count and shape a draft—all without an account.</p></div><Link className="text-link" href="/writing-tools">All writing tools <span aria-hidden="true">→</span></Link></div>
      <div className="tool-grid">{featuredTools.map((tool) => <article className="tool-card" key={tool.id}><span className="tool-icon">{tool.group}</span><h3>{tool.title}</h3><p>{tool.description}</p><Link className="text-link" href={`/tools/${tool.id}`}>Open tool <span aria-hidden="true">→</span></Link></article>)}</div>
    </div></section>
    <section className="section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Browse by purpose</p><h2>Explore English, one question at a time</h2></div></div>
      <div className="topic-strip">{topics.map((topic) => <Link className="topic-chip" href={`/topics/${topic.slug}`} key={topic.slug}><strong>{topic.title}</strong><span>{topic.description}</span></Link>)}</div>
    </div></section>
    <section className="section"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">From the editors</p><h2>Recent guides</h2><p>Original examples and practical distinctions, not just lists of words.</p></div><Link className="text-link" href="/blog">Browse articles <span aria-hidden="true">→</span></Link></div>
      {articles.length ? <div className="card-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="empty-editorial">Editorial guides are being prepared. The search and interactive tools are ready to use.</p>}
    </div></section>
    <section className="section"><div className="container split-layout"><div>
      <p className="eyebrow">Usage notes</p><h2>Grammar questions, answered in context</h2><p className="page-description">A word can be close in meaning without being interchangeable. Our guides show how choices change with the sentence, audience, and tone.</p>
      {grammarArticles.length ? <div className="card-grid" style={{ marginTop: 24 }}>{grammarArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="status-box">Browse <Link href="/grammar">grammar tools and usage topics</Link>.</p>}
    </div><aside className="side-shelf"><h2>Try these next</h2><Link href="/tools/synonym-finder">Find a synonym</Link><Link href="/tools/word-counter">Count words</Link><Link href="/tools/basic-grammar-checker">Check a draft</Link><Link href="/abbreviations">Browse abbreviations</Link><Link href="/idioms">Explore idioms</Link></aside></div></section>
    <section className="section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Word choices have nuance</p><h2>Find a useful alternative</h2><p>Datamuse results are suggestions, not exact replacements; check context before using one.</p></div></div><div className="button-row"><Link className="button-secondary" href="/synonyms">Explore synonyms</Link><Link className="button-secondary" href="/antonyms">Explore antonyms</Link><Link className="button-secondary" href="/topics/synonyms">Read the guides</Link></div></div></section>
  </>;
}
