"use client";

// Features.tsx — "The path" — the 3-step ET journey: Learn -> Simulate -> Own.
// Ported from `Features` + `JourneyStep` + `FeatureRow` + `JourneyWide` in
// et-landing-2.jsx. id="path" matches the reference section id.
//
// Prototype-isms removed:
//  - The original `Section`/`Wrap`/`SecHead` globals are inlined here as a fluid,
//    responsive 1100px container (no fixed phone-page layout).
//  - JourneyWide is ported faithfully using the brand CapTile + Puffy primitives
//    (the prototype reached for window.ET2_SKINS / window.ET2CapTile globals).
//  - The Step 02/03 feature visuals use the @/reel Animated* screens (built for
//    the 412-wide PhoneFrame) rather than the prototype's bare 320×640 ScreenCard.
//  - Entrance animation uses brand's useReveal (client) — no window/document at
//    module scope.

import React from "react";
import { colors, fontFamily, Eyebrow, useReveal, CapTile, Puffy, SKINS, type PuffyType } from "@et/brand";
import { AnimatedSpotter, AnimatedPortfolio } from "@/reel";

// ── shared bits (inlined from the prototype's Section/Wrap/SecHead) ──────────

const CHECK = (color: string, size = 12) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M5 12l5 5L20 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function SecHead({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub: string }) {
  const { ref, progress } = useReveal(700);
  const eased = 1 - Math.pow(1 - progress, 3);
  return (
    <div
      ref={ref}
      style={{
        maxWidth: 720,
        margin: "0 auto",
        textAlign: "center",
        marginBottom: 56,
        opacity: 0.05 + eased * 0.95,
        transform: `translateY(${(1 - eased) * 20}px)`,
        willChange: "opacity, transform",
      }}
    >
      <Eyebrow style={{ marginBottom: 16 }}>{eyebrow}</Eyebrow>
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
        {title}
      </h2>
      <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: 0 }}>{sub}</p>
    </div>
  );
}

// ── Step 01 — the journey intro: copy header + the real Map screen ──────────

function JourneyStep() {
  const bullets = ["5-minute daily lessons", "Streaks & XP", "Each lesson unlocks a sim"];
  return (
    <div style={{ padding: "16px 0 64px" }}>
      {/* Step 01 leads straight into the Your Journey map — the section header
          ("Learn it. Simulate it. Own it.") already frames the journey, and the
          map below shows the lit/locked path, so no second "map, not a syllabus"
          intro is needed (that read as a redundant duplicate header). */}
      <div style={{ maxWidth: 720, marginBottom: 24 }}>
        <Eyebrow style={{ marginBottom: 14 }}>Step 01 · Lessons</Eyebrow>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px" }}>
          {bullets.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(30,91,255,0.16)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {CHECK(colors.blueLite)}
              </span>
              <span style={{ fontFamily: fontFamily.sans, fontSize: 16, color: "#d6d8dc" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      {/* visual — wide horizontal journey map on desktop; a vertical timeline on
          phones (no horizontal scroll). */}
      <div className="et-jw-wide">
        <JourneyWide />
      </div>
      <div className="et-jw-vert">
        <JourneyVertical />
      </div>
    </div>
  );
}

// ── wide, spaced-out journey map (Step 01) — ported from JourneyWide ─────────
interface JWStop {
  n: number;
  icon: PuffyType;
  title: string;
  x: number;
  y: number;
  state: "done" | "current" | "locked";
}
const JW_STOPS: JWStop[] = [
  { n: 1, icon: "coins", title: "The 1% Rule", x: 90, y: 300, state: "done" },
  { n: 2, icon: "house", title: "Read a Listing", x: 330, y: 150, state: "done" },
  { n: 3, icon: "bank", title: "Finance the Deal", x: 575, y: 300, state: "current" },
  { n: 4, icon: "apartments", title: "Make the Offer", x: 820, y: 150, state: "locked" },
  { n: 5, icon: "trophy", title: "Close It", x: 1045, y: 300, state: "locked" },
];
const JW_W = 1135;
const JW_H = 430;

function JWBadge({ state, size = 34 }: { state: JWStop["state"]; size?: number }) {
  if (state === "locked") {
    return (
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="9" rx="1.6" stroke={colors.muted} strokeWidth="1.9" />
        <path d="M8 11V8a4 4 0 018 0v3" stroke={colors.muted} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }
  const isDone = state === "done";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors.blue,
        boxShadow: isDone ? `0 2px 10px ${colors.blue}88` : `0 0 20px ${colors.blue}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isDone ? (
        <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#fff">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </div>
  );
}

function JourneyWide() {
  const skin = SKINS.duo;
  const doneCount = 2; // stops 1–2 done, stop 3 current
  return (
    <div style={{ width: "100%", maxWidth: JW_W, margin: "0 auto" }}>
      {/* map (the "Your Journey" header + progress bar were removed) */}
      <div style={{ position: "relative", width: "100%", aspectRatio: `${JW_W} / ${JW_H}` }}>
        <svg viewBox={`0 0 ${JW_W} ${JW_H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {[[0, 1], [1, 2], [2, 3], [3, 4]].map(([a, b], i) => {
            const A = JW_STOPS[a];
            const B = JW_STOPS[b];
            const lit = i < doneCount;
            return (
              <g key={i}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={skin.pathLocked} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 14" />
                {lit && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={colors.blue} strokeWidth="4" strokeOpacity="0.65" strokeLinecap="round" />}
              </g>
            );
          })}
        </svg>
        {JW_STOPS.map((s) => {
          const isCur = s.state === "current";
          const hue = s.state === "done" ? "lime" : isCur ? "blue" : "slate";
          const eColor = isCur ? colors.blue : s.state === "locked" ? colors.muted : colors.blue;
          const eyebrow = isCur ? "IN PROGRESS" : s.state === "locked" ? "LOCKED" : `STOP ${s.n}`;
          return (
            <div
              key={s.n}
              style={{
                position: "absolute",
                left: `${(s.x / JW_W) * 100}%`,
                top: `${(s.y / JW_H) * 100}%`,
                transform: "translate(-50%,-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: isCur ? 6 : 2,
              }}
            >
              <div style={{ position: "relative", opacity: s.state === "locked" ? 0.62 : 1, filter: isCur ? `drop-shadow(0 0 26px ${colors.blue})` : "none" }}>
                <CapTile state={s.state} isCurrent={isCur} skin={skin} big>
                  <Puffy type={s.icon} hue={hue} size={isCur ? 60 : 52} />
                </CapTile>
                <div style={{ position: "absolute", right: -6, top: -6, zIndex: 4 }}>
                  <JWBadge state={s.state} size={isCur ? 36 : 30} />
                </div>
              </div>
              <div style={{ marginTop: 14, textAlign: "center", maxWidth: 150 }}>
                <div style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: eColor, marginBottom: 5 }}>{eyebrow}</div>
                <div style={{ fontFamily: fontFamily.sans, fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2, color: s.state === "locked" ? colors.muted : "#fff" }}>{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── vertical journey timeline (Step 01, mobile) — the wide map reflowed into a
//    top-down path so phones don't need a horizontal scroll ───────────────────
function JourneyVertical() {
  const skin = SKINS.duo;
  const doneCount = 2;
  return (
    <div style={{ maxWidth: 440, margin: "0 auto" }}>
      {/* stops, top to bottom (the "Your Journey" header + progress bar were removed) */}
      <div>
        {JW_STOPS.map((s, i) => {
          const isCur = s.state === "current";
          const hue = s.state === "done" ? "lime" : isCur ? "blue" : "slate";
          const eColor = isCur ? colors.blue : s.state === "locked" ? colors.muted : colors.blue;
          const eyebrow = isCur ? "IN PROGRESS" : s.state === "locked" ? "LOCKED" : `STOP ${s.n}`;
          const lit = i < doneCount; // the connector below this stop is part of the lit path
          const last = i === JW_STOPS.length - 1;
          return (
            <div key={s.n} style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
              {/* left rail: glossy cap tile + the connecting line down to the next stop */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 60 }}>
                <div style={{ position: "relative", opacity: s.state === "locked" ? 0.66 : 1, filter: isCur ? `drop-shadow(0 0 18px ${colors.blue})` : "none" }}>
                  <CapTile state={s.state} isCurrent={isCur} skin={skin} size={56}>
                    <Puffy type={s.icon} hue={hue} size={isCur ? 38 : 32} />
                  </CapTile>
                  <div style={{ position: "absolute", right: -5, top: -5, zIndex: 4 }}>
                    <JWBadge state={s.state} size={isCur ? 28 : 24} />
                  </div>
                </div>
                {!last && (
                  <div
                    style={{
                      flex: 1,
                      minHeight: 26,
                      width: 3,
                      margin: "8px 0",
                      borderRadius: 2,
                      ...(lit
                        ? { background: colors.blue, opacity: 0.7 }
                        : { background: `repeating-linear-gradient(to bottom, ${skin.pathLocked} 0 4px, transparent 4px 12px)` }),
                    }}
                  />
                )}
              </div>
              {/* right: label */}
              <div style={{ paddingTop: 13, paddingBottom: last ? 0 : 22, minWidth: 0 }}>
                <div style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", color: eColor, marginBottom: 5 }}>{eyebrow}</div>
                <div style={{ fontFamily: fontFamily.sans, fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2, color: s.state === "locked" ? colors.muted : colors.ink }}>{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── alternating feature row: copy on one side, reel screen on the other ─────

interface FeatureRowProps {
  flip?: boolean;
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  accent: string;
  visual: React.ReactNode;
}

function FeatureRow({ flip = false, eyebrow, title, body, bullets, accent, visual }: FeatureRowProps) {
  return (
    <div
      className="et-feature-row"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
        gap: 56,
        alignItems: "center",
        padding: "64px 0",
      }}
    >
      <div
        className="et-feature-visual"
        style={{ order: flip ? 2 : 1, display: "flex", justifyContent: "center", position: "relative" }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: `radial-gradient(50% 50% at 50% 50%, ${accent}22, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        {visual}
      </div>
      <div style={{ order: flip ? 1 : 2 }}>
        <Eyebrow style={{ marginBottom: 14 }}>{eyebrow}</Eyebrow>
        <h3
          style={{
            fontFamily: fontFamily.sans,
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
            color: colors.ink,
            margin: "0 0 16px",
            textWrap: "balance",
          }}
        >
          {title}
        </h3>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: "0 0 24px" }}>{body}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bullets.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "rgba(30,91,255,0.16)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {CHECK(colors.blueLite)}
              </span>
              <span style={{ fontFamily: fontFamily.sans, fontSize: 16.5, lineHeight: 1.45, color: "#d6d8dc" }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="path" style={{ position: "relative", padding: "90px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        <SecHead
          eyebrow="The path"
          title={
            <>
              Learn it. Simulate it.{" "}
              <span style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontWeight: 400, color: colors.blue }}>Own it.</span>
            </>
          }
          sub="A guided journey from your first lesson to your first deal. Every step tracked, unlocked, and graded so you actually finish."
        />

        {/* Step 01 — Learn */}
        <JourneyStep />

        {/* Step 02 — Simulate (visual on the left) */}
        <FeatureRow
          flip
          eyebrow="Step 02 · Simulators"
          accent={colors.blueLite}
          title="Practice with house money."
          body="Spot the motivated seller. Make the offer. Get graded. Run a deal a hundred times in the sim so the real one feels like a rep you’ve already taken."
          bullets={["60 seconds, one offer", "Scored 60–100 instantly", "XP & unlocks per clear"]}
          visual={<AnimatedSpotter />}
        />

        {/* Step 03 — Own (visual on the right) */}
        <FeatureRow
          eyebrow="Step 03 · Own"
          accent={colors.blue}
          title="The portfolio that outlives the contract."
          body="Every lesson and rep points here: doors you own, cashflow that lands whether or not you suit up Sunday, and equity that compounds. Earn more than you owned."
          bullets={["Track doors, cashflow & equity", "Passive income, contract-proof", "Your standing, earned not bought"]}
          visual={<AnimatedPortfolio />}
        />
      </div>

      {/* responsive: stack copy/visual into a single column on small viewports */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 860px) {
          .et-feature-row { grid-template-columns: 1fr !important; }
          .et-feature-row .et-feature-visual { order: 1 !important; }
          .et-feature-row > div:last-child { order: 2 !important; }
        }
        .et-jw-vert { display: none; }
        @media (max-width: 720px) {
          /* swap the wide horizontal map for a clean vertical journey on phones —
             no horizontal scroll */
          .et-jw-wide { display: none; }
          .et-jw-vert { display: block; }
        }
      ` }} />
    </section>
  );
}
