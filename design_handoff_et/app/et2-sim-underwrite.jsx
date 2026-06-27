// et2-sim-underwrite.jsx — "UNDERWRITE IT" (Sim 03 · Underwriting 101).
// You're the lender. Loan files hit your desk — approve or deny on DSCR.

const UNDERWRITE = {
  threshold: 1.2,
  files: [
    { id: 1, name: '742 Semmes St', desc: 'Duplex · 2×2BR · stabilized', gross: 33600, opex: 7200, debt: 20400,
      why: 'NOI $26.4k ÷ $20.4k debt = 1.29 DSCR. Comfortable cushion — fund it.' },
    { id: 2, name: '1815 Lamar Flats', desc: '4-unit · high turnover', gross: 58000, opex: 34000, debt: 21600,
      why: 'Big gross, bigger expenses. NOI $24k ÷ $21.6k = 1.11 — under the line. Deny.' },
    { id: 3, name: '220 Cooper St', desc: 'Single-family rental · long-term tenant', gross: 19200, opex: 4800, debt: 12000,
      why: 'NOI $14.4k ÷ $12k = exactly 1.20. Right at the bar — it clears. Approve.' },
    { id: 4, name: '88 N Main · Unit 4', desc: 'Downtown loft · HOA-heavy', gross: 27600, opex: 9600, debt: 19500,
      why: 'NOI $18k ÷ $19.5k = 0.92. The property can\u2019t even pay its own mortgage. Hard deny.' },
    { id: 5, name: '5009 Knight Arnold', desc: 'Triplex · recently renovated', gross: 40800, opex: 9800, debt: 19000,
      why: 'NOI $31k ÷ $19k = 1.63. The strongest file on the desk. Approve.' },
  ],
  grades: [
    { min: 5, g: 'S', line: 'Five for five. The bank should be worried about your desk ambitions.' },
    { min: 4, g: 'A', line: 'Sharp underwriting. One file got past you.' },
    { min: 3, g: 'B', line: 'You know the formula — now make it instinct.' },
    { min: 2, g: 'C', line: 'You approved hope and denied math. Run the NOI first, always.' },
    { min: 0, g: 'F', line: 'Every bad loan on your desk got funded. The workout department says hi.' },
  ],
};

function uwDscr(f) { return (f.gross - f.opex) / f.debt; }

function UnderwriteBrief({ onBack, onStart }) {
  return (
    <ET2Shell label="Sim Underwrite Brief">
      <ET2Header onBack={onBack} eyebrow="Simulator 03" eyebrowColor={ET2P.lime} title="Underwrite It" sub="You're the bank now. Protect the money." />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden', padding: '18px 0 0' }}>
          <div style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, padding: '0 16px', marginBottom: 4 }}>THE ASSIGNMENT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px 6px' }}>
            <ET2Puffy type="bank" hue="lime" size={54} />
            <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>Five loan files on your desk. Borrowers are charming. Their numbers are less so.</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <SimSpecRow k="Files" v="5" />
            <SimSpecRow k="Approve when DSCR" v="≥ 1.20" accent={ET2P.lime} />
            <SimSpecRow k="DSCR" v="NOI ÷ annual debt service" />
            <SimSpecRow k="NOI" v="gross rent − operating expenses" />
          </div>
        </div>
        <SimCallout color={ET2P.blue}>
          <span style={{ fontWeight: 700 }}>The trap:</span> big gross rent means nothing. Run the NOI, divide by the debt — the number decides, not the brochure.
        </SimCallout>
      </div>
      <ET2Cta label="Open the first file" onClick={onStart} />
    </ET2Shell>
  );
}

function UnderwritePlay({ onDone }) {
  const [idx, setIdx] = React.useState(0);
  const [locked, setLocked] = React.useState(null); // 'approve' | 'deny'
  const [results, setResults] = React.useState([]);
  const f = UNDERWRITE.files[idx];
  const dscr = uwDscr(f);
  const shouldApprove = dscr >= UNDERWRITE.threshold;
  const right = locked && ((locked === 'approve') === shouldApprove);
  const last = idx + 1 >= UNDERWRITE.files.length;

  const decide = (choice) => {
    if (locked) return;
    setLocked(choice);
    setResults([...results, { id: f.id, right: (choice === 'approve') === shouldApprove }]);
  };
  const next = () => {
    if (last) { onDone(locked ? results : results); return; }
    setIdx(idx + 1); setLocked(null);
  };

  return (
    <ET2Shell label="Sim Underwrite Play">
      <div style={{ padding: '14px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <ET2Mono color={ET2P.lime} size={10}>Loan desk · File {idx + 1} of {UNDERWRITE.files.length}</ET2Mono>
        <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.muted }}>
          {results.filter((r) => r.right).length} RIGHT
        </span>
      </div>
      <ET2Progress percent={((idx + (locked ? 1 : 0)) / UNDERWRITE.files.length) * 100} />

      <div key={f.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 8px' }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px 10px' }}>
            <ET2Puffy type="bank" hue="slate" size={46} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.015em' }}>{f.name}</div>
              <div style={{ fontFamily: ET2_MONO, fontSize: 10, color: ET2P.muted, marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{f.desc}</div>
            </div>
          </div>
          <SimSpecRow k="Gross rent / yr" v={sim$(f.gross)} accent={ET2P.text} />
          <SimSpecRow k="Operating expenses" v={`\u2212 ${sim$(f.opex)}`} accent={ET2P.text} />
          <SimSpecRow k="Annual debt service" v={sim$(f.debt)} accent={ET2P.text} />
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 16px',
            background: locked ? (shouldApprove ? 'rgba(0,255,127,0.05)' : 'rgba(255,77,77,0.05)') : ET2P.surfaceActive || '#1c1c1c' }}>
            <span style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: ET2P.muted }}>DSCR</span>
            <span style={{ fontFamily: ET2_MONO, fontSize: 13, fontWeight: 700, color: locked ? (shouldApprove ? ET2P.lime : ET2P.red) : ET2P.text }}>
              {locked ? dscr.toFixed(2) : '?.??'}
            </span>
          </div>
        </div>

        {locked && (
          <div className="et2-fade" style={{ marginTop: 14, borderRadius: 16, padding: '14px 16px',
            background: ET2P.surface, border: `1px solid ${right ? `${ET2P.lime}66` : `${ET2P.red}66`}` }}>
            <div style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
              color: right ? ET2P.lime : ET2P.red, marginBottom: 6 }}>
              {right ? 'RIGHT CALL' : 'WRONG CALL'}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>{f.why}</div>
          </div>
        )}
      </div>

      {!locked ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 22px 22px', flexShrink: 0 }}>
          <button onClick={() => decide('deny')} style={{ appearance: 'none', cursor: 'pointer',
            height: 56, borderRadius: 999, border: `2px solid ${ET2P.red}88`, background: 'transparent', color: ET2P.red,
            fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>Deny</button>
          <button onClick={() => decide('approve')} style={{ appearance: 'none', cursor: 'pointer',
            height: 56, borderRadius: 999, border: 0, background: ET2P.lime, color: ET2P.ink,
            fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>Approve</button>
        </div>
      ) : (
        <ET2Cta label={last ? 'Close the desk' : 'Next file'} onClick={next} />
      )}
    </ET2Shell>
  );
}

function ET2UnderwriteSim({ onBack, onComplete }) {
  const [phase, setPhase] = React.useState('brief');
  const [results, setResults] = React.useState([]);

  if (phase === 'brief') return <UnderwriteBrief onBack={onBack} onStart={() => setPhase('play')} />;
  if (phase === 'play') return <UnderwritePlay onDone={(r) => { setResults(r); setPhase('results'); }} />;

  const score = results.filter((r) => r.right).length;
  const g = UNDERWRITE.grades.find((x) => score >= x.min);
  const fundedBad = UNDERWRITE.files.filter((f, i) => results[i] && !results[i].right && uwDscr(f) < 1.2).length;
  return <ET2SimResults
    label="Sim Underwrite Results"
    eyebrow="Desk review"
    title={`${score} of ${UNDERWRITE.files.length} calls right.`}
    grade={g.g}
    line={g.line}
    rows={[
      { k: 'Correct decisions', v: `${score} / ${UNDERWRITE.files.length}`, accent: score >= 4 ? ET2P.lime : ET2P.red },
      { k: 'Bad loans funded', v: String(fundedBad), accent: fundedBad === 0 ? ET2P.lime : ET2P.red },
      { k: 'The line', v: 'DSCR ≥ 1.20', accent: ET2P.text },
    ]}
    onRetry={() => { setResults([]); setPhase('play'); }}
    onCollect={() => onComplete({ grade: g.g, xp: SIM_XP[g.g], line: g.line })} />;
}

Object.assign(window, { ET2UnderwriteSim });
