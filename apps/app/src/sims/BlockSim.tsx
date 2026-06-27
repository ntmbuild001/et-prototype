"use client";

// BlockSim.tsx — "BLOCK ROYALE" capstone simulator (Sim 05).
// Ported from design_handoff_et/app/et2-sim-block.jsx into proper React + TS.
// Flow: brief → per-lot sealed bidding → results.

import React from "react";
import { Shell, Header, Progress, Cta, Mono, Puffy, colors, fontFamily } from "@et/brand";
import type { SimResult } from "@/lib/types";
import { SimResults, SimCallout, SimSpecRow, sim$, simSigned } from "@/sims/simShared";
import { BLOCK_CAPITAL, BLOCK_LOTS, computeBlock } from "@/sims/blockEngine";

// ── helpers ────────────────────────────────────────────────────────────────
const fmtK = (n: number): string => `$${Math.round(n / 1000)}k`;

type Reveal = { won: boolean; bid: number | null; passed?: boolean };

// ── Brief ───────────────────────────────────────────────────────────────────
// Richer than the generic SimBrief — keeps the prototype's "THE ASSIGNMENT"
// card with spec rows and the capstone-rule callout.
function BlockBrief({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <Shell label="Sim Block Brief">
      <Header
        onBack={onBack}
        eyebrow="Simulator 05 · Capstone"
        eyebrowColor={colors.blue}
        title="Block Royale"
        sub="Five lots. Rival money. One block."
      />
      <div
        className="et-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "22px 22px 10px", display: "flex", flexDirection: "column", gap: 18 }}
      >
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden", padding: "18px 0 0" }}>
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: colors.blue,
              padding: "0 16px",
              marginBottom: 4,
            }}
          >
            THE ASSIGNMENT
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px 6px" }}>
            <Puffy type="villa" hue="blue" size={54} />
            <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>
              The Lucy Ave block hits the courthouse steps. Sealed bids, one per property. Rival buyers have the same list.
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <SimSpecRow k="Your capital" v={sim$(BLOCK_CAPITAL)} accent={colors.blue} />
            <SimSpecRow k="Properties" v="5 · sealed bid each" />
            <SimSpecRow k="You're shown" v="Worth-to-you (your underwriting)" />
            <SimSpecRow k="Scored on" v="Equity created = worth − price paid" accent={colors.blue} />
          </div>
        </div>
        <SimCallout color={colors.blue}>
          <span style={{ fontWeight: 700 }}>The capstone rule:</span> your number is your number. Win below worth and you create
          equity. Win above it and you just bought a loss with extra steps.
        </SimCallout>
      </div>
      <Cta label="To the courthouse steps" onClick={onStart} />
    </Shell>
  );
}

// ── Auction (per-lot sealed bidding) ─────────────────────────────────────────
function BlockAuction({ onDone }: { onDone: (bids: Record<string, number>) => void }) {
  const [idx, setIdx] = React.useState(0);
  const [spent, setSpent] = React.useState(0);
  const [bids, setBids] = React.useState<Record<string, number>>({});
  const [wonEquity, setWonEquity] = React.useState(0);
  const [reveal, setReveal] = React.useState<Reveal | null>(null);

  const lot = BLOCK_LOTS[idx];
  const remaining = BLOCK_CAPITAL - spent;
  const maxBid = Math.min(remaining, lot.worth + 60000);
  const [bid, setBid] = React.useState(lot.list);

  // Reset the slider whenever the lot changes.
  React.useEffect(() => {
    setBid(lot.list);
  }, [lot.list]);

  const last = idx + 1 >= BLOCK_LOTS.length;

  const advance = () => {
    if (last) {
      onDone(bids);
      return;
    }
    setIdx((i) => i + 1);
    setReveal(null);
  };

  const place = () => {
    const won = bid > lot.rival && bid <= remaining;
    setReveal({ won, bid });
    setBids((b) => ({ ...b, [String(lot.id)]: bid }));
    if (won) {
      setSpent((s) => s + bid);
      setWonEquity((e) => e + (lot.worth - bid));
    }
  };

  const pass = () => {
    setReveal({ won: false, bid: null, passed: true });
  };

  const overNumber = bid > lot.worth;
  const accent = overNumber ? colors.error : colors.blue;

  return (
    <Shell label="Sim Block Auction">
      <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Mono color={colors.blue} size={10}>
          Courthouse steps · Lot {idx + 1} of {BLOCK_LOTS.length}
        </Mono>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: colors.ink }}>{fmtK(remaining)} LEFT</span>
      </div>
      <Progress percent={(idx / BLOCK_LOTS.length) * 100} />

      <div key={lot.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: "auto", padding: "18px 22px 8px" }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 16px 10px" }}>
            <Puffy type={lot.icon} hue="slate" size={46} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.015em" }}>{lot.addr}</div>
              <div
                style={{
                  fontFamily: fontFamily.mono,
                  fontSize: 10,
                  color: colors.muted,
                  marginTop: 3,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {lot.desc}
              </div>
            </div>
          </div>
          <SimSpecRow k="Opening price" v={sim$(lot.list)} />
          <SimSpecRow k="Worth to you" v={sim$(lot.worth)} accent={colors.blue} />
          <div style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.55, color: "rgba(var(--et-ink-rgb),0.75)" }}>{lot.intel}</div>
        </div>

        {!reveal ? (
          <div style={{ marginTop: 14, border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <Mono size={9.5}>Your sealed bid</Mono>
              <span style={{ fontFamily: fontFamily.mono, fontSize: 17, fontWeight: 700, color: accent }}>{sim$(bid)}</span>
            </div>
            <input
              type="range"
              min={lot.list}
              max={maxBid}
              step={1000}
              value={bid}
              onChange={(e) => setBid(Number(e.target.value))}
              style={{ width: "100%", accentColor: accent }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontFamily: fontFamily.mono, fontSize: 9.5, color: colors.muted }}>{fmtK(lot.list)}</span>
              <span style={{ fontFamily: fontFamily.mono, fontSize: 9.5, color: overNumber ? colors.error : colors.muted }}>
                {overNumber ? "ABOVE YOUR NUMBER" : `equity if won: ${fmtK(lot.worth - bid)}`}
              </span>
              <span style={{ fontFamily: fontFamily.mono, fontSize: 9.5, color: colors.muted }}>{fmtK(maxBid)}</span>
            </div>
          </div>
        ) : (
          <div
            className="et2-fade"
            style={{
              marginTop: 14,
              borderRadius: 16,
              padding: "14px 16px",
              background: colors.surface,
              border: `1px solid ${reveal.won ? `${colors.blue}66` : colors.line2}`,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: reveal.won ? colors.blue : colors.muted,
                marginBottom: 6,
              }}
            >
              {reveal.passed ? "PASSED" : reveal.won ? "WON" : "OUTBID"}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(var(--et-ink-rgb),0.85)" }}>
              Rival&rsquo;s top bid: <span style={{ fontFamily: fontFamily.mono, fontWeight: 700 }}>{sim$(lot.rival)}</span>.{" "}
              {reveal.passed
                ? lot.rival > lot.worth
                  ? "They overpaid. Walking away was the win."
                  : `It went for under worth — ${fmtK(lot.worth - lot.rival)} of equity walked away with them.`
                : reveal.won
                ? lot.worth - (reveal.bid ?? 0) >= 0
                  ? `You created ${fmtK(lot.worth - (reveal.bid ?? 0))} in equity at the table.`
                  : `You won — and paid ${fmtK((reveal.bid ?? 0) - lot.worth)} above your own number.`
                : lot.rival > lot.worth
                ? "They paid above worth. Losing that one was free money saved."
                : "They got it under worth. It stings because it should."}
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, padding: "0 4px" }}>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: colors.muted }}>
            EQUITY CREATED
          </span>
          <span style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: wonEquity >= 0 ? colors.blue : colors.error }}>
            {simSigned(wonEquity)}
          </span>
        </div>
      </div>

      {!reveal ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 12, padding: "10px 22px 22px", flexShrink: 0 }}>
          <button
            onClick={pass}
            style={{
              appearance: "none",
              cursor: "pointer",
              height: 56,
              borderRadius: 999,
              border: `2px solid ${colors.line2}`,
              background: "transparent",
              color: colors.ink,
              fontFamily: fontFamily.sans,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Pass
          </button>
          <button
            onClick={place}
            style={{
              appearance: "none",
              cursor: "pointer",
              height: 56,
              borderRadius: 999,
              border: 0,
              background: colors.blue,
              color: "#fff",
              fontFamily: fontFamily.sans,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Place sealed bid
          </button>
        </div>
      ) : (
        <Cta label={last ? "Final tally" : "Next lot"} color="blue" onClick={advance} />
      )}
    </Shell>
  );
}

// ── Top-level orchestrator ───────────────────────────────────────────────────
export function BlockSim({ onBack, onComplete }: { onBack: () => void; onComplete: (r: SimResult) => void }) {
  const [phase, setPhase] = React.useState<"brief" | "play" | "results">("brief");
  const [bids, setBids] = React.useState<Record<string, number>>({});

  if (phase === "brief") {
    return <BlockBrief onBack={onBack} onStart={() => setPhase("play")} />;
  }
  if (phase === "play") {
    return (
      <BlockAuction
        onDone={(b) => {
          setBids(b);
          setPhase("results");
        }}
      />
    );
  }

  const result = computeBlock(bids);
  const wonLots = result.lots.filter((l) => l.won);

  return (
    <SimResults
      label="Sim Block Results"
      eyebrow="The block, settled"
      title={result.wins ? `${result.wins} of 5 lots are yours.` : "You bought nothing."}
      grade={result.grade}
      line={result.line}
      rows={[
        { k: "Lots won", v: `${result.wins} / 5`, accent: colors.ink },
        { k: "Capital deployed", v: sim$(result.spent), accent: colors.ink },
        { k: "Equity created", v: simSigned(result.totalEquity), accent: result.totalEquity > 0 ? colors.blue : colors.error },
        ...wonLots.map((l) => ({
          k: l.addr,
          v: `${sim$(l.bid)} · ${l.equity >= 0 ? "+" : "−"}${fmtK(Math.abs(l.equity)).slice(1)} equity`,
          accent: l.equity >= 0 ? colors.blue : colors.error,
        })),
      ]}
      onRetry={() => {
        setBids({});
        setPhase("play");
      }}
      onCollect={() => onComplete({ grade: result.grade, xp: result.xp, line: result.line })}
    />
  );
}
