"use client";

// Spotlight.tsx — "Athlete spotlight" split section (after the player cards).
// Left: dynamic text — eyebrow, serif-emphasis headline, and a rotating athlete
// quote that cycles. Right: a talking-head video panel framed in the same glassy
// card language as the PlayerCards (backdrop-blur, white-alpha border, LIVE pill,
// name overlay). Drop a clip at apps/web/public/spotlight.mp4 and it plays
// (muted, looping) over the poster placeholder; until then the placeholder shows.
//
// Cohesive with the rest of the lander: brand tokens + fonts, mono eyebrow, blue
// accents, serif italic emphasis, and a scroll-reveal entrance (useReveal).

import React from "react";
import { colors, fontFamily, useReveal } from "@et/brand";

// Drop a clip at apps/web/public/spotlight.mp4 and set this to "/spotlight.mp4"
// to enable the real video; empty = show the styled poster placeholder.
const VIDEO_SRC = "";

const QUOTES: ReadonlyArray<string> = [
  "“I owned three doors before I owned a watch.”",
  "“Game checks are temporary. Doors aren’t.”",
  "“Pegasus ran the numbers. I made the call.”",
];

export function Spotlight() {
  const { ref, progress } = useReveal(800);
  const eased = 1 - Math.pow(1 - progress, 3);

  const [qi, setQi] = React.useState(0);
  React.useEffect(() => {
    const id = window.setInterval(() => setQi((i) => (i + 1) % QUOTES.length), 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section id="spotlight" style={{ position: "relative", padding: "110px 0", overflow: "hidden" }}>
      <div
        ref={ref}
        className="et-spot-grid"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 28px",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "minmax(0,0.9fr) minmax(0,1.05fr)",
          gap: 56,
          alignItems: "center",
          opacity: 0.05 + eased * 0.95,
          transform: `translateY(${(1 - eased) * 22}px)`,
          willChange: "opacity, transform",
        }}
      >
        {/* dynamic text (right on desktop) */}
        <div className="et-spot-copy">
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: colors.blue,
              marginBottom: 16,
            }}
          >
            Athlete spotlight
          </div>
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
            The leap, in their own{" "}
            <span style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontWeight: 400, color: colors.blue }}>words.</span>
          </h2>
          <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: "0 0 28px", maxWidth: 460 }}>
            Hear how pros are turning game checks into doors, cashflow, and equity that outlasts the career,
            straight from the members.
          </p>

          {/* rotating quote — the "dynamic" text */}
          <div
            style={{
              borderLeft: `2px solid ${colors.blue}`,
              paddingLeft: 18,
              minHeight: 64,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              key={qi}
              className="et-spot-quote"
              style={{
                fontFamily: fontFamily.serif,
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.2vw, 26px)",
                lineHeight: 1.3,
                color: colors.ink,
              }}
            >
              {QUOTES[qi]}
            </div>
            <div style={{ fontFamily: fontFamily.mono, fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.muted, marginTop: 12 }}>
              Austin Bryant · Defensive End
            </div>
          </div>
        </div>

        {/* talking-head video panel (left on desktop) */}
        <VideoPanel />
      </div>

      {/* responsive: stack into one column on small screens, cap the video width */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes etSpotQuoteIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .et-spot-quote { animation: etSpotQuoteIn .5s cubic-bezier(.22,1,.36,1) both; }
        /* desktop: video on the left, copy on the right */
        .et-spot-video { order: 1; }
        .et-spot-copy { order: 2; }
        @media (max-width: 860px) {
          .et-spot-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          .et-spot-copy { order: 0; }
          .et-spot-video { order: 1; max-width: 380px; margin: 0 auto; }
        }
        @media (prefers-reduced-motion: reduce) { .et-spot-quote { animation: none; } }
      ` }} />
    </section>
  );
}

function VideoPanel() {
  const [ready, setReady] = React.useState(false);

  return (
    <div
      className="et-spot-video"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 5",
        borderRadius: 24,
        overflow: "hidden",
        background: "rgba(20,23,30,0.45)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 18px 44px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* real clip (muted, looping) — fades in over the placeholder once it loads.
          Only rendered when a clip is set, so there's no 404 for a missing file. */}
      {VIDEO_SRC && (
        <video
          src={VIDEO_SRC}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          onLoadedData={() => setReady(true)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: ready ? 1 : 0, transition: "opacity .45s ease" }}
        />
      )}

      {/* poster placeholder — shown until a clip is present */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          opacity: ready ? 0 : 1,
          transition: "opacity .45s ease",
          background: "radial-gradient(120% 90% at 50% 18%, #12244a 0%, #0a1326 48%, #07090f 100%)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 52%, rgba(5,7,12,0.72) 100%)" }} />
        {/* play affordance */}
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: colors.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 12px 34px ${colors.blue}66`,
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* persistent chrome: SPOTLIGHT pill + name overlay (over poster and video) */}
      <div style={{ position: "absolute", top: 14, left: 14, display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999, background: "rgba(8,10,13,0.7)", backdropFilter: "blur(6px)" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green, boxShadow: `0 0 8px ${colors.green}` }} />
        <span style={{ fontFamily: fontFamily.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.14em", color: "#fff" }}>SPOTLIGHT</span>
      </div>
      <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
        <div style={{ fontFamily: fontFamily.sans, fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1.05 }}>Austin Bryant</div>
        <div style={{ fontFamily: fontFamily.sans, fontSize: 13.5, color: "rgba(255,255,255,0.72)", marginTop: 3 }}>Defensive End · 1 door and counting</div>
      </div>
    </div>
  );
}
