// et2-sim-spotter.jsx — "DEAL SPOTTER" (Sim 01 · Spot the Opportunity).
// Five listings, 60 seconds, one offer. Find the real deal.

const SPOTTER = {
  seconds: 60,
  listings: [
    { id: 'vinton', addr: '1208 Vinton Ave', type: 'Single-family · 3BR', price: 415000, rent: 2300, dom: 4,
      tags: ['Staged photos', 'Fresh listing'], note: 'Gorgeous renovation, designer finishes. Open house Saturday — agent expects multiple offers.',
      verdict: { g: 'F', why: 'Rent is 0.55% of price — half the 1% bar. A beautiful liability.' } },
    { id: 'maple', addr: '884 Maple Cove', type: 'Duplex · 2×2BR', price: 232000, rent: 2450, dom: 12,
      tags: ['Both units rented'], note: 'Clean duplex with long-term tenants. Priced at market, seller in no hurry.',
      verdict: { g: 'B', why: '1.06% — a deal. But full price and zero seller motivation means thin upside.' } },
    { id: 'barron', addr: '2917 Barron Ave', type: 'Duplex · 2×2BR', price: 189000, rent: 2150, dom: 124,
      tags: ['Estate sale', 'As-is', 'Vacant', '2 price cuts'], note: 'Inherited by out-of-state heirs. Tired but structurally sound — needs paint and patience.',
      verdict: { g: 'S', why: '1.14% ratio, 124 days on market, estate sale, vacant, two cuts. Every motivated-seller fingerprint at once.' } },
    { id: 'harbor', addr: '55 Harbor Town Sq', type: 'Condo · 2BR', price: 510000, rent: 2900, dom: 31,
      tags: ['Waterfront', 'HOA $410/mo'], note: 'River views, resort amenities. The lifestyle pitch writes itself.',
      verdict: { g: 'F', why: '0.57% before the $410 HOA even hits. Lifestyle for you, losses for your portfolio.' } },
    { id: 'givens', addr: '3402 Givens Ave', type: 'Single-family · 2BR', price: 145000, rent: 1250, dom: 89,
      tags: ['Price cut', 'Foundation issues'], note: 'Cheapest house on the street. Inspector flagged significant foundation movement.',
      verdict: { g: 'C', why: 'Cheap isn\u2019t the same as a deal — 0.86% and a structural repair of unknown depth. That\u2019s a gamble, not a gap.' } },
  ],
  grade(pickId, timeLeft) {
    if (!pickId) return { g: 'F', line: 'The clock beat you. In a hot market, hesitation is a decision too.' };
    if (pickId === 'barron') return timeLeft >= 20
      ? { g: 'S', line: 'You smelled the motivated seller from across town. That\u2019s the instinct.' }
      : { g: 'A', line: 'Right deal. Cut it close — but right is right.' };
    if (pickId === 'maple') return { g: 'B', line: 'A solid pick — but you paid retail while the estate sale sat there waving at you.' };
    if (pickId === 'givens') return { g: 'C', line: 'You found cheap, not value. Foundations eat profits whole.' };
    return { g: 'F', line: 'You bought the pretty trap. Price is what you pay — you forgot the rest.' };
  },
};

function SpotterBrief({ onBack, onStart }) {
  return (
    <ET2Shell label="Sim Spotter Brief">
      <ET2Header onBack={onBack} eyebrow="Simulator 01" eyebrowColor={ET2P.lime} title="Deal Spotter" sub="Five listings. Sixty seconds. One offer." />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '22px 22px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden', padding: '18px 0 0' }}>
          <div style={{ fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, padding: '0 16px', marginBottom: 4 }}>THE ASSIGNMENT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px 6px' }}>
            <ET2Puffy type="house" hue="lime" size={54} />
            <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>Saturday morning, the MLS refreshes. Five new listings. Every other buyer in Memphis is looking at the same screen.</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <SimSpecRow k="Listings" v="5" />
            <SimSpecRow k="Clock" v="60 seconds" accent={ET2P.red} />
            <SimSpecRow k="Offers" v="1 — no take-backs" accent={ET2P.lime} />
          </div>
        </div>
        <SimCallout>
          <span style={{ fontWeight: 700 }}>Remember:</span> rent ÷ price ≥ 1% deserves a look. Motivated sellers leave fingerprints — days on market, price cuts, vacancies, estates.
        </SimCallout>
      </div>
      <ET2Cta label="Refresh the MLS" onClick={onStart} />
    </ET2Shell>
  );
}

function SpotterPlay({ onPick, onTimeout }) {
  const [idx, setIdx] = React.useState(0);
  const [left, setLeft] = React.useState(SPOTTER.seconds);
  const L = SPOTTER.listings[idx];

  React.useEffect(() => {
    const t = setInterval(() => setLeft((s) => s - 0.1), 100);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => { if (left <= 0) onTimeout(); }, [left <= 0]);

  const pct = Math.max(0, (left / SPOTTER.seconds) * 100);
  const danger = left < 15;

  return (
    <ET2Shell label="Sim Spotter Play">
      <div style={{ padding: '14px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <ET2Mono color={ET2P.lime} size={10}>New on market · {idx + 1} of {SPOTTER.listings.length}</ET2Mono>
        <span style={{ fontFamily: ET2_MONO, fontSize: 15, fontWeight: 700, color: danger ? ET2P.red : ET2P.text }}>
          0:{String(Math.max(0, Math.ceil(left))).padStart(2, '0')}
        </span>
      </div>
      <div style={{ padding: '10px 22px 0', flexShrink: 0 }}>
        <div style={{ height: 4, background: ET2P.surface, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: danger ? ET2P.red : ET2P.lime, borderRadius: 999 }}></div>
        </div>
      </div>

      <div key={L.id} className="et-scroll et2-fade" style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 8px' }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          <div style={{ padding: '18px 16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <ET2Puffy type={L.type.startsWith('Duplex') ? 'apartments' : L.type.startsWith('Condo') ? 'bank' : 'house'} hue="slate" size={46} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.015em' }}>{L.addr}</div>
                <div style={{ fontFamily: ET2_MONO, fontSize: 10, color: ET2P.muted, marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{L.type}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {L.tags.map((t) => (
                <span key={t} style={{ fontFamily: ET2_MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '5px 9px', borderRadius: 999, border: `1px solid ${ET2P.line2}`, color: 'rgba(255,255,255,0.75)' }}>{t}</span>
              ))}
            </div>
          </div>
          <SimSpecRow k="Asking" v={sim$(L.price)} accent={ET2P.text} />
          <SimSpecRow k="Market rent" v={`${sim$(L.rent)} / mo`} accent={ET2P.text} />
          <SimSpecRow k="Days on market" v={String(L.dom)} accent={L.dom > 60 ? ET2P.lime : ET2P.muted} />
          <div style={{ padding: '12px 16px', fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)' }}>{L.note}</div>
        </div>

        <button onClick={() => onPick(L.id, left)} style={{ appearance: 'none', cursor: 'pointer', width: '100%', marginTop: 14,
          height: 52, borderRadius: 999, border: `2px solid ${ET2P.lime}`, background: 'transparent', color: ET2P.lime,
          fontFamily: ET2_FONT, fontSize: 15, fontWeight: 700 }}>
          Make the offer — {L.addr}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px 20px', flexShrink: 0 }}>
        <ET2RoundBtn onClick={() => setIdx((idx + SPOTTER.listings.length - 1) % SPOTTER.listings.length)} label="Previous listing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </ET2RoundBtn>
        <div style={{ display: 'flex', gap: 7 }}>
          {SPOTTER.listings.map((_, i) => (
            <span key={i} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 999, transition: 'all .25s',
              background: i === idx ? ET2P.lime : ET2P.line2 }}></span>
          ))}
        </div>
        <ET2RoundBtn onClick={() => setIdx((idx + 1) % SPOTTER.listings.length)} label="Next listing">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </ET2RoundBtn>
      </div>
    </ET2Shell>
  );
}

function ET2SpotterSim({ onBack, onComplete }) {
  const [phase, setPhase] = React.useState('brief');
  const [pick, setPick] = React.useState(null);
  const [timeLeft, setTimeLeft] = React.useState(0);

  if (phase === 'brief') return <SpotterBrief onBack={onBack} onStart={() => setPhase('play')} />;
  if (phase === 'play') return <SpotterPlay
    onPick={(id, left) => { setPick(id); setTimeLeft(left); setPhase('results'); }}
    onTimeout={() => { setPick(null); setTimeLeft(0); setPhase('results'); }} />;

  const res = SPOTTER.grade(pick, timeLeft);
  const picked = SPOTTER.listings.find((l) => l.id === pick);
  const best = SPOTTER.listings.find((l) => l.id === 'barron');
  return <ET2SimResults
    label="Sim Spotter Results"
    eyebrow="MLS debrief"
    title={pick ? (pick === 'barron' ? 'Offer accepted.' : 'Offer made.') : 'Market closed.'}
    grade={res.g}
    line={res.line}
    rows={[
      { k: 'Your offer', v: picked ? picked.addr : '— none —', accent: picked ? ET2P.text : ET2P.red },
      ...(picked ? [{ k: 'Rent-to-price', v: `${((picked.rent / picked.price) * 100).toFixed(2)}%`, accent: picked.rent / picked.price >= 0.01 ? ET2P.lime : ET2P.red }] : []),
      ...(picked && picked.id !== 'barron' ? [{ k: 'The deal was', v: best.addr, accent: ET2P.lime }] : []),
      { k: 'The deal\u2019s ratio', v: `${((best.rent / best.price) * 100).toFixed(2)}% · 124 DOM`, accent: ET2P.lime },
      { k: 'Time left', v: `${Math.max(0, Math.ceil(timeLeft))}s`, accent: timeLeft >= 20 ? ET2P.lime : ET2P.muted },
    ]}
    onRetry={() => { setPick(null); setPhase('play'); }}
    onCollect={() => onComplete({ grade: res.g, xp: SIM_XP[res.g], line: res.line })} />;
}

Object.assign(window, { ET2SpotterSim });
