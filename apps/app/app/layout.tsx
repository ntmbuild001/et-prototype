import "./globals.css";
import type { Metadata, Viewport } from "next";
import { fontVars } from "./fonts";

export const metadata: Metadata = {
  title: "Elite Transition",
  description: "Earn more than you owned. Turn game checks into owned assets.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6f8" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Resolve the theme BEFORE first paint (no flash): a manual override
// (localStorage "et-theme") wins; otherwise follow the device. Also keeps the
// app in sync if the system theme changes while open and there's no override.
const THEME_SCRIPT = `(function(){try{var mq=window.matchMedia('(prefers-color-scheme: light)');var apply=function(){var o=localStorage.getItem('et-theme');document.documentElement.dataset.theme=(o==='light'||o==='dark')?o:(mq.matches?'light':'dark');};apply();mq.addEventListener('change',function(){var o=localStorage.getItem('et-theme');if(o!=='light'&&o!=='dark')apply();});}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
