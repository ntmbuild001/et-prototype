// et2-sim-block.jsx — "BLOCK ROYALE" (Sim 05 · capstone).
// Five properties up for grabs against rival buyers. Sealed bids, fixed
// capital. Equity created decides your grade — overpaying counts against you.

const BLOCK = {
  capital: 750000,
  lots: [
    { id: 1, addr: '1942 Cella St', desc: 'Duplex · tired but solid', icon: 'house', list: 145000, worth: 205000, rival: 172000,
      intel: 'Estate sale. Other buyers smell it too.' },
    { id: 2, addr: '1944 Cella St', desc: 'Duplex · the neighbor', icon: 'house', list: 150000, worth: 195000, rival: 201000,
      intel: 'A cash buyer from out of state loves this one. Loves it a little too much.' },
    { id: 3, addr: '506 Lucy Ave', desc: 'Fourplex · corner lot', icon: 'apartments', list: 210000, worth: 290000, rival: 252000,
      intel: 'Best rent roll on the block. Expect a fight.' },
    { id: 4, addr: '510 Lucy Ave', desc: 'Boarded shell · needs everything', icon: 'villa', list: 55000, worth: 88000, rival: 64000,
      intel: 'Everyone else is scared of it. Fear is a discount.' },
    { id: 5, addr: '515 Lucy Ave', desc: 'Brick sixplex · the anchor', icon: 'bank', list: 280000, worth: 360000, rival: 338000,
      intel: 'The trophy. Trophies are where discipline goes to die.' },
  ],
  grades: [
    { min: 60000, g: 'S', line: 'You bought equity, not buildings. The block answers to you now.' },
    { min: 40000, g: 'A', line: 'Strong campaign. You won where it was cheap and walked where it wasn\u2019t.' },
    { min: 25000, g: 'B', line: 'Profitable — but you left equity on the table or paid for the privilege.' },
    { min: 1, g: 'C', line: 'You own property. Barely ahead. Winning the bid isn\u2019t winning the deal.' },
    { min: -Infinity, g: 'F', line: 'You won auctions and lost money. The rivals send their thanks.' },
  ],
  zeroLine: 'You never overpaid — and never bought. Discipline without deals is just window shopping.',
};

function blockFmtK(n) { return `$${Math.round(n / 1000)}k`; }

function BlockBrief({ onBack, onStart }) {
  return (
    <ET2Shell label="Sim Block Brief">
      <ET2Header onBack={onBack} eyebrow="Simulator 05 · Capstone" eyebrowColor={ET2P.lime} title="Block Royale" sub="Five lots. Rival money. One block." />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden', padding: '18px 0 0' }}>
          <div style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, padding: '0 16px', marginBottom: 4 }}>THE ASSIGNMENT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px 6px' }}>
            <ET2Puffy type="villa" hue="lime" size={54} />
            <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>The Lucy Ave block hits the courthouse steps. Sealed bids, one per property. Rival buyers have the same list.</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <SimSpecRow k="Your capital" v={sim$(BLOCK.capital)} accent={ET2P.lime} />
            <SimSpecRow k="Properties" v="5 · sealed bid each" />
            <SimSpecRow k="You're shown" v="Worth-to-you (your underwriting)" />
            <SimSpecRow k="Scored on" v="Equity created = worth − price paid" accent={ET2P.blue} />
          </div>
        </div>
        <SimCallout>
          <span style={{ fontWeight: 700 }}>The capstone rule:</span> your number is your number. Win below worth and you create equity. Win above it and you just bought a loss with extra steps.
        </SimCallout>
      </div>
      <ET2Cta label="To the courthouse steps" onClick={onStart} />
    </ET2Shell>
  );
}

function BlockAuction({ onDone }) {
  const [idx, setIdx] = React.useState(0);
  const [spent, setSpent] = React.useState(0);
  const [wins, setWins] = React.useState([]);   // {id, bid, equity}
  const [reveal, setReveal] = React.useState(null); // {won, bid}
  const lot = BLOCK.lots[idx];
  const remaining = BLOCK.capital - spent;
  const maxBid = Math.min(remaining, lot.worth + 60000);
  const [bid, setBid] = React.useState(lot.list);
  React.useEffect(() => { setBid(lot.list); }, [idx]);

  const last = idx + 1 >= BLOCK.lots.length;
  const advance = (newWins, newSpent) => {
    if (last) { onDone(newWins); return; }
    setIdx(idx + 1); setReveal(null);
  };
  const place = () => {
    const won = bid > lot.rival && bid <= remaining;
    const equity = lot.worth - bid;
    setReveal({ won, bid });
    if (won) { setWins([...wins, { id: lot.id, bid, equity }]); setSpent(spent + bid); }
  };
  const pass = () => { setReveal({ won: false, bid: null, passed: true }); };

  const equityNow = wins.reduce((s, w) => s + w.equity, 0);

  return (
    <ET2Shell label="Sim Block Auction">
      <div style={{ padding: '14px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <ET2Mono color={ET2P.lime} size={10}>Courthouse steps · Lot {idx + 1} of {BLOCK.lots.length}</ET2Mono>
        <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.text }}>{blockFmtK(remaining)} LEFT</span>
      </div>
      <ET2Progress percent={(idx / BLOCK.lots.length) * 100} />

      <div key={lot.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 8px' }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 16px 10px' }}>
            <ET2Puffy type={lot.icon} hue="slate" size={46} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.015em' }}>{lot.addr}</div>
              <div style={{ fontFamily: ET2_MONO, fontSize: 10, color: ET2P.muted, marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{lot.desc}</div>
            </div>
          </div>
          <SimSpecRow k="Opening price" v={sim$(lot.list)} />
          <SimSpecRow k="Worth to you" v={sim$(lot.worth)} accent={ET2P.lime} />
          <div style={{ padding: '12px 16px', fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)' }}>{lot.intel}</div>
        </div>

        {!reveal ? (
          <div style={{ marginTop: 14, border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <ET2Mono size={9.5}>Your sealed bid</ET2Mono>
              <span style={{ fontFamily: ET2_MONO, fontSize: 17, fontWeight: 700, color: bid > lot.worth ? ET2P.red : ET2P.lime }}>{sim$(bid)}</span>
            </div>
            <input type="range" min={lot.list} max={maxBid} step={1000} value={bid}
              onChange={(e) => setBid(Number(e.target.value))}
              style={{ width: '100%', accentColor: bid > lot.worth ? ET2P.red : ET2P.lime }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: ET2_MONO, fontSize: 9.5, color: ET2P.muted }}>{blockFmtK(lot.list)}</span>
              <span style={{ fontFamily: ET2_MONO, fontSize: 9.5, color: bid > lot.worth ? ET2P.red : ET2P.muted }}>
                {bid > lot.worth ? 'ABOVE YOUR NUMBER' : `equity if won: ${blockFmtK(lot.worth - bid)}`}
              </span>
              <span style={{ fontFamily: ET2_MONO, fontSize: 9.5, color: ET2P.muted }}>{blockFmtK(maxBid)}</span>
            </div>
          </div>
        ) : (
          <div className="et2-fade" style={{ marginTop: 14, borderRadius: 16, padding: '14px 16px',
            background: ET2P.surface,
            border: `1px solid ${reveal.won ? `${ET2P.lime}66` : `${ET2P.line2}`}` }}>
            <div style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
              color: reveal.won ? ET2P.lime : ET2P.muted, marginBottom: 6 }}>
              {reveal.passed ? 'PASSED' : reveal.won ? 'WON' : 'OUTBID'}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)' }}>
              Rival&rsquo;s top bid: <span style={{ fontFamily: ET2_MONO, fontWeight: 700 }}>{sim$(lot.rival)}</span>.{' '}
              {reveal.passed
                ? (lot.rival > lot.worth ? 'They overpaid. Walking away was the win.' : `It went for under worth — ${blockFmtK(lot.worth - lot.rival)} of equity walked away with them.`)
                : reveal.won
                  ? (lot.worth - reveal.bid >= 0 ? `You created ${blockFmtK(lot.worth - reveal.bid)} in equity at the table.` : `You won — and paid ${blockFmtK(reveal.bid - lot.worth)} above your own number.`)
                  : (lot.rival > lot.worth ? 'They paid above worth. Losing that one was free money saved.' : 'They got it under worth. It stings because it should.')}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, padding: '0 4px' }}>
          <span style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: ET2P.muted }}>EQUITY CREATED</span>
          <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: equityNow >= 0 ? ET2P.lime : ET2P.red }}>{simSigned(equityNow)}</span>
        </div>
      </div>

      {!reveal ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 12, padding: '10px 22px 22px', flexShrink: 0 }}>
          <button onClick={pass} style={{ appearance: 'none', cursor: 'pointer',
            height: 56, borderRadius: 999, border: `2px solid ${ET2P.line2}`, background: 'transparent', color: ET2P.text,
            fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>Pass</button>
          <button onClick={place} style={{ appearance: 'none', cursor: 'pointer',
            height: 56, borderRadius: 999, border: 0, background: ET2P.lime, color: ET2P.ink,
            fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>Place sealed bid</button>
        </div>
      ) : (
        <ET2Cta label={last ? 'Final tally' : 'Next lot'} color="blue" onClick={() => advance()} />
      )}
    </ET2Shell>
  );
}

function ET2BlockSim({ onBack, onComplete }) {
  const [phase, setPhase] = React.useState('brief');
  const [wins, setWins] = React.useState([]);

  if (phase === 'brief') return <BlockBrief onBack={onBack} onStart={() => setPhase('play')} />;
  if (phase === 'play') return <BlockAuction onDone={(w) => { setWins(w); setPhase('results'); }} />;

  const equity = wins.reduce((s, w) => s + w.equity, 0);
  const spent = wins.reduce((s, w) => s + w.bid, 0);
  let g = BLOCK.grades.find((x) => equity >= x.min);
  let line = g.line;
  if (wins.length === 0) { g = { ...g, g: 'C' }; line = BLOCK.zeroLine; }
  return <ET2SimResults
    label="Sim Block Results"
    eyebrow="The block, settled"
    title={wins.length ? `${wins.length} of 5 lots are yours.` : 'You bought nothing.'}
    grade={g.g}
    line={line}
    rows={[
      { k: 'Lots won', v: `${wins.length} / 5`, accent: ET2P.text },
      { k: 'Capital deployed', v: sim$(spent), accent: ET2P.text },
      { k: 'Equity created', v: simSigned(equity), accent: equity > 0 ? ET2P.lime : ET2P.red },
      ...wins.map((w) => {
        const lot = BLOCK.lots.find((l) => l.id === w.id);
        return { k: lot.addr, v: `${sim$(w.bid)} · ${w.equity >= 0 ? '+' : '\u2212'}${blockFmtK(Math.abs(w.equity)).slice(1)} equity`, accent: w.equity >= 0 ? ET2P.lime : ET2P.red };
      }),
    ]}
    onRetry={() => { setWins([]); setPhase('play'); }}
    onCollect={() => onComplete({ grade: g.g, xp: SIM_XP[g.g], line })} />;
}

Object.assign(window, { ET2BlockSim });
