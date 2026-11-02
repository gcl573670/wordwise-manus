import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "API Sources and Attribution", robots: { index: false, follow: true } };
export default function ApiSourcesPage() { return <TrustPage page="sources" />; }
