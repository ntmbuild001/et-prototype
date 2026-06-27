// skins.ts — glossy map-tile color schemes (ported from et2-ui.jsx ET2_SKINS).
import { colors } from "./tokens";

export type CapState = "done" | "current" | "locked";
export interface MapSkin {
  id: string;
  label: string;
  bg: string;
  chrome: string;
  pathLocked: string;
  iconHue: Record<CapState, "lime" | "blue" | "slate">;
  cap: Record<
    CapState,
    { top: string; lip: string; edge: string; glow: string | null }
  >;
}

export const SKINS: Record<string, MapSkin> = {
  duo: {
    id: "duo",
    label: "Glossy Duo",
    bg: "var(--et-screen-map)",
    chrome: colors.surface,
    pathLocked: "var(--et-path-locked)",
    iconHue: { done: "lime", current: "blue", locked: "slate" },
    cap: {
      done: { top: "linear-gradient(180deg,#2bf09a,#06c06e)", lip: "#067a45", edge: "rgba(255,255,255,0.35)", glow: null },
      current: { top: "linear-gradient(180deg,#5b9bff,#2f6fe6)", lip: "#16458c", edge: "rgba(255,255,255,0.5)", glow: `${colors.blue}77` },
      locked: { top: "linear-gradient(180deg,#20242c,#15181e)", lip: "#0c0e12", edge: "rgba(255,255,255,0.06)", glow: null },
    },
  },
  green: {
    id: "green",
    label: "Glossy Green",
    bg: "radial-gradient(130% 80% at 50% 120%, #061a10 0%, #000 60%)",
    chrome: colors.surface,
    pathLocked: "var(--et-path-locked)",
    iconHue: { done: "lime", current: "lime", locked: "slate" },
    cap: {
      done: { top: "linear-gradient(180deg,#2bf09a,#06c06e)", lip: "#057a45", edge: "rgba(255,255,255,0.35)", glow: null },
      current: { top: "linear-gradient(180deg,#33ffa6,#04d074)", lip: "#067a45", edge: "rgba(255,255,255,0.55)", glow: `rgba(var(--et-green-rgb),0.4)` },
      locked: { top: "linear-gradient(180deg,#20242c,#15181e)", lip: "#0c0e12", edge: "rgba(255,255,255,0.06)", glow: null },
    },
  },
  mono: {
    id: "mono",
    label: "Glossy Mono",
    bg: "radial-gradient(125% 90% at 30% -5%, #080a0e 0%, #000 58%)",
    chrome: colors.surface,
    pathLocked: "var(--et-path-locked)",
    iconHue: { done: "lime", current: "blue", locked: "slate" },
    cap: {
      done: { top: "linear-gradient(180deg,#2a2f38,#1b1f26)", lip: "#0e1014", edge: "rgba(31,233,138,0.4)", glow: null },
      current: { top: "linear-gradient(180deg,#2c3340,#1b2230)", lip: "#0e131c", edge: "rgba(30,91,255,0.6)", glow: `${colors.blue}55` },
      locked: { top: "linear-gradient(180deg,#20242c,#15181e)", lip: "#0c0e12", edge: "rgba(255,255,255,0.06)", glow: null },
    },
  },
};
