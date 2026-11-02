import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ToolPanel } from "@/components/ToolPanel";
import { TOOL_CATALOG, findTool } from "@/data/tools";
import { pageMetadata, publicSiteUrl } from "@/lib/seo/site";

type PageProps = { params: Promise<{ tool: string }> };
export function generateStaticParams() { return TOOL_CATALOG.map(({ id }) => ({ tool: id })); }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool: id } = await params;
  const tool = findTool(id);
  if (!tool) return { title: "Tool not found", robots: { index: false, follow: false } };
  return pageMetadata(tool.title, tool.description, `/tools/${tool.id}`);
}

export default async function ToolPage({ params }: PageProps) {
  const { tool: id } = await params;
  const tool = findTool(id);
  if (!tool) notFound();
  const origin = publicSiteUrl();
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "WebApplication", name: tool.title,
    description: tool.description, applicationCategory: tool.group === "Writing" ? "UtilitiesApplication" : "EducationalApplication",
    operatingSystem: "Any", isAccessibleForFree: true,
    ...(origin ? { url: new URL(`/tools/${tool.id}`, origin).toString() } : {}),
  };
  return <div className="container page-main"><JsonLd data={schema} /><ToolPanel toolId={id} /></div>;
}
