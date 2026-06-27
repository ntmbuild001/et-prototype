// et2-screens-extra.jsx — supporting screens: Profile, Settings,
// Notifications, Paywall, Leaderboard. ET2 design system throughout.

const ET2_TABS = [
  { id: 'dashboard', label: 'Home',    icon: 'home' },
  { id: 'lessons',   label: 'Lessons', icon: 'lessons' },
  { id: 'league',    label: 'League',  icon: 'league' },
  { id: 'profile',   label: 'Profile', icon: 'profile' },
];

function ET2Row({ label, sub, value, onClick, danger, last }) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: onClick ? 'pointer' : 'default', textAlign: 'left', width: '100%',
      background: 'transparent', border: 0, borderBottom: last ? 0 : `1px solid ${ET2P.line}`,
      padding: '15px 18px', display: 'flex', alignItems: 'center', gap: 12, color: ET2P.text, minHeight: 54 }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: danger ? ET2P.red : ET2P.text }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 12.5, color: ET2P.muted, marginTop: 2 }}>{sub}</span>}
      </span>
      {value && <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.muted, flexShrink: 0 }}>{value}</span>}
      {onClick && <KeylineIcon name="forward" size={14} color={ET2P.muted} accent={ET2P.muted} />}
    </button>
  );
}

function ET2Toggle({ label, sub, value, onChange, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 18px',
      borderBottom: last ? 0 : `1px solid ${ET2P.line}`, minHeight: 54 }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 600 }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 12.5, color: ET2P.muted, marginTop: 2 }}>{sub}</span>}
      </span>
      <button onClick={() => onChange(!value)} aria-label={label} style={{
        appearance: 'none', cursor: 'pointer', border: 0, flexShrink: 0,
        width: 50, height: 30, borderRadius: 999, position: 'relative',
        background: value ? ET2P.lime : ET2P.line2, transition: 'background .2s' }}>
        <span style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 24, height: 24,
          borderRadius: '50%', background: value ? ET2P.ink : '#777', transition: 'left .2s' }}></span>
      </button>
    </div>
  );
}

function ET2Card({ children, style = {} }) {
  return <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden', ...style }}>{children}</div>;
}

// ── Profile ──────────────────────────────────────────────────────
function ET2ProfileScreen({ progress, lessons, onTab, onSettings, onPaywall, onLeague }) {
  const simsPassed = Object.keys(progress.simGrades).length;
  const level = 1 + Math.floor(progress.xp / 600);
  const levelPct = ((progress.xp % 600) / 600) * 100;
  return (
    <ET2Shell label="Profile">
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 22px 110px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: ET2P.surface2,
            border: `2px solid ${ET2P.lime}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: ET2_MONO, fontSize: 20, fontWeight: 700, color: ET2P.lime, flexShrink: 0 }}>AC</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-0.02em' }}>Alex Chen</div>
            <div style={{ fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: ET2P.muted, marginTop: 4 }}>
              Rookie Investor · LVL {level}
            </div>
          </div>
          <button onClick={onSettings} aria-label="Settings" style={{ appearance: 'none', cursor: 'pointer', border: 0,
            width: 40, height: 40, borderRadius: '50%', background: ET2P.surface, color: ET2P.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <KeylineIcon name="settings" size={19} color="currentColor" accent={ET2P.lime} />
          </button>
        </div>

        {/* level progress */}
        <ET2Card style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <ET2Mono size={9.5}>Level {level} → {level + 1}</ET2Mono>
            <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.lime }}>{progress.xp.toLocaleString()} XP</span>
          </div>
          <div style={{ height: 6, background: ET2P.surface2, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${levelPct}%`, height: '100%', background: ET2P.lime, borderRadius: 999 }}></div>
          </div>
        </ET2Card>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { k: 'Streak', v: `${progress.streak}d`, c: ET2P.lime },
            { k: 'Sims', v: `${simsPassed}/5`, c: ET2P.text },
            { k: 'Lessons', v: `${progress.completed.length}/5`, c: ET2P.text },
          ].map((s, i) => (
            <ET2Card key={i} style={{ padding: '14px 14px' }}>
              <ET2Mono size={9} style={{ marginBottom: 7 }}>{s.k}</ET2Mono>
              <div style={{ fontFamily: ET2_MONO, fontSize: 19, fontWeight: 700, color: s.c }}>{s.v}</div>
            </ET2Card>
          ))}
        </div>

        {/* league entry */}
        <button onClick={onLeague} style={{ appearance: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
          border: `1px solid ${ET2P.line}`, borderRadius: 22, padding: '15px 18px', background: ET2P.surface,
          color: ET2P.text, display: 'flex', alignItems: 'center', gap: 13 }}>
          <ET2Puffy type="trophy" hue="lime" size={30} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>Rookie League</span>
            <span style={{ display: 'block', fontSize: 12.5, color: ET2P.muted, marginTop: 1 }}>Weekly · 4 days left</span>
          </span>
          <KeylineIcon name="forward" size={14} color={ET2P.muted} accent={ET2P.muted} />
        </button>

        {/* sim transcript */}
        <div>
          <ET2Mono color={ET2P.lime} style={{ marginBottom: 10 }}>Simulator transcript</ET2Mono>
          <ET2Card>
            {lessons.map((l, i) => {
              const g = progress.simGrades[l.sim.id];
              return (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                  borderBottom: i === lessons.length - 1 ? 0 : `1px solid ${ET2P.line}` }}>
                  <ET2Puffy type={l.icon} hue={g ? 'lime' : 'slate'} size={30} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700 }}>{l.sim.name}</span>
                    <span style={{ display: 'block', fontSize: 12, color: ET2P.muted, marginTop: 1 }}>Stop {l.n} · {l.title}</span>
                  </span>
                  {g ? (
                    <span style={{ width: 34, height: 34, borderRadius: 10, border: `1.5px solid ${simGradeColor(g)}`,
                      color: simGradeColor(g), display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{g}</span>
                  ) : (
                    <span style={{ fontFamily: ET2_MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', color: ET2P.muted, flexShrink: 0 }}>—</span>
                  )}
                </div>
              );
            })}
          </ET2Card>
        </div>

        {/* pro upsell */}
        <button onClick={onPaywall} style={{ appearance: 'none', cursor: 'pointer', textAlign: 'left', border: `1px solid ${ET2P.lime}55`,
          borderRadius: 22, padding: '18px 18px', background: `linear-gradient(135deg, #07140d 0%, ${ET2P.surface} 75%)`,
          color: ET2P.text, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: ET2_MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, marginBottom: 5 }}>ET PRO</span>
            <span style={{ display: 'block', fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>Unlock every module & sim</span>
            <span style={{ display: 'block', fontSize: 12.5, color: ET2P.muted, marginTop: 3 }}>7-day free trial, then $11.99/mo</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M5 12h13M12 6l6 6-6 6" stroke={ET2P.lime} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <TabBar palette={ET2_HOME_PALETTE} current="profile" tabs={ET2_TABS} onJump={onTab} />
      </div>
    </ET2Shell>
  );
}

// ── Leaderboard ──────────────────────────────────────────────────
const ET2_LEAGUE = [
  { name: 'Dre Whitfield', xp: 2210 },
  { name: 'Jaylen Brooks', xp: 1950 },
  { name: 'Marcus Vale', xp: 1820 },
  { name: 'Alex Chen', xp: null, me: true }, // xp filled from live progress
  { name: 'Tory Lammers', xp: 1130 },
  { name: 'Cam Ridley', xp: 980 },
  { name: 'DeShawn Pope', xp: 840 },
  { name: 'Isaiah Granger', xp: 720 },
];

function ET2LeaderboardScreen({ progress, onTab }) {
  const rows = ET2_LEAGUE.map((r) => ({ ...r, xp: r.me ? progress.xp : r.xp }))
    .sort((a, b) => b.xp - a.xp);
  const promo = 3;
  return (
    <ET2Shell label="Leaderboard">
      <div style={{ padding: '24px 22px 0', flexShrink: 0 }}>
        <ET2Mono color={ET2P.lime} style={{ marginBottom: 6 }}>Weekly league · 4 days left</ET2Mono>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Rookie League</div>
        <div style={{ fontSize: 13.5, color: ET2P.muted, marginTop: 4 }}>Top {promo} advance to Contender League.</div>
      </div>
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 110px' }}>
        <ET2Card>
          {rows.map((r, i) => {
            const isPromo = i < promo;
            return (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                background: r.me ? 'rgba(0,255,127,0.06)' : 'transparent',
                borderLeft: r.me ? `3px solid ${ET2P.lime}` : '3px solid transparent',
                borderBottom: i === rows.length - 1 ? 0 : `1px solid ${ET2P.line}` }}>
                <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, width: 20, flexShrink: 0,
                  color: isPromo ? ET2P.lime : ET2P.muted }}>{i + 1}</span>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: ET2P.surface2,
                  border: `1px solid ${r.me ? ET2P.lime : ET2P.line2}`, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, color: r.me ? ET2P.lime : ET2P.muted }}>
                  {r.name.split(' ').map((w) => w[0]).join('')}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: r.me ? 800 : 600 }}>
                  {r.name}{r.me && <span style={{ color: ET2P.lime, fontFamily: ET2_MONO, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.14em', marginLeft: 8 }}>YOU</span>}
                </span>
                <span style={{ fontFamily: ET2_MONO, fontSize: 12.5, fontWeight: 700, color: isPromo ? ET2P.lime : ET2P.muted, flexShrink: 0 }}>
                  {r.xp.toLocaleString()}
                </span>
              </div>
            );
          })}
        </ET2Card>
        <div style={{ marginTop: 14 }}>
          <SimCallout color={ET2P.blue}>
            <span style={{ fontWeight: 700 }}>XP counts this week only.</span> Lessons, quizzes and sim grades all feed the league.
          </SimCallout>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <TabBar palette={ET2_HOME_PALETTE} current="league" tabs={ET2_TABS} onJump={onTab} />
      </div>
    </ET2Shell>
  );
}

// ── Settings ─────────────────────────────────────────────────────
function ET2SettingsScreen({ onBack, onNotifications, onPaywall }) {
  const [s, setS] = React.useState({ sound: true, haptics: true });
  return (
    <ET2Shell label="Settings">
      <ET2Header onBack={onBack} eyebrow="Account" title="Settings" />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ET2Card>
          <ET2Row label="Notifications" sub="Reminders, streak alerts" onClick={onNotifications} />
          <ET2Toggle label="Sound effects" value={s.sound} onChange={(v) => setS({ ...s, sound: v })} />
          <ET2Toggle label="Haptics" value={s.haptics} onChange={(v) => setS({ ...s, haptics: v })} last />
        </ET2Card>
        <ET2Card>
          <ET2Row label="Subscription" sub="Free plan" value="UPGRADE" onClick={onPaywall} />
          <ET2Row label="Email" value="alex@chen.co" last />
        </ET2Card>
        <ET2Card>
          <ET2Row label="Restore purchases" onClick={() => {}} />
          <ET2Row label="Privacy policy" onClick={() => {}} />
          <ET2Row label="Sign out" danger onClick={() => {}} last />
        </ET2Card>
        <div style={{ fontFamily: ET2_MONO, fontSize: 9.5, fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: ET2P.muted, textAlign: 'center' }}>
          Elite Transition · v0.4 prototype
        </div>
      </div>
    </ET2Shell>
  );
}

// ── Notifications ────────────────────────────────────────────────
function ET2NotificationsScreen({ onBack }) {
  const [n, setN] = React.useState({ daily: true, streak: true, league: true, drops: false });
  const [time, setTime] = React.useState('7:00 PM');
  return (
    <ET2Shell label="Notifications">
      <ET2Header onBack={onBack} eyebrow="Settings" title="Notifications" />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ET2Card>
          <ET2Toggle label="Daily reminder" sub="One nudge to keep the streak alive" value={n.daily} onChange={(v) => setN({ ...n, daily: v })} last={!n.daily} />
          {n.daily && (
            <div style={{ padding: '4px 18px 16px', display: 'flex', gap: 8 }}>
              {['8:00 AM', '12:30 PM', '7:00 PM'].map((t) => (
                <button key={t} onClick={() => setTime(t)} style={{
                  appearance: 'none', cursor: 'pointer', flex: 1,
                  border: `1.5px solid ${time === t ? ET2P.lime : ET2P.line}`, borderRadius: 12,
                  background: time === t ? 'rgba(0,255,127,0.07)' : ET2P.surface2, color: ET2P.text,
                  padding: '10px 0', fontFamily: ET2_MONO, fontSize: 11, fontWeight: 700, minHeight: 44 }}>{t}</button>
              ))}
            </div>
          )}
        </ET2Card>
        <ET2Card>
          <ET2Toggle label="Streak alerts" sub="Warn me before midnight if I haven't trained" value={n.streak} onChange={(v) => setN({ ...n, streak: v })} />
          <ET2Toggle label="League updates" sub="Rank changes, promotion day" value={n.league} onChange={(v) => setN({ ...n, league: v })} />
          <ET2Toggle label="New module drops" value={n.drops} onChange={(v) => setN({ ...n, drops: v })} last />
        </ET2Card>
      </div>
    </ET2Shell>
  );
}

// ── Paywall ──────────────────────────────────────────────────────
function ET2PaywallScreen({ onClose }) {
  const [plan, setPlan] = React.useState('annual');
  return (
    <ET2Shell bg="radial-gradient(120% 75% at 50% -10%, #0a1a10 0%, #000 60%)" label="Paywall">
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 22px 0', flexShrink: 0 }}>
        <ET2RoundBtn onClick={onClose} label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"></path></svg>
        </ET2RoundBtn>
      </div>
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 26px 10px' }}>
        <ET2Mono color={ET2P.lime} style={{ marginBottom: 10 }}>ET Pro</ET2Mono>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.06 }}>
          Train like your money depends on it.
        </h1>
        <div style={{ fontFamily: ET2_SERIF, fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.65)', marginTop: 10, lineHeight: 1.4 }}>
          Because it does.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11, margin: '24px 0' }}>
          {['Every module, lesson and simulator', 'Unlimited sim replays — chase the S grade', 'Leagues, streak shields & bonus XP', 'New modules every month'].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14.5, fontWeight: 600 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" fill={ET2P.lime} fillOpacity="0.14"></circle>
                <path d="M7.5 12.5l3 3 6-7" stroke={ET2P.lime} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              {f}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { id: 'annual', label: 'Annual', price: '$79.99/yr', sub: '$6.67/mo · save 44%', badge: 'BEST VALUE' },
            { id: 'monthly', label: 'Monthly', price: '$11.99/mo', sub: 'Cancel anytime' },
          ].map((p) => {
            const on = plan === p.id;
            return (
              <button key={p.id} onClick={() => setPlan(p.id)} style={{
                appearance: 'none', cursor: 'pointer', textAlign: 'left',
                border: `2px solid ${on ? ET2P.lime : ET2P.line}`, borderRadius: 18, padding: '15px 16px',
                background: ET2P.surface, color: ET2P.text, display: 'flex', alignItems: 'center', gap: 13,
                boxShadow: on ? `0 0 30px ${ET2P.lime}22` : 'none', position: 'relative', minHeight: 54 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${on ? ET2P.lime : ET2P.line2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <span style={{ width: 11, height: 11, borderRadius: '50%', background: ET2P.lime }}></span>}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 15.5, fontWeight: 800 }}>{p.label}</span>
                  <span style={{ display: 'block', fontSize: 12.5, color: ET2P.muted, marginTop: 2 }}>{p.sub}</span>
                </span>
                <span style={{ fontFamily: ET2_MONO, fontSize: 13, fontWeight: 700, color: on ? ET2P.lime : ET2P.text, flexShrink: 0 }}>{p.price}</span>
                {p.badge && (
                  <span style={{ position: 'absolute', top: -9, right: 14, background: ET2P.lime, color: ET2P.ink,
                    fontFamily: ET2_MONO, fontSize: 8.5, fontWeight: 700, letterSpacing: '0.14em',
                    padding: '3px 8px', borderRadius: 999 }}>{p.badge}</span>
                )}
              </button>
            );
          })}
        </div>
        <div style={{ fontFamily: ET2_MONO, fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', color: ET2P.muted, textAlign: 'center', marginTop: 16, textTransform: 'uppercase' }}>
          7-day free trial · cancel anytime
        </div>
      </div>
      <ET2Cta label="Start free trial" onClick={onClose} />
    </ET2Shell>
  );
}

Object.assign(window, {
  ET2ProfileScreen, ET2LeaderboardScreen, ET2SettingsScreen,
  ET2NotificationsScreen, ET2PaywallScreen, ET2_TABS,
});
