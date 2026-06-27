// et2-sim-buybox.jsx — "BUY BOX" (Sim 02 · Build Your Buy Box).
// The box is set. A feed of listings floods in — KEEP or PASS, fast.

const BUYBOX = {
  perCard: 10, // seconds per listing
  box: [
    { k: 'Market', v: 'Memphis, TN' },
    { k: 'Type', v: '2\u20134 units' },
    { k: 'Price band', v: '$150k \u2013 $250k' },
    { k: 'Rent-to-price', v: '\u2265 1.0%' },
    { k: 'Condition', v: 'Cosmetic rehab only' },
  ],
  cards: [
    { id: 1, addr: '1530 Netherwood Ave', type: 'Duplex · 2×2BR', price: 198000, rent: 2150, cond: 'Paint + flooring', keep: true,
      why: 'In the box on every line: duplex, $198k, 1.09%, cosmetic work.' },
    { id: 2, addr: '4012 Walnut Grove', type: 'Single-family · 4BR', price: 240000, rent: 2450, cond: 'Move-in ready', keep: false,
      why: 'Numbers look fine — but it\u2019s a single-family. Wrong type, automatic pass.' },
    { id: 3, addr: '722 N Trezevant', type: 'Triplex · 3×1BR', price: 245000, rent: 2700, cond: 'Cosmetic', keep: true,
      why: 'Triplex, inside the band, 1.10%, cosmetic. Keeper.' },
    { id: 4, addr: '88 Stonewall Pl', type: 'Fourplex · 4×1BR', price: 289000, rent: 3300, cond: 'Cosmetic', keep: false,
      why: '1.14% is juicy — but $289k busts the price band. The box says no for you.' },
    { id: 5, addr: '2204 Young Ave', type: 'Duplex · 2×1BR', price: 225000, rent: 1900, cond: 'Light cosmetic', keep: false,
      why: '0.84% rent-to-price. Inside the band, wrong math.' },
    { id: 6, addr: '1108 Faxon Ave', type: 'Fourplex · 4×1BR', price: 235000, rent: 2600, cond: 'Foundation + roof', keep: false,
      why: '1.11% — but it needs structural work. Condition line exists for a reason.' },
    { id: 7, addr: '3315 Park Ave', type: 'Duplex · 2×2BR', price: 168000, rent: 1750, cond: 'Paint only', keep: true,
      why: '$168k duplex at 1.04% needing paint. Textbook box fit.' },
    { id: 8, addr: '901 River Bluff (Nashville)', type: 'Duplex · 2×2BR', price: 232000, rent: 2400, cond: 'Cosmetic', keep: false,
      why: '1.03%, right type, right band — wrong city. Your market is Memphis.' },
  ],
  grades: [
    { min: 8, g: 'S', line: 'Eight for eight. The box isn\u2019t a suggestion to you — it\u2019s a reflex.' },
    { min: 7, g: 'A', line: 'Nearly flawless. One listing slipped past the box.' },
    { min: 6, g: 'B', line: 'Good instincts, but the box only works if it\u2019s automatic.' },
    { min: 4, g: 'C', line: 'You negotiated with yourself house by house. That\u2019s how deals go bad.' },
    { min: 0, g: 'F', line: 'You bought with your eyes, not your criteria. Re-read the box.' },
  ],
};

function BuyBoxBrief({ onBack, onStart }) {
  return (
    <ET2Shell label="Sim BuyBox Brief">
      <ET2Header onBack={onBack} eyebrow="Simulator 02" eyebrowColor={ET2P.lime} title="Buy Box" sub="Your criteria. Their flood. Sort fast." />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden', padding: '18px 0 0' }}>
          <div style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, padding: '0 16px', marginBottom: 10 }}>YOUR BUY BOX</div>
          {BUYBOX.box.map((b) => <SimSpecRow key={b.k} k={b.k} v={b.v} accent={ET2P.lime} />)}
        </div>
        <SimCallout>
          <span style={{ fontWeight: 700 }}>{BUYBOX.cards.length} listings, {BUYBOX.perCard} seconds each.</span> KEEP what fits, PASS what doesn&rsquo;t. Hesitate and it counts against you — the box answers in seconds.
        </SimCallout>
      </div>
      <ET2Cta label="Open the feed" onClick={onStart} />
    </ET2Shell>
  );
}

function BuyBoxPlay({ onDone }) {
  const [idx, setIdx] = React.useState(0);
  const [left, setLeft] = React.useState(BUYBOX.perCard);
  const [answer, setAnswer] = React.useState(null); // {choice, right} during feedback
  const [results, setResults] = React.useState([]);
  const card = BUYBOX.cards[idx];

  React.useEffect(() => {
    if (answer) return;
    const t = setInterval(() => setLeft((s) => s - 0.1), 100);
    return () => clearInterval(t);
  }, [idx, answer]);

  const record = (choice) => {
    if (answer) return;
    const right = choice === null ? false : choice === card.keep;
    setAnswer({ choice, right });
    const next = [...results, { id: card.id, right }];
    setResults(next);
    setTimeout(() => {
      if (idx + 1 >= BUYBOX.cards.length) { onDone(next); return; }
      setIdx(idx + 1); setLeft(BUYBOX.perCard); setAnswer(null);
    }, 1600);
  };
  React.useEffect(() => { if (left <= 0 && !answer) record(null); }, [left <= 0]);

  const pct = Math.max(0, (left / BUYBOX.perCard) * 100);
  const ratio = (card.rent / card.price) * 100;
  const border = answer ? (answer.right ? ET2P.lime : ET2P.red) : ET2P.line;

  return (
    <ET2Shell label="Sim BuyBox Play">
      <div style={{ padding: '14px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <ET2Mono color={ET2P.lime} size={10}>The feed · {idx + 1} of {BUYBOX.cards.length}</ET2Mono>
        <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.muted }}>
          {results.filter((r) => r.right).length} RIGHT
        </span>
      </div>
      <div style={{ padding: '10px 22px 0', flexShrink: 0 }}>
        <div style={{ height: 4, background: ET2P.surface, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${answer ? 100 : pct}%`, height: '100%', background: left < 3 && !answer ? ET2P.red : ET2P.lime, borderRadius: 999 }}></div>
        </div>
      </div>

      <div key={card.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 8px' }}>
        <div style={{ border: `2px solid ${border}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden',
          boxShadow: answer ? `0 0 30px ${border}33` : 'none', transition: 'border-color .15s, box-shadow .15s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px 10px' }}>
            <ET2Puffy type={card.type.startsWith('Single') ? 'house' : 'apartments'} hue="slate" size={46} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.015em' }}>{card.addr}</div>
              <div style={{ fontFamily: ET2_MONO, fontSize: 10, color: ET2P.muted, marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{card.type}</div>
            </div>
          </div>
          <SimSpecRow k="Asking" v={sim$(card.price)} accent={ET2P.text} />
          <SimSpecRow k="Rent" v={`${sim$(card.rent)} / mo  ·  ${ratio.toFixed(2)}%`} accent={ET2P.text} />
          <SimSpecRow k="Condition" v={card.cond} accent={ET2P.text} />
          {answer && (
            <div className="et2-fade" style={{ padding: '12px 16px', fontSize: 13, lineHeight: 1.5,
              color: 'rgba(255,255,255,0.85)', borderTop: `1px solid ${ET2P.line}` }}>
              <span style={{ fontFamily: ET2_MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.18em', color: border, marginRight: 8 }}>
                {answer.choice === null ? 'TOO SLOW' : answer.right ? 'RIGHT' : 'WRONG'}
              </span>
              {card.why}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 22px 22px', flexShrink: 0 }}>
        <button onClick={() => record(false)} disabled={!!answer} style={{ appearance: 'none', cursor: answer ? 'default' : 'pointer',
          height: 56, borderRadius: 999, border: `2px solid ${ET2P.line2}`, background: 'transparent', color: answer ? ET2P.muted : ET2P.text,
          fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>Pass</button>
        <button onClick={() => record(true)} disabled={!!answer} style={{ appearance: 'none', cursor: answer ? 'default' : 'pointer',
          height: 56, borderRadius: 999, border: 0, background: answer ? ET2P.surface : ET2P.lime, color: answer ? ET2P.muted : ET2P.ink,
          fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>Keep</button>
      </div>
    </ET2Shell>
  );
}

function ET2BuyBoxSim({ onBack, onComplete }) {
  const [phase, setPhase] = React.useState('brief');
  const [results, setResults] = React.useState([]);

  if (phase === 'brief') return <BuyBoxBrief onBack={onBack} onStart={() => setPhase('play')} />;
  if (phase === 'play') return <BuyBoxPlay onDone={(r) => { setResults(r); setPhase('results'); }} />;

  const score = results.filter((r) => r.right).length;
  const g = BUYBOX.grades.find((x) => score >= x.min);
  return <ET2SimResults
    label="Sim BuyBox Results"
    eyebrow="Feed debrief"
    title={`${score} of ${BUYBOX.cards.length} sorted right.`}
    grade={g.g}
    line={g.line}
    rows={[
      { k: 'Correct calls', v: `${score} / ${BUYBOX.cards.length}`, accent: score >= 6 ? ET2P.lime : ET2P.red },
      { k: 'Keepers in feed', v: String(BUYBOX.cards.filter((c) => c.keep).length), accent: ET2P.text },
      { k: 'Traps dodged', v: `${results.filter((r, i) => r.right && !BUYBOX.cards[i].keep).length} / ${BUYBOX.cards.filter((c) => !c.keep).length}`, accent: ET2P.text },
    ]}
    onRetry={() => { setResults([]); setPhase('play'); }}
    onCollect={() => onComplete({ grade: g.g, xp: SIM_XP[g.g], line: g.line })} />;
}

Object.assign(window, { ET2BuyBoxSim });
