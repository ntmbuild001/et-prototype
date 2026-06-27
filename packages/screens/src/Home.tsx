"use client";

// Home.tsx — the connected-app dashboard, portfolio-led (ported from
// et2-home-v2.jsx). Hero stack: greeting → Pegasus coach card → "your latest
// deal" Elite-Mogul card → Robinhood-style portfolio value + chart → Continue
// (Module 01) → "From the league" feed. Nav = the 5-tab bar with the raised
// Pegasus eddy moon in the center.
//
// Fully prop-driven and store-free (the marketing reel renders it statically;
// omit `nav` to drop the tab bar / frameless mode), and fully themed — every
// color routes through the brand `colors` tokens / CSS vars, so light & dark
// both work. The Eddy moon reuses the shared <PegasusMoon/>.

import React from "react";
import { colors, fontFamily, Shell, ThemeToggle } from "@et/brand";
import { PegasusMoon } from "./PegasusMoon";
import { TabBar } from "./TabBar";
import type { TabId } from "./TabBar";

// ── types ───────────────────────────────────────────────────────────────────
export interface LeagueItem {
  handle: string;
  time: string;
  tag: string;
  kind: "win" | "close" | "rank";
  text: string;
}

export interface HomeDeal {
  eyebrow: string;
  name: string;
  role: string;
  statusLabel: string;
  address: string;
  initials: string;
  stats: { value: string; label: string }[];
}

export interface HomePortfolio {
  value: string;
  change: string;
  period: string;
}

export interface HomeProps {
  /** First name for the greeting ("Austin."). */
  name: string;
  /** Greeting kicker ("Good morning"); omit to derive from the time of day. */
  greeting?: string;
  /** Header avatar initials. */
  initials?: string;
  /** Pegasus coach guidance line (rendered in serif italic). */
  coachLine?: string;
  /** "Your latest deal" card. */
  deal?: HomeDeal;
  /** Portfolio hero (value + chart). */
  portfolio?: HomePortfolio;
  /** Continue card. */
  continueEyebrow?: string;
  continueTitle?: string;
  continueDone?: number;
  continueTotal?: number;
  /** "From the league" feed. */
  league?: LeagueItem[];

  /** Actions. */
  onPegasus?: () => void;
  onFinishLesson?: () => void;
  onContinue?: () => void;
  onProfile?: () => void;
  onPortfolio?: () => void;

  /** Tab bar wiring. Omit to render frameless (landing reel). */
  nav?: { active: TabId; onTab: (t: TabId) => void };
}

// ── demo defaults ────────────────────────────────────────────────────────────
const DEFAULT_DEAL: HomeDeal = {
  eyebrow: "Elite Mogul",
  name: "Austin Bryant",
  role: "Investor · Nashville, TN",
  statusLabel: "Active",
  address: "1942 Faxon Ave",
  initials: "AB",
  stats: [
    { value: "1", label: "active deals" },
    { value: "3,440", label: "sq ft" },
    { value: "4-Plex", label: "asset" },
  ],
};

const DEFAULT_PORTFOLIO: HomePortfolio = {
  value: "$248,400",
  change: "+$12,480 · 5.3%",
  period: "this month",
};

const DEFAULT_LEAGUE: LeagueItem[] = [
  { handle: "@nina_underwrites", time: "2h", tag: "Posted a win", kind: "win", text: "Triplex in Whitehaven, forced $54k of equity in 6 months." },
  { handle: "@deon_buys", time: "5h", tag: "Closed a deal", kind: "close", text: "4-plex in Frayser, $0 down on a seller carry." },
];

// ── small shared bits ────────────────────────────────────────────────────────
function Eyebrow({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: color || colors.muted }}>
      {children}
    </div>
  );
}

function InitialAvatar({ size = 42, initials = "AB" }: { size?: number; initials?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors.surface2,
        border: `1px solid ${colors.line2}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontFamily: fontFamily.mono,
        fontSize: size * 0.34,
        fontWeight: 700,
        color: colors.blue,
      }}
    >
      {initials}
    </div>
  );
}

// ── portfolio area chart + range tabs ───────────────────────────────────────
function HVChart({ h = 120 }: { h?: number }) {
  const line = "M2 78 C 26 70, 40 84, 60 66 S 96 40, 120 48 S 160 22, 188 30 S 224 10, 248 16";
  const fillId = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg width="100%" height={h} viewBox="0 0 250 96" preserveAspectRatio="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`hvfill-${fillId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.blue} stopOpacity="0.22" />
          <stop offset="1" stopColor={colors.blue} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="0" y1="48" x2="250" y2="48" stroke="var(--et-line-soft)" strokeWidth="0.7" strokeDasharray="3 4" />
      <path d={`${line} L 248 96 L 2 96 Z`} fill={`url(#hvfill-${fillId})`} />
      <path d={line} fill="none" stroke={colors.blueLite} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HVRange({ active = "1M" }: { active?: string }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "space-between", marginTop: 4 }}>
      {["1D", "1W", "1M", "1Y", "ALL"].map((t) => {
        const on = t === active;
        return (
          <div
            key={t}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "7px 0",
              borderRadius: 10,
              fontFamily: fontFamily.mono,
              fontSize: 11,
              fontWeight: 700,
              background: on ? colors.ink : "transparent",
              color: on ? colors.bg : colors.muted,
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
}

export function PortfolioHero({ portfolio = DEFAULT_PORTFOLIO, initials = "AB", onOpen }: { portfolio?: HomePortfolio; initials?: string; onOpen?: () => void }) {
  return (
    <div
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      style={{
        cursor: onOpen ? "pointer" : "default",
        background: "var(--et-card-hero)",
        border: `1px solid ${colors.line}`,
        borderRadius: 26,
        padding: "20px 20px 16px",
        boxShadow: "0 24px 50px rgba(0,0,0,0.45), inset 0 1px 0 var(--et-line-soft)",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div
          aria-hidden
          style={{
            width: 78,
            height: 78,
            flexShrink: 0,
            borderRadius: "50%",
            background: `radial-gradient(120% 120% at 30% 20%, ${colors.surface2}, ${colors.surface})`,
            border: `1px solid ${colors.line2}`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontFamily.mono,
            fontSize: 24,
            fontWeight: 700,
            color: colors.blue,
          }}
        >
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <Eyebrow color={colors.blueLite}>Portfolio value</Eyebrow>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 30, fontWeight: 700, color: colors.ink, letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>
            {portfolio.value}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M6 11l6-6 6 6" stroke={colors.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, color: colors.green }}>{portfolio.change}</span>
            <span style={{ fontFamily: fontFamily.mono, fontSize: 9.5, color: colors.muted }}>{portfolio.period}</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        <HVChart h={120} />
      </div>
      <HVRange active="1M" />
    </div>
  );
}

// ── Pegasus coach card ───────────────────────────────────────────────────────
function CoachCard({ line, onPegasus, onFinish }: { line: string; onPegasus?: () => void; onFinish?: () => void }) {
  const btn = (label: string, fill: boolean, fn?: () => void) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        fn && fn();
      }}
      style={{
        flex: 1,
        fontFamily: fontFamily.sans,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        color: fill ? colors.bg : colors.blueLite,
        border: `1px solid rgba(30,91,255,0.45)`,
        background: fill ? colors.blueLite : "rgba(30,91,255,0.12)",
        borderRadius: 999,
        padding: "11px 16px",
      }}
    >
      {label}
    </button>
  );
  return (
    <div
      onClick={onPegasus}
      role="button"
      style={{
        cursor: "pointer",
        flexShrink: 0,
        background: "var(--et-card-pegasus)",
        border: `1px solid var(--et-card-pegasus-border)`,
        borderRadius: 24,
        padding: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 13 }}>
        <PegasusMoon size={40} />
        <div>
          <div style={{ fontFamily: fontFamily.sans, fontSize: 16, fontWeight: 800, color: colors.ink }}>Pegasus</div>
          <Eyebrow color={colors.blueLite}>Your coach · here now</Eyebrow>
        </div>
      </div>
      <div style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontSize: 23, lineHeight: 1.3, color: colors.ink, letterSpacing: "-0.005em" }}>
        {line}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {btn("Finish Lesson", true, onFinish)}
        {btn("Ask Pegasus", false, onPegasus)}
      </div>
    </div>
  );
}

// ── "Your latest deal" — glossy live Elite-Mogul card ───────────────────────
function LatestDeal({ deal, onOpen }: { deal: HomeDeal; onOpen?: () => void }) {
  return (
    <div
      onClick={onOpen}
      role="button"
      style={{
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        flexShrink: 0,
        border: `1px solid var(--et-card-deal-border)`,
        borderRadius: 28,
        overflow: "hidden",
        background: "var(--et-card-deal-bg)",
        position: "relative",
        color: colors.ink,
        boxShadow: "0 0 0 1px rgba(30,91,255,0.1), 0 22px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* glossy header — a fixed dark-blue banner (mode-independent) */}
      <div style={{ position: "relative", height: 132, background: "linear-gradient(150deg, #1b2d4f 0%, #0f1a30 56%, #15243f 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(118deg, transparent 28%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0.17) 50%, rgba(255,255,255,0.04) 58%, transparent 72%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.22)" }} />
        <div style={{ position: "absolute", top: 14, right: 14, display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "6px 12px" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green, boxShadow: `0 0 8px ${colors.green}` }} />
          <span style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#fff" }}>LIVE</span>
        </div>
      </div>

      {/* avatar straddling the seam */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 22,
          width: 84,
          height: 84,
          borderRadius: "50%",
          background: colors.surface2,
          border: `1px solid ${colors.line2}`,
          zIndex: 3,
          boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontFamily.mono,
          fontSize: 26,
          fontWeight: 700,
          color: colors.blueLite,
          letterSpacing: "0.02em",
        }}
      >
        {deal.initials}
      </div>

      {/* body */}
      <div style={{ padding: "52px 22px 20px", display: "flex", flexDirection: "column" }}>
        <Eyebrow color={colors.blueLite}>{deal.eyebrow}</Eyebrow>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 8 }}>
          <div style={{ fontFamily: fontFamily.sans, fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: colors.ink }}>{deal.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.green }} />
            <span style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: 500, color: colors.muted }}>{deal.statusLabel}</span>
          </div>
        </div>
        <div style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.muted, marginTop: 6 }}>{deal.role}</div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 11.5L12 5l8 6.5M6 10v9h12v-9" stroke={colors.blueLite} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 17, fontWeight: 700, color: colors.ink, letterSpacing: "-0.01em" }}>{deal.address}</span>
        </div>

        <div style={{ display: "flex", marginTop: 18, background: "var(--et-line-soft)", border: "1px solid var(--et-line-soft)", borderRadius: 18, overflow: "hidden" }}>
          {deal.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "16px 10px", textAlign: "center", borderLeft: i === 0 ? 0 : "1px solid var(--et-line-soft)" }}>
              <div style={{ fontFamily: fontFamily.sans, fontSize: 20, fontWeight: 800, color: colors.ink, letterSpacing: "-0.01em" }}>{s.value}</div>
              <div style={{ fontFamily: fontFamily.sans, fontSize: 12.5, color: colors.muted, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Continue (Module 01) ─────────────────────────────────────────────────────
function ContinueModule({ eyebrow, title, done, total, onContinue }: { eyebrow: string; title: string; done: number; total: number; onContinue?: () => void }) {
  return (
    <button
      onClick={onContinue}
      style={{ appearance: "none", cursor: "pointer", textAlign: "left", width: "100%", background: colors.surface, border: `1px solid ${colors.line}`, borderRadius: 24, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 13, color: colors.ink }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: colors.bg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fontFamily.mono, fontSize: 14, fontWeight: 700, color: colors.ink, border: `1px solid ${colors.line}` }}>
          01
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Eyebrow color={colors.blueLite}>{eyebrow}</Eyebrow>
          <div style={{ fontFamily: fontFamily.sans, fontSize: 16, fontWeight: 800, color: colors.ink, marginTop: 3, letterSpacing: "-0.01em" }}>{title}</div>
        </div>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, color: colors.muted }}>
          {done}/{total}
        </span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: i < done ? colors.blue : i === done ? "rgba(30,91,255,0.4)" : colors.surface2,
              border: i === done ? `1.5px solid ${colors.blue}` : "none",
            }}
          />
        ))}
      </div>
    </button>
  );
}

// ── "From the league" — quiet notification cards ─────────────────────────────
function QuietCard({ item }: { item: LeagueItem }) {
  const tagStyle: Record<LeagueItem["kind"], React.CSSProperties> = {
    win: { color: colors.blue, background: "rgba(30,91,255,0.10)" },
    close: { color: "#2BBB6A", background: "rgba(43,187,106,0.12)" },
    rank: { color: "#8a6d12", background: "rgba(232,181,61,0.16)" },
  };
  return (
    <div style={{ background: "var(--et-quiet-bg)", border: "1px solid var(--et-quiet-border)", borderRadius: 20, padding: 14, display: "flex", gap: 14, marginBottom: 12 }}>
      <div style={{ width: 76, height: 76, borderRadius: 14, background: "rgba(30,91,255,0.10)", border: "1px solid rgba(30,91,255,0.18)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M4 11.5L12 5l8 6.5M6 10v9h12v-9" stroke={colors.blue} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5 }}>
          <span style={{ fontFamily: fontFamily.sans, fontWeight: 800, color: "var(--et-quiet-ink)" }}>{item.handle}</span>
          <span style={{ marginLeft: "auto", fontFamily: fontFamily.mono, fontSize: 10, color: "var(--et-quiet-sub)" }}>{item.time}</span>
        </div>
        <span style={{ alignSelf: "flex-start", marginTop: 5, fontFamily: fontFamily.mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 999, ...tagStyle[item.kind] }}>
          {item.tag}
        </span>
        <div style={{ fontFamily: fontFamily.sans, fontSize: 14, fontWeight: 700, color: "var(--et-quiet-ink)", lineHeight: 1.32, marginTop: 8 }}>{item.text}</div>
      </div>
    </div>
  );
}

function FeaturedWin({ league }: { league: LeagueItem[] }) {
  return (
    <div>
      <div style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: colors.muted, marginBottom: 10 }}>From the league</div>
      {league.map((item, i) => (
        <QuietCard key={i} item={item} />
      ))}
    </div>
  );
}

function timeGreeting(): string {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

// ── Screen ───────────────────────────────────────────────────────────────────
export function Home(props: HomeProps) {
  const {
    name,
    initials = "AB",
    coachLine = "Here is your next move. Finish your current lesson, then we will underwrite a real one together.",
    deal = DEFAULT_DEAL,
    portfolio = DEFAULT_PORTFOLIO,
    continueEyebrow = "Module 01 · Continue",
    continueTitle = "Underwriting 101",
    continueDone = 2,
    continueTotal = 6,
    league = DEFAULT_LEAGUE,
    onPegasus,
    onFinishLesson,
    onContinue,
    onProfile,
    onPortfolio,
    nav,
  } = props;

  // Derive the greeting from the time of day on the client (avoids hydration
  // mismatch by starting from the passed/neutral value, then updating on mount).
  const [greeting, setGreeting] = React.useState(props.greeting ?? "Welcome back");
  React.useEffect(() => {
    if (!props.greeting) setGreeting(timeGreeting());
  }, [props.greeting]);

  return (
    <Shell label="Home">
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 20px 120px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: fontFamily.sans, fontSize: 15, color: colors.muted, fontWeight: 500 }}>{greeting}</div>
            <div style={{ fontFamily: fontFamily.serif, fontStyle: "italic", fontSize: 34, lineHeight: 1.05, letterSpacing: "-0.01em", marginTop: 2, color: colors.ink }}>{name}.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ThemeToggle />
            <button onClick={onProfile} aria-label="Profile" style={{ appearance: "none", cursor: onProfile ? "pointer" : "default", padding: 0, border: 0, background: "transparent" }}>
              <InitialAvatar size={42} initials={initials} />
            </button>
          </div>
        </div>

        <CoachCard line={coachLine} onPegasus={onPegasus} onFinish={onFinishLesson} />
        <LatestDeal deal={deal} onOpen={onPegasus} />
        <PortfolioHero portfolio={portfolio} initials={initials} onOpen={onPortfolio} />
        <ContinueModule eyebrow={continueEyebrow} title={continueTitle} done={continueDone} total={continueTotal} onContinue={onContinue} />
        <FeaturedWin league={league} />
      </div>

      {nav && <TabBar active={nav.active} onTab={nav.onTab} />}
    </Shell>
  );
}

export const homeDemo: HomeProps = {
  name: "Austin",
  greeting: "Good evening",
  initials: "AB",
  coachLine: "Here is your next move, Austin. Finish Stop 4 of The Flip, then we will underwrite a real one together.",
  continueEyebrow: "Module 01 · Continue",
  continueTitle: "Underwriting 101",
  continueDone: 2,
  continueTotal: 6,
};
