// tokens.ts — the single source of truth for ET brand values.
// Unifies the app's ET2P palette, the landing's L palette, and the old
// constants.ts "crimson" palette into ONE token set. Dark-first; electric
// blue (#1E5BFF) is the only chromatic accent.

// Tokens that differ between dark and light reference CSS vars (themed per app);
// blue/blueLite/blueDeep/error are hue-stable across modes, so they stay literal
// (which also keeps their `${colors.blue}NN` alpha-concatenations valid).
export const colors = {
  bg: "var(--et-bg)",
  bg2: "var(--et-bg-2)",
  bg3: "var(--et-bg-3)",
  surface: "var(--et-surface)",
  surface2: "var(--et-surface-2)",
  line: "var(--et-line)",
  line2: "var(--et-line-2)",
  lineSoft: "var(--et-line-soft)",
  lineSoft2: "var(--et-line-soft-2)",
  ink: "var(--et-ink)",
  text: "var(--et-ink)",
  muted: "var(--et-muted)",
  dim: "var(--et-dim)",
  blue: "#1E5BFF",
  blueLite: "#5b9bff",
  blueDeep: "#16458c",
  green: "var(--et-green)",
  error: "#FF4D4D",
} as const;

// Font-family strings reference the CSS variables that each app binds via
// next/font. Components use these instead of literal family names so the
// loaded Google fonts actually apply (the prototype's literal "Inter Tight"
// references never resolved — that was the missing-fonts bug).
export const fontFamily = {
  sans: "var(--font-inter-tight), -apple-system, system-ui, sans-serif",
  mono: "var(--font-jetbrains-mono), ui-monospace, monospace",
  serif: "var(--font-instrument-serif), Georgia, serif",
} as const;

// Back-compat alias matching the prototype's ET2P shape, so ported screens
// can swap `ET2P` -> `tokens` with minimal churn.
export const tokens = {
  ...colors,
  // prototype used `lime` as the success/accent key in some places; both map
  // to the same blue-forward system now.
  lime: colors.blue,
  red: colors.error,
  fonts: fontFamily,
} as const;

export type Tokens = typeof tokens;
