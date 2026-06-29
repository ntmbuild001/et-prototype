"use client";

// Hero.tsx — landing hero. Ported faithfully from `Hero` + `HeroPhone` in
// et-landing-1.jsx and `PegasusAnalysisScreen`/`UWRow` in et-reel-screens.jsx.
// Left: badge, serif-emphasised headline ("Where athletes become owners."),
// game-checks→real-estate subcopy, and the <Waitlist/> form. Right: a 3D
// floating phone that loops (11s) between a Pegasus moon splash and a live
// deal-underwrite analysis — the signature hero motion.

import React from "react";
import { colors, fontFamily, PhoneFrame, Puffy } from "@et/brand";
import { PegasusMoon } from "@et/screens";
import { Waitlist } from "./Waitlist";

export function Hero() {
  return (
    <section
      id="waitlist"
      style={{ position: "relative", overflow: "hidden", paddingTop: 96, paddingBottom: 56 }}
    >
      <span id="top" style={{ position: "absolute", top: 0 }} aria-hidden />
      <div
        className="et-hero-grid"
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1.05fr) minmax(0,0.95fr)",
          gap: 40,
          alignItems: "center",
        }}
      >
        {/* left — copy + waitlist */}
        <div>
          <h1
            style={{
              fontFamily: fontFamily.sans,
              fontSize: "clamp(44px, 6vw, 78px)",
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 0.98,
              color: colors.ink,
              margin: "0 0 18px",
              textWrap: "balance",
            }}
          >
            Where athletes
            <br />
            become{" "}
            <span style={{ fontFamily: fontFamily.serif, fontWeight: 400, fontStyle: "italic", color: colors.blue }}>owners.</span>
          </h1>

          <p
            style={{
              fontFamily: fontFamily.sans,
              fontSize: "clamp(17px, 1.5vw, 20px)",
              lineHeight: 1.5,
              color: colors.muted,
              margin: "0 0 28px",
              maxWidth: 520,
            }}
          >
            A community of pros turning game checks into real estate, together. Track teammates&rsquo; live deals, run your own
            deals, and build a portfolio that outlasts the career. Own more than you earned.
          </p>

          <Waitlist size="lg" />
        </div>

        {/* right — floating phone with the looping splash↔analysis motion */}
        <div className="et-hero-phone" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <HeroPhone />
        </div>
      </div>

      {/* responsive: single column + hide the phone on small viewports */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 900px) {
          .et-hero-grid { grid-template-columns: 1fr !important; }
          .et-hero-phone { display: none !important; }
        }
      ` }} />
    </section>
  );
}

// ── looping clock + easing (no Stage engine on the landing) ──────────
function useHeroLoop(period: number) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start == null) start = now;
      setT(((now - start) / 1000) % period);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [period]);
  return t;
}

const clampn = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

function HeroPhone() {
  // Living hero: a big Pegasus moon splash, then the underwrite mockup
  // (Pegasus analysing a real deal) — looping (PERIOD = 11s).
  const PERIOD = 11;
  const t = useHeroLoop(PERIOD);
  const eo = (x: number) => 1 - Math.pow(1 - clampn(x), 3);
  // crossfade splash ↔ analysis
  const splashOp = t < 3.0 ? 1 : t < 3.6 ? 1 - (t - 3.0) / 0.6 : t > 10.3 ? clampn((t - 10.3) / 0.7) : 0;
  const anaOp = 1 - splashOp;
  // moon intro + reveal
  const moonScale = 0.72 + eo(t / 1.5) * 0.28;
  const introFade = eo((t - 0.15) / 0.8);
  const reveal = eo((t - 4.0) / 3.4);
  return (
    <div style={{ position: "relative", perspective: 2000, width: "100%", maxWidth: 420, margin: "0 auto", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: "rotateY(-14deg) rotateX(6deg) rotateZ(1deg)",
          transformStyle: "preserve-3d",
          filter: `drop-shadow(0 50px 80px rgba(0,0,0,0.6)) drop-shadow(0 0 60px ${colors.blue}33)`,
        }}
      >
        <div style={{ transform: "scale(0.62)", transformOrigin: "center", position: "relative" }}>
          <div style={{ opacity: anaOp }}>
            <PhoneFrame>
              <PegasusAnalysisScreen reveal={reveal} />
            </PhoneFrame>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: splashOp, pointerEvents: "none" }}>
            <PhoneFrame>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "radial-gradient(125% 80% at 50% 38%, #08101f 0%, #000 72%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 30,
                  padding: 40,
                }}
              >
                <div style={{ filter: `drop-shadow(0 0 60px ${colors.blue}77)`, transform: `scale(${moonScale})`, opacity: introFade }}>
                  <PegasusMoon size={104} />
                </div>
                <div style={{ textAlign: "center", opacity: introFade }}>
                  <div style={{ fontFamily: fontFamily.mono, fontSize: 16, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: colors.blueLite }}>
                    Pegasus
                  </div>
                  <div style={{ fontFamily: fontFamily.sans, fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em", color: "#fff", marginTop: 16, lineHeight: 1.1 }}>
                    Your 24/7
                    <br />
                    deal coach.
                  </div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── deal-underwrite analysis screen (ported from et-reel-screens.jsx) ──
// `reveal` 0..1 staggers the property card, each underwriting row, and verdict.
function UWRow({ k, sub, v, color, strong, show = 1 }: { k: string; sub?: string; v: string; color?: string; strong?: boolean; show?: number }) {
  const s = clampn(show);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        padding: "13px 0",
        borderTop: `1px solid ${colors.line}`,
        opacity: s,
        transform: `translateY(${(1 - s) * 8}px)`,
      }}
    >
      <div>
        <div style={{ fontFamily: fontFamily.mono, fontSize: 12, letterSpacing: "0.07em", textTransform: "uppercase", color: colors.muted }}>{k}</div>
        {sub && <div style={{ fontFamily: fontFamily.mono, fontSize: 10.5, color: colors.dim, marginTop: 4, letterSpacing: "0.04em" }}>{sub}</div>}
      </div>
      <div style={{ fontFamily: fontFamily.sans, fontSize: strong ? 23 : 18, fontWeight: strong ? 800 : 700, color: color || "#fff", whiteSpace: "nowrap" }}>{v}</div>
    </div>
  );
}

function PegasusAnalysisScreen({ reveal = 1 }: { reveal?: number }) {
  const step = (i: number) => clampn(reveal * 6.5 - i);
  const rows = [
    { k: "After-repair value", sub: "from 6 sold comps", v: "$300,000" },
    { k: "Est. rehab", sub: "scope + 10% contingency", v: "$30,000" },
    { k: "70% rule ceiling", sub: "0.70 × ARV − rehab", v: "$180,000", color: colors.blueLite, strong: true },
    { k: "Asking", v: "$159,000" },
    { k: "Margin under ceiling", v: "+$21,000", color: colors.green, strong: true },
  ];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "radial-gradient(125% 80% at 50% -8%, #08101f 0%, #000 58%)",
        color: "#fff",
        fontFamily: fontFamily.sans,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px 16px", flexShrink: 0, borderBottom: `1px solid ${colors.line}` }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: colors.surface, border: `1px solid ${colors.line2}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PegasusMoon size={36} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: "-0.01em" }}>Pegasus</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green }} />
            <span style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.muted }}>Underwriting · live</span>
          </div>
        </div>
      </div>
      {/* body */}
      <div style={{ flex: 1, overflow: "hidden", padding: "20px 20px 16px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ maxWidth: "82%", background: colors.blue, borderRadius: 18, borderTopRightRadius: 6, padding: "13px 17px", fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>
            Underwrite 2917 Barron Ave for me.
          </div>
        </div>
        <div
          style={{
            border: `1px solid ${colors.line2}`,
            borderRadius: 22,
            background: colors.surface,
            overflow: "hidden",
            opacity: clampn(step(0)),
            transform: `translateY(${(1 - step(0)) * 18}px)`,
          }}
        >
          <div style={{ padding: "18px 20px 4px", display: "flex", alignItems: "center", gap: 14 }}>
            <Puffy type="apartments" hue="blue" size={46} />
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: "-0.015em" }}>2917 Barron Ave</div>
              <div style={{ fontFamily: fontFamily.mono, fontSize: 11, color: colors.muted, marginTop: 3, letterSpacing: "0.07em", textTransform: "uppercase" }}>Duplex · 2×2BR · Memphis, TN</div>
            </div>
          </div>
          <div style={{ padding: "6px 20px 16px" }}>
            {rows.map((r, i) => (
              <UWRow key={i} {...r} show={step(i + 1)} />
            ))}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 18px",
                borderRadius: 14,
                background: "rgba(31,233,138,0.1)",
                border: "1px solid rgba(31,233,138,0.3)",
                opacity: clampn(step(6)),
                transform: `translateY(${(1 - step(6)) * 8}px)`,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke={colors.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: fontFamily.sans, fontSize: 16, fontWeight: 700, color: "#fff" }}>Under the ceiling. Pursue this one.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
