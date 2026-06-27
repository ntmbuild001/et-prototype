// et-landing-1.jsx — ET landing page: shared styles, nav, hero (waitlist).
// Extension of the app: same blue (#1E5BFF), Inter Tight / JetBrains Mono /
// Instrument Serif, glossy puffy icons, lo-fi moon. Clean minimal SaaS, lightly
// gamified. Reuses PhoneFrame + HomeNow/MapScreen from the app build.

const L = {
  bg: '#000', bg2: '#08090c', bg3: '#0b0d11',
  surface: '#141414', surface2: '#1a1a1a',
  line: 'rgba(255,255,255,0.08)', line2: 'rgba(255,255,255,0.14)',
  ink: '#ffffff', muted: '#8A8A8A', dim: '#5a5f66',
  blue: '#1E5BFF', blueLite: '#5b9bff', blueDeep: '#16458c',
  green: '#1fe98a',
};
const LF = "'Inter Tight', -apple-system, system-ui, sans-serif";
const LM = "'JetBrains Mono', ui-monospace, monospace";
const LS = "'Instrument Serif', Georgia, serif";

// ── shared atoms ───────────────────────────────────────────────
function Eye({ children, color = L.blueLite, style = {} }) {
  return <div style={{ fontFamily: LM, fontSize: 13, fontWeight: 700, letterSpacing: '0.28em',
    textTransform: 'uppercase', color, ...style }}>{children}</div>;
}

function PillBtn({ children, primary, onClick, type, style = {}, size = 'md' }) {
  const pad = size === 'lg' ? '18px 34px' : '14px 26px';
  const fs = size === 'lg' ? 18 : 15.5;
  return (
    <button type={type || 'button'} onClick={onClick} style={{ appearance: 'none', cursor: 'pointer',
      border: primary ? 'none' : `1px solid ${L.line2}`, borderRadius: 999, padding: pad,
      background: primary ? L.blue : 'transparent', color: primary ? '#fff' : L.ink,
      fontFamily: LF, fontWeight: 700, fontSize: fs, letterSpacing: '-0.01em',
      boxShadow: primary ? `0 10px 34px ${L.blue}55` : 'none', transition: 'transform .15s, box-shadow .15s, background .15s',
      display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; if (primary) e.currentTarget.style.boxShadow = `0 16px 44px ${L.blue}77`; else e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; if (primary) e.currentTarget.style.boxShadow = `0 10px 34px ${L.blue}55`; else e.currentTarget.style.background = 'transparent'; }}>
      {children}
    </button>
  );
}

function LogoMark({ size = 26 }) {
  const [ok, setOk] = React.useState(false);
  const h = size * 1.55;
  const w = h * 1.9; // reserve space so the wordmark never reflows
  return (
    <div style={{ position: 'relative', height: h, width: w, flexShrink: 0 }}>
      {/* fallback brand mark — italic ET (shows until the logo video decodes) */}
      <div style={{ position: 'absolute', inset: 0, display: ok ? 'none' : 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: LF, fontStyle: 'italic', fontWeight: 800, fontSize: h * 0.96, lineHeight: 1, letterSpacing: '-0.07em',
          background: `linear-gradient(120deg, ${L.blueLite}, ${L.blue} 58%, ${L.blueDeep})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>ET</span>
      </div>
      <video ref={(r) => { if (r) { r.muted = true; r.playbackRate = 0.5; } }} autoPlay loop muted playsInline preload="auto" onLoadedData={(e) => { e.target.playbackRate = 0.5; setOk(true); }}
        style={{ position: 'absolute', inset: 0, height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'left center', opacity: ok ? 1 : 0 }}>
        <source src={(typeof window !== 'undefined' && window.__resources && window.__resources.etLogo) || 'et-logo.webm'} type="video/webm" />
      </video>
    </div>
  );
}

function ETWordmark({ size = 26 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <LogoMark size={size} />
      <span style={{ fontFamily: LF, fontWeight: 800, fontSize: size * 0.82, letterSpacing: '-0.03em', color: L.ink, whiteSpace: 'nowrap' }}>Elite Transition</span>
    </div>
  );
}

// static aurora + grid backdrop (no animation engine needed)
// `pos` moves the blue glow + grid mask to a corner/edge so the splotch can
// travel from section to section down the page.
// each pos defines the PRIMARY glow + grid-mask center, plus a SECONDARY
// (smaller, dimmer) splotch on the opposite side. Centers stay ON-screen and a
// vertical fade mask eases each section's glow in at the top and out at the
// bottom, so the blue blends across section seams instead of cutting hard.
const BD_POS = {
  'top-left':     { gx: '8%',  gy: '28%', sx: '86%', sy: '74%' },
  'top':          { gx: '50%', gy: '24%', sx: '14%', sy: '78%' },
  'top-right':    { gx: '92%', gy: '28%', sx: '12%', sy: '74%' },
  'center':       { gx: '50%', gy: '50%', sx: '88%', sy: '30%' },
  'bottom-right': { gx: '92%', gy: '72%', sx: '10%', sy: '26%' },
  'bottom-left':  { gx: '8%',  gy: '72%', sx: '88%', sy: '26%' },
};
// alpha hex for the main splotch, scaled by the glow prop
const bdAlpha = (glow) => Math.round(Math.max(0, Math.min(1, glow * 0.62 + 0.18)) * 255).toString(16).padStart(2, '0');
const BD_FADE = 'linear-gradient(to bottom, transparent 0%, #000 17%, #000 83%, transparent 100%)';
function Backdrop({ glow = 0.6, pos = 'top', gridOpacity = 0.55 }) {
  const P = BD_POS[pos] || BD_POS.top;
  const a = bdAlpha(glow);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        maskImage: BD_FADE, WebkitMaskImage: BD_FADE }}>
        {/* primary splotch */}
        <div style={{ position: 'absolute', top: P.gy, left: P.gx, transform: 'translate(-50%, -50%)', width: 1180, height: 760,
          background: `radial-gradient(50% 50% at 50% 50%, ${L.blue}${a} 0%, transparent 72%)` }} />
        {/* secondary splotch (opposite side, dimmer) */}
        <div style={{ position: 'absolute', top: P.sy, left: P.sx, transform: 'translate(-50%, -50%)', width: 820, height: 560,
          background: `radial-gradient(50% 50% at 50% 50%, ${L.blue}2e 0%, transparent 70%)` }} />
        <div style={{ position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${L.line2} 1px, transparent 1px), linear-gradient(90deg, ${L.line2} 1px, transparent 1px)`,
          backgroundSize: '72px 72px', opacity: gridOpacity,
          maskImage: `radial-gradient(85% 65% at ${P.gx} ${P.gy}, #000 0%, transparent 80%)`,
          WebkitMaskImage: `radial-gradient(85% 65% at ${P.gx} ${P.gy}, #000 0%, transparent 80%)` }} />
      </div>
    </React.Fragment>
  );
}

// ── nav ────────────────────────────────────────────────────────
function Nav({ onJoin }) {
  const [solid, setSolid] = React.useState(false);
  React.useEffect(() => {
    const sc = document.scrollingElement || document.documentElement;
    const onScroll = () => setSolid((sc.scrollTop || window.scrollY) > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['Moguls', 'moguls'], ['Experience', 'experience'], ['How it works', 'how']];
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: solid ? 'rgba(5,6,8,0.55)' : 'transparent', backdropFilter: solid ? 'blur(16px)' : 'none',
      borderBottom: 'none', transition: 'background .25s' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <ETWordmark size={40} />
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {links.map(([t, id]) => (
            <a key={id} href={`#${id}`} style={{ fontFamily: LF, fontSize: 15, fontWeight: 500, color: L.muted, textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = L.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = L.muted)}>{t}</a>
          ))}
        </div>
        <PillBtn primary onClick={onJoin}>Join the waitlist</PillBtn>
      </div>
    </div>
  );
}

// ── waitlist form (gamified) ───────────────────────────────────
const WAITLIST_BASE = 2417;
function useWaitlist() {
  const [state, setState] = React.useState(() => {
    try { const v = JSON.parse(localStorage.getItem('et-waitlist') || 'null'); if (v && v.email) return v; } catch {}
    return null;
  });
  const join = (email) => {
    const pos = WAITLIST_BASE - Math.floor(Math.random() * 40);
    const v = { email, pos, at: Date.now() };
    try { localStorage.setItem('et-waitlist', JSON.stringify(v)); } catch {}
    setState(v);
    return v;
  };
  return [state, join];
}

function WaitlistForm({ joined, onJoin, size = 'md' }) {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) { setErr(true); return; }
    onJoin(email);
  };
  if (joined) {
    const target = 3000;
    const pct = Math.min(100, Math.round((joined.pos / target) * 100));
    return (
      <div style={{ background: L.surface, border: `1px solid ${L.line2}`, borderRadius: 20, padding: 24, maxWidth: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{ width: 34, height: 34, borderRadius: '50%', background: L.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div style={{ fontFamily: LF, fontSize: 19, fontWeight: 800, color: L.ink, letterSpacing: '-0.01em' }}>You’re on the list.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: LM, fontSize: 13, color: L.muted, letterSpacing: '0.1em' }}>YOUR SPOT</span>
          <span style={{ fontFamily: LF, fontSize: 30, fontWeight: 800, color: L.blueLite, letterSpacing: '-0.02em' }}>#{joined.pos.toLocaleString()}</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: L.surface2, overflow: 'hidden', margin: '14px 0 10px' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${L.blueDeep}, ${L.blue} 60%, ${L.blueLite})` }} />
        </div>
        <div style={{ fontFamily: LF, fontSize: 14, color: L.muted }}>
          Move up the list: <span style={{ color: L.ink, fontWeight: 600 }}>refer 3 teammates</span> to skip to early access.
        </div>
      </div>
    );
  }
  return (
    <form onSubmit={submit} style={{ width: '100%', maxWidth: 540 }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input value={email} onChange={(e) => { setEmail(e.target.value); setErr(false); }} type="email" placeholder="you@team.com" aria-label="Email address"
          style={{ flex: '1 1 240px', minWidth: 0, appearance: 'none', borderRadius: 999, padding: size === 'lg' ? '18px 24px' : '15px 22px',
            background: L.surface, border: `1px solid ${err ? '#FF4D4D' : L.line2}`, color: L.ink, fontFamily: LF, fontSize: 16, outline: 'none' }} />
        <PillBtn primary type="submit" size={size}>Join the waitlist</PillBtn>
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10, fontFamily: LF, fontSize: 14, color: L.muted }}>
        <span style={{ display: 'inline-flex' }}>{[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ width: 24, height: 24, borderRadius: '50%', marginLeft: i ? -8 : 0, border: `2px solid ${L.bg}`,
            background: `linear-gradient(150deg, ${L.blueLite}, ${L.blueDeep})` }} />
        ))}</span>
        <span><span style={{ color: L.ink, fontWeight: 700 }}>2,400+ athletes</span> already in line.</span>
      </div>
    </form>
  );
}

// ── hero ───────────────────────────────────────────────────────
function Hero({ joined, onJoin }) {
  return (
    <section style={{ position: 'relative', background: L.bg, overflow: 'hidden', paddingTop: 112, paddingBottom: 70 }}>
      <Backdrop glow={0.4} pos="center" gridOpacity={0.32} />
      <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '0 28px',
        display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,0.95fr)', gap: 40, alignItems: 'center' }} className="hero-grid">
        {/* left */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 999,
            border: `1px solid ${L.line2}`, background: 'rgba(30,91,255,0.08)', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: L.green, boxShadow: `0 0 8px ${L.green}` }} />
            <span style={{ fontFamily: LM, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: L.blueLite }}>A LEAGUE OF OWNERS · PRIVATE BETA</span>
          </div>
          <h1 style={{ fontFamily: LF, fontSize: 'clamp(44px, 6vw, 78px)', fontWeight: 800, letterSpacing: '-0.035em',
            lineHeight: 0.98, color: L.ink, margin: '0 0 18px', textWrap: 'balance' }}>
            Where athletes<br />become <span style={{ fontFamily: LS, fontWeight: 400, fontStyle: 'italic', color: L.blue }}>owners.</span>
          </h1>
          <p style={{ fontFamily: LF, fontSize: 'clamp(17px, 1.5vw, 20px)', lineHeight: 1.5, color: L.muted, margin: '0 0 28px', maxWidth: 520 }}>
            A community of pros turning game checks into real estate, together. Track teammates’ live deals, run your own reps, and build a portfolio that outlasts the career. Earn more than you owned.
          </p>
          <WaitlistForm joined={joined} onJoin={onJoin} size="lg" />
        </div>
        {/* right — floating phone */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }} className="hero-phone">
          <HeroPhone />
        </div>
      </div>
    </section>
  );
}

// Self-contained looping clock for decorative hero animation (no Stage engine on landing).
function useHeroLoop(period) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf, start;
    const tick = (now) => {
      if (start == null) start = now;
      setT(((now - start) / 1000) % period);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [period]);
  return t;
}

function HeroPhone() {
  // Living hero: a big Pegasus moon splash, then the underwrite mockup
  // (Pegasus analysing a real deal) — looping.
  const PERIOD = 11;
  const t = useHeroLoop(PERIOD);
  const cn = (v) => Math.max(0, Math.min(1, v));
  const eo = (x) => 1 - Math.pow(1 - cn(x), 3);
  // crossfade splash ↔ analysis
  const splashOp = t < 3.0 ? 1 : t < 3.6 ? 1 - (t - 3.0) / 0.6 : t > 10.3 ? cn((t - 10.3) / 0.7) : 0;
  const anaOp = 1 - splashOp;
  // moon intro + reveal
  const moonScale = 0.72 + eo(t / 1.5) * 0.28;
  const introFade = eo((t - 0.15) / 0.8);
  const reveal = eo((t - 4.0) / 3.4);
  return (
    <div style={{ position: 'relative', perspective: 2000, width: '100%', maxWidth: 420, margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
      <div style={{ transform: 'rotateY(-14deg) rotateX(6deg) rotateZ(1deg)', transformStyle: 'preserve-3d',
        filter: `drop-shadow(0 50px 80px rgba(0,0,0,0.6)) drop-shadow(0 0 60px ${L.blue}33)` }}>
        <div style={{ transform: 'scale(0.62)', transformOrigin: 'center', position: 'relative' }}>
          <div style={{ opacity: anaOp }}><PhoneFrame><PegasusAnalysisScreen reveal={reveal} /></PhoneFrame></div>
          <div style={{ position: 'absolute', inset: 0, opacity: splashOp, pointerEvents: 'none' }}>
            <PhoneFrame>
              <div style={{ width: '100%', height: '100%', background: 'radial-gradient(125% 80% at 50% 38%, #08101f 0%, #000 72%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, padding: 40 }}>
                <div style={{ filter: `drop-shadow(0 0 60px ${L.blue}77)`, transform: `scale(${moonScale})`, opacity: introFade }}>
                  <PegasusMark size={104} />
                </div>
                <div style={{ textAlign: 'center', opacity: introFade }}>
                  <div style={{ fontFamily: LM, fontSize: 16, fontWeight: 700, letterSpacing: '0.34em', textTransform: 'uppercase', color: L.blueLite }}>Pegasus</div>
                  <div style={{ fontFamily: LF, fontSize: 34, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginTop: 16, lineHeight: 1.1 }}>Your 24/7<br />deal coach.</div>
                </div>
              </div>
            </PhoneFrame>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatChip({ style, icon, label, tone }) {
  const ic = {
    flame: <path d="M12 4C9 8 7.5 10 7.5 13.2a4.5 4.5 0 0 0 9 0C16.5 10 15 8 12 4z" stroke={tone} strokeWidth="1.8" fill="none" strokeLinejoin="round" />,
    xp: <path d="M13 3l-7 10.5h5l-1 7.5 7-10.5h-5L13 3z" stroke={tone} strokeWidth="1.8" fill="none" strokeLinejoin="round" />,
    moon: <g><circle cx="12" cy="12" r="8.5" stroke={tone} strokeWidth="1.8" fill="none" /><circle cx="9.4" cy="9" r="1.2" fill={tone} /><circle cx="14.6" cy="13" r="1.6" fill={tone} /></g>,
  }[icon];
  return (
    <div style={{ position: 'absolute', ...style, display: 'inline-flex', alignItems: 'center', gap: 9,
      padding: '11px 16px', borderRadius: 999, background: 'rgba(12,14,18,0.82)', border: `1px solid ${L.line2}`,
      backdropFilter: 'blur(10px)', boxShadow: '0 12px 30px rgba(0,0,0,0.4)' }}>
      <svg width="18" height="18" viewBox="0 0 24 24">{ic}</svg>
      <span style={{ fontFamily: LM, fontSize: 13, fontWeight: 700, letterSpacing: '0.02em', color: L.ink, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

Object.assign(window, { L, LF, LM, LS, Eye, PillBtn, ETWordmark, Backdrop, Nav, useWaitlist, WaitlistForm, Hero });
