// et2-home.jsx — home screen for the connected app: greeting, streak,
// continue card, module overview, tab bar.

function ET2StreakChip({ days }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: ET2P.surface,
      border: `1px solid ${ET2P.line}`, borderRadius: 999, padding: '8px 14px' }}>
      <KeylineIcon name="streak" size={14} color={ET2P.lime} accent={ET2P.lime} />
      <span style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.text }}>{days}</span>
    </div>
  );
}

function ET2TabBar({ active = 'home', onTab }) {
  const tabs = [
    { id: 'home', label: 'Home', d: 'M4 11.5L12 4l8 7.5M6 10v9h12v-9' },
    { id: 'map', label: 'Journey', d: 'M9 20l-5-2V4l5 2 6-2 5 2v14l-5-2-6 2zM9 6v14M15 4v14' },
    { id: 'sims', label: 'Sims', d: 'M6 9h4M8 7v4M15 8.5h.01M17.5 11h.01M4.5 8A2.5 2.5 0 017 5.5h10A2.5 2.5 0 0119.5 8l.8 7a2.3 2.3 0 01-4 1.8L14.5 15h-5l-1.8 1.8a2.3 2.3 0 01-4-1.8z' },
    { id: 'profile', label: 'You', d: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5' },
  ];
  return (
    <div style={{ flexShrink: 0, borderTop: `1px solid ${ET2P.line}`, background: 'rgba(0,0,0,0.85)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', padding: '10px 8px 14px' }}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        const enabled = t.id === 'home' || t.id === 'map';
        return (
          <button key={t.id} onClick={enabled ? () => onTab(t.id) : undefined} style={{
            appearance: 'none', border: 0, background: 'transparent',
            cursor: enabled ? 'pointer' : 'default',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: isActive ? ET2P.lime : enabled ? ET2P.muted : '#3a3a3a', padding: '4px 0', minHeight: 44 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d={t.d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <span style={{ fontFamily: ET2_MONO, fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ET2HomeScreen({ module, lessons, stateOf, progress, onContinue, onMap }) {
  const doneCount = lessons.filter((l) => stateOf(l) === 'done').length;
  const current = lessons.find((l) => stateOf(l) === 'current');
  const allDone = !current;
  return (
    <ET2Shell label="Home">
      {/* header */}
      <div style={{ padding: '16px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <ETLogo variant="trail" size={34} color="#fff" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ET2StreakChip days={progress.streak} />
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: ET2P.surface2,
            border: `1px solid ${ET2P.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.lime }}>AC</div>
        </div>
      </div>

      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '26px 22px 18px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div style={{ fontFamily: ET2_SERIF, fontStyle: 'italic', fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.01em' }}>
            Morning, Alex.
          </div>
          <div style={{ fontSize: 14.5, color: ET2P.muted, marginTop: 6 }}>
            {allDone ? 'Module 01 is in the books. Next module drops soon.' : 'Your next deal is waiting on the board.'}
          </div>
        </div>

        {/* continue card */}
        {current && (
          <button onClick={onContinue} style={{
            appearance: 'none', cursor: 'pointer', textAlign: 'left', border: `1px solid ${ET2P.line}`,
            borderRadius: 26, padding: 20, background: `linear-gradient(135deg, #0c1322 0%, ${ET2P.surface} 70%)`,
            display: 'flex', alignItems: 'center', gap: 18, color: ET2P.text }}>
            <ET2CapTile state="current" isCurrent skin={ET2_SKINS.duo} size={86}>
              <ET2Puffy type={current.icon} hue="blue" size={50} />
            </ET2CapTile>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ET2Mono color={ET2P.blue} size={10} style={{ marginBottom: 6 }}>Continue · Stop {current.n} of {lessons.length}</ET2Mono>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{current.title}</div>
              <div style={{ fontSize: 13, color: ET2P.muted, marginTop: 5 }}>{current.tagline}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <span style={{ fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, color: ET2P.lime }}>{current.mins}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: ET2P.line2 }}></span>
                <span style={{ fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, color: ET2P.muted }}>ENDS IN SIM · {current.sim.name.toUpperCase()}</span>
              </div>
            </div>
          </button>
        )}

        {/* module progress */}
        <button onClick={onMap} style={{ appearance: 'none', cursor: 'pointer', textAlign: 'left',
          border: `1px solid ${ET2P.line}`, borderRadius: 26, padding: 20, background: ET2P.surface, color: ET2P.text }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <ET2Mono color={ET2P.lime} size={10} style={{ marginBottom: 5 }}>{module.eyebrow}</ET2Mono>
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.015em' }}>{module.title}</div>
            </div>
            <div style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.muted }}>{doneCount}/{lessons.length}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {lessons.map((l) => {
              const st = stateOf(l);
              return (
                <div key={l.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: st === 'done' ? 'rgba(0,255,127,0.09)' : st === 'current' ? 'rgba(47,126,255,0.12)' : ET2P.surface2,
                    border: `1px solid ${st === 'done' ? 'rgba(0,255,127,0.35)' : st === 'current' ? 'rgba(47,126,255,0.5)' : ET2P.line}` }}>
                    <ET2Puffy type={l.icon} hue={st === 'done' ? 'lime' : st === 'current' ? 'blue' : 'slate'} size={30} />
                  </div>
                  <div style={{ height: 5, width: 5, borderRadius: '50%',
                    background: st === 'done' ? ET2P.lime : st === 'current' ? ET2P.blue : ET2P.line2 }}></div>
                </div>
              );
            })}
          </div>
        </button>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, padding: '16px 18px', background: ET2P.surface }}>
            <ET2Mono size={9.5} style={{ marginBottom: 8 }}>Career XP</ET2Mono>
            <div style={{ fontFamily: ET2_MONO, fontSize: 24, fontWeight: 700, color: ET2P.lime }}>{progress.xp.toLocaleString()}</div>
          </div>
          <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, padding: '16px 18px', background: ET2P.surface }}>
            <ET2Mono size={9.5} style={{ marginBottom: 8 }}>Sims passed</ET2Mono>
            <div style={{ fontFamily: ET2_MONO, fontSize: 24, fontWeight: 700, color: ET2P.text }}>{progress.simsPassed} <span style={{ fontSize: 13, color: ET2P.muted }}>/ 5</span></div>
          </div>
        </div>
      </div>

      <ET2TabBar active="home" onTab={(t) => { if (t === 'map') onMap(); }} />
    </ET2Shell>
  );
}

Object.assign(window, { ET2HomeScreen, ET2TabBar, ET2StreakChip });
