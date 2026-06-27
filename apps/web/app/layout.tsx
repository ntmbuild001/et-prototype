import "./globals.css";
import type { Metadata } from "next";
import { fontVars } from "./fonts";

export const metadata: Metadata = {
  title: "Elite Transition — Earn more than you owned.",
  description:
    "Real-estate investing for pro athletes. Turn game checks into owned assets. Learn, rep deals, own the block.",
  openGraph: {
    title: "Elite Transition — Earn more than you owned.",
    description:
      "Real-estate investing for pro athletes. Turn game checks into owned assets.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
