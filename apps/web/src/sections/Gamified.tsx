"use client";

// Gamified.tsx — "Built like a game" gamification band.
// Ported from `Gamified` + `StatBig` in et-landing-2.jsx. id="game" anchors the
// "The game" nav link.
//
// Prototype-isms removed:
//  - Inlined the global Section/Wrap helpers as a fluid 1100px responsive grid.
//  - The original chip row used window.ET2Puffy icons; here we inline matching
//    line icons (flame / coins / trophy) to keep the section self-contained.
//  - StatBig is kept as a styled stat block rather than the brand <Stat/>: this
//    band wants large display figures (clamp 40–60px) whereas brand <Stat/>
//    renders a compact 26px value. The four required stats are: 5 modules,
//    100+ deal reps, 24/7 Pegasus, 60–100 grades (S–F-style scoring band).

import React from "react";
import { colors, fontFamily, Eyebrow } from "@et/brand";

type ChipIcon = "flame" | "coins" | "trophy";

function ChipIcon({ name, size = 22 }: { name: ChipIcon; size?: number }) {
  const p = {
    stroke: colors.blueLite,
    strokeWidth: 1.8,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<ChipIcon, React.ReactNode> = {
    flame: <path d="M12 4C9 8 7.5 10 7.5 13.2a4.5 4.5 0 0 0 9 0C16.5 10 15 8 12 4z" {...p} />,
    coins: (
      <g>
        <ellipse cx="12" cy="7" rx="6.5" ry="2.6" {...p} />
        <path d="M5.5 7v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V7M5.5 12v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" {...p} />
      </g>
    ),
    trophy: <path d="M7 4h10v4a5 5 0 0 1-10 0V4zM7 5H4.5a4 4 0 0 0 3 4M17 5h2.5a4 4 0 0 1-3 4M12 13v3M8.5 20h7M9.5 16.5h5l.5 3.5h-6l.5-3.5z" {...p} />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {paths[name]}
    </svg>
  );
}

function StatBig({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", padding: "8px 12px" }}>
      <div
        style={{
          fontFamily: fontFamily.sans,
          fontSize: "clamp(40px, 5vw, 60px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: colors.ink,
          lineHeight: 1,
        }}
      >
        {v}
      </div>
      <div style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", color: colors.blueLite, marginTop: 10 }}>
        {k}
      </div>
      <div style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.muted, marginTop: 6 }}>{sub}</div>
    </div>
  );
}

const CHIPS: ReadonlyArray<{ icon: ChipIcon; label: string }> = [
  { icon: "flame", label: "6-day streak" },
  { icon: "coins", label: "Level 4 · 1,240 XP" },
  { icon: "trophy", label: "3 sims cleared" },
];

export function Gamified() {
  return (
    <section id="game" style={{ position: "relative", padding: "78px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        <div
          className="et-game-grid"
          style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 56, alignItems: "center" }}
        >
          {/* left — copy + status chips */}
          <div>
            <Eyebrow style={{ marginBottom: 16 }}>Built like a game</Eyebrow>
            <h2
              style={{
                fontFamily: fontFamily.sans,
                fontSize: "clamp(32px, 4vw, 50px)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.04,
                color: colors.ink,
                margin: "0 0 18px",
                textWrap: "balance",
              }}
            >
              Because that’s how you{" "}
              <span style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontWeight: 400, color: colors.blue }}>stick with it.</span>
            </h2>
            <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: "0 0 30px", maxWidth: 460 }}>
              Streaks, XP, levels, and unlockable simulators. The discipline that made you elite on the field, pointed at your
              portfolio.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {CHIPS.map((c) => (
                <div
                  key={c.label}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "11px 16px",
                    borderRadius: 999,
                    background: colors.surface,
                    border: `1px solid ${colors.line2}`,
                  }}
                >
                  <ChipIcon name={c.icon} size={20} />
                  <span style={{ fontFamily: fontFamily.mono, fontSize: 13, fontWeight: 700, color: colors.ink, whiteSpace: "nowrap" }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* right — the stats panel */}
          <div
            className="et-game-stats"
            style={{
              background: colors.surface,
              border: `1px solid ${colors.line}`,
              borderRadius: 28,
              padding: "44px 28px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 36,
            }}
          >
            <StatBig v="5" k="MODULES" sub="lessons + sims" />
            <StatBig v="100+" k="DEAL REPS" sub="in simulation" />
            <StatBig v="24/7" k="PEGASUS" sub="AI deal coach" />
            <StatBig v="S–F" k="GRADES" sub="on every sim" />
          </div>
        </div>
      </div>

      {/* responsive: stack into one column on small viewports */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .et-game-grid { grid-template-columns: 1fr !important; }
        }
      ` }} />
    </section>
  );
}
