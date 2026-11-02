import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Disclaimer", robots: { index: false, follow: true } };
export default function DisclaimerPage() { return <TrustPage page="disclaimer" />; }
