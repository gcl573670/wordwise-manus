import Link from "next/link";
import type { Article } from "@/lib/content";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="article-card">
      <div className="article-meta"><span>{article.category}</span><time dateTime={article.reviewDate}>{new Date(`${article.reviewDate}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</time></div>
      <h3><Link href={`/${article.category}/${article.slug}`}>{article.title}</Link></h3>
      <p>{article.description}</p>
      <Link className="text-link" href={`/${article.category}/${article.slug}`}>Read article <span aria-hidden="true">→</span></Link>
    </article>
  );
}
