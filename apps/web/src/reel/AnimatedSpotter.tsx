"use client";

// AnimatedSpotter — lightweight presentational mock of the Deal Spotter sim.
//
// The real Deal Spotter game lives in the product app (not in @et/screens), so
// this is a self-contained, store-free mockup with NO game logic: a single
// listing card with a "60s" countdown chip (gently ticking via useReveal
// progress), property stats, a "Make offer" pill, and a grade reveal that fades
// in near the end of the scroll entrance. Styled with brand tokens + Puffy.

import React from "react";
import { colors, fontFamily, Mono, Puffy, useReveal } from "@et/brand";
import { PhoneReel } from "./PhoneReel";

export function AnimatedSpotter() {
  // Drive the countdown + grade reveal off a local in-card reveal timeline so
  // the chip ticks and the grade appears independently of PhoneReel's entrance.
  const { ref, progress } = useReveal(2400);

  // Gentle countdown 60 → ~12 as the card settles. Static-feeling, not a real
  // timer — purely presentational.
  const seconds = Math.max(12, Math.round(60 - progress * 48));

  // Grade reveal fades in over the last ~25% of the timeline.
  const gradeP = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  return (
    <PhoneReel>
      <div
        style={{
          height: "100%",
          width: "100%",
          background: colors.bg,
          padding: "20px 18px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          fontFamily: fontFamily.sans,
          color: colors.text,
        }}
      >
        {/* Header row: eyebrow + countdown chip */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Mono color={colors.blue}>Deal Spotter</Mono>
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: colors.text,
              background: colors.surface,
              border: `1px solid ${colors.line2}`,
              borderRadius: 999,
              padding: "6px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: colors.blue,
                boxShadow: `0 0 8px ${colors.blue}`,
              }}
            />
            {seconds}s
          </div>
        </div>

        {/* Listing card */}
        <div
          ref={ref}
          style={{
            background: colors.surface,
            border: `1px solid ${colors.line}`,
            borderRadius: 22,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          {/* Property identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 16,
                background: colors.bg2,
                border: `1px solid ${colors.lineSoft}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Puffy type="house" hue="blue" size={42} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, lineHeight: "20px" }}>
                412 Pegasus Ave
              </div>
              <div style={{ fontSize: 13, color: colors.muted, marginTop: 3 }}>
                Nashville, TN · 3bd / 2ba
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Stat label="Rent / mo" value="$2,850" />
            <Stat label="Price" value="$249,900" />
            <Stat label="Rent-to-price" value="1.14%" highlight />
            <Stat label="DOM" value="14 days" />
          </div>

          {/* Days-on-market tag */}
          <div style={{ display: "flex", gap: 8 }}>
            <Tag>Cash-flow positive</Tag>
            <Tag>Below market</Tag>
          </div>

          {/* Make offer pill */}
          <button
            type="button"
            style={{
              appearance: "none",
              border: "none",
              cursor: "pointer",
              width: "100%",
              background: colors.blue,
              color: "#fff",
              fontFamily: fontFamily.sans,
              fontSize: 15,
              fontWeight: 700,
              borderRadius: 999,
              padding: "13px 16px",
              boxShadow: `0 8px 24px ${colors.blue}55`,
            }}
          >
            Make offer
          </button>
        </div>

        {/* Grade reveal — fades + lifts in near the end of the timeline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            opacity: gradeP,
            transform: `translateY(${(1 - gradeP) * 12}px) scale(${0.92 + gradeP * 0.08})`,
            transformOrigin: "center",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(160deg, ${colors.blueLite}, ${colors.blue})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fontFamily.sans,
              fontWeight: 800,
              fontSize: 20,
              color: "#fff",
              boxShadow: `0 8px 22px ${colors.blue}66`,
            }}
          >
            S
          </div>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 13, fontWeight: 700, letterSpacing: "0.14em", color: colors.text }}>
            GRADE S · <span style={{ color: colors.green }}>+200 XP</span>
          </div>
        </div>
      </div>
    </PhoneReel>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        background: colors.bg2,
        border: `1px solid ${highlight ? colors.blueDeep : colors.lineSoft}`,
        borderRadius: 14,
        padding: "10px 12px",
      }}
    >
      <Mono size={9} color={colors.dim}>
        {label}
      </Mono>
      <div
        style={{
          marginTop: 5,
          fontSize: 16,
          fontWeight: 700,
          color: highlight ? colors.blueLite : colors.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: fontFamily.sans,
        fontSize: 11,
        fontWeight: 600,
        color: colors.muted,
        background: colors.bg2,
        border: `1px solid ${colors.lineSoft}`,
        borderRadius: 999,
        padding: "5px 10px",
      }}
    >
      {children}
    </span>
  );
}
