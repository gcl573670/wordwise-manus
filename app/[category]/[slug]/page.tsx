import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { ArticleContent } from "@/components/ArticleContent";
import { JsonLd } from "@/components/JsonLd";
import { getArticle, getArticles } from "@/lib/content";
import { pageMetadata, publicSiteUrl, SITE_NAME } from "@/lib/seo/site";

type RouteParams = { category: string; slug: string };
type PageProps = { params: Promise<RouteParams> };

export function generateStaticParams(): RouteParams[] {
  return getArticles().filter((article) => article.category !== "synonyms").map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(slug, category);
  if (!article) return { title: "Guide not found", robots: { index: false, follow: false } };
  return { ...pageMetadata(article.title, article.description, `/${article.category}/${article.slug}`, "article"), robots: { index: true, follow: true } };
}

export default async function EditorialArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = getArticle(slug, category);
  if (!article || article.category === "synonyms") notFound();
  const origin = publicSiteUrl();
  const pageUrl = origin ? new URL(`/${article.category}/${article.slug}`, origin).toString() : undefined;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "Article", headline: article.title,
    description: article.description, dateModified: article.reviewDate,
    author: { "@type": "Organization", name: article.author }, publisher: { "@type": "Organization", name: SITE_NAME },
    ...(pageUrl ? { mainEntityOfPage: pageUrl } : {}),
  };
  const related = getArticles(article.category).filter((entry) => entry.slug !== article.slug).slice(0, 3);
  return <><JsonLd data={schema} /><ArticleContent article={article} />
    {related.length ? <section className="section related-reading"><div className="container">
      <div className="section-heading"><div><p className="eyebrow">Read next</p><h2>More {article.category} guides</h2></div></div>
      <div className="card-grid">{related.map((entry) => <ArticleCard key={entry.slug} article={entry} />)}</div>
    </div></section> : null}
  </>;
}
