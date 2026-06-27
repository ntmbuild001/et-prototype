"use client";

// PegasusMoon.tsx — the animated "Eddy Moon" mark (from the standalone
// Pegasus Eddy Moon design). A radial-gradient sphere with an animated caustic
// swirl, a pulsing corona, and a breathing glow. Shared by the Pegasus screen
// header and the bottom-nav Pegasus tab. Keyframes are injected from a client
// effect (not module scope) so the package stays side-effect-free for static
// landing renders. Each instance uses unique gradient/filter ids (useId) so
// multiple moons on one screen never collide.

import React from "react";

const PEG_MOON_CSS = `
@keyframes pegMoonSwirl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pegMoonCorona { 0%,100% { transform: scale(1); opacity:.5; } 50% { transform: scale(1.085); opacity:.78; } }
@keyframes pegMoonGlow {
  0%,100% { filter: drop-shadow(0 0 var(--g1) rgba(127,176,255,.5)) drop-shadow(0 0 var(--g2) rgba(30,91,255,.32)); }
  50%     { filter: drop-shadow(0 0 var(--g1b) rgba(127,176,255,.72)) drop-shadow(0 0 var(--g2b) rgba(30,91,255,.46)); }
}
.pegMoonSvg  { overflow: visible; animation: pegMoonGlow 7.5s ease-in-out infinite; }
.pegMoonSwirl{ transform-box: view-box; transform-origin: 100px 100px; animation: pegMoonSwirl 46s linear infinite; }
.pegMoonCorona{ transform-box: fill-box; transform-origin: center; animation: pegMoonCorona 9.5s ease-in-out infinite; }
@keyframes pegDotBob { 0%,100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-5px); opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .pegMoonSvg { animation: none; filter: drop-shadow(0 0 var(--g1b) rgba(127,176,255,.6)); }
  .pegMoonSwirl, .pegMoonCorona, .pegDot { animation: none; }
}`;

export function usePegasusMoonStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById("peg-moon-styles")) return;
    const s = document.createElement("style");
    s.id = "peg-moon-styles";
    s.textContent = PEG_MOON_CSS;
    document.head.appendChild(s);
  }, []);
}

export function PegasusMoon({
  size = 28,
  detail = true,
  glow = true,
}: {
  size?: number;
  /** Render the animated caustic swirl (heavier; invisible at tiny sizes). */
  detail?: boolean;
  /** Apply the breathing drop-shadow glow. */
  glow?: boolean;
}) {
  usePegasusMoonStyles();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const glowVars = {
    "--g1": `${size * 0.1}px`,
    "--g2": `${size * 0.25}px`,
    "--g1b": `${size * 0.16}px`,
    "--g2b": `${size * 0.4}px`,
  } as React.CSSProperties;

  return (
    <svg
      className={glow ? "pegMoonSvg" : undefined}
      style={glow ? glowVars : { overflow: "visible" }}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`pmBody-${uid}`} cx="46%" cy="40%" r="68%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="32%" stopColor="#dcebff" />
          <stop offset="66%" stopColor="#6ea3ff" />
          <stop offset="100%" stopColor="#27579f" />
        </radialGradient>
        <radialGradient id={`pmRim-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="74%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#cfe2ff" stopOpacity="0.82" />
        </radialGradient>
        {detail && (
          <filter id={`pmCaus-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="5" stitchTiles="stitch" result="t">
              <animate attributeName="baseFrequency" dur="20s" values="0.014;0.02;0.014" repeatCount="indefinite" />
            </feTurbulence>
            <feColorMatrix in="t" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.5 -0.82" result="c" />
            <feGaussianBlur in="c" stdDeviation="0.7" />
          </filter>
        )}
        <clipPath id={`pmClip-${uid}`}>
          <circle cx="100" cy="100" r="78" />
        </clipPath>
      </defs>
      <circle className="pegMoonCorona" cx="100" cy="100" r="84" fill="#6ea3ff" style={{ filter: "blur(20px)" }} opacity="0.5" />
      <g clipPath={`url(#pmClip-${uid})`}>
        <circle cx="100" cy="100" r="78" fill={`url(#pmBody-${uid})`} />
        {detail && (
          <g className="pegMoonSwirl">
            <rect x="20" y="20" width="160" height="160" filter={`url(#pmCaus-${uid})`} opacity="0.72" style={{ mixBlendMode: "screen" }} />
          </g>
        )}
        <ellipse cx="84" cy="68" rx="32" ry="24" fill="#ffffff" opacity="0.3" style={{ filter: "blur(13px)" }} />
      </g>
      <circle cx="100" cy="100" r="78" fill={`url(#pmRim-${uid})`} />
    </svg>
  );
}
