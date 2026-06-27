"use client";

// simShared.tsx — shared simulator UI + helpers (ported from et2-sims.jsx).
import React from "react";
import { Shell, Header, Cta, Mono, colors, fontFamily } from "@et/brand";
import type { Grade } from "../lib/types";
import { SIM_XP } from "../lib/types";

// Frozen "Blue·Blue" look: S/A and B all render blue (the prototype's ET2P.lime
// and ET2P.blue are both #1E5BFF); C is amber, F is red.
export const simGradeColor = (g: Grade): string =>
  g === "S" || g === "A" || g === "B" ? colors.blue : g === "C" ? "#FFB347" : colors.error;

export const sim$ = (n: number): string => `$${Math.round(Math.abs(n)).toLocaleString()}`;
export const simSigned = (n: number): string => `${n < 0 ? "−" : "+"}$${Math.round(Math.abs(n)).toLocaleString()}`;

export function SimSpecRow({ k, v, accent }: { k: React.ReactNode; v: React.ReactNode; accent?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 16px", borderBottom: `1px solid ${colors.line}` }}>
      <span style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: colors.muted, textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontFamily: fontFamily.mono, fontSize: 12.5, fontWeight: 700, color: accent || colors.ink, textAlign: "right" }}>{v}</span>
    </div>
  );
}

export function SimCallout({ color, children }: { color?: string; children: React.ReactNode }) {
  const c = color || colors.green;
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, borderRadius: 14, padding: "12px 14px", background: colors.bg, border: `1px dashed ${c}66` }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7" />
        <path d="M12 11v6M12 7.5v.5" stroke={c} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
      <div style={{ fontSize: 13, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

/** Shared results screen — grade badge + breakdown rows + serif line. */
export function SimResults({
  label,
  eyebrow,
  title,
  grade,
  line,
  rows,
  onRetry,
  onCollect,
}: {
  label?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  grade: Grade;
  line: React.ReactNode;
  rows: { k: React.ReactNode; v: React.ReactNode; accent?: string }[];
  onRetry: () => void;
  onCollect: () => void;
}) {
  const gradeColor = simGradeColor(grade);
  const xp = SIM_XP[grade];
  return (
    <Shell bg="var(--et-screen-green)" label={label}>
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "30px 22px 10px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <div>
            <Mono color={gradeColor} size={10} style={{ marginBottom: 6 }}>{eyebrow}</Mono>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.04 }}>{title}</div>
          </div>
          <div
            style={{
              width: 84,
              height: 84,
              border: `2px solid ${gradeColor}`,
              borderRadius: 20,
              background: colors.surface,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: gradeColor,
              flexShrink: 0,
              boxShadow: `0 0 28px ${gradeColor}33`,
            }}
          >
            <span style={{ fontFamily: fontFamily.mono, fontSize: 8, fontWeight: 700, letterSpacing: "0.22em" }}>GRADE</span>
            <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{grade}</span>
          </div>
        </div>

        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden" }}>
          {rows.map((r, i) => (
            <SimSpecRow key={i} k={r.k} v={r.v} accent={r.accent} />
          ))}
        </div>

        <div style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontSize: 19, lineHeight: 1.35, color: "rgba(var(--et-ink-rgb),0.85)" }}>{line}</div>

        <button
          onClick={onRetry}
          style={{
            appearance: "none",
            cursor: "pointer",
            background: "transparent",
            border: `1px solid ${colors.line2}`,
            borderRadius: 999,
            color: colors.muted,
            padding: "12px 16px",
            fontFamily: fontFamily.mono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          ↺ Run it back
        </button>
      </div>
      <Cta label={`Collect rewards · +${xp} XP`} onClick={onCollect} arrow={false} />
    </Shell>
  );
}

/** Brief shell shared by sims for their intro screen. */
export function SimBrief({
  n,
  name,
  brief,
  onBack,
  onStart,
  cta = "Start simulator",
  children,
}: {
  n: number;
  name: string;
  brief: string;
  onBack: () => void;
  onStart: () => void;
  cta?: string;
  children?: React.ReactNode;
}) {
  return (
    <Shell label={`Sim ${name} brief`}>
      <Header onBack={onBack} eyebrow={`Simulator ${String(n).padStart(2, "0")}`} eyebrowColor={colors.blue} title={name} />
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 22px 10px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(var(--et-ink-rgb),0.82)" }}>{brief}</div>
        {children}
      </div>
      <Cta label={cta} onClick={onStart} />
    </Shell>
  );
}
