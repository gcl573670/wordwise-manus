import type { BreadcrumbItem } from "@/components/Breadcrumbs";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function PageIntro({ eyebrow, title, description, parent, currentHref }: { eyebrow?: string; title: string; description: string; parent?: BreadcrumbItem; currentHref?: string }) {
  const breadcrumbItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...(parent ? [parent] : []), { label: title, href: currentHref }];
  return (
    <div className="page-intro">
      <Breadcrumbs items={breadcrumbItems} currentHref={currentHref} />
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </div>
  );
}
