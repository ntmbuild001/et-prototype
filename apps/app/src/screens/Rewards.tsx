"use client";

// Rewards.tsx — ported from et2-rewards.jsx (ET2RewardsScreen).
// Earnings breakdown (quiz XP + sim XP = totalXp), sim grade, 7-day streak grid,
// trophy Puffy. Replays bank 0 XP. CTA -> onMap.

import React from "react";
import {
  Shell,
  Cta,
  CapTile,
  Puffy,
  Mono,
  SKINS,
  colors,
  fontFamily,
  useEntrance,
} from "@et/brand";
import type { Lesson } from "@/data/curriculum";
import type { Grade, Progress } from "@/lib/types";

export function Rewards({
  lesson,
  result,
  replay,
  progress,
  onMap,
}: {
  lesson: Lesson;
  result: {
    quizCorrect: number;
    quizTotal: number;
    simGrade: Grade | null;
    simXp: number;
    simLine: string | null;
    totalXp: number;
  };
  replay: boolean;
  progress: Progress & { simsPassed?: number };
  onMap: () => void;
}) {
  // totalXp is defined as quiz XP + sim XP, so quiz XP is recoverable without
  // re-deriving the per-question constant.
  const quizXp = Math.max(0, result.totalXp - result.simXp);

  const rows: { label: string; xp: number }[] = [
    { label: `Quiz · ${result.quizCorrect}/${result.quizTotal} correct`, xp: quizXp },
    ...(result.simGrade
      ? [{ label: `${lesson.sim.name} · Grade ${result.simGrade}`, xp: result.simXp }]
      : []),
  ];

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const todayIdx = 3; // prototype anchor: Thursday
  const litFrom = todayIdx - Math.min(progress.streak, todayIdx + 1) + 1;

  const popRef = useEntrance<HTMLDivElement>("pop");

  return (
    <Shell bg="var(--et-screen-green)" label="Rewards">
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "46px 22px 10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div ref={popRef} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CapTile state="current" isCurrent skin={SKINS.duo} size={124} big>
            <Puffy type="trophy" hue="blue" size={66} />
          </CapTile>
        </div>

        <div style={{ textAlign: "center" }}>
          <Mono color={colors.blue} style={{ marginBottom: 8 }}>
            {replay ? "Replay complete" : `Stop ${lesson.n} complete`}
          </Mono>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              textWrap: "balance",
            }}
          >
            {lesson.title}
          </div>
          {result.simLine && (
            <div
              style={{
                fontFamily: fontFamily.serif,
                fontStyle: "italic",
                fontSize: 18,
                color: "rgba(var(--et-ink-rgb),0.7)",
                marginTop: 10,
                maxWidth: 300,
                lineHeight: 1.35,
              }}
            >
              {result.simLine}
            </div>
          )}
        </div>

        {/* XP tally */}
        <div
          style={{
            width: "100%",
            border: `1px solid ${colors.line}`,
            borderRadius: 22,
            background: colors.surface,
            overflow: "hidden",
          }}
        >
          {rows.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: `1px solid ${colors.line}`,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(var(--et-ink-rgb),0.85)" }}>{r.label}</span>
              <span style={{ fontFamily: fontFamily.mono, fontSize: 13, fontWeight: 700, color: colors.blue }}>
                +{r.xp}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              background: "rgba(30,91,255,0.05)",
            }}
          >
            <Mono color={colors.text} size={10.5}>
              {replay ? "Replay — no XP banked" : "XP earned"}
            </Mono>
            <span
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 17,
                fontWeight: 700,
                color: replay ? colors.muted : colors.blue,
              }}
            >
              {replay ? "+0" : `+${result.totalXp}`}
            </span>
          </div>
        </div>

        {/* streak */}
        <div
          style={{
            width: "100%",
            border: `1px solid ${colors.line}`,
            borderRadius: 22,
            background: colors.surface,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <Mono size={10}>Streak</Mono>
            <span style={{ fontFamily: fontFamily.mono, fontSize: 13, fontWeight: 700, color: colors.blue }}>
              {progress.streak} days
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {days.map((d, i) => {
              const lit = i >= litFrom && i <= todayIdx;
              const isToday = i === todayIdx;
              return (
                <div
                  key={i}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: lit ? "rgba(30,91,255,0.1)" : colors.surface2,
                      border: `1px solid ${
                        isToday ? colors.blue : lit ? "rgba(30,91,255,0.35)" : colors.line
                      }`,
                    }}
                  >
                    <StreakGlyph size={15} color={lit ? colors.blue : colors.line2} />
                  </div>
                  <span
                    style={{
                      fontFamily: fontFamily.mono,
                      fontSize: 9,
                      fontWeight: 700,
                      color: isToday ? colors.text : colors.muted,
                    }}
                  >
                    {d}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Cta label="Back to the map" onClick={onMap} />
    </Shell>
  );
}

// Inline fallback: the prototype used a shared <KeylineIcon name="streak"/> glyph
// that is not exported from @et/brand. Recreated here as a small flame keyline.
function StreakGlyph({ size = 15, color = colors.line2 }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c1.2 2.6 4.5 4 4.5 8a4.5 4.5 0 11-9 0c0-1.6.7-2.7 1.6-3.6.3 1 .9 1.7 1.7 2C11.2 8 10.8 5.5 12 3z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
