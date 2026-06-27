// et-landing-2.jsx — lower sections: how-it-works, features, gamification,
// final CTA, footer. Relies on et-landing-1 globals + app components
// (PhoneFrame, MapScreen, PegasusScreen, SpotterScreen, HomeNow, ET2Puffy).

function Section({ id, bg, children, style = {} }) {
  return <section id={id} style={{ position: 'relative', background: bg || L.bg, ...style }}>{children}</section>;
}
function Wrap({ children, style = {}, className }) {
  return <div className={className} style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', position: 'relative', ...style }}>{children}</div>;
}
function SecHead({ eyebrow, title, sub, center }) {
  return (
    <div style={{ maxWidth: 720, margin: center ? '0 auto' : 0, textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
      <Eye style={{ marginBottom: 16 }}>{eyebrow}</Eye>
      <h2 style={{ fontFamily: LF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04, color: L.ink, margin: '0 0 18px', textWrap: 'balance' }}>{title}</h2>
      {sub && <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: 0 }}>{sub}</p>}
    </div>
  );
}

// scaled phone in a fixed footprint
function MiniPhone({ children, scale = 0.6 }) {
  const w = Math.round(430 * scale), h = Math.round(886 * scale);
  return (
    <div style={{ width: w, height: h, position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left',
        filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.5)) drop-shadow(0 0 40px ${L.blue}22)` }}>
        <PhoneFrame>{children}</PhoneFrame>
      </div>
    </div>
  );
}

// bare app-screen — just the content on screen, no bezel / wireframe.
// Rounded clip + soft drop shadow so it sits on the page cleanly.
function ScreenCard({ children, w = 320, h = 640 }) {
  return (
    <div style={{ width: w, height: h, position: 'relative', borderRadius: 30, overflow: 'hidden',
      boxShadow: '0 36px 70px rgba(0,0,0,0.5)' }}>
      {children}
    </div>
  );
}

// ── reusable left-copy + icon bullet list ──────────────────────
function BulletList({ items }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 26 }}>
      {items.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,91,255,0.14)', border: '1px solid rgba(30,91,255,0.3)' }}>
            <ET2Puffy type={b.icon} hue="blue" size={20} />
          </span>
          <div>
            <div style={{ fontFamily: LF, fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: L.ink }}>{b.t}</div>
            <div style={{ fontFamily: LF, fontSize: 15, lineHeight: 1.5, color: L.muted, marginTop: 3 }}>{b.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── The Path — copy left, sticky square panel right (matches ref) ──
function PathCard({ item }) {
  const dot = item.state === 'done' ? '#1f9d57' : item.state === 'current' ? L.blue : '#9aa0aa';
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start', padding: '15px 16px', borderRadius: 16, marginBottom: 14,
      background: '#ffffff', border: '1px solid rgba(20,30,60,0.06)', boxShadow: '0 8px 22px rgba(20,40,90,0.10)' }}>
      <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(30,91,255,0.10)' }}>
        <FeedIcon name={item.icon} color={L.blue} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: LF, fontSize: 15.5, fontWeight: 700, color: '#10131a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
          {item.state && <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0, boxShadow: item.state === 'current' ? `0 0 8px ${L.blue}` : 'none' }} />}
        </div>
        {item.sub && <div style={{ fontFamily: LF, fontSize: 13.5, color: '#5b6270', marginTop: 3 }}>{item.sub}</div>}
      </div>
    </div>
  );
}

function PathPanel() {
  const list = [...PATH_FEED, ...PATH_FEED];
  return (
    <div style={{ position: 'sticky', top: 96, alignSelf: 'start' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 520, aspectRatio: '1 / 1', marginLeft: 'auto', borderRadius: 32, overflow: 'hidden',
        background: 'linear-gradient(158deg, #f5f8ff 0%, #e6eeff 52%, #d3e1ff 100%)',
        border: '1px solid rgba(30,91,255,0.16)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.75)' }}>
        {/* dotted texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(30,91,255,0.16) 1.1px, transparent 1.3px)', backgroundSize: '17px 17px', opacity: 0.6, pointerEvents: 'none' }} />
        {/* card stack, gently rising, faded top & bottom */}
        <div style={{ position: 'absolute', inset: 0,
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0, #000 13%, #000 85%, transparent 100%)',
          maskImage: 'linear-gradient(180deg, transparent 0, #000 13%, #000 85%, transparent 100%)' }}>
          <div style={{ padding: '32px 30px 0', animation: 'etFeedScroll 32s linear infinite' }}>
            {list.map((it, i) => <PathCard key={i} item={it} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { icon: 'coins', t: 'Learn', d: 'Five-minute lessons that turn jargon into plain plays, built for the time you actually have.' },
    { icon: 'apartments', t: 'Simulate', d: 'Put it to work in live deal sims. 60 seconds, one offer, real consequences.' },
    { icon: 'trophy', t: 'Own', d: 'Graduate each module with a coach in your corner and a playbook for your first property.' },
  ];
  return (
    <Section id="how" bg={L.bg2} style={{ padding: '110px 0', overflow: 'hidden' }}>
      <Wrap className="split-grid" style={{ alignItems: 'start' }}>
        <div>
          <Eye style={{ marginBottom: 16 }}>The path</Eye>
          <h2 style={{ fontFamily: LF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04, color: L.ink, margin: '0 0 18px', textWrap: 'balance' }}>
            Learn it. Simulate it. <span style={{ fontFamily: LS, fontStyle: 'italic', fontWeight: 400, color: L.blue }}>Own it.</span>
          </h2>
          <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: 0, maxWidth: 460 }}>
            A guided journey from your first lesson to your first deal. Every step tracked, unlocked, and graded so you actually finish.
          </p>
          <BulletList items={steps} />
        </div>
        <PathPanel />
      </Wrap>
    </Section>
  );
}

// ── feature rows (alternating; phone optional) ─────────────────
// ── wide, spaced-out journey map (Step 01) — same tiles, no phone bezel ──
const JW_STOPS = [
  { n: 1, icon: 'coins',      title: 'The 1% Rule',      x: 90,   y: 300, state: 'done' },
  { n: 2, icon: 'house',      title: 'Read a Listing',   x: 330,  y: 150, state: 'done' },
  { n: 3, icon: 'bank',       title: 'Finance the Deal', x: 575,  y: 300, state: 'current' },
  { n: 4, icon: 'apartments', title: 'Make the Offer',   x: 820,  y: 150, state: 'locked' },
  { n: 5, icon: 'trophy',     title: 'Close It',         x: 1045, y: 300, state: 'locked' },
];
const JW_W = 1135, JW_H = 430;

function JWBadge({ state, size = 34 }) {
  if (state === 'locked') {
    return (
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="9" rx="1.6" stroke={L.muted} strokeWidth="1.9" />
        <path d="M8 11V8a4 4 0 018 0v3" stroke={L.muted} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }
  const isDone = state === 'done';
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: L.blue,
      boxShadow: isDone ? `0 2px 10px ${L.blue}88` : `0 0 20px ${L.blue}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {isDone
        ? <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        : <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>}
    </div>
  );
}

function JourneyWide() {
  const skin = window.ET2_SKINS.duo;
  const doneCount = 2; // stops 1–2 done, stop 3 current
  return (
    <div style={{ width: '100%', maxWidth: JW_W, margin: '0 auto' }}>
      {/* header + progress */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 18 }}>
        <div style={{ fontFamily: LF, fontSize: 'clamp(24px,2.6vw,34px)', fontWeight: 800, letterSpacing: '-0.02em', color: L.ink }}>Your Journey</div>
        <div style={{ fontFamily: LM, fontSize: 14, fontWeight: 700, color: L.muted, whiteSpace: 'nowrap' }}>{doneCount} / 5</div>
      </div>
      <div style={{ height: 5, background: L.surface, borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ width: `${(doneCount / 5) * 100}%`, height: '100%', background: L.blue, borderRadius: 999 }}></div>
      </div>
      {/* map */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: `${JW_W} / ${JW_H}` }}>
        <svg viewBox={`0 0 ${JW_W} ${JW_H}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {[[0, 1], [1, 2], [2, 3], [3, 4]].map(([a, b], i) => {
            const A = JW_STOPS[a], B = JW_STOPS[b];
            const lit = i < doneCount;
            return (
              <g key={i}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={skin.pathLocked} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 14" />
                {lit && <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={L.blue} strokeWidth="4" strokeOpacity="0.65" strokeLinecap="round" />}
              </g>
            );
          })}
        </svg>
        {JW_STOPS.map((s) => {
          const isCur = s.state === 'current';
          const hue = s.state === 'done' ? 'lime' : isCur ? 'blue' : 'slate';
          const eColor = isCur ? L.blue : s.state === 'locked' ? L.muted : L.blue;
          const eyebrow = isCur ? 'IN PROGRESS' : s.state === 'locked' ? 'LOCKED' : `STOP ${s.n}`;
          return (
            <div key={s.n} style={{ position: 'absolute', left: `${(s.x / JW_W) * 100}%`, top: `${(s.y / JW_H) * 100}%`,
              transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center',
              zIndex: isCur ? 6 : 2 }}>
              <div style={{ position: 'relative', opacity: s.state === 'locked' ? 0.62 : 1,
                filter: isCur ? `drop-shadow(0 0 26px ${L.blue})` : 'none' }}>
                <window.ET2CapTile state={s.state} isCurrent={isCur} skin={skin} big>
                  <window.ET2Puffy type={s.icon} hue={hue} size={isCur ? 60 : 52} />
                </window.ET2CapTile>
                <div style={{ position: 'absolute', right: -6, top: -6, zIndex: 4 }}><JWBadge state={s.state} size={isCur ? 36 : 30} /></div>
              </div>
              <div style={{ marginTop: 14, textAlign: 'center', maxWidth: 150 }}>
                <div style={{ fontFamily: LM, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: eColor, marginBottom: 5 }}>{eyebrow}</div>
                <div style={{ fontFamily: LF, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2,
                  color: s.state === 'locked' ? L.muted : '#fff' }}>{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── full-width Step 01: copy header + wide spaced journey map ──
function JourneyStep() {
  const bullets = ['5-minute daily lessons', 'Streaks & XP', 'Each lesson unlocks a sim'];
  return (
    <div style={{ padding: '64px 0' }}>
      <div style={{ maxWidth: 720, marginBottom: 48 }}>
        <Eye style={{ marginBottom: 14 }}>Step 01 · Lessons</Eye>
        <h3 style={{ fontFamily: LF, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.06, color: L.ink, margin: '0 0 16px', textWrap: 'balance' }}>A map, not a syllabus.</h3>
        <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: '0 0 22px', maxWidth: 600 }}>
          Five lessons unlock five simulators. Your path lights up as you go: completed, current, locked, so progress always feels earned.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(30,91,255,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={L.blueLite} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span style={{ fontFamily: LF, fontSize: 16, color: '#d6d8dc' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
      <JourneyWide />
    </div>
  );
}

function FeatureRow({ flip, eyebrow, title, body, bullets, accent, phone, screen }) {
  const media = screen
    ? <ScreenCard>{screen}</ScreenCard>
    : phone
      ? <MiniPhone scale={0.6}>{phone}</MiniPhone>
      : null;
  // no media → centered single-column feature block
  if (!media) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', padding: '52px 0' }}>
        <Eye style={{ marginBottom: 14 }}>{eyebrow}</Eye>
        <h3 style={{ fontFamily: LF, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.06, color: L.ink, margin: '0 0 16px', textWrap: 'balance' }}>{title}</h3>
        <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: '0 auto 22px', maxWidth: 560 }}>{body}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px 22px' }}>
          {bullets.map((b, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: LF, fontSize: 15.5, color: '#d6d8dc' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={L.blueLite} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {b}
            </span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 56, alignItems: 'center', padding: '64px 0' }} className="feature-row">
      <div style={{ order: flip ? 2 : 1, display: 'flex', justifyContent: 'center', position: 'relative' }} className="feature-phone">
        {!screen && <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', background: `radial-gradient(50% 50% at 50% 50%, ${accent}22, transparent 70%)` }} />}
        {media}
      </div>
      <div style={{ order: flip ? 1 : 2 }}>
        <Eye style={{ marginBottom: 14 }}>{eyebrow}</Eye>
        <h3 style={{ fontFamily: LF, fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.06, color: L.ink, margin: '0 0 16px', textWrap: 'balance' }}>{title}</h3>
        <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: '0 0 24px' }}>{body}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(30,91,255,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={L.blueLite} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span style={{ fontFamily: LF, fontSize: 16.5, lineHeight: 1.45, color: '#d6d8dc' }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PEG_LANDING = [
  { from: 'peg', lines: ['I’m Pegasus, your deal coach. Ask me anything.'], grow: 1 },
  { from: 'me', lines: ['Is a $170k flip on a $300k ARV good?'], grow: 1 },
  { from: 'peg', lines: ['Run the 70% rule: 0.70 × $300k = $210k, minus rehab.', 'Max buy ≈ $170k. The ceiling, not a deal yet.'], grow: 1 },
];

function Features() {
  return (
    <Section id="path" bg={L.bg} style={{ padding: '90px 0', overflow: 'hidden' }}>
      <Backdrop glow={0.45} pos="top-right" />
      <Wrap>
        <SecHead center eyebrow="The path"
          title={<>Learn it. Simulate it. <span style={{ fontFamily: LS, fontStyle: 'italic', fontWeight: 400, color: L.blue }}>Own it.</span></>}
          sub="A guided journey from your first lesson to your first deal. Every step tracked, unlocked, and graded so you actually finish." />
        <JourneyStep />
        <FeatureRow flip eyebrow="Step 02 · Simulators" accent={L.blueLite}
          title="Practice with house money."
          body="Spot the motivated seller. Make the offer. Get graded. Run a deal a hundred times in the sim so the real one feels like a rep you’ve already taken."
          bullets={['60 seconds, one offer', 'Scored 60–100 instantly', 'XP & unlocks per clear']}
          screen={<AnimatedSpotter />} />
        <FeatureRow eyebrow="Step 03 · Own" accent={L.blue}
          title="The portfolio that outlives the contract."
          body="Every lesson and rep points here: doors you own, cashflow that lands whether or not you suit up Sunday, and equity that compounds. Earn more than you owned."
          bullets={['Track doors, cashflow & equity', 'Passive income, contract-proof', 'Your standing, earned not bought']}
          screen={<AnimatedPortfolio />} />
      </Wrap>
    </Section>
  );
}

// ── Pegasus · AI coach (phone left, copy + checklist right) ─────
function PegasusSection() {
  const checks = ['Trained on the ET curriculum', 'Sanity-checks real deals in seconds', 'Always on, always private'];
  return (
    <Section id="pegasus" bg={L.bg} style={{ padding: '110px 0', overflow: 'hidden' }}>
      <Backdrop glow={0.45} pos="center" />
      <Wrap className="split-grid">
        <div className="split-media" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: `radial-gradient(50% 50% at 50% 50%, ${L.blue}22, transparent 70%)` }} />
          <MiniPhone scale={0.62}><AnimatedPegasus /></MiniPhone>
        </div>
        <div>
          <Eye style={{ marginBottom: 16, display: 'block' }}>Pegasus · AI coach</Eye>
          <h2 style={{ fontFamily: LF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04, color: L.ink, margin: '0 0 18px', textWrap: 'balance' }}>
            A coach in your pocket. <span style={{ fontFamily: LS, fontStyle: 'italic', fontWeight: 400, color: L.blue }}>24/7.</span>
          </h2>
          <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: '0 0 28px', maxWidth: 480 }}>
            Walking you through every step of the path. Ask about any property, number, or lesson and get answers grounded in real math: the 70% rule, DSCR, cash-on-cash, not vibes.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(30,91,255,0.16)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={L.blueLite} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span style={{ fontFamily: LF, fontSize: 17, fontWeight: 600, color: '#d6d8dc' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

// ── gamification band ──────────────────────────────────────────
function StatBig({ k, v, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 12px' }}>
      <div style={{ fontFamily: LF, fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 800, letterSpacing: '-0.03em', color: L.ink, lineHeight: 1 }}>{v}</div>
      <div style={{ fontFamily: LM, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: L.blueLite, marginTop: 10 }}>{k}</div>
      {sub && <div style={{ fontFamily: LF, fontSize: 14, color: L.muted, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}
function Gamified() {
  return (
    <Section id="game" bg={L.bg2} style={{ padding: '110px 0' }}>
      <Wrap>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 56, alignItems: 'center' }} className="game-grid">
          <div>
            <Eye style={{ marginBottom: 16 }}>Built like a game</Eye>
            <h2 style={{ fontFamily: LF, fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04, color: L.ink, margin: '0 0 18px', textWrap: 'balance' }}>
              Because that’s how you <span style={{ fontFamily: LS, fontStyle: 'italic', fontWeight: 400, color: L.blue }}>stick with it.</span>
            </h2>
            <p style={{ fontFamily: LF, fontSize: 18, lineHeight: 1.55, color: L.muted, margin: '0 0 30px', maxWidth: 460 }}>
              Streaks, XP, levels, and unlockable simulators. The discipline that made you elite on the field, pointed at your portfolio.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[['flame', '6-day streak'], ['xp', 'Level 4 · 1,240 XP'], ['trophy', '3 sims cleared']].map(([ic, t], i) => (
                <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '11px 16px', borderRadius: 999, background: L.surface, border: `1px solid ${L.line2}` }}>
                  <ET2Puffy type={ic === 'trophy' ? 'trophy' : ic === 'xp' ? 'coins' : 'house'} hue="blue" size={22} />
                  <span style={{ fontFamily: LM, fontSize: 13, fontWeight: 700, color: L.ink, whiteSpace: 'nowrap' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: L.surface, border: `1px solid ${L.line}`, borderRadius: 28, padding: '44px 28px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
            <StatBig v="5" k="MODULES" sub="lessons + sims" />
            <StatBig v="100+" k="DEAL REPS" sub="in simulation" />
            <StatBig v="24/7" k="PEGASUS" sub="AI deal coach" />
            <StatBig v="60–100" k="GRADES" sub="on every sim" />
          </div>
        </div>
      </Wrap>
    </Section>
  );
}

// ── final CTA ──────────────────────────────────────────────────
function FinalCTA({ joined, onJoin }) {
  return (
    <Section bg={L.bg} style={{ padding: '120px 0', overflow: 'hidden' }}>
      <Backdrop glow={0.6} pos="bottom-left" />
      <Wrap style={{ textAlign: 'center', maxWidth: 760 }}>
        <Eye style={{ marginBottom: 18, display: 'block' }}>The clock is running</Eye>
        <h2 style={{ fontFamily: LF, fontSize: 'clamp(38px, 5.5vw, 68px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.0, color: L.ink, margin: '0 0 22px', textWrap: 'balance' }}>
          Your career has an end date.<br /><span style={{ fontFamily: LS, fontStyle: 'italic', fontWeight: 400, color: L.blue }}>Your portfolio doesn’t have to.</span>
        </h2>
        <p style={{ fontFamily: LF, fontSize: 19, lineHeight: 1.5, color: L.muted, margin: '0 auto 36px', maxWidth: 520 }}>
          Join the waitlist for private beta. Early members get founding access and a head start on the leaderboard.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WaitlistForm joined={joined} onJoin={onJoin} size="lg" />
        </div>
      </Wrap>
    </Section>
  );
}

// ── footer ─────────────────────────────────────────────────────
function Footer() {
  const cols = [
    ['Product', ['How it works', 'Features', 'The game', 'Pegasus']],
    ['Company', ['About', 'Careers', 'Press', 'Contact']],
    ['Legal', ['Privacy', 'Terms', 'Security']],
  ];
  return (
    <footer style={{ background: L.bg3, padding: '64px 0 40px' }}>
      <Wrap style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 32 }} className="footer-grid">
        <div>
          <ETWordmark size={22} />
          <p style={{ fontFamily: LF, fontSize: 14.5, lineHeight: 1.55, color: L.muted, margin: '18px 0 0', maxWidth: 280 }}>
            The wealth game built for pro athletes. Learn, simulate, own. Before the contract ends.
          </p>
        </div>
        {cols.map(([h, items], i) => (
          <div key={i}>
            <div style={{ fontFamily: LM, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', color: L.dim, marginBottom: 16 }}>{h.toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {items.map((it) => (
                <a key={it} href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: LF, fontSize: 15, color: L.muted, textDecoration: 'none', transition: 'color .15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = L.ink)} onMouseLeave={(e) => (e.currentTarget.style.color = L.muted)}>{it}</a>
              ))}
            </div>
          </div>
        ))}
      </Wrap>
      <Wrap style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${L.line}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: LF, fontSize: 13.5, color: L.dim }}>© 2026 Elite Transition. All rights reserved.</span>
        <span style={{ fontFamily: LM, fontSize: 12, letterSpacing: '0.1em', color: L.dim }}>EARN MORE THAN YOU OWNED.</span>
      </Wrap>
    </footer>
  );
}

// ── app shell ──────────────────────────────────────────────────
function LandingApp() {
  const [joined, join] = useWaitlist();
  const onJoin = (email) => { join(email); };
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <div style={{ background: L.bg }}>
      <Nav onJoin={scrollTop} />
      <Hero joined={joined} onJoin={onJoin} />
      <PlayersSection />
      <ExperienceBand />
      <Features />
      <PegasusSection />
      <FinalCTA joined={joined} onJoin={onJoin} />
      <Footer />
    </div>
  );
}

Object.assign(window, { Section, Wrap, SecHead, MiniPhone, PathCard, PathPanel, HowItWorks, Features, PegasusSection, Gamified, FinalCTA, Footer, LandingApp });
