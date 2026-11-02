import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Editorial Policy", robots: { index: false, follow: true } };
export default function EditorialPolicyPage() { return <TrustPage page="editorial" />; }
