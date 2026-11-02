import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Privacy information", robots: { index: false, follow: true } };
export default function PrivacyPage() { return <TrustPage page="privacy" />; }
