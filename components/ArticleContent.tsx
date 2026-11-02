import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Article } from "@/lib/content";

export function ArticleContent({ article }: { article: Article }) {
  return (
    <article className="article-layout">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: article.category, href: `/topics/${article.category}` }, { label: article.title, href: `/${article.category}/${article.slug}` }]} currentHref={`/${article.category}/${article.slug}`} />
      <header className="article-header">
        <p className="eyebrow">{article.category} · FindWord guide</p>
        <h1>{article.title}</h1>
        <p className="article-deck">{article.description}</p>
        <p className="article-byline">By {article.author} <span aria-hidden="true">·</span> Reviewed <time dateTime={article.reviewDate}>{article.reviewDate}</time></p>
      </header>
      <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown></div>
      {article.sources?.length ? <aside className="source-list"><h2>Sources</h2><ul>{article.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul></aside> : null}
    </article>
  );
}
