import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { PageIntro } from "@/components/PageIntro";
import { getArticles } from "@/lib/content";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata("English Vocabulary, Grammar and Writing Guides", "Original practical articles about English word choice, grammar, writing, and reference topics.", "/blog");

export default function BlogPage() {
  const articles = getArticles();
  return <div className="container page-main"><PageIntro eyebrow="WordWise Hub articles" title="Guides for better word choices" description="Original explanations, examples, and context notes for English vocabulary and writing." currentHref="/blog" />
    {articles.length ? <div className="card-grid">{articles.map((article) => <ArticleCard article={article} key={article.slug} />)}</div> : <p className="status-box">No editorial articles are currently available.</p>}
  </div>;
}
