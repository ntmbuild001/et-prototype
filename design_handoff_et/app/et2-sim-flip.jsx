// et2-sim-flip.jsx — "FLIP IT" simulator. Fully playable: pick rehab scope,
// protect budget + timeline, sell, get graded on real P&L math.
// Industrial work-order aesthetic: mono data, quoted labels, hazard stripes.

const FLIPC = () => ET2DATA.FLIP;
const flip$ = (n) => `$${Math.round(Math.abs(n)).toLocaleString()}`;
const flipSigned = (n) => `${n < 0 ? '−' : '+'}$${Math.round(Math.abs(n)).toLocaleString()}`;

function flipCompute(selIds) {
  const C = FLIPC();
  const sel = C.items.filter((it) => selIds.includes(it.id));
  const rehab = sel.reduce((s, it) => s + it.cost, 0);
  const weeks = C.baseWeeks + sel.reduce((s, it) => s + it.weeks, 0);
  const holding = Math.round(weeks * C.holdPerWeek);
  let value = C.asIs + sel.reduce((s, it) => s + it.add, 0);
  const penalties = [];
  C.items.forEach((it) => {
    if (it.essential && !selIds.includes(it.id)) {
      penalties.push({ id: it.id, label: it.label, amount: it.penalty });
      value -= it.penalty;
    }
  });
  const sale = value;
  const sellCost = Math.round(sale * C.sellPct);
  const profit = sale - C.purchase - rehab - holding - sellCost;
  const grade = C.grades.find((g) => profit >= g.min);
  return { sel, rehab, weeks, holding, sale, sellCost, profit, penalties, grade };
}

// ── shared bits ──────────────────────────────────────────────────
function FlipMeter({ label, valueText, pct, danger }) {
  const color = danger ? ET2P.red : ET2P.lime;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: ET2_MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: ET2P.muted }}>{label}</span>
        <span style={{ fontFamily: ET2_MONO, fontSize: 11.5, fontWeight: 700, color }}>{valueText}</span>
      </div>
      <div style={{ height: 6, background: ET2P.surface2, borderRadius: 2, border: `1px solid ${ET2P.line}`, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', transition: 'width .3s',
          background: `repeating-linear-gradient(-45deg, ${color} 0 5px, rgba(0,0,0,0.45) 5px 8px), ${color}` }}></div>
      </div>
    </div>
  );
}

function FlipSpecRow({ k, v, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 16px', borderBottom: `1px solid ${ET2P.line}` }}>
      <span style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: ET2P.muted, textTransform: 'uppercase' }}>{k}</span>
      <span style={{ fontFamily: ET2_MONO, fontSize: 12.5, fontWeight: 700, color: accent || ET2P.text }}>{v}</span>
    </div>
  );
}

// ── Phase: brief ─────────────────────────────────────────────────
function FlipBrief({ onBack, onStart }) {
  const C = FLIPC();
  return (
    <ET2Shell bg="radial-gradient(125% 85% at 70% -8%, #07090c 0%, #000 55%)" label="Sim Flip Brief">
      <ET2Header onBack={onBack} eyebrow="Simulator 04" eyebrowColor={ET2P.lime} title="Flip It" sub="One property. One budget. One shot." />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden', padding: '18px 0 0' }}>
          <div style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, padding: '0 16px', marginBottom: 4 }}>THE ASSIGNMENT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px 6px' }}>
            <ET2Puffy type="house" hue="lime" size={54} />
            <div>
              <div style={{ fontSize: 16.5, fontWeight: 800, letterSpacing: '-0.01em' }}>{C.propertyName}</div>
              <div style={{ fontFamily: ET2_MONO, fontSize: 10, color: ET2P.muted, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{C.propertyDesc}</div>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <FlipSpecRow k="Purchase" v={flip$(C.purchase)} />
            <FlipSpecRow k="Value as-is" v={flip$(C.asIs)} />
            <FlipSpecRow k="Rehab budget" v={flip$(C.budget)} accent={ET2P.lime} />
            <FlipSpecRow k="Holding cost" v={`${flip$(C.holdPerWeek)} / wk`} accent={ET2P.red} />
            <FlipSpecRow k="Selling costs" v="6% of sale" />
            <FlipSpecRow k="Target profit" v={flip$(C.targetProfit) + '+'} accent={ET2P.blue} />
          </div>
        </div>
        <div style={{ fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', textWrap: 'pretty', padding: '0 2px' }}>
          The keys are yours. Choose your rehab scope from the contractor&rsquo;s board — every line item costs money <em style={{ fontFamily: ET2_SERIF }}>and weeks</em>. Fix what sells. Skip what doesn&rsquo;t. The market grades you at the closing table.
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 14, padding: '12px 14px',
          background: ET2P.bg, border: `1px dashed ${ET2P.lime}66` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" stroke={ET2P.lime} strokeWidth="1.7"></circle>
            <path d="M12 11v6M12 7.5v.5" stroke={ET2P.lime} strokeWidth="1.9" strokeLinecap="round"></path>
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>Formula:</span> Profit = Sale − (Purchase + Rehab + Holding + 6% Selling costs).
          </div>
        </div>
      </div>
      <ET2Cta label="Open the project board" onClick={onStart} />
    </ET2Shell>
  );
}

// ── Phase: scope ─────────────────────────────────────────────────
function FlipScope({ onBack, onRun }) {
  const C = FLIPC();
  const [sel, setSel] = React.useState([]);
  const [flash, setFlash] = React.useState(null);
  const spent = C.items.filter((it) => sel.includes(it.id)).reduce((s, it) => s + it.cost, 0);
  const weeks = C.baseWeeks + C.items.filter((it) => sel.includes(it.id)).reduce((s, it) => s + it.weeks, 0);
  const holding = Math.round(weeks * C.holdPerWeek);

  const toggle = (it) => {
    if (sel.includes(it.id)) { setSel(sel.filter((id) => id !== it.id)); return; }
    if (spent + it.cost > C.budget) {
      setFlash(it.id); setTimeout(() => setFlash(null), 900); return;
    }
    let next = sel;
    if (it.excludes) next = next.filter((id) => id !== it.excludes);
    const excludedBy = C.items.find((o) => o.excludes === it.id);
    if (excludedBy) next = next.filter((id) => id !== excludedBy.id);
    setSel([...next, it.id]);
  };

  return (
    <ET2Shell label="Sim Flip Scope">
      <ET2Header onBack={onBack} eyebrow="Simulator 04 · Scope phase" eyebrowColor={ET2P.lime} title="The project board" />
      <div style={{ display: 'flex', gap: 16, padding: '16px 22px 12px', flexShrink: 0 }}>
        <FlipMeter label="BUDGET" valueText={`${flip$(spent)} / ${flip$(C.budget)}`} pct={(spent / C.budget) * 100} danger={spent > C.budget * 0.92} />
        <FlipMeter label="TIMELINE" valueText={`${weeks.toFixed(1).replace('.0', '')} WKS · ${flip$(holding)}`} pct={(weeks / 14) * 100} danger={weeks > 10} />
      </div>
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '2px 22px 10px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        {C.items.map((it) => {
          const on = sel.includes(it.id);
          const over = flash === it.id;
          return (
            <button key={it.id} onClick={() => toggle(it)} style={{
              appearance: 'none', cursor: 'pointer', textAlign: 'left',
              border: `2px solid ${over ? ET2P.red : on ? ET2P.lime : ET2P.line}`,
              borderRadius: 16, padding: '13px 15px',
              background: ET2P.surface,
              color: ET2P.text, display: 'flex', gap: 12, alignItems: 'flex-start',
              boxShadow: on ? `0 0 30px ${ET2P.lime}22` : 'none',
              transition: 'border-color .15s, box-shadow .15s' }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                border: `2px solid ${on ? ET2P.lime : ET2P.line2}`,
                background: on ? ET2P.lime : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={ET2P.ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
              </span>
              <span style={{ display: 'block', flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: '-0.005em' }}>{it.label}</span>
                  <span style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', color: over ? ET2P.red : on ? ET2P.lime : ET2P.muted, flexShrink: 0 }}>
                    {over ? 'OVER BUDGET' : `${flip$(it.cost)} · ${it.weeks}WK`}
                  </span>
                </span>
                <span style={{ display: 'block', fontSize: 12, color: ET2P.muted, marginTop: 4, lineHeight: 1.45 }}>{it.note}</span>
              </span>
            </button>
          );
        })}
        <ET2Meta text="Scope" style={{ padding: '8px 0 2px' }} />
      </div>
      <ET2Cta label={sel.length === 0 ? 'Sell as-is' : 'Run the flip'} color="blue" onClick={() => onRun(sel)} />
    </ET2Shell>
  );
}

// ── Phase: run (terminal log) ────────────────────────────────────
function FlipRun({ selIds, onDone }) {
  const C = FLIPC();
  const R = React.useMemo(() => flipCompute(selIds), []);
  const lines = React.useMemo(() => {
    const L = [];
    L.push({ t: 'WK 00 — CLOSED. KEYS IN HAND.', c: ET2P.muted });
    L.push({ t: `WK 00 — WIRE SENT · ${flip$(C.purchase)}`, c: ET2P.muted });
    if (R.sel.length === 0) L.push({ t: 'NO SCOPE SELECTED — STRAIGHT TO MARKET.', c: ET2P.blue });
    let wk = C.baseWeeks;
    R.sel.forEach((it) => {
      wk += it.weeks;
      L.push({ t: `WK ${String(Math.round(wk)).padStart(2, '0')} — ${it.label.toUpperCase()} · DONE`, c: ET2P.text });
    });
    R.penalties.forEach((p) => {
      L.push({ t: `INSPECTION — ${p.label.toUpperCase()} FLAGGED · CREDIT ${flipSigned(-p.amount)}`, c: ET2P.red });
    });
    L.push({ t: `LISTED · ${flip$(R.sale)}`, c: ET2P.blue });
    L.push({ t: `HOLDING METER · ${R.weeks.toFixed(1).replace('.0', '')} WKS × ${flip$(C.holdPerWeek)} = ${flipSigned(-R.holding)}`, c: ET2P.muted });
    L.push({ t: 'DAY 09 ON MARKET — OFFER IN.', c: ET2P.lime });
    return L;
  }, []);
  const [shown, setShown] = React.useState(0);

  React.useEffect(() => {
    if (shown >= lines.length) { const t = setTimeout(() => onDone(R), 900); return () => clearTimeout(t); }
    const t = setTimeout(() => setShown(shown + 1), 420);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <ET2Shell label="Sim Flip Run">
      <ET2Header eyebrow="Simulator 04 · In progress" eyebrowColor={ET2P.lime} title="Running the flip" />
      <div style={{ flex: 1, padding: '20px 22px 10px', overflow: 'hidden' }}>
        <div style={{ background: ET2P.surface, border: `1px solid ${ET2P.line}`, borderRadius: 22,
          padding: '18px 18px 20px', height: '100%', overflow: 'hidden',
          fontFamily: ET2_MONO, display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime }}>EXECUTION LOG</div>
          {lines.slice(0, shown).map((l, i) => (
            <div key={i} className="et2-fade" style={{ fontSize: 11.5, fontWeight: 500, letterSpacing: '0.04em', color: l.c, lineHeight: 1.5 }}>
              <span style={{ color: ET2P.line2, marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>{l.t}
            </div>
          ))}
          {shown < lines.length && <div style={{ fontSize: 11.5, color: ET2P.lime }} className="et2-blink">_</div>}
        </div>
      </div>
      <div style={{ height: 22, flexShrink: 0 }}></div>
    </ET2Shell>
  );
}

// ── Phase: results ───────────────────────────────────────────────
function FlipResults({ result, onRetry, onCollect }) {
  const C = FLIPC();
  const R = result;
  const g = R.grade;
  const gradeColor = g.g === 'S' || g.g === 'A' ? ET2P.lime : g.g === 'B' ? ET2P.blue : g.g === 'C' ? '#FFB347' : ET2P.red;
  const win = R.profit >= 0;
  return (
    <ET2Shell bg="radial-gradient(120% 75% at 50% -10%, #0a1410 0%, #000 60%)" label="Sim Flip Results">
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '30px 22px 10px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <ET2Mono color={gradeColor} size={10} style={{ marginBottom: 6 }}>Closing statement</ET2Mono>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.04 }}>
              {win ? 'Sold.' : 'Sold. At a loss.'}
            </div>
          </div>
          {/* grade badge */}
          <div className="et2-pop" style={{ width: 84, height: 84, border: `2px solid ${gradeColor}`, borderRadius: 20,
            background: ET2P.surface,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: gradeColor, flexShrink: 0, boxShadow: `0 0 28px ${gradeColor}33` }}>
            <span style={{ fontFamily: ET2_MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em' }}>GRADE</span>
            <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{g.g}</span>
          </div>
        </div>

        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          <FlipSpecRow k="Sale price" v={flip$(R.sale)} accent={ET2P.text} />
          <FlipSpecRow k="Purchase" v={flipSigned(-C.purchase)} />
          <FlipSpecRow k="Rehab" v={flipSigned(-R.rehab)} />
          <FlipSpecRow k={`Holding · ${R.weeks.toFixed(1).replace('.0', '')} wks`} v={flipSigned(-R.holding)} />
          <FlipSpecRow k="Selling costs · 6%" v={flipSigned(-R.sellCost)} />
          {R.penalties.map((p) => <FlipSpecRow key={p.id} k={`Buyer credit · ${p.label}`} v={flipSigned(-p.amount)} accent={ET2P.red} />)}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: win ? 'rgba(0,255,127,0.06)' : 'rgba(255,77,77,0.06)' }}>
            <span style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: ET2P.text }}>NET PROFIT</span>
            <span style={{ fontFamily: ET2_MONO, fontSize: 16, fontWeight: 700, color: win ? ET2P.lime : ET2P.red }}>{flipSigned(R.profit)}</span>
          </div>
        </div>

        <div style={{ fontFamily: ET2_SERIF, fontStyle: 'italic', fontSize: 19, lineHeight: 1.35, color: 'rgba(255,255,255,0.85)', textWrap: 'balance' }}>
          {g.line}
        </div>

        <button onClick={onRetry} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent',
          border: `1px solid ${ET2P.line2}`, borderRadius: 999, color: ET2P.muted, padding: '12px 16px',
          fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          ↺ Run it back
        </button>
        <ET2Meta text="Closing table" />
      </div>
      <ET2Cta label={`Collect rewards · +${g.xp} XP`} onClick={() => onCollect(R)} />
    </ET2Shell>
  );
}

// ── Sim orchestrator ─────────────────────────────────────────────
function ET2FlipSim({ onBack, onComplete }) {
  const [phase, setPhase] = React.useState('brief'); // brief | scope | run | results
  const [selIds, setSelIds] = React.useState([]);
  const [result, setResult] = React.useState(null);

  if (phase === 'brief') return <FlipBrief onBack={onBack} onStart={() => setPhase('scope')} />;
  if (phase === 'scope') return <FlipScope onBack={() => setPhase('brief')} onRun={(ids) => { setSelIds(ids); setPhase('run'); }} />;
  if (phase === 'run') return <FlipRun selIds={selIds} onDone={(r) => { setResult(r); setPhase('results'); }} />;
  return <FlipResults result={result}
    onRetry={() => { setResult(null); setPhase('scope'); }}
    onCollect={(r) => onComplete({ grade: r.grade.g, xp: r.grade.xp, line: r.grade.line, profit: r.profit })} />;
}

Object.assign(window, { ET2FlipSim });
