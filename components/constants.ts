// constants.ts — Palette definitions, flow order, and the frozen tweak settings.
// Ported from et-app.jsx. The tweaks UI is gone; settings are hardcoded.

export const PALETTES: Record<string, any> = {
  lime: {
    id: "lime",
    label: "Lime · Black",
    mode: "dark",
    bg: "#000000",
    surface: "#141414",
    surfaceActive: "#1c1c1c",
    line: "#252525",
    line2: "#3a3a3a",
    text: "#FFFFFF",
    muted: "#8A8A8A",
    accent: "#00FF7F",
    accent2: "#2F7EFF",
    accentText: "#000000",
  },
  bone: {
    id: "bone",
    label: "Bone · Light",
    mode: "light",
    bg: "#ECE5D2",
    surface: "#FAF6E9",
    surfaceActive: "#F1ECD9",
    line: "#D5CCB5",
    line2: "#A89C7E",
    text: "#1A1812",
    muted: "#6C6657",
    accent: "#00FF7F",
    accent2: "#2F7EFF",
    accentText: "#000000",
  },
  crimson: {
    id: "crimson",
    label: "Blue · Blue",
    mode: "dark",
    bg: "#000000",
    surface: "#141414",
    surfaceActive: "#1c1c1c",
    line: "#252525",
    line2: "#3a3a3a",
    text: "#FFFFFF",
    muted: "#8A8A8A",
    // Single blue across copy and CTA — primary blue everywhere.
    accent: "#1E5BFF",
    accent2: "#1E5BFF",
    accentText: "#FFFFFF",
    copyAccent: "accent2",
  },
  electric: {
    id: "electric",
    label: "Electric",
    mode: "dark",
    bg: "#000000",
    surface: "#141414",
    surfaceActive: "#1c1c1c",
    line: "#252525",
    line2: "#3a3a3a",
    text: "#FFFFFF",
    muted: "#8A8A8A",
    accent: "#00E5C7",
    accent2: "#7C5CFF",
    accentText: "#000000",
  },
};

// Frozen settings — replaces the old useTweaks/TWEAK_DEFAULTS layer.
// crimson ("Blue · Blue", #1E5BFF) is the intended look (the file's stale
// "lime" default is ignored), trail logo, glow home, iOS frame shown.
export const TWEAK = {
  paletteId: "crimson",
  logoVariant: "trail",
  homeStyle: "glow",
  showFrame: true,
} as const;

export const FLOW = [
  "intro",
  "welcome",
  "verifyid",
  "submitted",
  "verify",
  "goal",
  "experience",
  "topics",
  "complete",
  "home",
];
