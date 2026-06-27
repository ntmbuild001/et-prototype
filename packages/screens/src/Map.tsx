"use client";

// Map.tsx — the in-app lessons journey map (ported from et2-map.jsx + the
// reel's MapScreen). Five glossy key-cap nodes connected by an SVG trail, each
// state done/current/locked with a Puffy icon. Prop-driven & store-free.
//
// `appear` (optional): when true the path + nodes animate in on mount (used by
// the marketing reel); when false/omitted everything renders fully drawn.

import React from "react";
import {
  colors,
  fontFamily,
  Shell,
  Mono,
  Progress,
  Cta,
  RoundButton,
  Puffy,
  SKINS,
} from "@et/brand";
import type { PuffyType } from "@et/brand";
import { TabBar } from "./TabBar";
import type { TabId } from "./TabBar";

const MAP_VBW = 394;
const MAP_VBH = 700;

/** Node positions in viewBox coordinates (bottom-to-top zig-zag). */
const PTS = [
  { x: 100, y: 600 },
  { x: 286, y: 478 },
  { x: 118, y: 350 },
  { x: 292, y: 226 },
  { x: 168, y: 100 },
];

export interface MapNode {
  id: string;
  n: number;
  title: string;
  icon: PuffyType;
  state: "done" | "current" | "locked";
}

export interface MapProps {
  module: { eyebrow: string; title: string; sub?: string };
  nodes: MapNode[];
  /** Skin lookup key — defaults to "duo". */
  skinId?: "duo" | "green" | "mono";
  onOpen: (id: string) => void;
  onBack?: () => void;
  /** When true, animate the trail + nodes in on mount; else render drawn. */
  appear?: boolean;
  nav?: { active: TabId; onTab: (t: TabId) => void };
}

function clampn(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
function easeBack(t: number) {
  // overshoot easing for the "pop" reveal
  const c = 1.70158;
  const x = clampn(t, 0, 1);
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

/** Small status badge that floats on a node (check / play / lock). */
function NodeBadge({ state, size = 32 }: { state: MapNode["state"]; size?: number }) {
  const isDone = state === "done";
  const isCurrent = state === "current";
  const bg = isDone ? colors.green : isCurrent ? colors.blue : colors.surface;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        border: state === "locked" ? `1px solid ${colors.line2}` : "0",
        boxShadow: isDone
          ? `0 2px 8px rgba(var(--et-green-rgb),0.4)`
          : isCurrent
          ? `0 0 16px ${colors.blue}aa`
          : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {isDone && (
        <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke="#000" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {isCurrent && (
        <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#fff">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
      {state === "locked" && (
        <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="9" rx="1.6" stroke={colors.muted} strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke={colors.muted} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

export function Map(props: MapProps) {
  const { module, nodes, skinId = "duo", onOpen, onBack, appear = false, nav } = props;
  const skin = SKINS[skinId] || SKINS.duo;

  const doneCount = nodes.filter((n) => n.state === "done").length;
  const total = nodes.length;
  const current = nodes.find((n) => n.state === "current");
  const allDone = doneCount === total;

  // Animation timeline: 0 → fully drawn. Held at 1 unless `appear`.
  const [t, setT] = React.useState(appear ? 0 : 1);
  React.useEffect(() => {
    if (!appear) {
      setT(1);
      return;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setT(1);
      return;
    }
    let raf = 0;
    let start = 0;
    const dur = 1400;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / dur);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [appear]);

  // Path-draw fraction (first 60% of the timeline) and node-reveal float.
  const pathLit = clampn(t / 0.6, 0, 1);
  const appearFloat = t * (total + 1); // node i reveals as float passes i

  return (
    <Shell bg={skin.bg} label="Journey Map">
      {/* header */}
      <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "flex-start", gap: 12, flexShrink: 0 }}>
        {onBack ? (
          <RoundButton onClick={onBack} label="Back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </RoundButton>
        ) : (
          <div style={{ width: 40 }} />
        )}
        <div style={{ flex: 1, paddingTop: 1 }}>
          <Mono color={colors.blue} style={{ marginBottom: 4 }}>
            {module.eyebrow} · {module.title}
          </Mono>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
            {module.sub || "Your Journey"}
          </div>
        </div>
        <div style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: colors.muted, paddingTop: 6 }}>
          {doneCount}/{total}
        </div>
      </div>

      <Progress percent={(doneCount / total) * 100} />

      {/* map canvas */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${MAP_VBW} ${MAP_VBH}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          {[
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
          ].map(([a, b], i) => {
            const A = PTS[a];
            const B = PTS[b];
            const sa = nodes[a]?.state;
            const sb = nodes[b]?.state;
            const lit = sb === "done" || (sa === "done" && sb === "current");
            const len = Math.hypot(B.x - A.x, B.y - A.y);
            // For lit segments, draw progressively as the timeline advances.
            const litSegs = doneCount; // segments up to the current node
            const segP = lit ? clampn(pathLit * litSegs - i, 0, 1) : 0;
            return (
              <g key={i}>
                {/* dashed locked baseline */}
                <line
                  x1={A.x}
                  y1={A.y + 6}
                  x2={B.x}
                  y2={B.y + 6}
                  stroke={skin.pathLocked}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="2 13"
                />
                {/* lit overlay (drawn-in for the reel, solid otherwise) */}
                {lit && (
                  <line
                    x1={A.x}
                    y1={A.y + 6}
                    x2={B.x}
                    y2={B.y + 6}
                    stroke={colors.blue}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeOpacity="0.55"
                    strokeDasharray={len}
                    strokeDashoffset={len * (1 - segP)}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {nodes.map((node, i) => {
          const isCurrent = node.state === "current";
          const isLocked = node.state === "locked";
          const pop = appear ? easeBack(clampn(appearFloat - i, 0, 1)) : 1;
          if (pop <= 0) return null;
          const hue = skin.iconHue[node.state];
          const eColor = isCurrent ? colors.blue : isLocked ? colors.muted : colors.blue;
          const eyebrow = isCurrent ? "IN PROGRESS" : isLocked ? "LOCKED" : `STOP ${node.n}`;
          const pt = PTS[i] || PTS[0];
          return (
            <div
              key={node.id}
              style={{
                position: "absolute",
                left: `${(pt.x / MAP_VBW) * 100}%`,
                top: `${(pt.y / MAP_VBH) * 100}%`,
                transform: `translate(-50%,-50%) scale(${pop})`,
                opacity: clampn(pop, 0, 1),
                width: 168,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: isCurrent ? 6 : 2,
              }}
            >
              <button
                onClick={isLocked ? undefined : () => onOpen(node.id)}
                style={{
                  appearance: "none",
                  border: 0,
                  background: "transparent",
                  padding: 0,
                  cursor: isLocked ? "default" : "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ position: "relative", opacity: isLocked ? 0.62 : 1 }}>
                  {/* Flat dark-grey tile (homepage-card fill) with a state-colored
                      outline — done=green, current=blue (+glow), locked=line.
                      Replaces the glossy 3D CapTile: ~20% smaller, no lip. */}
                  <div
                    style={{
                      width: isCurrent ? 90 : 78,
                      height: isCurrent ? 90 : 78,
                      borderRadius: 20,
                      background: colors.surface,
                      border: `1.5px solid ${
                        node.state === "done" ? colors.green : isCurrent ? colors.blue : colors.line
                      }`,
                      // just-noticeable 3D raise (works in both modes): faint top
                      // highlight + bottom inner shadow + soft drop, plus the current glow.
                      boxShadow: [
                        "inset 0 1px 0 rgba(255,255,255,0.06)",
                        "inset 0 -3px 5px rgba(0,0,0,0.20)",
                        "0 3px 6px rgba(0,0,0,0.16)",
                        isCurrent ? `0 0 20px ${colors.blue}44` : "",
                      ]
                        .filter(Boolean)
                        .join(", "),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Puffy type={node.icon} hue={hue} size={isCurrent ? 50 : 44} />
                  </div>
                  <div style={{ position: "absolute", right: -6, top: -6, zIndex: 4 }}>
                    <NodeBadge state={node.state} size={isCurrent ? 34 : 28} />
                  </div>
                </div>
                <div style={{ marginTop: 14, textAlign: "center", maxWidth: 150 }}>
                  <div
                    style={{
                      fontFamily: fontFamily.mono,
                      fontSize: 9.5,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      color: eColor,
                      marginBottom: 5,
                    }}
                  >
                    {eyebrow}
                  </div>
                  <div
                    style={{
                      fontFamily: fontFamily.sans,
                      fontSize: 13.5,
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                      color: isLocked ? colors.muted : colors.ink,
                    }}
                  >
                    {node.title}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* When framed in the app, show a continue CTA; in frameless/reel mode the
          tab bar is omitted and the CTA still anchors the journey. */}
      {nav ? (
        <TabBar active={nav.active} onTab={nav.onTab} />
      ) : (
        <Cta
          label={allDone ? "Module complete" : `Continue · ${current ? current.title : ""}`}
          color={allDone ? "ghost" : "blue"}
          arrow={!allDone}
          onClick={allDone || !current ? undefined : () => onOpen(current.id)}
        />
      )}
    </Shell>
  );
}

export const mapDemo: MapProps = {
  module: { eyebrow: "Module 01", title: "Your First Deal", sub: "Your Journey" },
  skinId: "duo",
  nodes: [
    { id: "m1", n: 1, title: "The 1% Rule", icon: "coins", state: "done" },
    { id: "m2", n: 2, title: "Read a Listing", icon: "house", state: "done" },
    { id: "m3", n: 3, title: "Finance the Deal", icon: "bank", state: "done" },
    { id: "m4", n: 4, title: "Make the Offer", icon: "apartments", state: "current" },
    { id: "m5", n: 5, title: "Close It", icon: "villa", state: "locked" },
  ],
  onOpen: () => {},
  onBack: () => {},
};
