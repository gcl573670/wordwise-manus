import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { MediaWikiReferenceTool } from "@/components/MediaWikiReferenceTool";
import { PageIntro } from "@/components/PageIntro";
import { TOOL_CATALOG } from "@/data/tools";
import { getArticles, type ArticleCategory } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/site";

const silos: Record<ArticleCategory, { title: string; description: string; toolIds: string[] }> = {
  vocabulary: { title: "Vocabulary", description: "Develop precise word choices, explore words by letter and context, and learn how language changes with audience and purpose.", toolIds: ["word-unscrambler", "starts-with", "vocabulary-quiz-generator", "word-meaning"] },
  synonyms: { title: "Synonyms and antonyms", description: "Find alternatives by meaning and sound, then check how tone, context, and usage affect whether a word is a good substitute.", toolIds: ["synonym-finder", "antonym-finder", "rhyme-finder", "word-association-finder"] },
  grammar: { title: "Grammar", description: "Work through common English usage differences, punctuation, and sentence-level choices with examples.", toolIds: ["basic-grammar-checker", "word-counter"] },
  writing: { title: "Writing", description: "Use practical tools and guidance for professional emails, clear paragraphs, readability, and concise communication.", toolIds: ["word-counter", "reading-time-calculator", "text-formatter", "basic-grammar-checker"] },
  reference: { title: "Reference", description: "Browse common abbreviations, acronyms, idioms, and verified language resources with visible sources.", toolIds: ["abbreviation-finder", "acronym-finder", "idiom-finder", "pronunciation-finder"] },
};

type PageProps = { params: Promise<{ category: string }> };
export function generateStaticParams() { return Object.keys(silos).map((category) => ({ category })); }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const silo = silos[category as ArticleCategory];
  if (!silo) return { title: "Topic not found", robots: { index: false, follow: false } };
  return pageMetadata(`${silo.title} guides and tools`, silo.description, `/topics/${category}`);
}

export default async function TopicPage({ params }: PageProps) {
  const { category } = await params;
  const silo = silos[category as ArticleCategory];
  if (!silo) notFound();
  const articles = getArticles(category);
  const tools = silo.toolIds.map((id) => TOOL_CATALOG.find((tool) => tool.id === id)).filter((tool) => !!tool);
  return <div className="container page-main"><PageIntro eyebrow="Explore a topic" title={silo.title} description={silo.description} currentHref={`/topics/${category}`} />
    {category === "reference" ? <MediaWikiReferenceTool /> : null}
    <section className="section"><h2>Tools</h2><div className="tool-grid">{tools.map((tool) => tool ? <article className="tool-card" key={tool.id}><span className="tool-icon">Interactive tool</span><h3>{tool.title}</h3><p>{tool.description}</p><Link className="text-link" href={`/tools/${tool.id}`}>Open tool <span aria-hidden="true">→</span></Link></article> : null)}</div></section>
    <section className="section"><h2>Articles</h2>{articles.length ? <div className="card-grid">{articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="status-box">No articles in this topic are available yet.</p>}</section>
  </div>;
}
