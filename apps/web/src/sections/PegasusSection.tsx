"use client";

// PegasusSection.tsx — "A coach in your pocket. 24/7." — the Pegasus AI coach.
// Centerpiece: the large, procedurally-animated Eddy moon (PegasusMoon — vector,
// seamless caustic loop). A spread-out chat dialogue floats around it (no device).
//
// Entrance: the moon is always visible (it's the hero of the section); the three
// dialogue bubbles fade/slide in one-by-one when the section scrolls into view.
// The stagger is pure CSS keyframes gated by an `.et-peg-in` class an
// IntersectionObserver adds once — `animation-fill-mode: both` guarantees the
// bubbles always finish visible (no rAF/React-state dependency to stall).

import React from "react";
import { colors, fontFamily, Eyebrow } from "@et/brand";
import { PegasusMoon } from "@et/screens";

// The coaching exchange (reused from the prototype's PEG_LANDING).
const DIALOGUE = {
  intro: "I'm Pegasus, your deal coach. Ask me about any property, number, or lesson.",
  user: "Is a $170k flip on a $300k ARV worth it?",
  answer:
    "Run the 70% rule: 0.70 × $300k = $210k, minus rehab. Max buy ≈ $170k. That's the ceiling, not a green light yet.",
};

const coachBubble: React.CSSProperties = {
  background: "rgba(18,18,20,0.82)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: `1px solid ${colors.line2}`,
  color: colors.ink,
  borderRadius: 20,
  borderTopLeftRadius: 6,
  padding: "15px 19px",
  fontFamily: fontFamily.sans,
  fontSize: 16.5,
  fontWeight: 500,
  lineHeight: 1.45,
  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
};

const userBubble: React.CSSProperties = {
  background: colors.blue,
  color: "#fff",
  borderRadius: 20,
  borderTopRightRadius: 6,
  padding: "15px 19px",
  fontFamily: fontFamily.sans,
  fontSize: 16.5,
  fontWeight: 600,
  lineHeight: 1.4,
  boxShadow: `0 16px 40px ${colors.blue}44`,
};

export function PegasusSection() {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Add `.et-peg-in` once the canvas is ~20% in view, which fires the CSS bubble
  // stagger. If IO is unavailable, reveal immediately.
  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("et-peg-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("et-peg-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="pegasus" style={{ position: "relative", padding: "120px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        {/* header — centered */}
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", marginBottom: 8 }}>
          <Eyebrow style={{ marginBottom: 16, display: "block" }}>Pegasus · AI coach</Eyebrow>
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
            A coach in your pocket.{" "}
            <span style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontWeight: 400, color: colors.blue }}>24/7.</span>
          </h2>
          <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: "0 auto", maxWidth: 540 }}>
            Ask about any property, number, or lesson and get answers grounded in real math: the 70% rule, DSCR, cash-on-cash,
            not vibes.
          </p>
        </div>

        {/* wide canvas — the big seamless moon with the dialogue spread around it */}
        <div ref={canvasRef} className="et-peg-canvas" style={{ position: "relative", maxWidth: 1000, margin: "8px auto 0", minHeight: 640 }}>
          {/* soft glow behind the moon */}
          <div
            aria-hidden
            className="et-peg-glow"
            style={{
              position: "absolute",
              left: "50%",
              top: "49.5%",
              transform: "translate(-50%,-50%)",
              width: 620,
              height: 620,
              maxWidth: "92%",
              borderRadius: "50%",
              background: `radial-gradient(50% 50% at 50% 50%, ${colors.blue}33, transparent 68%)`,
              pointerEvents: "none",
            }}
          />

          {/* the Eddy moon — always visible centerpiece; scales to fill its wrapper */}
          <div
            className="et-peg-moon"
            style={{ position: "absolute", left: "50%", top: "49.5%", transform: "translate(-50%,-50%)", width: 380, lineHeight: 0 }}
          >
            <PegasusMoon size={380} />
          </div>

          {/* dialogue — three free-floating bubbles, staggered in via CSS */}
          <div className="et-peg-bubble et-peg-b1" style={{ position: "absolute", left: 0, top: "3%", maxWidth: 300, ...coachBubble }}>
            {DIALOGUE.intro}
          </div>
          <div className="et-peg-bubble et-peg-b2" style={{ position: "absolute", right: 0, top: "38%", maxWidth: 270, ...userBubble }}>
            {DIALOGUE.user}
          </div>
          <div className="et-peg-bubble et-peg-b3" style={{ position: "absolute", left: 0, top: "80%", maxWidth: 410, ...coachBubble }}>
            {DIALOGUE.answer}
          </div>
        </div>
      </div>

      {/* moon sizing, bubble entrance stagger, and the small-screen stack */}
      <style dangerouslySetInnerHTML={{ __html: `
        .et-peg-moon { width: clamp(260px, 40vw, 380px); }
        .et-peg-moon svg { width: 100% !important; height: auto !important; display: block; }

        .et-peg-bubble { opacity: 0; }
        @keyframes etPegBubbleIn { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .et-peg-in .et-peg-b1 { animation: etPegBubbleIn .6s cubic-bezier(.22,1,.36,1) .15s both; }
        .et-peg-in .et-peg-b2 { animation: etPegBubbleIn .6s cubic-bezier(.22,1,.36,1) .45s both; }
        .et-peg-in .et-peg-b3 { animation: etPegBubbleIn .6s cubic-bezier(.22,1,.36,1) .75s both; }
        @media (prefers-reduced-motion: reduce) {
          .et-peg-bubble { opacity: 1 !important; animation: none !important; }
        }

        @media (max-width: 880px) {
          .et-peg-canvas {
            min-height: 0 !important;
            display: flex; flex-direction: column; align-items: center; gap: 16px;
          }
          .et-peg-glow { display: none !important; }
          .et-peg-canvas > .et-peg-moon,
          .et-peg-canvas > .et-peg-bubble {
            position: static !important; left: auto !important; right: auto !important;
            top: auto !important; bottom: auto !important; transform: none !important;
            max-width: 88% !important;
          }
          .et-peg-b2 { align-self: flex-end; }
          .et-peg-b1, .et-peg-b3 { align-self: flex-start; }
        }
      ` }} />
    </section>
  );
}
