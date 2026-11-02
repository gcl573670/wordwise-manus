import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { publicSiteUrl } from "@/lib/seo/site";

export interface BreadcrumbItem { label: string; href?: string }

export function Breadcrumbs({ items, currentHref }: { items: BreadcrumbItem[]; currentHref?: string }) {
  const origin = publicSiteUrl();
  const schemaItems = origin && currentHref ? items.map((item, index) => ({
    "@type": "ListItem", position: index + 1, name: item.label,
    item: new URL(item.href || currentHref, origin).toString(),
  })) : null;
  return <>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={`${item.label}-${index}`}>
      {index > 0 ? <span className="breadcrumb-divider" aria-hidden="true">/</span> : null}
      {index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
    </li>)}</ol></nav>
    {schemaItems ? <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: schemaItems }} /> : null}
  </>;
}
