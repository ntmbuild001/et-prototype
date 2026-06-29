import "./globals.css";
import type { Metadata } from "next";
import { fontVars } from "./fonts";

export const metadata: Metadata = {
  title: "Elite Transition: Own more than you earned.",
  description:
    "Real-estate investing for pro athletes. Turn game checks into owned assets. Learn, close deals, own property.",
  openGraph: {
    title: "Elite Transition: Own more than you earned.",
    description:
      "Real-estate investing for pro athletes. Turn game checks into owned assets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elite Transition: Own more than you earned.",
    description:
      "Real-estate investing for pro athletes. Turn game checks into owned assets.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
