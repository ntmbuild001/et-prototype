"use client";

// FlipSim.tsx — "Flip It" simulator (Simulator 04). Ported from
// et2-sim-flip.jsx. Four phases: brief → scope → run → results. All P&L math
// lives in flipEngine.ts; this file is presentation + interaction only.
//
// Token mapping applied throughout: ET2P.lime AND ET2P.blue → colors.blue
// (the frozen "Blue·Blue" look), ET2P.red → colors.error, ET2_FONT/MONO/SERIF →
// fontFamily.sans/mono/serif.
//
// Notes on missing brand primitives:
//  - The prototype's `.et2-fade` / `.et2-blink` / `.et2-pop` keyframe classes
//    do NOT exist in the production CSS, so the run-phase line reveal and the
//    blinking cursor are reproduced with inline opacity transitions + a small
//    setInterval-driven blink (cleaned up in useEffect).
//  - `ET2Puffy` maps to the brand `Puffy`; `ET2Meta` (a tiny mono footer label)
//    has no brand equivalent, so it's an inline `Mono` footer.

import React from "react";
import { Shell, Header, Cta, Mono, Puffy, colors, fontFamily } from "@et/brand";
import { FLIP, type FlipItem } from "@/data/curriculum";
import type { SimResult } from "@/lib/types";
import { SimResults, sim$, simSigned } from "./simShared";
import { computeFlip, scopeTotals, excludesConflict, flipPenalties, type FlipBreakdown } from "./flipEngine";

type Phase = "brief" | "scope" | "run" | "results";

// ── shared bits ──────────────────────────────────────────────────

/** Hazard-striped meter for the scope phase (budget + timeline). */
function FlipMeter({
  label,
  valueText,
  pct,
  danger,
}: {
  label: string;
  valueText: string;
  pct: number;
  danger?: boolean;
}) {
  const color = danger ? colors.error : colors.blue;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: colors.muted }}>{label}</span>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 11.5, fontWeight: 700, color }}>{valueText}</span>
      </div>
      <div style={{ height: 6, background: colors.surface2, borderRadius: 2, border: `1px solid ${colors.line}`, overflow: "hidden" }}>
        <div
          style={{
            width: `${Math.min(100, pct)}%`,
            height: "100%",
            transition: "width .3s",
            background: `repeating-linear-gradient(-45deg, ${color} 0 5px, rgba(0,0,0,0.45) 5px 8px), ${color}`,
          }}
        />
      </div>
    </div>
  );
}

/** Spec row used on the brief card (mirrors prototype FlipSpecRow). */
function FlipSpecRow({ k, v, accent }: { k: React.ReactNode; v: React.ReactNode; accent?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 16px", borderBottom: `1px solid ${colors.line}` }}>
      <span style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: colors.muted, textTransform: "uppercase" }}>{k}</span>
      <span style={{ fontFamily: fontFamily.mono, fontSize: 12.5, fontWeight: 700, color: accent || colors.ink }}>{v}</span>
    </div>
  );
}

/** Tiny mono footer label — inline fallback for the prototype's ET2Meta. */
function FlipMeta({ text, style = {} }: { text: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: fontFamily.mono,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: colors.line2,
        textAlign: "center",
        ...style,
      }}
    >
      {text}
    </div>
  );
}

// Strip a trailing ".0" so "2.0 WKS" → "2 WKS" but "2.5 WKS" stays.
const fmtWeeks = (w: number): string => w.toFixed(1).replace(/\.0$/, "");

// ── Phase: brief ─────────────────────────────────────────────────

function FlipBrief({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <Shell bg="var(--et-screen-map)" label="Sim Flip Brief">
      <Header onBack={onBack} eyebrow="Simulator 04" eyebrowColor={colors.blue} title="Flip It" sub="One property. One budget. One shot." />
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "22px 22px 10px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden", padding: "18px 0 0" }}>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: colors.blue, padding: "0 16px", marginBottom: 4 }}>
            THE ASSIGNMENT
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px 6px" }}>
            <Puffy type="house" hue="blue" size={54} />
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: "-0.01em" }}>{FLIP.propertyName}</div>
              <div style={{ fontFamily: fontFamily.mono, fontSize: 10, color: colors.muted, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {FLIP.propertyDesc}
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <FlipSpecRow k="Purchase" v={sim$(FLIP.purchase)} />
            <FlipSpecRow k="Value as-is" v={sim$(FLIP.asIs)} />
            <FlipSpecRow k="Rehab budget" v={sim$(FLIP.budget)} accent={colors.blue} />
            <FlipSpecRow k="Holding cost" v={`${sim$(FLIP.holdPerWeek)} / wk`} accent={colors.error} />
            <FlipSpecRow k="Selling costs" v="6% of sale" />
            <FlipSpecRow k="Target profit" v={`${sim$(FLIP.targetProfit)}+`} accent={colors.blue} />
          </div>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: "rgba(var(--et-ink-rgb),0.78)", padding: "0 2px" }}>
          The keys are yours. Choose your rehab scope from the contractor&rsquo;s board — every line item costs money{" "}
          <em style={{ fontFamily: fontFamily.serif }}>and weeks</em>. Fix what sells. Skip what doesn&rsquo;t. The market grades you at the closing table.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            borderRadius: 14,
            padding: "12px 14px",
            background: colors.bg,
            border: `1px dashed ${colors.blue}66`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" stroke={colors.blue} strokeWidth="1.7" />
            <path d="M12 11v6M12 7.5v.5" stroke={colors.blue} strokeWidth="1.9" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>Formula:</span> Profit = Sale − (Purchase + Rehab + Holding + 6% Selling costs).
          </div>
        </div>
      </div>
      <Cta label="Open the project board" onClick={onStart} />
    </Shell>
  );
}

// ── Phase: scope ─────────────────────────────────────────────────

function FlipScope({ onBack, onRun }: { onBack: () => void; onRun: (ids: string[]) => void }) {
  const [sel, setSel] = React.useState<string[]>([]);
  const [flash, setFlash] = React.useState<string | null>(null);
  const flashTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  const { cost: spent, weeks } = scopeTotals(sel);
  const holding = Math.round(weeks * FLIP.holdPerWeek);

  const toggle = (it: FlipItem) => {
    if (sel.includes(it.id)) {
      setSel(sel.filter((id) => id !== it.id));
      return;
    }
    // Over-budget rejection: flash the row red and bail.
    if (spent + it.cost > FLIP.budget) {
      setFlash(it.id);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(null), 900);
      return;
    }
    // Enforce excludes rule (luxkit ⇄ kitchen): drop the conflicting id.
    let next = sel;
    const conflict = excludesConflict(sel, it);
    if (conflict) next = next.filter((id) => id !== conflict);
    setSel([...next, it.id]);
  };

  return (
    <Shell label="Sim Flip Scope">
      <Header onBack={onBack} eyebrow="Simulator 04 · Scope phase" eyebrowColor={colors.blue} title="The project board" />
      <div style={{ display: "flex", gap: 16, padding: "16px 22px 12px", flexShrink: 0 }}>
        <FlipMeter label="BUDGET" valueText={`${sim$(spent)} / ${sim$(FLIP.budget)}`} pct={(spent / FLIP.budget) * 100} danger={spent > FLIP.budget * 0.92} />
        <FlipMeter label="TIMELINE" valueText={`${fmtWeeks(weeks)} WKS · ${sim$(holding)}`} pct={(weeks / 14) * 100} danger={weeks > 10} />
      </div>
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "2px 22px 10px", display: "flex", flexDirection: "column", gap: 9 }}>
        {FLIP.items.map((it) => {
          const on = sel.includes(it.id);
          const over = flash === it.id;
          return (
            <button
              key={it.id}
              onClick={() => toggle(it)}
              style={{
                appearance: "none",
                cursor: "pointer",
                textAlign: "left",
                border: `2px solid ${over ? colors.error : on ? colors.blue : colors.line}`,
                borderRadius: 16,
                padding: "13px 15px",
                background: colors.surface,
                color: colors.ink,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                boxShadow: on ? `0 0 30px ${colors.blue}22` : "none",
                transition: "border-color .15s, box-shadow .15s",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  flexShrink: 0,
                  marginTop: 1,
                  border: `2px solid ${on ? colors.blue : colors.line2}`,
                  background: on ? colors.blue : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {on && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke={colors.ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span style={{ display: "block", flex: 1, minWidth: 0 }}>
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.005em" }}>{it.label}</span>
                  <span
                    style={{
                      fontFamily: fontFamily.mono,
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      color: over ? colors.error : on ? colors.blue : colors.muted,
                      flexShrink: 0,
                    }}
                  >
                    {over ? "OVER BUDGET" : `${sim$(it.cost)} · ${it.weeks}WK`}
                  </span>
                </span>
                <span style={{ display: "block", fontSize: 12, color: colors.muted, marginTop: 4, lineHeight: 1.45 }}>{it.note}</span>
              </span>
            </button>
          );
        })}
        <FlipMeta text="Scope" style={{ padding: "8px 0 2px" }} />
      </div>
      <Cta label={sel.length === 0 ? "Sell as-is" : "Run the flip"} onClick={() => onRun(sel)} />
    </Shell>
  );
}

// ── Phase: run (terminal log) ────────────────────────────────────

interface LogLine {
  t: string;
  c: string;
}

function FlipRun({ selIds, onDone }: { selIds: string[]; onDone: (r: FlipBreakdown) => void }) {
  const R = React.useMemo(() => computeFlip(selIds), [selIds]);

  const lines = React.useMemo<LogLine[]>(() => {
    const L: LogLine[] = [];
    L.push({ t: "WK 00 — CLOSED. KEYS IN HAND.", c: colors.muted });
    L.push({ t: `WK 00 — WIRE SENT · ${sim$(FLIP.purchase)}`, c: colors.muted });
    if (R.selectedIds.length === 0) L.push({ t: "NO SCOPE SELECTED — STRAIGHT TO MARKET.", c: colors.blue });
    let wk = FLIP.baseWeeks;
    for (const id of R.selectedIds) {
      const it = FLIP.items.find((x) => x.id === id);
      if (!it) continue;
      wk += it.weeks;
      L.push({ t: `WK ${String(Math.round(wk)).padStart(2, "0")} — ${it.label.toUpperCase()} · DONE`, c: colors.ink });
    }
    for (const p of flipPenalties(R.selectedIds)) {
      L.push({ t: `INSPECTION — ${p.label.toUpperCase()} FLAGGED · CREDIT ${simSigned(-p.amount)}`, c: colors.error });
    }
    L.push({ t: `LISTED · ${sim$(R.salePrice)}`, c: colors.blue });
    L.push({ t: `HOLDING METER · ${fmtWeeks(R.weeks)} WKS × ${sim$(FLIP.holdPerWeek)} = ${simSigned(-R.holding)}`, c: colors.muted });
    L.push({ t: "DAY 09 ON MARKET — OFFER IN.", c: colors.blue });
    return L;
  }, [R]);

  const [shown, setShown] = React.useState(0);
  const [blink, setBlink] = React.useState(true);

  // Reveal lines one at a time, then hand off to results.
  React.useEffect(() => {
    if (shown >= lines.length) {
      const t = setTimeout(() => onDone(R), 900);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 420);
    return () => clearTimeout(t);
  }, [shown, lines.length, onDone, R]);

  // Blinking cursor (inline replacement for the missing .et2-blink class).
  React.useEffect(() => {
    if (shown >= lines.length) return;
    const id = setInterval(() => setBlink((b) => !b), 520);
    return () => clearInterval(id);
  }, [shown, lines.length]);

  return (
    <Shell label="Sim Flip Run">
      <Header eyebrow="Simulator 04 · In progress" eyebrowColor={colors.blue} title="Running the flip" />
      <div style={{ flex: 1, padding: "20px 22px 10px", overflow: "hidden" }}>
        <div
          style={{
            background: colors.surface,
            border: `1px solid ${colors.line}`,
            borderRadius: 22,
            padding: "18px 18px 20px",
            height: "100%",
            overflow: "hidden",
            fontFamily: fontFamily.mono,
            display: "flex",
            flexDirection: "column",
            gap: 13,
          }}
        >
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", color: colors.blue }}>EXECUTION LOG</div>
          {lines.slice(0, shown).map((l, i) => (
            <div
              key={i}
              style={{
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: l.c,
                lineHeight: 1.5,
                opacity: 1,
                animation: "none",
                transition: "opacity .3s ease",
              }}
            >
              <span style={{ color: colors.line2, marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>
              {l.t}
            </div>
          ))}
          {shown < lines.length && <div style={{ fontSize: 11.5, color: colors.blue, opacity: blink ? 1 : 0, transition: "opacity .1s" }}>_</div>}
        </div>
      </div>
      <div style={{ height: 22, flexShrink: 0 }} />
    </Shell>
  );
}

// ── Phase: results (delegates to shared SimResults) ──────────────

function FlipResults({ result, onRetry, onCollect }: { result: FlipBreakdown; onRetry: () => void; onCollect: () => void }) {
  const R = result;
  const win = R.profit >= 0;
  const pens = flipPenalties(R.selectedIds);

  const rows: { k: React.ReactNode; v: React.ReactNode; accent?: string }[] = [
    { k: "Sale price", v: sim$(R.salePrice), accent: colors.ink },
    { k: "Purchase", v: simSigned(-FLIP.purchase) },
    { k: "Rehab", v: simSigned(-R.rehab) },
    { k: `Holding · ${fmtWeeks(R.weeks)} wks`, v: simSigned(-R.holding) },
    { k: "Selling costs · 6%", v: simSigned(-R.selling) },
    ...pens.map((p) => ({ k: `Buyer credit · ${p.label}`, v: simSigned(-p.amount), accent: colors.error })),
    {
      k: "NET PROFIT",
      v: <span style={{ color: win ? colors.blue : colors.error }}>{simSigned(R.profit)}</span>,
      accent: win ? colors.blue : colors.error,
    },
  ];

  return (
    <SimResults
      label="Sim Flip Results"
      eyebrow="Closing statement"
      title={win ? "Sold." : "Sold. At a loss."}
      grade={R.grade}
      line={R.line}
      rows={rows}
      onRetry={onRetry}
      onCollect={onCollect}
    />
  );
}

// ── Orchestrator ─────────────────────────────────────────────────

export function FlipSim({ onBack, onComplete }: { onBack: () => void; onComplete: (r: SimResult) => void }) {
  const [phase, setPhase] = React.useState<Phase>("brief");
  const [selIds, setSelIds] = React.useState<string[]>([]);
  const [result, setResult] = React.useState<FlipBreakdown | null>(null);

  if (phase === "brief") {
    return <FlipBrief onBack={onBack} onStart={() => setPhase("scope")} />;
  }
  if (phase === "scope") {
    return (
      <FlipScope
        onBack={() => setPhase("brief")}
        onRun={(ids) => {
          setSelIds(ids);
          setPhase("run");
        }}
      />
    );
  }
  if (phase === "run") {
    return (
      <FlipRun
        selIds={selIds}
        onDone={(r) => {
          setResult(r);
          setPhase("results");
        }}
      />
    );
  }
  // results — `result` is always set by the time we land here.
  if (!result) {
    return <FlipBrief onBack={onBack} onStart={() => setPhase("scope")} />;
  }
  return (
    <FlipResults
      result={result}
      onRetry={() => {
        setResult(null);
        setSelIds([]);
        setPhase("brief");
      }}
      onCollect={() => onComplete({ grade: result.grade, xp: result.xp, line: result.line })}
    />
  );
}
