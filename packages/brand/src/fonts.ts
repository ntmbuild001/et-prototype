// fonts.ts — CONFIG ONLY. next/font/google cannot be called inside a shared
// package (Next's font loader only transforms calls inside an app's module
// graph), so each app declares its own next/font calls but imports this config
// so both surfaces load identical weights and bind the same CSS variables.
//
// Usage in an app's app/fonts.ts:
//   import { Inter_Tight, JetBrains_Mono, Instrument_Serif } from "next/font/google";
//   import { interTightConfig, jetbrainsMonoConfig, instrumentSerifConfig } from "@et/brand/fonts";
//   export const interTight = Inter_Tight(interTightConfig);
//   ...
//   <html className={`${interTight.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}>

export const interTightConfig = {
  subsets: ["latin"] as ["latin"],
  weight: ["400", "500", "600", "700", "800"] as string[],
  variable: "--font-inter-tight",
  display: "swap" as const,
};

export const jetbrainsMonoConfig = {
  subsets: ["latin"] as ["latin"],
  weight: ["400", "500", "700"] as string[],
  variable: "--font-jetbrains-mono",
  display: "swap" as const,
};

export const instrumentSerifConfig = {
  subsets: ["latin"] as ["latin"],
  weight: "400" as const,
  style: ["normal", "italic"] as ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap" as const,
};
