"use client";

// Players.tsx — "Real players. Real portfolios." social-proof section.
// Ported from `PlayersSection` / `PlayerCard` / `JoinCard` in et-landing-3.jsx.
// id="players" anchors the "Moguls" nav link.
//
// The prototype used <image-slot> custom elements (a prototyping drop-target for
// headshots/property photos). Those are not real DOM elements, so here the
// banner is a glassy gradient and the avatar shows the player's initials — the
// production app can later swap in <Image> sources.

import React from "react";
import { colors, fontFamily } from "@et/brand";

interface Property {
  tag: string;
  name: string;
  sqft: string;
  city: string;
}

interface Player {
  id: string;
  name: string;
  pos: string;
  loc: string;
  deals: number;
  prop: Property;
}

const PLAYERS: ReadonlyArray<Player> = [
  { id: "fred", name: "Fred Brown", pos: "Wide Receiver", loc: "Jackson, MS", deals: 1, prop: { tag: "Multi-Family", name: "The Fifth & Fondren", sqft: "11,530 sqft", city: "Jackson, MS" } },
  { id: "bobby", name: "Bobby Evans Jr", pos: "Offensive Tackle", loc: "Dallas, TX", deals: 1, prop: { tag: "Duplex", name: "2400 Buchanan St", sqft: "3,440 sqft", city: "Nashville, TN" } },
  { id: "fales", name: "David Fales", pos: "Quarterback", loc: "Phoenix, AZ", deals: 2, prop: { tag: "Duplex", name: "2109 14th Ave N", sqft: "3,536 sqft", city: "Nashville, TN" } },
  { id: "nate", name: "Nate Gilliam", pos: "Guard", loc: "Nashville, TN", deals: 2, prop: { tag: "Single Family", name: "1715 Heiman St", sqft: "1,500 sqft", city: "Nashville, TN" } },
  { id: "austin", name: "Austin Bryant", pos: "Defensive End", loc: "Brentwood, TN", deals: 1, prop: { tag: "Single Family", name: "1008 Highland Brentwood", sqft: "4,500 sqft", city: "Brentwood, TN" } },
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("");
}

export function Players() {
  return (
    <section id="players" style={{ position: "relative", padding: "78px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        <SecHead
          eyebrow="The members"
          title="Real players. Real portfolios."
          sub="From the league to the ledger: see the athletes already turning game checks into owned assets. Every deal live, every move tracked."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {PLAYERS.map((p) => (
            <PlayerCard key={p.id} p={p} />
          ))}
          <JoinCard />
        </div>

        <div style={{ textAlign: "center", marginTop: 44 }}>
          <div style={{ fontFamily: fontFamily.sans, fontSize: 17, color: colors.muted }}>
            <span style={{ color: colors.ink, fontWeight: 700 }}>240+ athletes</span> building right now. Your name goes here next.
          </div>
        </div>
      </div>
    </section>
  );
}

function SecHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", marginBottom: 56 }}>
      <div style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.blue, marginBottom: 16 }}>
        {eyebrow}
      </div>
      <h2 style={{ fontFamily: fontFamily.sans, fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.04, color: colors.ink, margin: "0 0 18px", textWrap: "balance" }}>
        {title}
      </h2>
      <p style={{ fontFamily: fontFamily.sans, fontSize: 18, lineHeight: 1.55, color: colors.muted, margin: 0 }}>{sub}</p>
    </div>
  );
}

function PlayerCard({ p }: { p: Player }) {
  const sqft = String(p.prop.sqft).replace(/\s*sqft/i, "");
  const typeShort = p.prop.tag === "Multi-Family" ? "Multi" : p.prop.tag === "Single Family" ? "Single" : p.prop.tag;
  const stats: ReadonlyArray<{ v: string; k: string }> = [
    { v: String(p.deals), k: "active deals" },
    { v: sqft, k: "sq ft" },
    { v: typeShort, k: "asset" },
  ];

  return (
    <div
      style={{
        position: "relative",
        background: "rgba(20,23,30,0.45)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 18px 44px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        transition: "transform .2s, border-color .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(30,91,255,0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
      }}
    >
      {/* cover banner — glassy gradient stand-in for the live-deal photo */}
      <div
        style={{
          position: "relative",
          height: 150,
          backdropFilter: "blur(18px) saturate(170%)",
          WebkitBackdropFilter: "blur(18px) saturate(170%)",
          background: "linear-gradient(140deg, rgba(91,155,255,0.24) 0%, rgba(30,91,255,0.10) 36%, rgba(255,255,255,0.02) 60%, rgba(91,155,255,0.16) 100%)",
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.55), inset 1.5px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25)",
        }}
      >
        {/* diagonal specular streak */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(118deg, transparent 28%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.05) 52%, transparent 64%)" }} />
        {/* soft bottom shade to ground the avatar */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 68%, rgba(8,10,14,0.34))", pointerEvents: "none" }} />
        {/* LIVE pill */}
        <div style={{ position: "absolute", top: 14, right: 14, display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999, background: "rgba(8,10,13,0.7)", backdropFilter: "blur(6px)" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green, boxShadow: `0 0 8px ${colors.green}` }} />
          <span style={{ fontFamily: fontFamily.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", color: "#fff" }}>LIVE</span>
        </div>
        {/* circular avatar with initials, overlapping bottom-left */}
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: -30,
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: `4px solid ${colors.surface}`,
            background: "#11131a",
            overflow: "hidden",
            boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontFamily: fontFamily.sans, fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: colors.blueLite }}>{initials(p.name)}</span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "42px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: colors.blueLite, marginBottom: 7 }}>ELITE MOGUL</div>
            <div style={{ fontFamily: fontFamily.sans, fontSize: 22, fontWeight: 800, letterSpacing: "-0.025em", color: colors.ink, lineHeight: 1.05 }}>{p.name}</div>
            <div style={{ fontFamily: fontFamily.sans, fontSize: 14, color: colors.muted, marginTop: 5 }}>
              {p.pos} · {p.loc}
            </div>
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0, paddingTop: 24 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors.green }} />
            <span style={{ fontFamily: fontFamily.sans, fontSize: 13.5, color: colors.muted }}>Active</span>
          </div>
        </div>

        {/* property name line */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 18 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M4 20V9l8-5 8 5v11" stroke={colors.blueLite} strokeWidth="1.8" strokeLinejoin="round" />
            <rect x="9.5" y="13" width="5" height="7" stroke={colors.blueLite} strokeWidth="1.8" />
          </svg>
          <span style={{ fontFamily: fontFamily.sans, fontSize: 15, fontWeight: 700, color: colors.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.prop.name}</span>
        </div>

        {/* stat strip */}
        <div style={{ display: "flex", marginTop: 16, background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 0" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", borderLeft: i ? `1px solid ${colors.lineSoft}` : "none" }}>
              <div style={{ fontFamily: fontFamily.sans, fontSize: 17, fontWeight: 800, letterSpacing: "-0.01em", color: colors.ink }}>{s.v}</div>
              <div style={{ fontFamily: fontFamily.sans, fontSize: 12, color: colors.muted, marginTop: 4 }}>{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Blank "join" card — sixth slot, locker-room ethos. Links to the waitlist.
function JoinCard() {
  return (
    <a
      href="#waitlist"
      style={{
        textDecoration: "none",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: 360,
        padding: "40px 28px",
        borderRadius: 24,
        cursor: "pointer",
        overflow: "hidden",
        background: "linear-gradient(158deg, rgba(58,110,255,0.22) 0%, rgba(30,91,255,0.13) 60%, rgba(30,91,255,0.18) 100%)",
        backdropFilter: "blur(22px) saturate(150%)",
        WebkitBackdropFilter: "blur(22px) saturate(150%)",
        border: "1px solid rgba(120,160,255,0.45)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.22), 0 18px 44px rgba(20,50,160,0.32)",
        transition: "transform .2s, border-color .2s, background .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "rgba(150,185,255,0.8)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "rgba(120,160,255,0.45)";
      }}
    >
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(30,91,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30, position: "relative" }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3.6" stroke={colors.blueLite} strokeWidth="1.8" />
          <path d="M5 19.5c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" stroke={colors.blueLite} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span style={{ position: "absolute", right: -3, bottom: -3, width: 26, height: 26, borderRadius: "50%", background: colors.blue, border: `2.5px solid ${colors.bg}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </span>
      </div>
      <div style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: colors.blueLite, marginBottom: 16 }}>OPEN ROSTER SPOT</div>
      <div style={{ fontFamily: fontFamily.sans, fontSize: 23, fontWeight: 800, letterSpacing: "-0.025em", color: colors.ink, lineHeight: 1.08, maxWidth: 260 }}>This spot is empty.</div>
      <p style={{ fontFamily: fontFamily.sans, fontSize: 15, lineHeight: 1.5, color: colors.muted, margin: "16px 0 32px", maxWidth: 260 }}>
        Claim your spot, track your first deal, and put your name on the board.
      </p>
      <span style={{ borderRadius: 999, padding: "14px 26px", background: colors.blue, color: "#fff", fontFamily: fontFamily.sans, fontWeight: 700, fontSize: 15.5, letterSpacing: "-0.01em", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: `0 10px 28px ${colors.blue}44` }}>
        Claim Your Spot
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h13M12 6l6 6-6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
