// et-journey-screens.jsx — screens specific to the journey canvas:
// faithful blue recreations of the current onboarding flow + the "now" home,
// and a static poster wrapper for the motion-reel row.
// Relies on globals: VID, FNT, MONO, SERIF, PhoneFrame, PhoneFloat, Eyebrow,
// Headline, ETLogo, ET2Puffy (et2-ui), PegasusMark (et2-pegasus).

const JF = "'Inter Tight', system-ui, sans-serif";
const JM = "'JetBrains Mono', monospace";
const JS_ = "'Instrument Serif', Georgia, serif";

// generic dark screen wrapper that fills the phone inner area
function Screen({ children, bg = '#000', pad = 28, justify = 'flex-start' }) {
  return (
    <div style={{ width: '100%', height: '100%', background: bg, color: '#fff', fontFamily: JF,
      display: 'flex', flexDirection: 'column', justifyContent: justify, padding: pad }}>{children}</div>
  );
}

function ETMark({ size = 34 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: size * 0.12, height: size, background: i < 2 ? `linear-gradient(${VID.blueLite},${VID.blue})` : '#fff',
          transform: 'skewX(-14deg)', borderRadius: 2 }} />
      ))}
      <span style={{ fontFamily: JF, fontWeight: 800, fontSize: size * 0.86, letterSpacing: '-0.05em', color: '#fff', marginLeft: 4 }}>ET</span>
    </div>
  );
}

// progress dots/bar for onboarding intro
function IntroDots({ active = 0, total = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 7 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 4, borderRadius: 2, width: i === active ? 26 : 14,
          background: i === active ? VID.blue : 'rgba(255,255,255,0.22)' }} />
      ))}
    </div>
  );
}

// ── 1 · Intro hero ─────────────────────────────────────────────
function OnbIntro() {
  return (
    <Screen bg="radial-gradient(120% 70% at 70% 108%, #0a1733 0%, #000 55%)" justify="space-between">
      <div style={{ paddingTop: 8 }}><ETMark size={30} /></div>
      <div>
        <Eyebrow style={{ fontSize: 13, letterSpacing: '0.28em', marginBottom: 18 }}>WEALTH · FOR ATHLETES</Eyebrow>
        <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.02 }}>
          Own more than<br />you <span style={{ fontStyle: 'italic', fontFamily: JS_, fontWeight: 400, color: VID.blueLite }}>earned.</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 18, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)', maxWidth: 320 }}>
          A wealth education made for pro athletes. Real estate is the asset. Ownership is the outcome.
        </div>
      </div>
      <div>
        <div style={{ height: 58, borderRadius: 999, background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: JM, fontWeight: 700, fontSize: 16, letterSpacing: '0.16em', color: '#fff' }}>BEGIN</div>
      </div>
    </Screen>
  );
}

// ── 2 · The numbers ────────────────────────────────────────────
function OnbWhy() {
  return (
    <Screen bg="#000" justify="space-between">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: VID.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 6l-6 6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <IntroDots active={0} />
      </div>
      <div>
        <Eyebrow style={{ fontSize: 13, letterSpacing: '0.28em', marginBottom: 16 }}>THE NUMBERS</Eyebrow>
        <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04 }}>
          Your contract has<br />an <span style={{ color: VID.blueLite }}>end date.</span>
        </div>
        <div style={{ marginTop: 22, fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.72)' }}>
          Your portfolio doesn’t have to. <span style={{ color: '#fff', fontWeight: 600 }}>68% of former NFL players</span> file for bankruptcy within two years of retirement. This is how you stay on the other side of that stat.
        </div>
      </div>
      <div style={{ height: 58, borderRadius: 999, border: `1.5px solid ${VID.blue}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: JM, fontWeight: 700, fontSize: 16, letterSpacing: '0.16em', color: VID.blueLite }}>NEXT</div>
    </Screen>
  );
}

// ── 3 · Create account ─────────────────────────────────────────
function Field({ label, value, dots }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: JM, fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', color: VID.muted, marginBottom: 9 }}>{label}</div>
      <div style={{ height: 56, borderRadius: 14, background: VID.surface, border: `1px solid ${VID.line2}`,
        display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 17, color: dots ? '#fff' : '#fff' }}>
        {dots ? '•'.repeat(11) : value}
      </div>
    </div>
  );
}
function OnbAccount() {
  return (
    <Screen bg="#000" justify="space-between">
      <div style={{ paddingTop: 6 }}>
        <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
          Players today.<br /><span style={{ color: VID.blueLite }}>Partners tomorrow.</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 17, color: 'rgba(255,255,255,0.6)' }}>Drop your email.</div>
      </div>
      <div>
        <Field label="EMAIL ADDRESS" value="alex.chen@email.com" />
        <Field label="PASSWORD" dots />
      </div>
      <div>
        <div style={{ height: 58, borderRadius: 999, background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>Create Account</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: VID.line2 }} /><span style={{ fontFamily: JM, fontSize: 11, color: VID.muted }}>OR</span><div style={{ flex: 1, height: 1, background: VID.line2 }} />
        </div>
        <div style={{ height: 54, borderRadius: 999, border: `1px solid ${VID.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, fontSize: 16, fontWeight: 600, color: '#fff' }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', color: '#000', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>G</span>
          Continue with Google
        </div>
      </div>
    </Screen>
  );
}

// ── 4 · Verify with ID.me ──────────────────────────────────────
function OnbVerify() {
  const rows = [['Bank-grade encryption', 'lock'], ['Your data stays yours', 'shield'], ['Takes under 2 minutes', 'timer']];
  return (
    <Screen bg="radial-gradient(120% 60% at 50% 0%, #0a1430 0%, #000 60%)" justify="space-between">
      <div style={{ paddingTop: 28 }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: VID.surface, border: `1px solid ${VID.line2}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke={VID.blueLite} strokeWidth="1.8" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke={VID.blueLite} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.04 }}>Verify it’s<br />really <span style={{ color: VID.blueLite }}>you.</span></div>
        <div style={{ marginTop: 18, fontSize: 17, lineHeight: 1.5, color: 'rgba(255,255,255,0.66)' }}>We partner with <span style={{ color: '#fff', fontWeight: 600 }}>ID.me</span> to confirm your identity. One scan, fully private.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {rows.map(([t], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(30,91,255,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={VID.blueLite} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)' }}>{t}</span>
          </div>
        ))}
      </div>
      <div>
        <div style={{ height: 58, borderRadius: 999, background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 14, whiteSpace: 'nowrap' }}>Verify with ID.me</div>
        <div style={{ textAlign: 'center', fontSize: 15, color: VID.muted }}>I’ll do this later</div>
      </div>
    </Screen>
  );
}

// ── 5 · Goal ───────────────────────────────────────────────────
function ChoiceRow({ title, sub, sel }) {
  return (
    <div style={{ borderRadius: 16, border: `1.5px solid ${sel ? VID.blue : VID.line2}`, background: sel ? 'rgba(30,91,255,0.1)' : VID.surface,
      padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 14, color: VID.muted, marginTop: 3 }}>{sub}</div>
      </div>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${sel ? VID.blue : VID.line2}`, background: sel ? VID.blue : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </div>
  );
}
function OnbGoal() {
  return (
    <Screen bg="#000" justify="flex-start">
      <div style={{ paddingTop: 4 }}>
        <Eyebrow style={{ fontSize: 12, letterSpacing: '0.24em' }}>STEP 1 OF 3</Eyebrow>
        <div style={{ marginTop: 14, fontSize: 38, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05 }}>What’s your<br />primary goal?</div>
        <div style={{ marginTop: 12, fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>We’ll customize your playbook based on what you pick.</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26 }}>
        <ChoiceRow title="First Property" sub="Buy my first investment property." sel />
        <ChoiceRow title="Build a Portfolio" sub="Scale beyond a single rental." />
        <ChoiceRow title="Plan the Exit" sub="Set up post-career income." />
        <ChoiceRow title="Just Learn" sub="No deal yet. Get the basics." />
      </div>
      <div style={{ height: 58, borderRadius: 999, background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 'auto' }}>Continue</div>
    </Screen>
  );
}

// ── 6 · Topics ─────────────────────────────────────────────────
const TOPICS = ['Property Investment', 'Commercial Leasing', 'Tax Strategies', 'Zoning Laws', 'Market Analysis', 'Asset Management', 'REITs', '1031 Exchanges', 'Financing', 'Wholesaling'];
const TOPICS_SEL = new Set(['Property Investment', 'Tax Strategies', '1031 Exchanges', 'Financing']);
function OnbTopics() {
  return (
    <Screen bg="#000" justify="flex-start">
      <div style={{ paddingTop: 4 }}>
        <Eyebrow style={{ fontSize: 12, letterSpacing: '0.24em' }}>STEP 3 OF 3</Eyebrow>
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05 }}>Personalize your<br />experience</div>
        <div style={{ marginTop: 12, fontSize: 16, color: 'rgba(255,255,255,0.6)' }}>Select at least 3 topics to curate your playbook.</div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
        {TOPICS.map((t) => {
          const sel = TOPICS_SEL.has(t);
          return (
            <span key={t} style={{ padding: '12px 18px', borderRadius: 999, fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap',
              border: `1.5px solid ${sel ? VID.blue : VID.line2}`, background: sel ? VID.blue : 'transparent', color: sel ? '#fff' : 'rgba(255,255,255,0.8)' }}>{t}</span>
          );
        })}
      </div>
      <div style={{ height: 58, borderRadius: 999, background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 'auto' }}>Continue</div>
    </Screen>
  );
}

// ── 7 · All set ────────────────────────────────────────────────
function OnbComplete() {
  return (
    <Screen bg="radial-gradient(120% 65% at 50% -5%, #0a1733 0%, #000 55%)" justify="space-between">
      <div style={{ paddingTop: 30, textAlign: 'center' }}>
        <div style={{ width: 74, height: 74, borderRadius: '50%', background: VID.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22, boxShadow: `0 10px 36px ${VID.blue}66` }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>You’re all set!</div>
        <div style={{ marginTop: 12, fontSize: 16, color: 'rgba(255,255,255,0.62)', padding: '0 10px' }}>We’ve tailored your playbook based on your profile.</div>
      </div>
      <div style={{ borderRadius: 20, background: VID.surface, border: `1px solid ${VID.line2}`, padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: JM, fontWeight: 700, fontSize: 18, color: '#fff' }}>AC</div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700 }}>Alex Chen</div>
            <div style={{ fontSize: 14, color: VID.muted }}>First-time Investor</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          {['Property Investment', 'Tax Strategies', '1031 Exchanges'].map((t) => (
            <span key={t} style={{ padding: '7px 13px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: 'rgba(30,91,255,0.14)', color: VID.blueLite, whiteSpace: 'nowrap' }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ height: 58, borderRadius: 999, background: VID.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>Start Learning</div>
    </Screen>
  );
}

// ── Home (current / blue) ──────────────────────────────────────
function StatTile({ k, v, unit, sub }) {
  return (
    <div style={{ flex: 1, borderRadius: 18, background: VID.surface, border: `1px solid ${VID.line}`, padding: '16px 18px' }}>
      <div style={{ fontFamily: JM, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: VID.muted }}>{k}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
        <span style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>{v}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: VID.blueLite }}>{unit}</span>
      </div>
      <div style={{ fontFamily: JM, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.12em', color: VID.muted, marginTop: 6 }}>{sub}</div>
    </div>
  );
}
// Flat keyline glyphs for the "Up next" icon tiles (match the shipping app).
function HomeModuleIcon({ name, color }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'stack') return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 3 3 7.5 12 12l9-4.5L12 3z" {...p} /><path d="M3 12l9 4.5L21 12" {...p} /><path d="M3 16.5 12 21l9-4.5" {...p} /></svg>;
  if (name === 'house') return <svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" {...p} /></svg>;
  return <svg width="18" height="18" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="1.5" {...p} /><path d="M8 11V8a4 4 0 0 1 8 0v3" {...p} /></svg>;
}

function HomeModuleRow({ icon, title, meta, value, valueSub, muted }) {
  return (
    <div style={{ width: '100%', textAlign: 'left', background: VID.surface, border: `1px solid ${VID.line}`,
      borderRadius: 24, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, color: '#fff' }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: '#000', border: `1px solid ${VID.line}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <HomeModuleIcon name={icon} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 12.5, color: VID.muted, marginTop: 2 }}>{meta}</div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: muted ? VID.muted : '#fff', whiteSpace: 'nowrap' }}>
        {value}{valueSub && <span style={{ color: VID.muted, fontWeight: 600 }}>{valueSub}</span>}
      </div>
    </div>
  );
}

function HomeNow() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#000', color: '#fff', fontFamily: JF, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'hidden', padding: '14px 22px 0' }}>
        <div style={{ fontSize: 17, color: VID.muted, fontWeight: 500 }}>Good afternoon</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.04 }}>Alex.</div>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: 'rgba(28,30,42,0.7)', border: `1px solid ${VID.line}`, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.6" stroke="#fff" strokeWidth="1.8" /><path d="M4.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>

        {/* Streak + lessons bento */}
        <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: VID.surface, border: `1px solid ${VID.line}`, borderRadius: 24, padding: '18px 18px', minHeight: 110, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 13, color: VID.muted, fontWeight: 500, marginBottom: 'auto' }}>Streak</div>
            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>6</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: VID.blue }}>days</span>
            </div>
            <div style={{ marginTop: 6, fontFamily: JM, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: VID.muted }}>Don&rsquo;t break it</div>
          </div>
          <div style={{ background: VID.surface, border: `1px solid ${VID.line}`, borderRadius: 24, padding: '18px 18px', minHeight: 110, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: 13, color: VID.muted, fontWeight: 500, marginBottom: 'auto' }}>Lessons done</div>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1 }}>4</div>
            <div style={{ marginTop: 6, fontFamily: JM, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: VID.muted }}>This year</div>
          </div>
        </div>

        {/* Hero blue card */}
        <div style={{ marginTop: 10, background: `radial-gradient(140% 120% at 0% 0%, #5187FF 0%, ${VID.blue} 42%, #0E3FB8 100%)`,
          borderRadius: 24, padding: '22px 22px 20px', position: 'relative', overflow: 'hidden', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: JM, fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>Today · Stop 5 / 5</div>
            <div style={{ fontFamily: JM, fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>~22 min</div>
          </div>
          <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.04 }}>Own the Block</h2>
          <div style={{ marginTop: 18 }}>
            <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
              <div style={{ width: '80%', height: '100%', background: '#fff', borderRadius: 999 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: JM, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
              <span>Your first deal</span><span>80%</span>
            </div>
          </div>
          <div style={{ marginTop: 18, height: 48, borderRadius: 999, background: '#fff', color: '#000', fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%' }}>
            Continue
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>

        {/* Fact of the day */}
        <div style={{ marginTop: 10, background: VID.surface, border: `1px solid ${VID.line}`, borderRadius: 24, padding: '20px 22px' }}>
          <div style={{ fontFamily: JM, fontSize: 9.5, fontWeight: 600, letterSpacing: '0.24em', textTransform: 'uppercase', color: VID.blue, marginBottom: 10 }}>Fact of the day</div>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.01em', textWrap: 'pretty' }}>A 30-year mortgage at 7% costs you 1.4&times; the home price in interest. Worth knowing before you sign.</p>
        </div>

        {/* Up next */}
        <div style={{ marginTop: 28, marginBottom: 14, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Up next</h3>
          <span style={{ color: VID.muted, fontFamily: JM, fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }}>See all →</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <HomeModuleRow icon="stack" title="Tax Shelters & 1031" meta="8 Lessons · Advanced" value="Not started" muted />
          <HomeModuleRow icon="house" title="Multifamily Math" meta="6 Lessons · Intermediate" value="Day 2" valueSub="/6" />
          <HomeModuleRow icon="lock" title="Cashflow & Cap Rates" meta="10 Lessons · Intermediate" value="Locked" muted />
        </div>
        <div style={{ height: 18 }} />
      </div>

      {/* bottom tab bar — pill, Home / Lessons / Agent */}
      <div style={{ flexShrink: 0, padding: '0 16px 16px' }}>
        <div style={{ background: 'rgba(28,28,28,0.78)', border: `1px solid ${VID.line}`, borderRadius: 999, padding: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          {[['home', true], ['lessons', false], ['agent', false]].map(([n, on], i) => (
            <div key={i} style={{ flex: 1, padding: '12px 14px', borderRadius: 999, background: on ? '#fff' : 'transparent', color: on ? '#000' : VID.muted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <TabGlyph name={n} color="currentColor" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function TabGlyph({ name, color = '#8A8A8A' }) {
  const p = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9z" {...p} /></svg>;
  if (name === 'lessons') return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 5a1 1 0 0 1 1-1h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H3V5z" {...p} /><path d="M21 5a1 1 0 0 0-1-1h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h7V5z" {...p} /></svg>;
  if (name === 'agent') return <svg width="22" height="22" viewBox="0 0 24 24"><path d="M12 3v2" {...p} /><circle cx="12" cy="2.4" r="0.9" fill={color} stroke="none" /><rect x="4.5" y="6" width="15" height="12" rx="4" {...p} /><circle cx="9" cy="12" r="1.2" fill={color} stroke="none" /><circle cx="15" cy="12" r="1.2" fill={color} stroke="none" /><path d="M3 11v3M21 11v3" {...p} /></svg>;
  return null;
}

// ── Reel poster (static representation of a motion spot) ────────
function ReelPoster({ eyebrow, lines, accent = VID.blueLite, children, phoneScale = 0.62 }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(60% 42% at 30% 14%, rgba(30,91,255,0.22), transparent 60%), #000' }}>
      {/* faint grid */}
      <div style={{ position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(80,90,110,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(80,90,110,0.08) 1px, transparent 1px)`,
        backgroundSize: '40px 40px', maskImage: 'radial-gradient(75% 60% at 50% 40%, #000, transparent 85%)', WebkitMaskImage: 'radial-gradient(75% 60% at 50% 40%, #000, transparent 85%)' }} />
      <div style={{ position: 'absolute', left: 34, top: 40, right: 34, zIndex: 3 }}>
        <div style={{ fontFamily: JM, fontSize: 13, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: VID.blue, marginBottom: 14 }}>{eyebrow}</div>
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: JF, fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.0, color: l.c || '#fff' }}>{l.t}</div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: '50%', bottom: -40, transform: `translateX(-50%) rotateX(6deg) rotateZ(-3deg) scale(${phoneScale})`, transformOrigin: 'bottom center',
        filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.7)) drop-shadow(0 0 40px ${VID.blue}33)` }}>
        <PhoneFrame>{children}</PhoneFrame>
      </div>
    </div>
  );
}

Object.assign(window, { OnbIntro, OnbWhy, OnbAccount, OnbVerify, OnbGoal, OnbTopics, OnbComplete, HomeNow, ReelPoster, ETMark });
