"use client";

// UnderwriteSim.tsx — "UNDERWRITE IT" (Sim 03 · Underwriting 101).
// You're the lender. Loan files hit your desk — approve or deny on DSCR.
// Ported from et2-sim-underwrite.jsx.
import React from "react";
import { Shell, Header, Mono, Cta, Progress, Puffy, colors, fontFamily } from "@et/brand";
import type { Grade, SimResult } from "@/lib/types";
import { SIM_XP } from "@/lib/types";
import { SimResults, SimSpecRow, SimCallout, sim$ } from "./simShared";

interface LoanFile {
  id: number;
  name: string;
  desc: string;
  gross: number;
  opex: number;
  debt: number;
  why: string;
}

interface GradeBand {
  min: number;
  g: Grade;
  line: string;
}

interface FileResult {
  id: number;
  right: boolean;
}

const UNDERWRITE = {
  threshold: 1.2,
  files: [
    {
      id: 1,
      name: "742 Semmes St",
      desc: "Duplex · 2×2BR · stabilized",
      gross: 33600,
      opex: 7200,
      debt: 20400,
      why: "NOI $26.4k ÷ $20.4k debt = 1.29 DSCR. Comfortable cushion — fund it.",
    },
    {
      id: 2,
      name: "1815 Lamar Flats",
      desc: "4-unit · high turnover",
      gross: 58000,
      opex: 34000,
      debt: 21600,
      why: "Big gross, bigger expenses. NOI $24k ÷ $21.6k = 1.11 — under the line. Deny.",
    },
    {
      id: 3,
      name: "220 Cooper St",
      desc: "Single-family rental · long-term tenant",
      gross: 19200,
      opex: 4800,
      debt: 12000,
      why: "NOI $14.4k ÷ $12k = exactly 1.20. Right at the bar — it clears. Approve.",
    },
    {
      id: 4,
      name: "88 N Main · Unit 4",
      desc: "Downtown loft · HOA-heavy",
      gross: 27600,
      opex: 9600,
      debt: 19500,
      why: "NOI $18k ÷ $19.5k = 0.92. The property can’t even pay its own mortgage. Hard deny.",
    },
    {
      id: 5,
      name: "5009 Knight Arnold",
      desc: "Triplex · recently renovated",
      gross: 40800,
      opex: 9800,
      debt: 19000,
      why: "NOI $31k ÷ $19k = 1.63. The strongest file on the desk. Approve.",
    },
  ] as LoanFile[],
  grades: [
    { min: 5, g: "S", line: "Five for five. The bank should be worried about your desk ambitions." },
    { min: 4, g: "A", line: "Sharp underwriting. One file got past you." },
    { min: 3, g: "B", line: "You know the formula — now make it instinct." },
    { min: 2, g: "C", line: "You approved hope and denied math. Run the NOI first, always." },
    { min: 0, g: "F", line: "Every bad loan on your desk got funded. The workout department says hi." },
  ] as GradeBand[],
};

function uwDscr(f: LoanFile): number {
  return (f.gross - f.opex) / f.debt;
}

type Decision = "approve" | "deny";

function UnderwriteBrief({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <Shell label="Sim Underwrite Brief">
      <Header onBack={onBack} eyebrow="Simulator 03" eyebrowColor={colors.blue} title="Underwrite It" sub="You're the bank now. Protect the money." />
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "22px 22px 10px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden", padding: "18px 0 0" }}>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 11, fontWeight: 700, letterSpacing: "0.22em", color: colors.blue, padding: "0 16px", marginBottom: 4 }}>
            THE ASSIGNMENT
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px 6px" }}>
            <Puffy type="bank" hue="blue" size={54} />
            <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>Five loan files on your desk. Borrowers are charming. Their numbers are less so.</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <SimSpecRow k="Files" v="5" />
            <SimSpecRow k="Approve when DSCR" v="≥ 1.20" accent={colors.blue} />
            <SimSpecRow k="DSCR" v="NOI ÷ annual debt service" />
            <SimSpecRow k="NOI" v="gross rent − operating expenses" />
          </div>
        </div>
        <SimCallout color={colors.blue}>
          <span style={{ fontWeight: 700 }}>The trap:</span> big gross rent means nothing. Run the NOI, divide by the debt — the number decides, not the brochure.
        </SimCallout>
      </div>
      <Cta label="Open the first file" onClick={onStart} />
    </Shell>
  );
}

function UnderwritePlay({ onDone }: { onDone: (results: FileResult[]) => void }) {
  const [idx, setIdx] = React.useState(0);
  const [locked, setLocked] = React.useState<Decision | null>(null);
  const [results, setResults] = React.useState<FileResult[]>([]);
  const f = UNDERWRITE.files[idx];
  const dscr = uwDscr(f);
  const shouldApprove = dscr >= UNDERWRITE.threshold;
  const right = locked !== null && (locked === "approve") === shouldApprove;
  const last = idx + 1 >= UNDERWRITE.files.length;

  const decide = (choice: Decision) => {
    if (locked) return;
    setLocked(choice);
    setResults([...results, { id: f.id, right: (choice === "approve") === shouldApprove }]);
  };
  const next = () => {
    if (last) {
      onDone(results);
      return;
    }
    setIdx(idx + 1);
    setLocked(null);
  };

  const rightCount = results.filter((r) => r.right).length;

  return (
    <Shell label="Sim Underwrite Play">
      <div style={{ padding: "14px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Mono color={colors.blue} size={10}>
          Loan desk · File {idx + 1} of {UNDERWRITE.files.length}
        </Mono>
        <span style={{ fontFamily: fontFamily.mono, fontSize: 12, fontWeight: 700, color: colors.muted }}>{rightCount} RIGHT</span>
      </div>
      <Progress percent={((idx + (locked ? 1 : 0)) / UNDERWRITE.files.length) * 100} />

      <div key={f.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: "auto", padding: "18px 22px 8px" }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 16px 10px" }}>
            <Puffy type="bank" hue="slate" size={46} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.015em" }}>{f.name}</div>
              <div style={{ fontFamily: fontFamily.mono, fontSize: 10, color: colors.muted, marginTop: 3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {f.desc}
              </div>
            </div>
          </div>
          <SimSpecRow k="Gross rent / yr" v={sim$(f.gross)} accent={colors.ink} />
          <SimSpecRow k="Operating expenses" v={`− ${sim$(f.opex)}`} accent={colors.ink} />
          <SimSpecRow k="Annual debt service" v={sim$(f.debt)} accent={colors.ink} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "13px 16px",
              background: locked ? (shouldApprove ? "rgba(31,233,138,0.05)" : "rgba(255,77,77,0.05)") : colors.surface2,
            }}
          >
            <span style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", color: colors.muted }}>DSCR</span>
            <span style={{ fontFamily: fontFamily.mono, fontSize: 13, fontWeight: 700, color: locked ? (shouldApprove ? colors.blue : colors.error) : colors.ink }}>
              {locked ? dscr.toFixed(2) : "?.??"}
            </span>
          </div>
        </div>

        {locked && (
          <div
            className="et2-fade"
            style={{
              marginTop: 14,
              borderRadius: 16,
              padding: "14px 16px",
              background: colors.surface,
              border: `1px solid ${right ? `${colors.blue}66` : `${colors.error}66`}`,
            }}
          >
            <div style={{ fontFamily: fontFamily.mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: right ? colors.blue : colors.error, marginBottom: 6 }}>
              {right ? "RIGHT CALL" : "WRONG CALL"}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(var(--et-ink-rgb),0.85)" }}>{f.why}</div>
          </div>
        )}
      </div>

      {!locked ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "10px 22px 22px", flexShrink: 0 }}>
          <button
            onClick={() => decide("deny")}
            style={{
              appearance: "none",
              cursor: "pointer",
              height: 56,
              borderRadius: 999,
              border: `2px solid ${colors.error}88`,
              background: "transparent",
              color: colors.error,
              fontFamily: fontFamily.sans,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Deny
          </button>
          <button
            onClick={() => decide("approve")}
            style={{
              appearance: "none",
              cursor: "pointer",
              height: 56,
              borderRadius: 999,
              border: 0,
              background: colors.blue,
              color: colors.ink,
              fontFamily: fontFamily.sans,
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Approve
          </button>
        </div>
      ) : (
        <Cta label={last ? "Close the desk" : "Next file"} onClick={next} />
      )}
    </Shell>
  );
}

type Phase = "brief" | "play" | "results";

export function UnderwriteSim({ onBack, onComplete }: { onBack: () => void; onComplete: (r: SimResult) => void }) {
  const [phase, setPhase] = React.useState<Phase>("brief");
  const [results, setResults] = React.useState<FileResult[]>([]);

  if (phase === "brief") return <UnderwriteBrief onBack={onBack} onStart={() => setPhase("play")} />;
  if (phase === "play")
    return (
      <UnderwritePlay
        onDone={(r) => {
          setResults(r);
          setPhase("results");
        }}
      />
    );

  const score = results.filter((r) => r.right).length;
  const g = UNDERWRITE.grades.find((x) => score >= x.min)!;
  const fundedBad = UNDERWRITE.files.filter((f, i) => results[i] && !results[i].right && uwDscr(f) < UNDERWRITE.threshold).length;

  return (
    <SimResults
      label="Sim Underwrite Results"
      eyebrow="Desk review"
      title={`${score} of ${UNDERWRITE.files.length} calls right.`}
      grade={g.g}
      line={g.line}
      rows={[
        { k: "Correct decisions", v: `${score} / ${UNDERWRITE.files.length}`, accent: score >= 4 ? colors.blue : colors.error },
        { k: "Bad loans funded", v: String(fundedBad), accent: fundedBad === 0 ? colors.blue : colors.error },
        { k: "The line", v: "DSCR ≥ 1.20", accent: colors.ink },
      ]}
      onRetry={() => {
        setResults([]);
        setPhase("play");
      }}
      onCollect={() => onComplete({ grade: g.g, xp: SIM_XP[g.g], line: g.line })}
    />
  );
}
