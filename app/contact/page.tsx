import type { Metadata } from "next";
import { TrustPage } from "@/components/TrustPage";
export const metadata: Metadata = { title: "Contact", robots: { index: false, follow: true } };
export default function ContactPage() { return <TrustPage page="contact" />; }
