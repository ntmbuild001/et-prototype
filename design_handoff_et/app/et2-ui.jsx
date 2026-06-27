// et2-ui.jsx — shared UI kit for the connected ET app.
// Palette, phone frame, chrome (header/progress/CTA), puffy 3D icons, cap tiles.

const ET2P = {
  bg: '#000', surface: '#141414', surface2: '#1c1c1c',
  line: '#252525', line2: '#3a3a3a',
  text: '#fff', muted: '#8A8A8A',
  lime: '#1E5BFF', blue: '#1E5BFF', red: '#FF4D4D', ink: '#ffffff',
};
const ET2_FONT  = "'Inter Tight', -apple-system, system-ui, sans-serif";
const ET2_MONO  = "'JetBrains Mono', ui-monospace, monospace";
const ET2_SERIF = "'Instrument Serif', Georgia, serif";

let _et2id = 0;
function et2uid(p) { _et2id += 1; return `${p}${_et2id}`; }

// ── Rolled-back helpers ─────────────────────────────────────────────
// Design direction restored to the clean glossy system (no quotes, no
// stripes, no metadata lines). Helpers kept as no-ops so call sites are safe.
const ET2Q = (s) => s;

function ET2Stripes() { return null; }

function ET2Meta() { return null; }

// ── Entrance animations via WAAPI (capture-safe; CSS keyframes get frozen
//    by screenshot tooling). Classes: et2-fade, et2-screenfade, et2-pop.
const ET2_ANIM_SPECS = {
  'et2-fade':       { kf: [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], opts: { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' } },
  'et2-screenfade': { kf: [{ opacity: 0 }, { opacity: 1 }], opts: { duration: 280, easing: 'ease' } },
  'et2-pop':        { kf: [{ opacity: 0, transform: 'scale(.7) rotate(8deg)' }, { opacity: 1, transform: 'rotate(0deg) scale(1)' }], opts: { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' } },
};
(function et2AnimObserver() {
  if (window.__et2AnimObserver) return;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runOn = (el) => {
    if (reduced || !el.animate || el.dataset.et2Animated) return;
    for (const cls in ET2_ANIM_SPECS) {
      if (el.classList && el.classList.contains(cls)) {
        el.dataset.et2Animated = '1';
        try {
          const a = el.animate(ET2_ANIM_SPECS[cls].kf, ET2_ANIM_SPECS[cls].opts);
          // Safety: some embeds freeze the animation timeline — force the
          // end state via wall clock so content never sticks at opacity 0.
          setTimeout(() => { try { a.finish(); } catch (e) {} }, ET2_ANIM_SPECS[cls].opts.duration + 50);
        } catch (e) {}
        return;
      }
    }
  };
  const scan = (node) => {
    if (node.nodeType !== 1) return;
    runOn(node);
    if (node.querySelectorAll) node.querySelectorAll('.et2-fade, .et2-screenfade, .et2-pop').forEach(runOn);
  };
  const mo = new MutationObserver((muts) => {
    muts.forEach((m) => m.addedNodes && m.addedNodes.forEach(scan));
  });
  mo.observe(document.body, { childList: true, subtree: true });
  window.__et2AnimObserver = mo;
})();

// ── Puffy glossy icons (from locked map exploration) ─────────────
function ET2Puffy({ type, hue = 'lime', size = 54 }) {
  const ramps = {
    lime:  { lite: '#9dffce', base: '#1fe98a', dark: '#06b566', edge: '#04361f', acc: '#0a8f4f' },
    blue:  { lite: '#a9ccff', base: '#4d92ff', dark: '#2f6fe6', edge: '#0c1f3f', acc: '#1f57c0' },
    slate: { lite: '#cfd6df', base: '#8b95a3', dark: '#5e6877', edge: '#1c2128', acc: '#46505e' },
  };
  const c = ramps[hue] || ramps.lime;
  const gBody = et2uid('b'), gRoof = et2uid('r'), gHi = et2uid('h');
  const P = { width: size, height: size, viewBox: '0 0 64 64',
    style: { overflow: 'visible', filter: 'drop-shadow(0 4px 5px rgba(0,0,0,0.45))' } };
  const defs = (
    <defs>
      <linearGradient id={gBody} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.lite} /><stop offset="0.45" stopColor={c.base} /><stop offset="1" stopColor={c.dark} />
      </linearGradient>
      <linearGradient id={gRoof} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.base} /><stop offset="1" stopColor={c.acc} />
      </linearGradient>
      <radialGradient id={gHi} cx="0.35" cy="0.25" r="0.7">
        <stop offset="0" stopColor="#fff" stopOpacity="0.85" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.12" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
  const body = `url(#${gBody})`, roof = `url(#${gRoof})`;
  const edge = { stroke: c.edge, strokeWidth: 1, strokeOpacity: 0.5 };
  const hi = (x, y, w, h, rx) => <rect x={x} y={y} width={w} height={h} rx={rx} fill={`url(#${gHi})`} />;

  if (type === 'coins') return (
    <svg {...P}>{defs}
      <ellipse cx="32" cy="46" rx="17" ry="6.5" fill={c.dark} {...edge} />
      <rect x="15" y="34" width="34" height="12" rx="6" fill={body} {...edge} />
      <ellipse cx="32" cy="34" rx="17" ry="6.5" fill={c.base} {...edge} />
      <rect x="15" y="24" width="34" height="12" rx="6" fill={body} {...edge} />
      <ellipse cx="32" cy="24" rx="17" ry="6.5" fill={c.lite} {...edge} />
      <ellipse cx="32" cy="24" rx="17" ry="6.5" fill={`url(#${gHi})`} />
      <text x="32" y="28.5" textAnchor="middle" fontSize="11" fontWeight="800" fill={c.edge} fontFamily={ET2_FONT}>$</text>
    </svg>
  );
  if (type === 'house') return (
    <svg {...P}>{defs}
      <rect x="16" y="30" width="32" height="22" rx="7" fill={body} {...edge} />
      <path d="M12 32 L32 13 Q34 11.5 36 13 L52 32 Q53 33.5 50 33.5 L14 33.5 Q11 33.5 12 32 Z" fill={roof} {...edge} />
      <rect x="27" y="40" width="10" height="12" rx="3.5" fill={c.edge} fillOpacity="0.55" />
      <rect x="19" y="34" width="7" height="6" rx="2.2" fill={c.lite} fillOpacity="0.8" />
      <rect x="38" y="34" width="7" height="6" rx="2.2" fill={c.lite} fillOpacity="0.8" />
      {hi(18, 31, 28, 9, 6)}
    </svg>
  );
  if (type === 'bank') return (
    <svg {...P}>{defs}
      <path d="M12 27 L32 14 Q34 13 36 14 L52 27 Q53.5 28.5 50.5 29 L13.5 29 Q10.5 28.5 12 27 Z" fill={roof} {...edge} />
      <rect x="15" y="44" width="34" height="8" rx="4" fill={body} {...edge} />
      {[18.5, 28.4, 38.3].map((x, i) => <rect key={i} x={x} y="29.5" width="7" height="15" rx="3.2" fill={body} {...edge} />)}
      <rect x="15" y="29.5" width="34" height="3" rx="1.5" fill={c.dark} />
      {hi(16, 30, 30, 7, 4)}
    </svg>
  );
  if (type === 'apartments') return (
    <svg {...P}>{defs}
      <rect x="17" y="12" width="30" height="40" rx="8" fill={body} {...edge} />
      {[18, 27, 36].map((y) => [21, 29.5, 38].map((x, j) => (
        <rect key={`${y}-${j}`} x={x} y={y} width="5.5" height="5.5" rx="2" fill={c.lite} fillOpacity="0.85" />
      )))}
      <rect x="27" y="44" width="10" height="8" rx="3" fill={c.edge} fillOpacity="0.5" />
      {hi(19, 13, 26, 12, 7)}
    </svg>
  );
  if (type === 'villa') return (
    <svg {...P}>{defs}
      <rect x="10" y="34" width="18" height="18" rx="6" fill={body} {...edge} />
      <rect x="36" y="34" width="18" height="18" rx="6" fill={body} {...edge} />
      <rect x="23" y="28" width="18" height="24" rx="6" fill={body} {...edge} />
      <path d="M8 35 L19 24 Q20 23 21 24 L30 35 Q31 36 28.5 36 L10 36 Q7.5 36 8 35 Z" fill={roof} {...edge} />
      <path d="M34 35 L45 24 Q46 23 47 24 L56 35 Q57 36 54.5 36 L36 36 Q33.5 36 34 35 Z" fill={roof} {...edge} />
      <path d="M21 30 L32 18 Q33 17 34 18 L43 30 Q44 31 41.5 31 L23 31 Q20.5 31 21 30 Z" fill={roof} {...edge} />
      <rect x="28" y="42" width="8" height="10" rx="3" fill={c.edge} fillOpacity="0.5" />
      {hi(24, 31, 14, 8, 5)}
    </svg>
  );
  if (type === 'trophy') return (
    <svg {...P}>{defs}
      <path d="M18 12 h28 v10 a14 14 0 01-28 0 Z" fill={body} {...edge} />
      <path d="M18 14 h-6 a8 8 0 008 9" fill="none" stroke={c.dark} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M46 14 h6 a8 8 0 01-8 9" fill="none" stroke={c.dark} strokeWidth="3.4" strokeLinecap="round" />
      <rect x="28" y="34" width="8" height="9" rx="2.5" fill={c.dark} />
      <rect x="21" y="43" width="22" height="7" rx="3.5" fill={body} {...edge} />
      <ellipse cx="32" cy="50" rx="15" ry="4" fill={c.dark} opacity="0.55" />
      {hi(20, 13, 22, 10, 6)}
    </svg>
  );
  return null;
}

// ── Glossy extruded key-cap tile ─────────────────────────────────
function ET2CapTile({ state = 'done', isCurrent = false, skin, children, big = false, size }) {
  const t = skin.cap[state];
  const W = size || (big ? (isCurrent ? 112 : 98) : 64);
  const lip = big ? 14 : 9;
  return (
    <div style={{ position: 'relative', width: W, height: W + lip,
      filter: isCurrent && t.glow ? `drop-shadow(0 0 22px ${t.glow})` : 'none' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: lip, bottom: 0, borderRadius: big ? 26 : 16,
        background: t.lip, boxShadow: '0 8px 16px rgba(0,0,0,0.5)' }}></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: W, borderRadius: big ? 26 : 16,
        background: t.top, border: `1px solid ${t.edge}`, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', left: '8%', right: '8%', top: '6%', height: '42%', borderRadius: '50%',
          background: 'radial-gradient(120% 100% at 30% 0%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

const ET2_SKINS = {
  duo: {
    id: 'duo', label: 'Glossy Duo',
    bg: 'radial-gradient(125% 85% at 70% -8%, #07090c 0%, #000 55%)',
    chrome: ET2P.surface, pathLocked: '#1d2330',
    iconHue: { done: 'lime', current: 'blue', locked: 'slate' },
    cap: {
      done:    { top: 'linear-gradient(180deg,#2bf09a,#06c06e)', lip: '#067a45', edge: 'rgba(255,255,255,0.35)', glow: null },
      current: { top: 'linear-gradient(180deg,#5b9bff,#2f6fe6)', lip: '#16458c', edge: 'rgba(255,255,255,0.5)', glow: `${ET2P.blue}77` },
      locked:  { top: 'linear-gradient(180deg,#20242c,#15181e)', lip: '#0c0e12', edge: 'rgba(255,255,255,0.06)', glow: null },
    },
  },
  green: {
    id: 'green', label: 'Glossy Green',
    bg: 'radial-gradient(130% 80% at 50% 120%, #061a10 0%, #000 60%)',
    chrome: ET2P.surface, pathLocked: '#1d2330',
    iconHue: { done: 'lime', current: 'lime', locked: 'slate' },
    cap: {
      done:    { top: 'linear-gradient(180deg,#2bf09a,#06c06e)', lip: '#057a45', edge: 'rgba(255,255,255,0.35)', glow: null },
      current: { top: 'linear-gradient(180deg,#33ffa6,#04d074)', lip: '#067a45', edge: 'rgba(255,255,255,0.55)', glow: `${ET2P.lime}66` },
      locked:  { top: 'linear-gradient(180deg,#20242c,#15181e)', lip: '#0c0e12', edge: 'rgba(255,255,255,0.06)', glow: null },
    },
  },
  mono: {
    id: 'mono', label: 'Glossy Mono',
    bg: 'radial-gradient(125% 90% at 30% -5%, #080a0e 0%, #000 58%)',
    chrome: ET2P.surface, pathLocked: '#1d2330',
    iconHue: { done: 'lime', current: 'blue', locked: 'slate' },
    cap: {
      done:    { top: 'linear-gradient(180deg,#2a2f38,#1b1f26)', lip: '#0e1014', edge: 'rgba(0,255,127,0.4)', glow: null },
      current: { top: 'linear-gradient(180deg,#2c3340,#1b2230)', lip: '#0e131c', edge: 'rgba(47,126,255,0.6)', glow: `${ET2P.blue}55` },
      locked:  { top: 'linear-gradient(180deg,#20242c,#15181e)', lip: '#0c0e12', edge: 'rgba(255,255,255,0.06)', glow: null },
    },
  },
};

// ── Chrome ───────────────────────────────────────────────────────
function ET2Shell({ children, bg, label }) {
  return (
    <div data-screen-label={label} style={{
      width: '100%', height: '100%', background: bg || ET2P.bg,
      color: ET2P.text, fontFamily: ET2_FONT,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

function ET2RoundBtn({ onClick, label, children }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      appearance: 'none', cursor: 'pointer', border: 0,
      width: 40, height: 40, borderRadius: '50%',
      background: ET2P.surface, color: ET2P.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>{children}</button>
  );
}

function ET2Header({ eyebrow, eyebrowColor, title, sub, onBack, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 22px 0', gap: 12, flexShrink: 0 }}>
      {onBack ? (
        <ET2RoundBtn onClick={onBack} label="Back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </ET2RoundBtn>
      ) : <div style={{ width: 40 }}></div>}
      <div style={{ flex: 1, paddingTop: 2 }}>
        {eyebrow && <div style={{ fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: eyebrowColor || ET2P.blue, marginBottom: 4 }}>{eyebrow}</div>}
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: ET2P.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {onClose ? (
        <ET2RoundBtn onClick={onClose} label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"></path></svg>
        </ET2RoundBtn>
      ) : <div style={{ width: 40 }}></div>}
    </div>
  );
}

function ET2Progress({ percent, color }) {
  return (
    <div style={{ padding: '16px 22px 0', flexShrink: 0 }}>
      <div style={{ height: 4, background: ET2P.surface, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color || ET2P.lime, borderRadius: 999, transition: 'width .45s cubic-bezier(.22,1,.36,1)' }}></div>
      </div>
    </div>
  );
}

function ET2Cta({ label, color = 'lime', onClick, disabled, arrow = true, meta }) {
  const bg = disabled ? ET2P.surface : color === 'lime' ? ET2P.lime : color === 'blue' ? ET2P.blue : color === 'ghost' ? ET2P.surface : '#fff';
  const fg = disabled ? ET2P.muted : color === 'lime' ? ET2P.ink : color === 'blue' ? '#fff' : color === 'ghost' ? ET2P.text : '#000';
  return (
    <div style={{ padding: '14px 22px 22px', flexShrink: 0 }}>
      <button onClick={disabled ? undefined : onClick} style={{
        appearance: 'none', cursor: disabled ? 'default' : 'pointer', width: '100%',
        height: 58, borderRadius: 999, border: 0, background: bg, color: fg,
        fontFamily: ET2_FONT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.005em',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
        {label}
        {arrow && !disabled && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
      </button>
    </div>
  );
}

function ET2Mono({ children, color, size = 10.5, style = {} }) {
  return <div style={{ fontFamily: ET2_MONO, fontSize: size, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: color || ET2P.muted, ...style }}>{children}</div>;
}

// ── Phone frame ──────────────────────────────────────────────────
function ET2Phone({ children }) {
  return (
    <div style={{
      width: 412, height: 891, background: '#1a1a1a', borderRadius: 52, padding: 9,
      boxShadow: '0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1.5px #2a2a2a', position: 'relative', flexShrink: 0,
    }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: ET2P.bg, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 122, height: 36, borderRadius: 18, background: '#000', zIndex: 30 }}></div>
        <div style={{ flexShrink: 0, position: 'relative', zIndex: 20 }}><IOSStatusBar dark={true} /></div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.4)', zIndex: 30 }}></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ET2P, ET2_FONT, ET2_MONO, ET2_SERIF, ET2_SKINS, ET2Q,
  ET2Puffy, ET2CapTile, ET2Shell, ET2Header, ET2Progress, ET2Cta, ET2Mono, ET2Phone, ET2RoundBtn,
  ET2Stripes, ET2Meta,
});
