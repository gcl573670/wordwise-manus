import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "About", robots: { index: false, follow: true } };
export default function AboutPage() { return <TrustPage page="about" />; }
