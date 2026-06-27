// et-landing-motion.jsx — animated, faded-in phone "motion graphics" for the
// Features section. Reuses the real app screens (MapScreen, PegasusScreen,
// SpotterScreen, ResultsScreen from video/et-reel-screens.jsx).
//
// Each plays its reveal ONCE when scrolled into view, then holds the final
// state. Before/after playing it rests at the completed frame (never blank),
// so it's robust even if the viewport trigger is missed. No perpetual rAF.

const mclamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mEaseOut = (t) => 1 - Math.pow(1 - mclamp(t, 0, 1), 3);
const mEaseInOut = (t) => { t = mclamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const fadeIn = (t) => mEaseOut(t / 0.6);

// Plays a one-shot timeline 0→duration when the element scrolls into view.
// Rests at `duration` (final frame) until then, so it's always visible.
function useReveal(duration) {
  const ref = React.useRef(null);
  const started = React.useRef(false);
  const [t, setT] = React.useState(duration);
  React.useEffect(() => {
    if (!ref.current) return;
    const play = () => {
      let raf, start = null;
      const loop = (ts) => {
        if (start == null) start = ts;
        const e = (ts - start) / 1000;
        if (e >= duration) { setT(duration); return; }
        setT(e);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting && !started.current) { started.current = true; setT(0); requestAnimationFrame(play); } });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [duration]);
  return [ref, t];
}

function MotionWrap({ inviewRef, opacity, children }) {
  return <div ref={inviewRef} style={{ width: '100%', height: '100%', opacity }}>{children}</div>;
}

// ── 1 · Journey map: nodes reveal stop1 → stop2 → in-progress → locked → locked ──
function AnimatedMap() {
  const DUR = 5;
  const [ref, t] = useReveal(DUR);
  const appear = mEaseOut(t / 3.2) * 5;
  const pathLit = mEaseInOut((t - 1.0) / 2.6);
  const progressPct = mEaseOut((t - 1.0) / 2.6) * 40;
  return (
    <MotionWrap inviewRef={ref} opacity={fadeIn(t)}>
      <MapScreen appear={appear} doneCount={2} pathLit={mclamp(pathLit, 0, 1)} focusCur={1} progressPct={progressPct} />
    </MotionWrap>
  );
}

// ── 2 · Pegasus: the coaching exchange types out ────────────────
function AnimatedPegasus() {
  const DUR = 6;
  const [ref, t] = useReveal(DUR);
  const grow = (s) => mEaseOut((t - s) / 0.45);
  const msgs = [];
  if (t > 0.3) msgs.push({ from: 'peg', lines: ['I’m Pegasus, your deal coach. Ask me anything.'], grow: grow(0.3) });
  if (t > 1.1) msgs.push({ from: 'me', lines: ['Is a $170k flip on a $300k ARV good?'], grow: grow(1.1) });
  const typing = t > 1.9 && t < 3.2;
  if (t > 3.2) {
    const lines = ['Run the 70% rule: 0.70 × $300k = $210k, minus rehab.'];
    if (t > 4.0) lines.push('Max buy ≈ $170k. The ceiling, not a deal yet.');
    msgs.push({ from: 'peg', lines, grow: grow(3.2) });
  }
  return (
    <MotionWrap inviewRef={ref} opacity={fadeIn(t)}>
      <PegasusScreen messages={msgs} typing={typing} dotsT={t} />
    </MotionWrap>
  );
}

// ── 3 · Simulators: the Barron listing, the offer is pressed → result ──
function AnimatedSpotter() {
  const DUR = 6;
  const [ref, t] = useReveal(DUR);
  const timeLeft = mclamp(14 - t * 0.7, 8, 14);
  const picked = mclamp((t - 2.6) / 0.6, 0, 1);
  const showResult = t > 3.3;
  const spotterOp = mclamp(1 - (t - 3.1) / 0.4, 0, 1);
  const resultOp = mEaseOut((t - 3.4) / 0.5);
  const gradeIn = mclamp((t - 3.6) / 0.6, 0, 1);
  const xpProg = mclamp((t - 4.1) / 1.4, 0, 1);
  return (
    <MotionWrap inviewRef={ref} opacity={fadeIn(t)}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: spotterOp }}>
          <SpotterScreen index={3} timeLeft={timeLeft} picked={picked} />
        </div>
        {showResult && (
          <div style={{ position: 'absolute', inset: 0, opacity: resultOp }}>
            <ResultsScreen gradeIn={gradeIn} xpProg={xpProg} />
          </div>
        )}
      </div>
    </MotionWrap>
  );
}

// ── 4 · Portfolio: doors / equity / cashflow + holdings reveal ──
function AnimatedPortfolio() {
  const DUR = 4;
  const [ref, t] = useReveal(DUR);
  const reveal = mEaseOut(t / 3);
  return (
    <MotionWrap inviewRef={ref} opacity={fadeIn(t)}>
      <PortfolioScreen reveal={mclamp(reveal, 0, 1)} />
    </MotionWrap>
  );
}

// ── animated event-feed (Beside-style rising card stack) ───────
function FeedIcon({ name, color }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  const m = {
    trophy: <path d="M7 4h10v4a5 5 0 0 1-10 0V4zM7 5H4.5a4 4 0 0 0 3 4M17 5h2.5a4 4 0 0 1-3 4M12 13v3M8.5 20h7M9.5 16.5h5l.5 3.5h-6l.5-3.5z" {...p} />,
    home: <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" {...p} />,
    coins: <g><ellipse cx="12" cy="7" rx="6.5" ry="2.6" {...p} /><path d="M5.5 7v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6V7M5.5 12v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" {...p} /></g>,
    flame: <path d="M12 4C9 8 7.5 10 7.5 13.2a4.5 4.5 0 0 0 9 0C16.5 10 15 8 12 4z" {...p} />,
    moon: <g><circle cx="12" cy="12" r="8" {...p} /><circle cx="9.6" cy="9.4" r="1.1" fill={color} stroke="none" /><circle cx="14.4" cy="13" r="1.5" fill={color} stroke="none" /></g>,
    bank: <path d="M4 9l8-4 8 4M5 9v8M19 9v8M9 9v8M15 9v8M4 19h16" {...p} />,
    apartments: <path d="M4 20V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M12 20v-9h7a1 1 0 0 1 1 1v8M7 9h2M7 13h2M15 14h2" {...p} />,
    spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" {...p} />,
    check: <path d="M5 12l5 5L20 7" {...p} />,
  };
  return <svg width="16" height="16" viewBox="0 0 24 24">{m[name] || m.spark}</svg>;
}

function StateDot({ state }) {
  const c = state === 'done' ? '#1fe98a' : state === 'current' ? L.blue : '#5a5f66';
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, boxShadow: state === 'current' ? `0 0 8px ${L.blue}` : 'none', flexShrink: 0 }} />;
}

function FeedCard({ item }) {
  const accent = item.accent || L.blueLite;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '13px 15px', borderRadius: 16, marginBottom: 12,
      background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,91,255,0.16)' }}>
        <FeedIcon name={item.icon} color={accent} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 14.5, fontWeight: 700, color: L.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {item.state && <StateDot state={item.state} />}
            {item.time && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: L.dim }}>{item.time}</span>}
          </span>
        </div>
        {item.sub && <div style={{ fontFamily: "'Inter Tight', system-ui, sans-serif", fontSize: 13, color: L.muted, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.sub}</div>}
      </div>
    </div>
  );
}

function AnimatedFeed({ items, glow = L.blue, dur = 26 }) {
  const list = [...items, ...items];
  return (
    <div className="split-media" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: '-6% -2%', background: `radial-gradient(52% 48% at 50% 42%, ${glow}26, transparent 72%)`, filter: 'blur(8px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 420, height: 452, borderRadius: 26, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(16,18,24,0.5)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px rgba(0,0,0,0.45)' }}>
        <div style={{ position: 'absolute', inset: 0,
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 13%, #000 85%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, transparent 0, #000 13%, #000 85%, transparent 100%)' }}>
          <div style={{ padding: '18px 16px 0', animation: `etFeedScroll ${dur}s linear infinite` }}>
            {list.map((it, i) => <FeedCard key={i} item={it} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

const EXP_FEED = [
  { icon: 'trophy', title: 'Fred Brown reached Elite Mogul', time: '2m', accent: '#5b9bff' },
  { icon: 'home', title: 'New deal tracked', sub: 'The Fifth & Fondren · Jackson, MS', time: '8m' },
  { icon: 'coins', title: 'Bobby Evans · +$48K equity', time: '21m' },
  { icon: 'flame', title: 'Marcus hit a 12-day streak', time: '47m' },
  { icon: 'moon', title: 'Pegasus answered a deal question', time: '1h' },
  { icon: 'apartments', title: 'David Fales opened deal #2', time: '2h' },
];
const PATH_FEED = [
  { icon: 'coins', title: 'The 1% Rule', sub: 'Lesson 1 · completed', state: 'done' },
  { icon: 'home', title: 'Read a Listing', sub: 'Lesson 2 · completed', state: 'done' },
  { icon: 'bank', title: 'Finance the Deal', sub: 'In progress', state: 'current' },
  { icon: 'spark', title: 'Simulator 01 cleared', sub: 'Grade S · +200 XP' },
  { icon: 'moon', title: 'Pegasus coaching tip', sub: 'Run the 70% rule first' },
  { icon: 'trophy', title: 'Make the Offer', sub: 'Locked', state: 'locked' },
];

Object.assign(window, { AnimatedMap, AnimatedPegasus, AnimatedSpotter, AnimatedPortfolio, AnimatedFeed, FeedCard, EXP_FEED, PATH_FEED });
