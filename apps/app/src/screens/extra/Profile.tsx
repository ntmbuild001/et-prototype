"use client";

// Profile.tsx — ported from ET2ProfileScreen (et2-screens-extra.jsx).
// Identity card, level progress, 3-stat grid, league entry, sim transcript,
// Pro upsell, Portfolio access, Settings. ET2P.lime -> colors.blue throughout
// (Blue·Blue — never green); Puffy hue "lime" -> "blue".
import React from "react";
import { Shell, Card, Mono, Puffy, colors, fontFamily } from "@et/brand";
import { TabBar } from "@et/screens";
import type { Progress } from "@/lib/types";
import { type Lesson } from "@/data/curriculum";
import { simGradeColor } from "@/sims/simShared";

// Inline fallback: small forward chevron (prototype used KeylineIcon name="forward").
function Chevron({ color = colors.muted }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Inline fallback: gear icon (prototype used KeylineIcon name="settings").
function GearIcon({ color = colors.ink }: { color?: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
      <path
        d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7L5.6 5.6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Profile({
  progress,
  lessons,
  onTab,
  onLeague,
  onSettings,
  onPaywall,
  onPortfolio,
}: {
  progress: Progress;
  lessons: Lesson[];
  onTab: (t: string) => void;
  onLeague: () => void;
  onSettings: () => void;
  onPaywall: () => void;
  onPortfolio: () => void;
}) {
  const simsPassed = Object.keys(progress.simGrades).length;
  const level = 1 + Math.floor(progress.xp / 600);
  const levelPct = ((progress.xp % 600) / 600) * 100;

  return (
    <Shell label="Profile">
      <div
        className="et-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "24px 22px 40px", display: "flex", flexDirection: "column", gap: 18 }}
      >
        {/* identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: colors.surface2,
              border: `2px solid ${colors.blue}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fontFamily.mono,
              fontSize: 20,
              fontWeight: 700,
              color: colors.blue,
              flexShrink: 0,
            }}
          >
            AC
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: "-0.02em" }}>Alex Chen</div>
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: colors.muted,
                marginTop: 4,
              }}
            >
              Rookie Investor · LVL {level}
            </div>
          </div>
          <button
            onClick={onSettings}
            aria-label="Settings"
            style={{
              appearance: "none",
              cursor: "pointer",
              border: 0,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: colors.surface,
              color: colors.ink,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <GearIcon />
          </button>
        </div>

        {/* level progress */}
        <Card style={{ padding: "16px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <Mono size={9.5}>
              Level {level} → {level + 1}
            </Mono>
            <span style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: colors.blue }}>
              {progress.xp.toLocaleString()} XP
            </span>
          </div>
          <div style={{ height: 6, background: colors.surface2, borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${levelPct}%`, height: "100%", background: colors.blue, borderRadius: 999 }} />
          </div>
        </Card>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { k: "XP", v: progress.xp.toLocaleString(), c: colors.blue },
            { k: "Streak", v: `${progress.streak}d`, c: colors.ink },
            { k: "Sims", v: `${simsPassed}`, c: colors.ink },
          ].map((s, i) => (
            <Card key={i} style={{ padding: "14px 14px" }}>
              <Mono size={9} style={{ marginBottom: 7 }}>
                {s.k}
              </Mono>
              <div style={{ fontFamily: fontFamily.mono, fontSize: 19, fontWeight: 700, color: s.c }}>{s.v}</div>
            </Card>
          ))}
        </div>

        {/* league entry */}
        <button
          onClick={onLeague}
          style={{
            appearance: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            border: `1px solid ${colors.line}`,
            borderRadius: 22,
            padding: "15px 18px",
            background: colors.surface,
            color: colors.ink,
            display: "flex",
            alignItems: "center",
            gap: 13,
          }}
        >
          <Puffy type="trophy" hue="blue" size={30} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>View league</span>
            <span style={{ display: "block", fontSize: 12.5, color: colors.muted, marginTop: 1 }}>
              Rookie League · Weekly · 4 days left
            </span>
          </span>
          <Chevron />
        </button>

        {/* portfolio entry */}
        <button
          onClick={onPortfolio}
          style={{
            appearance: "none",
            cursor: "pointer",
            textAlign: "left",
            width: "100%",
            border: `1px solid ${colors.line}`,
            borderRadius: 22,
            padding: "15px 18px",
            background: colors.surface,
            color: colors.ink,
            display: "flex",
            alignItems: "center",
            gap: 13,
          }}
        >
          <Puffy type="apartments" hue="blue" size={30} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 15, fontWeight: 700 }}>Portfolio</span>
            <span style={{ display: "block", fontSize: 12.5, color: colors.muted, marginTop: 1 }}>
              Track the deals you've closed
            </span>
          </span>
          <Chevron />
        </button>

        {/* sim transcript */}
        <div>
          <Mono color={colors.blue} style={{ marginBottom: 10 }}>
            Simulator transcript
          </Mono>
          <Card style={{ overflow: "hidden" }}>
            {lessons.map((l, i) => {
              const g = progress.simGrades[l.sim.id];
              return (
                <div
                  key={l.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "13px 16px",
                    borderBottom: i === lessons.length - 1 ? 0 : `1px solid ${colors.line}`,
                  }}
                >
                  <Puffy type={l.icon} hue={g ? "blue" : "slate"} size={30} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 14.5, fontWeight: 700 }}>{l.sim.name}</span>
                    <span style={{ display: "block", fontSize: 12, color: colors.muted, marginTop: 1 }}>
                      Stop {l.n} · {l.title}
                    </span>
                  </span>
                  {g ? (
                    <span
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        border: `1.5px solid ${simGradeColor(g)}`,
                        color: simGradeColor(g),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {g}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: fontFamily.mono,
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        color: colors.muted,
                        flexShrink: 0,
                      }}
                    >
                      —
                    </span>
                  )}
                </div>
              );
            })}
          </Card>
        </div>

        {/* pro upsell */}
        <button
          onClick={onPaywall}
          style={{
            appearance: "none",
            cursor: "pointer",
            textAlign: "left",
            border: `1px solid ${colors.blue}55`,
            borderRadius: 22,
            padding: "18px 18px",
            background: `linear-gradient(135deg, #07101f 0%, ${colors.surface} 75%)`,
            color: colors.ink,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: "block",
                fontFamily: fontFamily.mono,
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: colors.blue,
                marginBottom: 5,
              }}
            >
              ET PRO
            </span>
            <span style={{ display: "block", fontSize: 16, fontWeight: 800, letterSpacing: "-0.01em" }}>
              Unlock every module & sim
            </span>
            <span style={{ display: "block", fontSize: 12.5, color: colors.muted, marginTop: 3 }}>
              7-day free trial, then $11.99/mo
            </span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path
              d="M5 12h13M12 6l6 6-6 6"
              stroke={colors.blue}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <TabBar active="profile" onTab={onTab} />
    </Shell>
  );
}
