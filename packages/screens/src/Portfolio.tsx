"use client";

// Portfolio.tsx — the "Portfolio" tab-root, redesigned from et2-home-v2.jsx's
// ET2PortfolioScreen. Header ("Your portfolio" + serif door count) → the shared
// Robinhood-style PortfolioHero chart → Equity / Monthly cashflow stat grid →
// Holdings list → "Review with Pegasus". Prop-driven & store-free (omit `nav`
// for the frameless landing reel); fully themed via brand tokens / CSS vars.

import React from "react";
import { colors, fontFamily, Shell } from "@et/brand";
import { PegasusMoon } from "./PegasusMoon";
import { PortfolioHero, type HomePortfolio } from "./Home";
import { TabBar } from "./TabBar";
import type { TabId } from "./TabBar";

export interface PortfolioHolding {
  address: string;
  /** e.g. "Memphis · 4-plex". */
  sub: string;
  /** Preformatted value, e.g. "$268.0K". */
  value: string;
  /** Preformatted change, e.g. "+8.2%". */
  change: string;
  up: boolean;
}

export interface PortfolioProps {
  /** Serif headline door count ("3 doors."). */
  doorsLabel?: string;
  /** Portfolio hero value + chart. */
  portfolio?: HomePortfolio;
  /** Total equity, preformatted. */
  equity?: string;
  /** Monthly cashflow, preformatted. */
  cashflow?: string;
  /** Avatar initials. */
  initials?: string;
  holdings?: PortfolioHolding[];
  onProfile?: () => void;
  onReview?: () => void;
  nav?: { active: TabId; onTab: (t: TabId) => void };
}

const DEFAULT_HOLDINGS: PortfolioHolding[] = [
  { address: "1942 Faxon Ave", sub: "Memphis · 4-plex", value: "$268.0K", change: "+8.2%", up: true },
  { address: "88 Whitehaven Rd", sub: "Memphis · Triplex", value: "$214.0K", change: "+5.4%", up: true },
  { address: "3402 Givens Ave", sub: "Memphis · SFR", value: "$129.5K", change: "+1.1%", up: true },
];

function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: color || colors.muted }}>
      {children}
    </div>
  );
}

function PortHolding({ h }: { h: PortfolioHolding }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", background: colors.surface, border: `1px solid ${colors.line}`, borderRadius: 18 }}>
      <div style={{ width: 42, height: 42, borderRadius: 12, background: colors.surface2, border: `1px solid ${colors.line2}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M4 11.5L12 5l8 6.5M6 10v9h12v-9" stroke={colors.blueLite} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: fontFamily.sans, fontSize: 15, fontWeight: 800, color: colors.ink, letterSpacing: "-0.01em" }}>{h.address}</div>
        <div style={{ fontFamily: fontFamily.mono, fontSize: 11, color: colors.muted, marginTop: 3 }}>{h.sub}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: fontFamily.mono, fontSize: 14, fontWeight: 700, color: colors.ink }}>{h.value}</div>
        <div style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, color: h.up ? colors.green : colors.error, marginTop: 3 }}>{h.change}</div>
      </div>
    </div>
  );
}

export function Portfolio(props: PortfolioProps) {
  const {
    doorsLabel = "3 doors.",
    portfolio,
    equity = "$312.0K",
    cashflow = "$4,120",
    initials = "AB",
    holdings = DEFAULT_HOLDINGS,
    onProfile,
    onReview,
    nav,
  } = props;

  return (
    <Shell label="Portfolio">
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 20px 120px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <Eyebrow color={colors.blueLite}>Your portfolio</Eyebrow>
            <div style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.01em", marginTop: 3, color: colors.ink }}>{doorsLabel}</div>
          </div>
          <button onClick={onProfile} aria-label="Profile" style={{ appearance: "none", cursor: onProfile ? "pointer" : "default", padding: 0, border: 0, background: "transparent" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: colors.surface2, border: `1px solid ${colors.line2}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontFamily.mono, fontSize: 14, fontWeight: 700, color: colors.blue }}>
              {initials}
            </div>
          </button>
        </div>

        <PortfolioHero portfolio={portfolio} initials={initials} />

        {/* equity / cashflow */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Equity", equity],
            ["Monthly cashflow", cashflow],
          ].map(([k, v], i) => (
            <div key={i} style={{ border: `1px solid ${colors.line}`, borderRadius: 18, background: colors.surface, padding: "14px 16px" }}>
              <Eyebrow>{k}</Eyebrow>
              <div style={{ fontFamily: fontFamily.mono, fontSize: 20, fontWeight: 700, color: colors.ink, marginTop: 8 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* holdings */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Eyebrow color={colors.blueLite}>Holdings · {holdings.length}</Eyebrow>
          {holdings.map((h, i) => (
            <PortHolding key={i} h={h} />
          ))}
        </div>

        <button
          onClick={onReview}
          style={{ appearance: "none", cursor: "pointer", border: 0, width: "100%", height: 52, borderRadius: 999, background: "rgba(30,91,255,0.14)", color: colors.ink, fontFamily: fontFamily.sans, fontSize: 15, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9 }}
        >
          <PegasusMoon size={24} detail={false} glow={false} /> Review with Pegasus
        </button>
      </div>

      {nav && <TabBar active={nav.active} onTab={nav.onTab} />}
    </Shell>
  );
}

export const portfolioDemo: PortfolioProps = {
  doorsLabel: "3 doors.",
  equity: "$312.0K",
  cashflow: "$4,120",
  initials: "AB",
  holdings: DEFAULT_HOLDINGS,
};
