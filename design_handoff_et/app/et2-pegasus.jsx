// et2-pegasus.jsx — Pegasus, the ET AI coach. Branded chat surface.
// Lo-fi mono data aesthetic + lime. Semi-interactive: canned but real-feeling.

// Inject the Pegasus-mark keyframes once (shared by every instance).
(function ensurePegMoonStyles() {
  if (typeof document === 'undefined' || document.getElementById('peg-moon-styles')) return;
  const s = document.createElement('style');
  s.id = 'peg-moon-styles';
  s.textContent = `
    @keyframes pegMoonSwirl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pegMoonCorona { 0%,100% { transform: scale(1); opacity:.5; } 50% { transform: scale(1.085); opacity:.78; } }
    @keyframes pegMoonGlow {
      0%,100% { filter: drop-shadow(0 0 var(--g1) rgba(127,176,255,.5)) drop-shadow(0 0 var(--g2) rgba(30,91,255,.32)); }
      50%     { filter: drop-shadow(0 0 var(--g1b) rgba(127,176,255,.72)) drop-shadow(0 0 var(--g2b) rgba(30,91,255,.46)); }
    }
    .pegMoonSvg  { overflow: visible; animation: pegMoonGlow 7.5s ease-in-out infinite; }
    .pegMoonSwirl{ transform-box: view-box; transform-origin: 100px 100px; animation: pegMoonSwirl 46s linear infinite; }
    .pegMoonCorona{ transform-box: fill-box; transform-origin: center; animation: pegMoonCorona 9.5s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .pegMoonSvg { animation: none; filter: drop-shadow(0 0 var(--g1b) rgba(127,176,255,.6)); }
      .pegMoonSwirl, .pegMoonCorona { animation: none; }
    }`;
  document.head.appendChild(s);
})();

function PegasusMark({ size = 24, color }) {
  // Radiant blue "Eddy" moon (Moon Studio #11): a white→blue disc with slow
  // caustic light turning inside it and a breathing outward glow.
  const rawId = React.useId ? React.useId() : 'm' + Math.random().toString(36).slice(2, 8);
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const glow = {
    '--g1': `${size * 0.10}px`, '--g2': `${size * 0.25}px`,
    '--g1b': `${size * 0.16}px`, '--g2b': `${size * 0.40}px`,
  };
  return (
    <svg className="pegMoonSvg" style={glow} width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <radialGradient id={`pmBody-${uid}`} cx="46%" cy="40%" r="68%">
          <stop offset="0%" stopColor="#ffffff"></stop>
          <stop offset="32%" stopColor="#dcebff"></stop>
          <stop offset="66%" stopColor="#6ea3ff"></stop>
          <stop offset="100%" stopColor="#27579f"></stop>
        </radialGradient>
        <radialGradient id={`pmRim-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="74%" stopColor="#ffffff" stopOpacity="0"></stop>
          <stop offset="100%" stopColor="#cfe2ff" stopOpacity="0.82"></stop>
        </radialGradient>
        <filter id={`pmCaus-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="5" stitchTiles="stitch" result="t">
            <animate attributeName="baseFrequency" dur="20s" values="0.014;0.02;0.014" repeatCount="indefinite"></animate>
          </feTurbulence>
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.5 -0.82" result="c"></feColorMatrix>
          <feGaussianBlur in="c" stdDeviation="0.7"></feGaussianBlur>
        </filter>
        <clipPath id={`pmClip-${uid}`}><circle cx="100" cy="100" r="78"></circle></clipPath>
      </defs>
      <circle className="pegMoonCorona" cx="100" cy="100" r="84" fill="#6ea3ff" style={{ filter: 'blur(20px)' }} opacity="0.5"></circle>
      <g clipPath={`url(#pmClip-${uid})`}>
        <circle cx="100" cy="100" r="78" fill={`url(#pmBody-${uid})`}></circle>
        <g className="pegMoonSwirl"><rect x="20" y="20" width="160" height="160" filter={`url(#pmCaus-${uid})`} opacity="0.72" style={{ mixBlendMode: 'screen' }}></rect></g>
        <ellipse cx="84" cy="68" rx="32" ry="24" fill="#ffffff" opacity="0.3" style={{ filter: 'blur(13px)' }}></ellipse>
      </g>
      <circle cx="100" cy="100" r="78" fill={`url(#pmRim-${uid})`}></circle>
    </svg>
  );
}

const PEG_PROMPTS = [
  { id: 'dscr', chip: 'Explain DSCR like I\u2019m new',
    a: ['DSCR = Net Operating Income \u00f7 annual debt payments.', 'At 1.0 the property exactly covers its mortgage. Lenders usually want 1.20+ \u2014 a 20% cushion.', 'Quick gut check: if a place barely cash-flows on paper, the bank sees the same thing you do.'] },
  { id: 'flip', chip: 'Is a $170k flip on a $300k ARV good?',
    a: ['Run the 70% rule: 0.70 \u00d7 $300k = $210k, minus rehab.', 'If your rehab is ~$40k, your max buy is $170k \u2014 so $170k is the *ceiling*, not a deal yet.', 'You want to be UNDER that. At $150k with $40k rehab, you\u2019ve got real margin for holding + selling costs.'] },
  { id: 'buybox', chip: 'Help me tighten my buy box',
    a: ['Five dials: market, property type, price band, condition, and min rent-to-price.', 'Tell me your market and capital and I\u2019ll suggest a band. Discipline here is what kills bad deals before they cost you.'] },
  { id: 'spot', chip: 'What\u2019s a motivated-seller signal?',
    a: ['90+ days on market, price cuts, \u201cas-is,\u201d vacant units, or out-of-state owners.', 'Each one means the seller values speed over top dollar \u2014 which is exactly what you\u2019re selling as a buyer.'] },
];

const PEG_FALLBACK = ['Good question. Here\u2019s the investor\u2019s lens:', 'Anchor every decision to a number \u2014 the 1% rule to filter, DSCR to finance, the 70% rule to flip. If the math doesn\u2019t clear the bar, the answer is no, and that\u2019s a win.', 'Want me to walk a specific deal through it?'];

function PegBubble({ from, lines, fresh }) {
  const me = from === 'me';
  return (
    <div className={fresh ? 'et2-fade' : ''} style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {(Array.isArray(lines) ? lines : [lines]).map((l, i) => (
          <div key={i} style={{
            background: me ? ET2P.lime : ET2P.surface,
            color: me ? ET2P.ink : ET2P.text,
            border: me ? 0 : `1px solid ${ET2P.line}`,
            borderRadius: 16, borderTopRightRadius: me && i === 0 ? 5 : 16, borderTopLeftRadius: !me && i === 0 ? 5 : 16,
            padding: '11px 14px', fontSize: 14.5, fontWeight: me ? 600 : 500, lineHeight: 1.45, textWrap: 'pretty' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function ET2PegasusScreen({ onTab, onProfile }) {
  const [thread, setThread] = React.useState([
    { from: 'peg', lines: ['I\u2019m Pegasus \u2014 your deal coach. Ask me anything about a property, a number, or a lesson.'] },
  ]);
  const [typing, setTyping] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [used, setUsed] = React.useState([]);
  const scrollRef = React.useRef(null);
  const tRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(tRef.current), []);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [thread, typing]);

  const ask = (userText, answer) => {
    setThread((t) => [...t, { from: 'me', lines: [userText], fresh: true }]);
    setTyping(true);
    tRef.current = setTimeout(() => {
      setTyping(false);
      setThread((t) => [...t, { from: 'peg', lines: answer, fresh: true }]);
    }, 950);
  };
  const tapPrompt = (p) => { setUsed((u) => [...u, p.id]); ask(p.chip, p.a); };
  const send = () => { const v = draft.trim(); if (!v) return; setDraft(''); ask(v, PEG_FALLBACK); };

  const open = PEG_PROMPTS.filter((p) => !used.includes(p.id));

  return (
    <ET2Shell bg="radial-gradient(125% 80% at 50% -8%, #08101f 0%, #000 58%)" label="Pegasus">
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px 14px', flexShrink: 0, borderBottom: `1px solid ${ET2P.line}` }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: ET2P.surface, border: `1px solid ${ET2P.line2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <PegasusMark size={28} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em' }}>Pegasus</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: ET2P.lime }}></span>
            <span style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ET2P.muted }}>Deal coach · online</span>
          </div>
        </div>
        <button onClick={onProfile} aria-label="Profile" style={{ appearance: 'none', cursor: 'pointer', border: 0,
          width: 40, height: 40, borderRadius: '50%', background: ET2P.surface2, color: ET2P.lime, flexShrink: 0,
          fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700 }}>AC</button>
      </div>

      {/* thread */}
      <div ref={scrollRef} className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 18px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {thread.map((m, i) => <PegBubble key={i} from={m.from} lines={m.lines} fresh={m.fresh} />)}
        {typing && (
          <div className="et2-fade" style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: ET2P.surface, border: `1px solid ${ET2P.line}`, borderRadius: 16, borderTopLeftRadius: 5, padding: '13px 16px', display: 'flex', gap: 5 }}>
              {[0, 1, 2].map((d) => <span key={d} className="peg-dot" style={{ animationDelay: `${d * 0.15}s`, width: 7, height: 7, borderRadius: '50%', background: ET2P.muted, display: 'inline-block' }}></span>)}
            </div>
          </div>
        )}
      </div>

      {/* suggestion chips */}
      {open.length > 0 && !typing && (
        <div className="et-scroll" style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '6px 18px 10px', overflowX: 'auto' }}>
          {open.map((p) => (
            <button key={p.id} onClick={() => tapPrompt(p)} style={{
              appearance: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              border: `1px solid ${ET2P.line2}`, borderRadius: 999, padding: '9px 14px', background: ET2P.surface,
              color: ET2P.text, fontSize: 12.5, fontWeight: 600 }}>{p.chip}</button>
          ))}
        </div>
      )}

      {/* composer */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 10, alignItems: 'center', padding: '8px 16px 14px', marginBottom: 72, borderTop: `1px solid ${ET2P.line}`, background: '#000' }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ask Pegasus about a deal…" style={{
            flex: 1, appearance: 'none', background: ET2P.surface, border: `1px solid ${ET2P.line2}`,
            borderRadius: 999, padding: '13px 18px', color: ET2P.text, fontFamily: ET2_FONT, fontSize: 14.5, outline: 'none' }} />
        <button onClick={send} aria-label="Send" style={{ appearance: 'none', cursor: 'pointer', border: 0, flexShrink: 0,
          width: 46, height: 46, borderRadius: '50%', background: ET2P.lime, color: ET2P.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </button>
      </div>

      <TabBar palette={ET2_HOME_PALETTE} current="pegasus" tabs={ET2_TABS} onJump={onTab} />
    </ET2Shell>
  );
}

Object.assign(window, { ET2PegasusScreen, PegasusMark });
