"use client";

// TabBar.tsx — bottom navigation shared by every tab-root screen.
// Ported from et2-home-v2.jsx's HVTabBar: 5 slots with the Pegasus "eddy moon"
// RAISED in the dead center, flanked by two flat icon tabs on each side —
// Home · Portfolio · [Pegasus] · Learn · Profile. Prop-driven and store-free:
// the active tab + handler come from the parent. Fully themed (var(--et-nav),
// colors.blue/muted) so it works in light and dark.

import React from "react";
import { colors } from "@et/brand";
import { PegasusMoon } from "./PegasusMoon";

export type TabId = "home" | "portfolio" | "pegasus" | "learn" | "profile";

interface TabDef {
  id: TabId;
  label: string;
  /** Inline SVG path data drawn at 24×24. */
  d: string;
}

// two flat tabs on each side of the raised Pegasus center.
const LEFT: TabDef[] = [
  { id: "home", label: "Home", d: "M4 11.5L12 4l8 7.5M6 10v9h12v-9" },
  // Portfolio — folder glyph (matches the prototype).
  { id: "portfolio", label: "Portfolio", d: "M3 6.5A1.5 1.5 0 0 1 4.5 5h4.1a1.5 1.5 0 0 1 1.06.44l1 1A1.5 1.5 0 0 0 11.72 7H19.5A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-11z" },
];
const RIGHT: TabDef[] = [
  // Learn — the lessons journey map (open-book glyph).
  { id: "learn", label: "Learn", d: "M12 6.5C10.5 5.2 8.4 4.5 6 4.5c-1 0-2 .1-3 .4v13c1-.3 2-.4 3-.4 2.4 0 4.5.7 6 2 1.5-1.3 3.6-2 6-2 1 0 2 .1 3 .4v-13c-1-.3-2-.4-3-.4-2.4 0-4.5.7-6 2zM12 6.5v13" },
  // Profile — user glyph.
  { id: "profile", label: "Profile", d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20c0-3.4 3.1-6 7-6s7 2.6 7 6" },
];

function FlatTab({ t, active, onTab }: { t: TabDef; active: boolean; onTab: (t: TabId) => void }) {
  const color = active ? colors.blue : colors.muted;
  return (
    <button
      onClick={() => onTab(t.id)}
      aria-label={t.label}
      aria-current={active ? "page" : undefined}
      style={{
        appearance: "none",
        border: 0,
        background: "transparent",
        cursor: "pointer",
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        padding: "4px 0",
        minHeight: 44,
      }}
    >
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
        <path d={t.d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function TabBar({ active, onTab }: { active: TabId; onTab: (t: TabId) => void }) {
  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: `1px solid ${colors.line}`,
        background: "var(--et-nav)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "flex-end",
        padding: "12px 14px 16px",
      }}
    >
      {LEFT.map((t) => (
        <FlatTab key={t.id} t={t} active={t.id === active} onTab={onTab} />
      ))}

      {/* Pegasus — the raised "eddy moon" FAB in the center */}
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => onTab("pegasus")}
          aria-label="Pegasus"
          aria-current={active === "pegasus" ? "page" : undefined}
          style={{
            appearance: "none",
            border: 0,
            background: "transparent",
            cursor: "pointer",
            padding: 0,
            marginTop: -26,
            filter:
              active === "pegasus"
                ? "drop-shadow(0 6px 22px rgba(30,91,255,0.85))"
                : "drop-shadow(0 6px 16px rgba(30,91,255,0.5))",
          }}
        >
          <PegasusMoon size={52} detail={false} />
        </button>
      </div>

      {RIGHT.map((t) => (
        <FlatTab key={t.id} t={t} active={t.id === active} onTab={onTab} />
      ))}
    </div>
  );
}
