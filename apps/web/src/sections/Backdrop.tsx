// Backdrop.tsx — the aurora-glow + grid backdrop behind the landing page.
//
// Ported from et-landing-1.jsx. The prototype rendered a Backdrop *per section*
// with a `pos`/`glow` prop so a blue splotch traveled down the page. Here we use
// a single FIXED backdrop layer behind the whole page (position: fixed, behind
// content, pointer-events: none) so it reads as one continuous ambient field on
// a fluid responsive page rather than a stack of fixed phone screens.
//
// Purely presentational → server component (no "use client").

import React from "react";
import { colors } from "@et/brand";

// Vertical fade so the glow eases in/out instead of cutting hard at edges.
const FADE = "linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)";

export function Backdrop() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        background: colors.bg,
        maskImage: FADE,
        WebkitMaskImage: FADE,
      }}
    >
      {/* primary splotch — upper centre, where the hero sits */}
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1180,
          height: 760,
          background: `radial-gradient(50% 50% at 50% 50%, ${colors.blue}3a 0%, transparent 72%)`,
        }}
      />
      {/* secondary splotch — opposite corner, dimmer */}
      <div
        style={{
          position: "absolute",
          top: "74%",
          left: "12%",
          transform: "translate(-50%, -50%)",
          width: 820,
          height: 560,
          background: `radial-gradient(50% 50% at 50% 50%, ${colors.blue}24 0%, transparent 70%)`,
        }}
      />
      {/* faint engineering grid, masked to a soft radial so it dissolves at edges */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${colors.lineSoft2} 1px, transparent 1px), linear-gradient(90deg, ${colors.lineSoft2} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.32,
          maskImage: "radial-gradient(85% 60% at 50% 22%, #000 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(85% 60% at 50% 22%, #000 0%, transparent 80%)",
        }}
      />
    </div>
  );
}
