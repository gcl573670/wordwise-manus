import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { PageIntro } from "@/components/PageIntro";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("English Grammar Help", "Practical English grammar explanations and a basic, privacy-conscious checker.", "/grammar");

export default function GrammarPage() {
  const articles = getArticles("grammar");
  return <div className="container page-main"><PageIntro eyebrow="Grammar silo" title="Grammar, explained with examples" description="Explore common usage differences and sentence-level choices. The optional checker is deliberately modest about what local rules can detect." currentHref="/grammar" />
    <p><Link className="button-secondary" href="/tools/basic-grammar-checker">Open the basic grammar checker</Link></p>
    <section className="section"><div className="section-heading"><div><h2>Grammar guides</h2><p>Choose the question closest to yours.</p></div></div>{articles.length ? <div className="card-grid">{articles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <p className="status-box">No grammar guides are currently available.</p>}</section>
  </div>;
}
