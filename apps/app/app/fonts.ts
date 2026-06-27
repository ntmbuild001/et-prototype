// next/font requires inline literal options (it statically analyzes the call),
// so the config is duplicated here rather than imported. The CSS-var names must
// match @et/brand (tokens.ts + styles.css): --font-inter-tight, etc.
import { Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";

export const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const fontVars = `${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`;
