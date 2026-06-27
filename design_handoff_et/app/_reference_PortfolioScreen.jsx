// et-reel-screens.jsx — faithful ET app screen recreations for the reel.
// Built at the phone's native 412px width so they match the shipping UI.
// Each screen takes animation-driving props (no internal timeline).
// Relies on globals from et2-ui.jsx / et2-pegasus.jsx: ET2P, ET2Puffy,
// ET2CapTile, ET2_SKINS, PegasusMark, ET2_MONO/FONT — and the reel kit.

const RFONT = "'Inter Tight', system-ui, sans-serif";
const RMONO = "'JetBrains Mono', monospace";
const money = (n) => `$${Math.round(n).toLocaleString()}`;

// ════════════════ JOURNEY MAP ════════════════
const MAP_STOPS = [
  { n: 1, icon: 'coins',      title: 'The 1% Rule',     x: 100, y: 600 },
  { n: 2, icon: 'house',      title: 'Read a Listing',  x: 286, y: 478 },
  { n: 3, icon: 'bank',       title: 'Finance the Deal', x: 118, y: 350 },
  { n: 4, icon: 'apartments', title: 'Make the Offer',  x: 292, y: 226 },
  { n: 5, icon: 'trophy',     title: 'Close It',        x: 168, y: 100 },
];
const MAP_VBW = 394, MAP_VBH = 700;

function MapNode({ state, size = 34 }) {
  const isDone = state === 'done', isCur = state === 'current';
  const bg = isDone ? VID.blue : isCur ? VID.blue : VID.surface;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg,
      border: state === 'locked' ? `1px solid ${VID.line2}` : 0,
      boxShadow: isDone ? `0 2px 10px ${VID.blue}88` : isCur ? `0 0 20px ${VID.blue}` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isDone && <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      {isCur && <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>}
      {state === 'locked' && <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="1.6" stroke={VID.muted} strokeWidth="1.8"/><path d="M8 11V8a4 4 0 018 0v3" stroke={VID.muted} strokeWidth="1.8" strokeLinecap="round"/></svg>}
    </div>
  );
}

// appear: float 0..5 (nodes revealed, with pop). doneCount: settled done stops.
// pathLit: 0..1 fraction of the lit (done) path drawn. focusCur: 0..1 glow pulse.
function MapScreen({ appear = 5, doneCount = 2, pathLit = 1, focusCur = 1, progressPct }) {
  const skin = ET2_SKINS.duo;
  const pct = progressPct != null ? progressPct : (doneCount / 5) * 100;
  const litSegs = doneCount; // segments before/at current that are "done→current"
  return (
    <div data-screen-label="Journey Map" style={{ width: '100%', height: '100%',
      background: 'radial-gradient(125% 85% at 70% -8%, #07090c 0%, #000 55%)', color: '#fff',
      fontFamily: RFONT, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: VID.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 6l-6 6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex: 1, paddingTop: 1 }}>
          <div style={{ fontFamily: RMONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: VID.blue, marginBottom: 6 }}>Module 01 · Your First Deal</div>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.02 }}>Your Journey</div>
        </div>
        <div style={{ fontFamily: RMONO, fontSize: 13, fontWeight: 700, color: VID.muted, paddingTop: 8 }}>{doneCount}/5</div>
      </div>
      {/* progress */}
      <div style={{ padding: '18px 24px 0', flexShrink: 0 }}>
        <div style={{ height: 5, background: VID.surface, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: VID.blue, borderRadius: 999 }} />
        </div>
      </div>
      {/* map */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${MAP_VBW} ${MAP_VBH}`} preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {[[0, 1], [1, 2], [2, 3], [3, 4]].map(([a, b], i) => {
            const A = MAP_STOPS[a], B = MAP_STOPS[b];
            const lit = i < litSegs;
            const segP = lit ? clampn((pathLit * litSegs) - i, 0, 1) : 0;
            const len = Math.hypot(B.x - A.x, B.y - A.y);
            return (
              <g key={i}>
                <line x1={A.x} y1={A.y + 6} x2={B.x} y2={B.y + 6} stroke={skin.pathLocked} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 13" />
                {lit && <line x1={A.x} y1={A.y + 6} x2={B.x} y2={B.y + 6} stroke={VID.blue} strokeWidth="4" strokeLinecap="round"
                  strokeOpacity="0.6" strokeDasharray={len} strokeDashoffset={len * (1 - segP)} />}
              </g>
            );
          })}
        </svg>
        {MAP_STOPS.map((s, i) => {
          const state = i < doneCount ? 'done' : i === doneCount ? 'current' : 'locked';
          const isCur = state === 'current';
          const pop = easeBack(clampn(appear - i, 0, 1));
          if (pop <= 0) return null;
          const hue = state === 'done' ? 'lime' : state === 'current' ? 'blue' : 'slate';
          const eColor = isCur ? VID.blue : state === 'locked' ? VID.muted : VID.blue;
          const eyebrow = isCur ? 'IN PROGRESS' : state === 'locked' ? 'LOCKED' : `STOP ${s.n}`;
          const glow = isCur ? 0.5 + 0.5 * focusCur : 0;
          return (
            <div key={s.n} style={{ position: 'absolute', left: `${(s.x / MAP_VBW) * 100}%`, top: `${(s.y / MAP_VBH) * 100}%`,
              transform: `translate(-50%,-50%) scale(${pop})`, opacity: clampn(pop, 0, 1), width: 170,
              display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: isCur ? 6 : 2 }}>
              <div style={{ position: 'relative', opacity: state === 'locked' ? 0.62 : 1,
                filter: isCur ? `drop-shadow(0 0 ${22 * glow}px ${VID.blue})` : 'none' }}>
                <ET2CapTile state={state} isCurrent={isCur} skin={skin} big>
                  <ET2Puffy type={s.icon} hue={hue} size={isCur ? 60 : 52} />
                </ET2CapTile>
                <div style={{ position: 'absolute', right: -6, top: -6, zIndex: 4 }}><MapNode state={state} size={isCur ? 36 : 30} /></div>
              </div>
              <div style={{ marginTop: 14, textAlign: 'center', maxWidth: 150 }}>
                <div style={{ fontFamily: RMONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: eColor, marginBottom: 5 }}>{eyebrow}</div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2,
                  color: state === 'locked' ? VID.muted : '#fff' }}>{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════ PEGASUS CHAT ════════════════
function PegBubble({ from, lines, grow = 1 }) {
  const me = from === 'me';
  return (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start',
      transform: `translateY(${(1 - grow) * 14}px)`, opacity: clampn(grow, 0, 1) }}>
      <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ background: me ? VID.blue : VID.surface, color: me ? '#fff' : '#fff',
            border: me ? 0 : `1px solid ${VID.line}`, borderRadius: 18,
            borderTopRightRadius: me && i === 0 ? 6 : 18, borderTopLeftRadius: !me && i === 0 ? 6 : 18,
            padding: '13px 17px', fontSize: 17, fontWeight: me ? 600 : 500, lineHeight: 1.45 }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

// messages: [{from, lines, grow}]; typing: bool; dotsT for animating dots
function PegasusScreen({ messages = [], typing = false, dotsT = 0 }) {
  return (
    <div data-screen-label="Pegasus" style={{ width: '100%', height: '100%',
      background: 'radial-gradient(125% 80% at 50% -8%, #08101f 0%, #000 58%)', color: '#fff',
      fontFamily: RFONT, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px 16px', flexShrink: 0, borderBottom: `1px solid ${VID.line}` }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: VID.surface, border: `1px solid ${VID.line2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PegasusMark size={36} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.01em' }}>Pegasus</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: VID.green }} />
            <span style={{ fontFamily: RMONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: VID.muted }}>Deal coach · online</span>
          </div>
        </div>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: VID.surface2, color: VID.blue,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: RMONO, fontSize: 14, fontWeight: 700 }}>AC</div>
      </div>
      {/* thread */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '22px 20px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 13 }}>
        {messages.map((m, i) => <PegBubble key={i} from={m.from} lines={m.lines} grow={m.grow} />)}
        {typing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: VID.surface, border: `1px solid ${VID.line}`, borderRadius: 18, borderTopLeftRadius: 6, padding: '16px 18px', display: 'flex', gap: 6 }}>
              {[0, 1, 2].map((d) => {
                const ph = (dotsT * 2.2 - d * 0.32);
                const up = Math.max(0, Math.sin(ph * Math.PI * 2));
                return <span key={d} style={{ width: 9, height: 9, borderRadius: '50%', background: VID.muted, transform: `translateY(${-up * 5}px)`, opacity: 0.5 + up * 0.5 }} />;
              })}
            </div>
          </div>
        )}
      </div>
      {/* chips */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 9, padding: '6px 20px 12px', overflow: 'hidden' }}>
        {['Explain DSCR like I’m new', 'Tighten my buy box'].map((c) => (
          <span key={c} style={{ whiteSpace: 'nowrap', border: `1px solid ${VID.line2}`, borderRadius: 999,
            padding: '11px 16px', background: VID.surface, color: '#fff', fontSize: 14, fontWeight: 600 }}>{c}</span>
        ))}
      </div>
      {/* composer */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 12, alignItems: 'center', padding: '10px 18px 22px', borderTop: `1px solid ${VID.line}`, background: '#000' }}>
        <div style={{ flex: 1, background: VID.surface, border: `1px solid ${VID.line2}`, borderRadius: 999,
          padding: '15px 20px', color: VID.muted, fontSize: 16 }}>Ask Pegasus about a deal…</div>
        <div style={{ width: 50, height: 50, borderRadius: '50%', background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>
    </div>
  );
}

// ════════════════ DEAL SPOTTER (sim) ════════════════
const SPOT_LISTINGS = [
  { addr: '1208 Vinton Ave', type: 'Single-family · 3BR', price: 415000, rent: 2300, dom: 4, tags: ['Staged photos', 'Fresh listing'],
    note: 'Gorgeous renovation, designer finishes. Open house Saturday.', icon: 'house', grade: 'F' },
  { addr: '55 Harbor Town Sq', type: 'Condo · 2BR', price: 510000, rent: 2900, dom: 31, tags: ['Waterfront', 'HOA $410/mo'],
    note: 'River views, resort amenities. The lifestyle pitch writes itself.', icon: 'bank', grade: 'F' },
  { addr: '884 Maple Cove', type: 'Duplex · 2×2BR', price: 232000, rent: 2450, dom: 12, tags: ['Both units rented'],
    note: 'Clean duplex with long-term tenants. Priced at market.', icon: 'apartments', grade: 'B' },
  { addr: '2917 Barron Ave', type: 'Duplex · 2×2BR', price: 189000, rent: 2150, dom: 124, tags: ['Estate sale', 'As-is', 'Vacant', '2 price cuts'],
    note: 'Inherited by out-of-state heirs. Tired but structurally sound.', icon: 'apartments', grade: 'S' },
];

function SpotterScreen({ index = 0, timeLeft = 60, picked = 0, total = 4 }) {
  const L = SPOT_LISTINGS[clampn(index, 0, SPOT_LISTINGS.length - 1)];
  const danger = timeLeft < 15;
  const pct = Math.max(0, (timeLeft / 60) * 100);
  return (
    <div data-screen-label="Deal Spotter" style={{ width: '100%', height: '100%', background: '#000', color: '#fff', fontFamily: RFONT, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '18px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <span style={{ fontFamily: RMONO, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: VID.blue, whiteSpace: 'nowrap' }}>New on market · {index + 1} of 5</span>
        <span style={{ fontFamily: RMONO, fontSize: 19, fontWeight: 700, color: danger ? VID.red : '#fff' }}>0:{String(Math.max(0, Math.ceil(timeLeft))).padStart(2, '0')}</span>
      </div>
      <div style={{ padding: '12px 24px 0', flexShrink: 0 }}>
        <div style={{ height: 5, background: VID.surface, borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: danger ? VID.red : VID.blue, borderRadius: 999 }} />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 24px 8px' }}>
        <div style={{ border: `1px solid ${VID.line}`, borderRadius: 24, background: VID.surface, overflow: 'hidden' }}>
          <div style={{ padding: '20px 18px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ET2Puffy type={L.icon} hue="slate" size={52} />
              <div>
                <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.015em', whiteSpace: 'nowrap' }}>{L.addr}</div>
                <div style={{ fontFamily: RMONO, fontSize: 11, color: VID.muted, marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{L.type}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
              {L.tags.map((t) => (
                <span key={t} style={{ fontFamily: RMONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '6px 11px', borderRadius: 999, border: `1px solid ${VID.line2}`, color: 'rgba(255,255,255,0.75)' }}>{t}</span>
              ))}
            </div>
          </div>
          {[['Asking', money(L.price), '#fff'], ['Market rent', `${money(L.rent)} / mo`, '#fff'], ['Days on market', String(L.dom), L.dom > 60 ? VID.blue : VID.muted]].map(([k, v, c], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 18px', borderTop: `1px solid ${VID.line}` }}>
              <span style={{ fontFamily: RMONO, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: VID.muted }}>{k}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
          <div style={{ padding: '14px 18px', fontSize: 14.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.75)' }}>{L.note}</div>
        </div>
        <div style={{ position: 'relative', marginTop: 16, height: 56, borderRadius: 999, overflow: 'hidden',
          border: `2px solid ${VID.blue}`, background: picked > 0 ? VID.blue : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: picked > 0 ? '#fff' : VID.blue, zIndex: 2, whiteSpace: 'nowrap' }}>Make the offer: {L.addr.split(' ')[0]} {L.addr.split(' ')[1]}</span>
          {picked > 0 && picked < 1 && (
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 40, height: 40, borderRadius: '50%',
              transform: `translate(-50%,-50%) scale(${picked * 14})`, background: 'rgba(255,255,255,0.4)', opacity: 1 - picked }} />
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════ SIM RESULTS ════════════════
function ResultsScreen({ gradeIn = 1, xpProg = 1 }) {
  const xp = Math.round(200 * clampn(xpProg, 0, 1));
  const gs = easeBack(clampn(gradeIn, 0, 1));
  const score = 94;
  const arc = Math.round(score * 3.6 * clampn(gradeIn, 0, 1));
  return (
    <div data-screen-label="Sim Results" style={{ width: '100%', height: '100%', background: 'radial-gradient(120% 70% at 50% 0%, #0a1430 0%, #000 60%)', color: '#fff', fontFamily: RFONT, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ marginTop: 70, fontFamily: RMONO, fontSize: 13, fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: VID.blue }}>Simulator 01 · Cleared</div>
      <div style={{ marginTop: 36, width: 220, height: 220, borderRadius: '50%', position: 'relative',
        transform: `scale(${gs})`,
        background: `conic-gradient(${VID.blueLite} 0deg, ${VID.blue} ${arc}deg, ${VID.surface2} ${arc}deg 360deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 80px ${VID.blue}77` }}>
        <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: '#06080f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: RFONT, fontSize: 92, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{score}</span>
          <span style={{ fontFamily: RMONO, fontSize: 17, fontWeight: 700, color: VID.muted, letterSpacing: '0.1em', marginTop: 4 }}>/ 100</span>
        </div>
      </div>
      <div style={{ marginTop: 34, fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>Deal Spotter</div>
      <div style={{ marginTop: 10, padding: '0 40px', textAlign: 'center', fontFamily: SERIF, fontSize: 25, lineHeight: 1.3, color: 'rgba(255,255,255,0.82)' }}>
        “You smelled the motivated seller from across town. That’s the instinct.”
      </div>
      <div style={{ marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 999, background: VID.surface, border: `1px solid ${VID.line2}`, whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: RMONO, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: VID.muted }}>Earned</span>
        <span style={{ fontFamily: RFONT, fontSize: 30, fontWeight: 800, color: VID.blue, whiteSpace: 'nowrap' }}>+{xp} XP</span>
      </div>
    </div>
  );
}

// ════════════════ PEGASUS · DEAL ANALYSIS ════════════════
function UWRow({ k, sub, v, color, strong, show = 1 }) {
  const s = clampn(show, 0, 1);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '13px 0', borderTop: `1px solid ${VID.line}`, opacity: s, transform: `translateY(${(1 - s) * 8}px)` }}>
      <div>
        <div style={{ fontFamily: RMONO, fontSize: 12, letterSpacing: '0.07em', textTransform: 'uppercase', color: VID.muted }}>{k}</div>
        {sub && <div style={{ fontFamily: RMONO, fontSize: 10.5, color: VID.dim, marginTop: 4, letterSpacing: '0.04em' }}>{sub}</div>}
      </div>
      <div style={{ fontFamily: RFONT, fontSize: strong ? 23 : 18, fontWeight: strong ? 800 : 700, color: color || '#fff', whiteSpace: 'nowrap' }}>{v}</div>
    </div>
  );
}

// reveal 0..1 staggers the property card + each underwriting row + verdict.
function PegasusAnalysisScreen({ reveal = 1 }) {
  const step = (i) => clampn(reveal * 6.5 - i, 0, 1);
  const rows = [
    { k: 'After-repair value', sub: 'from 6 sold comps', v: '$300,000' },
    { k: 'Est. rehab', sub: 'scope + 10% contingency', v: '$30,000' },
    { k: '70% rule ceiling', sub: '0.70 × ARV − rehab', v: '$180,000', color: VID.blueLite, strong: true },
    { k: 'Asking', v: '$159,000' },
    { k: 'Margin under ceiling', v: '+$21,000', color: VID.green, strong: true },
  ];
  return (
    <div data-screen-label="Pegasus · Analysis" style={{ width: '100%', height: '100%',
      background: 'radial-gradient(125% 80% at 50% -8%, #08101f 0%, #000 58%)', color: '#fff',
      fontFamily: RFONT, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px 16px', flexShrink: 0, borderBottom: `1px solid ${VID.line}` }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: VID.surface, border: `1px solid ${VID.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PegasusMark size={36} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.01em' }}>Pegasus</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: VID.green }} />
            <span style={{ fontFamily: RMONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: VID.muted }}>Underwriting · live</span>
          </div>
        </div>
      </div>
      {/* body */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 20px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ maxWidth: '82%', background: VID.blue, borderRadius: 18, borderTopRightRadius: 6, padding: '13px 17px', fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>Underwrite 2917 Barron Ave for me.</div>
        </div>
        <div style={{ border: `1px solid ${VID.line2}`, borderRadius: 22, background: VID.surface, overflow: 'hidden',
          opacity: clampn(step(0), 0, 1), transform: `translateY(${(1 - step(0)) * 18}px)` }}>
          <div style={{ padding: '18px 20px 4px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <ET2Puffy type="apartments" hue="blue" size={46} />
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.015em' }}>2917 Barron Ave</div>
              <div style={{ fontFamily: RMONO, fontSize: 11, color: VID.muted, marginTop: 3, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Duplex · 2×2BR · Memphis, TN</div>
            </div>
          </div>
          <div style={{ padding: '6px 20px 16px' }}>
            {rows.map((r, i) => <UWRow key={i} {...r} show={step(i + 1)} />)}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 14,
              background: 'rgba(31,233,138,0.1)', border: '1px solid rgba(31,233,138,0.3)',
              opacity: clampn(step(6), 0, 1), transform: `translateY(${(1 - step(6)) * 8}px)` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={VID.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span style={{ fontFamily: RFONT, fontSize: 16, fontWeight: 700, color: '#fff' }}>Under the ceiling. Pursue this one.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════ PORTFOLIO ════════════════
function PortfolioScreen({ reveal = 1 }) {
  const step = (i) => clampn(reveal * 5 - i, 0, 1);
  const holdings = [
    { icon: 'apartments', addr: '1420 Marigold St', meta: 'Duplex · Rented', cf: '+$1,650/mo' },
    { icon: 'house', addr: '88 Crestline Ave', meta: 'SFH · BRRRR', cf: '+$1,150/mo' },
    { icon: 'bank', addr: '12 Harbor Walk #3', meta: 'Condo · STR', cf: '+$1,400/mo' },
  ];
  return (
    <div data-screen-label="Portfolio" style={{ width: '100%', height: '100%',
      background: 'radial-gradient(125% 80% at 50% -8%, #08101f 0%, #000 58%)', color: '#fff',
      fontFamily: RFONT, display: 'flex', flexDirection: 'column', padding: '24px 22px 18px' }}>
      <div style={{ fontFamily: RMONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: VID.blue }}>Your Portfolio</div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>3</span>
        <span style={{ fontSize: 18, color: VID.muted, fontWeight: 600 }}>doors owned</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
        {[['Equity', '$312.0K'], ['Portfolio value', '$985.0K']].map(([k, v], i) => (
          <div key={i} style={{ border: `1px solid ${VID.line}`, borderRadius: 16, background: VID.surface, padding: '14px 16px' }}>
            <div style={{ fontFamily: RMONO, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: VID.muted }}>{k}</div>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 5 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, border: '1px solid rgba(31,233,138,0.3)', borderRadius: 16, background: 'rgba(31,233,138,0.08)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: RMONO, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: VID.muted }}>Monthly cashflow</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: VID.green, letterSpacing: '-0.02em' }}>+$4.2K<span style={{ fontSize: 14, color: VID.muted, fontWeight: 600 }}>/mo</span></div>
        </div>
        <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>Passive. Paid whether you play Sunday or not.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Holdings</span>
        <span style={{ fontFamily: RMONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: VID.blue }}>ALL →</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {holdings.map((h, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, opacity: clampn(step(i + 1), 0, 1), transform: `translateY(${(1 - clampn(step(i + 1), 0, 1)) * 8}px)` }}>
            <ET2Puffy type={h.icon} hue="slate" size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>{h.addr}</div>
              <div style={{ fontFamily: RMONO, fontSize: 10.5, color: VID.muted, marginTop: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h.meta}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: VID.green }}>{h.cf}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MapScreen, PegasusScreen, SpotterScreen, ResultsScreen, PegasusAnalysisScreen, UWRow, PortfolioScreen, SPOT_LISTINGS, money: window.money || money });
