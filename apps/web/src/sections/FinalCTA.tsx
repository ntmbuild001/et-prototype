"use client";

// FinalCTA.tsx — closing call-to-action.
// Ported from `FinalCTA` in et-landing-2.jsx. No id (it's the closing band before
// the footer).
//
// Prototype-isms removed:
//  - Inlined the global Section/Wrap helpers as a fluid, centered 760px column.
//  - Embeds the <Waitlist/> form (matching the reference, which renders a full
//    WaitlistForm here rather than a scroll-up link).
//  - Entrance animation via brand useReveal (client) — no window/document at
//    module scope.

import React from "react";
import { colors, fontFamily, Eyebrow, useReveal } from "@et/brand";
import { Waitlist } from "./Waitlist";

export function FinalCTA() {
  const { ref, progress } = useReveal(800);
  const eased = 1 - Math.pow(1 - progress, 3);

  return (
    <section style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
      <div
        ref={ref}
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "0 28px",
          textAlign: "center",
          position: "relative",
          opacity: 0.05 + eased * 0.95,
          transform: `translateY(${(1 - eased) * 24}px)`,
          willChange: "opacity, transform",
        }}
      >
        <Eyebrow style={{ marginBottom: 18, display: "block" }}>The clock is running</Eyebrow>
        <h2
          style={{
            fontFamily: fontFamily.sans,
            fontSize: "clamp(38px, 5.5vw, 68px)",
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
            color: colors.ink,
            margin: "0 0 22px",
            textWrap: "balance",
          }}
        >
          Your career has an end date.
          <br />
          <span style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontWeight: 400, color: colors.blue }}>
            Your portfolio doesn’t have to.
          </span>
        </h2>
        <p style={{ fontFamily: fontFamily.sans, fontSize: 19, lineHeight: 1.5, color: colors.muted, margin: "0 auto 36px", maxWidth: 520 }}>
          Join the waitlist for private beta. Early members get founding access and a head start on the leaderboard.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Waitlist size="lg" />
        </div>
      </div>
    </section>
  );
}
