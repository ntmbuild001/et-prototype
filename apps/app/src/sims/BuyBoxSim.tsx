"use client";

// BuyBoxSim.tsx — "BUY BOX" (Sim 02 · Build Your Buy Box).
// The box is set. A feed of listings floods in — KEEP or PASS, fast.
// Ported from et2-sim-buybox.jsx.
import React from "react";
import { Shell, Header, Mono, Cta, Puffy, colors, fontFamily } from "@et/brand";
import type { Grade, SimResult } from "@/lib/types";
import { SIM_XP } from "@/lib/types";
import { SimResults, SimSpecRow, SimCallout, sim$ } from "./simShared";

interface BoxLine {
  k: string;
  v: string;
}

interface BuyCard {
  id: number;
  addr: string;
  type: string;
  price: number;
  rent: number;
  cond: string;
  keep: boolean;
  why: string;
}

interface GradeBand {
  min: number;
  g: Grade;
  line: string;
}

interface CardResult {
  id: number;
  right: boolean;
}

const BUYBOX = {
  perCard: 10, // seconds per listing
  box: [
    { k: "Market", v: "Memphis, TN" },
    { k: "Type", v: "2–4 units" },
    { k: "Price band", v: "$150k – $250k" },
    { k: "Rent-to-price", v: "≥ 1.0%" },
    { k: "Condition", v: "Cosmetic rehab only" },
  ] as BoxLine[],
  cards: [
    {
      id: 1,
      addr: "1530 Netherwood Ave",
      type: "Duplex · 2×2BR",
      price: 198000,
      rent: 2150,
      cond: "Paint + flooring",
      keep: true,
      why: "In the box on every line: duplex, $198k, 1.09%, cosmetic work.",
    },
    {
      id: 2,
      addr: "4012 Walnut Grove",
      type: "Single-family · 4BR",
      price: 240000,
      rent: 2450,
      cond: "Move-in ready",
      keep: false,
      why: "Numbers look fine — but it’s a single-family. Wrong type, automatic pass.",
    },
    {
      id: 3,
      addr: "722 N Trezevant",
      type: "Triplex · 3×1BR",
      price: 245000,
      rent: 2700,
      cond: "Cosmetic",
      keep: true,
      why: "Triplex, inside the band, 1.10%, cosmetic. Keeper.",
    },
    {
      id: 4,
      addr: "88 Stonewall Pl",
      type: "Fourplex · 4×1BR",
      price: 289000,
      rent: 3300,
      cond: "Cosmetic",
      keep: false,
      why: "1.14% is juicy — but $289k busts the price band. The box says no for you.",
    },
    {
      id: 5,
      addr: "2204 Young Ave",
      type: "Duplex · 2×1BR",
      price: 225000,
      rent: 1900,
      cond: "Light cosmetic",
      keep: false,
      why: "0.84% rent-to-price. Inside the band, wrong math.",
    },
    {
      id: 6,
      addr: "1108 Faxon Ave",
      type: "Fourplex · 4×1BR",
      price: 235000,
      rent: 2600,
      cond: "Foundation + roof",
      keep: false,
      why: "1.11% — but it needs structural work. Condition line exists for a reason.",
    },
    {
      id: 7,
      addr: "3315 Park Ave",
      type: "Duplex · 2×2BR",
      price: 168000,
      rent: 1750,
      cond: "Paint only",
      keep: true,
      why: "$168k duplex at 1.04% needing paint. Textbook box fit.",
    },
    {
      id: 8,
      addr: "901 River Bluff (Nashville)",
      type: "Duplex · 2×2BR",
      price: 232000,
      rent: 2400,
      cond: "Cosmetic",
      keep: false,
      why: "1.03%, right type, right band — wrong city. Your market is Memphis.",
    },
  ] as BuyCard[],
  grades: [
    { min: 8, g: "S", line: "Eight for eight. The box isn’t a suggestion to you — it’s a reflex." },
    { min: 7, g: "A", line: "Nearly flawless. One listing slipped past the box." },
    { min: 6, g: "B", line: "Good instincts, but the box only works if it’s automatic." },
    { min: 4, g: "C", line: "You negotiated with yourself house by house. That’s how deals go bad." },
    { min: 0, g: "F", line: "You bought with your eyes, not your criteria. Re-read the box." },
  ] as GradeBand[],
};

interface Answer {
  choice: boolean | null;
  right: boolean;
}

function BuyBoxBrief({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <Shell label="Sim BuyBox Brief">
      <Header onBack={onBack} eyebrow="Simulator 02" eyebrowColor={colors.blue} title="Buy Box" sub="Your criteria. Their flood. Sort fast." />
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "22px 22px 10px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden", padding: "18px 0 0" }}>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: colors.blue, padding: "0 16px", marginBottom: 10 }}>
            YOUR BUY BOX
          </div>
          {BUYBOX.box.map((b) => (
            <SimSpecRow key={b.k} k={b.k} v={b.v} accent={colors.blue} />
          ))}
        </div>
        <SimCallout>
          <span style={{ fontWeight: 700 }}>
            {BUYBOX.cards.length} listings, {BUYBOX.perCard} seconds each.
          </span>{" "}
          KEEP what fits, PASS what doesn&rsquo;t. Hesitate and it counts against you — the box answers in seconds.
        </SimCallout>
      </div>
      <Cta label="Open the feed" onClick={onStart} />
    </Shell>
  );
}

function BuyBoxPlay({ onDone }: { onDone: (results: CardResult[]) => void }) {
  const [idx, setIdx] = React.useState(0);
  const [left, setLeft] = React.useState(BUYBOX.perCard);
  const [answer, setAnswer] = React.useState<Answer | null>(null); // feedback state
  const [results, setResults] = React.useState<CardResult[]>([]);
  const card = BUYBOX.cards[idx];

  // Keep a live ref to current state so the timer's record() always sees the latest.
  const stateRef = React.useRef({ answer, results, idx });
  stateRef.current = { answer, results, idx };

  const record = React.useCallback(
    (choice: boolean | null) => {
      const cur = stateRef.current;
      if (cur.answer) return;
      const curCard = BUYBOX.cards[cur.idx];
      const right = choice === null ? false : choice === curCard.keep;
      setAnswer({ choice, right });
      const next = [...cur.results, { id: curCard.id, right }];
      setResults(next);
      setTimeout(() => {
        if (cur.idx + 1 >= BUYBOX.cards.length) {
          onDone(next);
          return;
        }
        setIdx(cur.idx + 1);
        setLeft(BUYBOX.perCard);
        setAnswer(null);
      }, 1600);
    },
    [onDone]
  );

  // Per-card countdown; pause while feedback (answer) is showing.
  React.useEffect(() => {
    if (answer) return;
    const t = setInterval(() => setLeft((s) => s - 0.1), 100);
    return () => clearInterval(t);
  }, [idx, answer]);

  // Auto-record a miss when the clock runs out and no choice was made.
  React.useEffect(() => {
    if (left <= 0 && !answer) record(null);
  }, [left, answer, record]);

  const pct = Math.max(0, (left / BUYBOX.perCard) * 100);
  const ratio = (card.rent / card.price) * 100;
  const border = answer ? (answer.right ? colors.blue : colors.error) : colors.line;
  const rightCount = results.filter((r) => r.right).length;

  return (
    <Shell label="Sim BuyBox Play">
      <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Mono color={colors.blue} size={10}>
          The feed · {idx + 1} of {BUYBOX.cards.length}
        </Mono>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: colors.muted }}>{rightCount} RIGHT</span>
      </div>
      <div style={{ padding: "10px 22px 0", flexShrink: 0 }}>
        <div style={{ height: 4, background: colors.surface, borderRadius: 999, overflow: "hidden" }}>
          <div style={{ width: `${answer ? 100 : pct}%`, height: "100%", background: left < 3 && !answer ? colors.error : colors.blue, borderRadius: 999 }} />
        </div>
      </div>

      <div key={card.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: "auto", padding: "18px 22px 8px" }}>
        <div
          style={{
            border: `2px solid ${border}`,
            borderRadius: 22,
            background: colors.surface,
            overflow: "hidden",
            boxShadow: answer ? `0 0 30px ${border}33` : "none",
            transition: "border-color .15s, box-shadow .15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 16px 10px" }}>
            <Puffy type={card.type.startsWith("Single") ? "house" : "apartments"} hue="slate" size={46} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.015em" }}>{card.addr}</div>
              <div style={{ fontFamily: fontFamily.mono, fontSize: 10, color: colors.muted, marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {card.type}
              </div>
            </div>
          </div>
          <SimSpecRow k="Asking" v={sim$(card.price)} accent={colors.ink} />
          <SimSpecRow k="Rent" v={`${sim$(card.rent)} / mo  ·  ${ratio.toFixed(2)}%`} accent={colors.ink} />
          <SimSpecRow k="Condition" v={card.cond} accent={colors.ink} />
          {answer && (
            <div
              className="et2-fade"
              style={{ padding: "12px 16px", fontSize: 13, lineHeight: 1.5, color: "rgba(var(--et-ink-rgb),0.85)", borderTop: `1px solid ${colors.line}` }}
            >
              <span style={{ fontFamily: fontFamily.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.18em", color: border, marginRight: 8 }}>
                {answer.choice === null ? "TOO SLOW" : answer.right ? "RIGHT" : "WRONG"}
              </span>
              {card.why}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "10px 22px 22px", flexShrink: 0 }}>
        <button
          onClick={() => record(false)}
          disabled={!!answer}
          style={{
            appearance: "none",
            cursor: answer ? "default" : "pointer",
            height: 56,
            borderRadius: 999,
            border: `2px solid ${colors.line2}`,
            background: "transparent",
            color: answer ? colors.muted : colors.ink,
            fontFamily: fontFamily.sans,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          Pass
        </button>
        <button
          onClick={() => record(true)}
          disabled={!!answer}
          style={{
            appearance: "none",
            cursor: answer ? "default" : "pointer",
            height: 56,
            borderRadius: 999,
            border: 0,
            background: answer ? colors.surface : colors.blue,
            color: answer ? colors.muted : colors.ink,
            fontFamily: fontFamily.sans,
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          Keep
        </button>
      </div>
    </Shell>
  );
}

type Phase = "brief" | "play" | "results";

export function BuyBoxSim({ onBack, onComplete }: { onBack: () => void; onComplete: (r: SimResult) => void }) {
  const [phase, setPhase] = React.useState<Phase>("brief");
  const [results, setResults] = React.useState<CardResult[]>([]);

  if (phase === "brief") return <BuyBoxBrief onBack={onBack} onStart={() => setPhase("play")} />;
  if (phase === "play")
    return (
      <BuyBoxPlay
        onDone={(r) => {
          setResults(r);
          setPhase("results");
        }}
      />
    );

  const score = results.filter((r) => r.right).length;
  const g = BUYBOX.grades.find((x) => score >= x.min)!;
  const trapsTotal = BUYBOX.cards.filter((c) => !c.keep).length;
  const trapsDodged = results.filter((r, i) => r.right && !BUYBOX.cards[i].keep).length;

  return (
    <SimResults
      label="Sim BuyBox Results"
      eyebrow="Feed debrief"
      title={`${score} of ${BUYBOX.cards.length} sorted right.`}
      grade={g.g}
      line={g.line}
      rows={[
        { k: "Correct calls", v: `${score} / ${BUYBOX.cards.length}`, accent: score >= 6 ? colors.blue : colors.error },
        { k: "Keepers in feed", v: String(BUYBOX.cards.filter((c) => c.keep).length), accent: colors.ink },
        { k: "Traps dodged", v: `${trapsDodged} / ${trapsTotal}`, accent: colors.ink },
      ]}
      onRetry={() => {
        setResults([]);
        setPhase("play");
      }}
      onCollect={() => onComplete({ grade: g.g, xp: SIM_XP[g.g], line: g.line })}
    />
  );
}
