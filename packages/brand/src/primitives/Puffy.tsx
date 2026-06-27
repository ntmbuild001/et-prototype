"use client";

// Puffy.tsx — glossy 3D real-estate icons (ported from ET2Puffy).
import React from "react";
import { fontFamily } from "../tokens";

export type PuffyType = "coins" | "house" | "bank" | "apartments" | "villa" | "trophy";
export type PuffyHue = "lime" | "blue" | "slate";

const RAMPS: Record<PuffyHue, { lite: string; base: string; dark: string; edge: string; acc: string }> = {
  lime: { lite: "#9dffce", base: "#1fe98a", dark: "#06b566", edge: "#04361f", acc: "#0a8f4f" },
  blue: { lite: "#a9ccff", base: "#4d92ff", dark: "#2f6fe6", edge: "#0c1f3f", acc: "#1f57c0" },
  slate: { lite: "#cfd6df", base: "#8b95a3", dark: "#5e6877", edge: "#1c2128", acc: "#46505e" },
};

export function Puffy({ type, hue = "lime", size = 54 }: { type: PuffyType; hue?: PuffyHue; size?: number }) {
  const c = RAMPS[hue] || RAMPS.lime;
  const uid = React.useId().replace(/[:]/g, "");
  const gBody = `b${uid}`,
    gRoof = `r${uid}`,
    gHi = `h${uid}`;
  const P = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    style: { overflow: "visible" as const, filter: "drop-shadow(0 4px 5px rgba(0,0,0,0.45))" },
  };
  const defs = (
    <defs>
      <linearGradient id={gBody} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.lite} />
        <stop offset="0.45" stopColor={c.base} />
        <stop offset="1" stopColor={c.dark} />
      </linearGradient>
      <linearGradient id={gRoof} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.base} />
        <stop offset="1" stopColor={c.acc} />
      </linearGradient>
      <radialGradient id={gHi} cx="0.35" cy="0.25" r="0.7">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
  const body = `url(#${gBody})`,
    roof = `url(#${gRoof})`;
  const edge = { stroke: c.edge, strokeWidth: 1, strokeOpacity: 0.5 };
  const hi = (x: number, y: number, w: number, h: number, rx: number) => <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${gHi})`} />;

  if (type === "coins")
    return (
      <svg {...P}>
        {defs}
        <ellipse cx="32" cy="46" rx="17" ry="6.5" fill={c.dark} {...edge} />
        <rect x="15" y="34" width="34" height="12" rx="6" fill={body} {...edge} />
        <ellipse cx="32" cy="34" rx="17" ry="6.5" fill={c.base} {...edge} />
        <rect x="15" y="24" width="34" height="12" rx="6" fill={body} {...edge} />
        <ellipse cx="32" cy="24" rx="17" ry="6.5" fill={c.lite} {...edge} />
        <ellipse cx="32" cy="24" rx="17" ry="6.5" fill={`url(#${gHi})`} />
        <text x="32" y="28.5" textAnchor="middle" fontSize="11" fontWeight="800" fill={c.edge} fontFamily={fontFamily.sans}>
          $
        </text>
      </svg>
    );
  if (type === "house")
    return (
      <svg {...P}>
        {defs}
        <rect x="16" y="30" width="32" height="22" rx="7" fill={body} {...edge} />
        <path d="M12 32 L32 13 Q34 11.5 36 13 L52 32 Q53 33.5 50 33.5 L14 33.5 Q11 33.5 12 32 Z" fill={roof} {...edge} />
        <rect x="27" y="40" width="10" height="12" rx="3.5" fill={c.edge} fillOpacity="0.55" />
        <rect x="19" y="34" width="7" height="6" rx="2.2" fill={c.lite} fillOpacity="0.8" />
        <rect x="38" y="34" width="7" height="6" rx="2.2" fill={c.lite} fillOpacity="0.8" />
        {hi(18, 31, 28, 9, 6)}
      </svg>
    );
  if (type === "bank")
    return (
      <svg {...P}>
        {defs}
        <path d="M12 27 L32 14 Q34 13 36 14 L52 27 Q53.5 28.5 50.5 29 L13.5 29 Q10.5 28.5 12 27 Z" fill={roof} {...edge} />
        <rect x="15" y="44" width="34" height="8" rx="4" fill={body} {...edge} />
        {[18.5, 28.4, 38.3].map((x, i) => (
          <rect key={i} x={x} y="29.5" width="7" height="15" rx="3.2" fill={body} {...edge} />
        ))}
        <rect x="15" y="29.5" width="34" height="3" rx="1.5" fill={c.dark} />
        {hi(16, 30, 30, 7, 4)}
      </svg>
    );
  if (type === "apartments")
    return (
      <svg {...P}>
        {defs}
        <rect x="17" y="12" width="30" height="40" rx="8" fill={body} {...edge} />
        {[18, 27, 36].map((y) =>
          [21, 29.5, 38].map((x, j) => <rect key={`${y}-${j}`} x={x} y={y} width="5.5" height="5.5" rx="2" fill={c.lite} fillOpacity="0.85" />)
        )}
        <rect x="27" y="44" width="10" height="8" rx="3" fill={c.edge} fillOpacity="0.5" />
        {hi(19, 13, 26, 12, 7)}
      </svg>
    );
  if (type === "villa")
    return (
      <svg {...P}>
        {defs}
        <rect x="10" y="34" width="18" height="18" rx="6" fill={body} {...edge} />
        <rect x="36" y="34" width="18" height="18" rx="6" fill={body} {...edge} />
        <rect x="23" y="28" width="18" height="24" rx="6" fill={body} {...edge} />
        <path d="M8 35 L19 24 Q20 23 21 24 L30 35 Q31 36 28.5 36 L10 36 Q7.5 36 8 35 Z" fill={roof} {...edge} />
        <path d="M34 35 L45 24 Q46 23 47 24 L56 35 Q57 36 54.5 36 L36 36 Q33.5 36 34 35 Z" fill={roof} {...edge} />
        <path d="M21 30 L32 18 Q33 17 34 18 L43 30 Q44 31 41.5 31 L23 31 Q20.5 31 21 30 Z" fill={roof} {...edge} />
        <rect x="28" y="42" width="8" height="10" rx="3" fill={c.edge} fillOpacity="0.5" />
        {hi(24, 31, 14, 8, 5)}
      </svg>
    );
  if (type === "trophy")
    return (
      <svg {...P}>
        {defs}
        <path d="M18 12 h28 v10 a14 14 0 01-28 0 Z" fill={body} {...edge} />
        <path d="M18 14 h-6 a8 8 0 008 9" fill="none" stroke={c.dark} strokeWidth="3.4" strokeLinecap="round" />
        <path d="M46 14 h6 a8 8 0 01-8 9" fill="none" stroke={c.dark} strokeWidth="3.4" strokeLinecap="round" />
        <rect x="28" y="34" width="8" height="9" rx="2.5" fill={c.dark} />
        <rect x="21" y="43" width="22" height="7" rx="3.5" fill={body} {...edge} />
        <ellipse cx="32" cy="50" rx="15" ry="4" fill={c.dark} opacity="0.55" />
        {hi(20, 13, 22, 10, 6)}
      </svg>
    );
  return null;
}
