import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Terms of Service", robots: { index: false, follow: true } };
export default function TermsPage() { return <TrustPage page="terms" />; }
