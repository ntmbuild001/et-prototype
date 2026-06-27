// et2-rewards.jsx — lesson-complete rewards: XP tally, streak, back to map.

function ET2RewardsScreen({ lesson, result, progress, replay, onMap }) {
  // result: { quizCorrect, quizTotal, simGrade, simXp, simLine, totalXp }
  const rows = [
    { label: `Quiz · ${result.quizCorrect}/${result.quizTotal} correct`, xp: result.quizCorrect * ET2DATA.QUIZ_XP },
    ...(result.simGrade ? [{ label: `${lesson.sim.name} · Grade ${result.simGrade}`, xp: result.simXp }] : []),
  ];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIdx = 3; // prototype: Thursday
  const litFrom = todayIdx - Math.min(progress.streak, todayIdx + 1) + 1;

  return (
    <ET2Shell bg="radial-gradient(120% 75% at 50% -10%, #0a1a10 0%, #000 60%)" label="Rewards">
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '46px 22px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div className="et2-pop" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <ET2CapTile state="done" isCurrent skin={ET2_SKINS.green} size={124} big>
            <ET2Puffy type="trophy" hue="lime" size={66} />
          </ET2CapTile>
        </div>
        <div style={{ textAlign: 'center' }}>
          <ET2Mono color={ET2P.lime} style={{ marginBottom: 8 }}>{replay ? 'Replay complete' : `Stop ${lesson.n} complete`}</ET2Mono>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.05, textWrap: 'balance' }}>{lesson.title}</div>
          {result.simLine && <div style={{ fontFamily: ET2_SERIF, fontStyle: 'italic', fontSize: 18, color: 'rgba(255,255,255,0.7)', marginTop: 10, maxWidth: 300, lineHeight: 1.35 }}>{result.simLine}</div>}
        </div>

        {/* XP tally */}
        <div style={{ width: '100%', border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: `1px solid ${ET2P.line}` }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{r.label}</span>
              <span style={{ fontFamily: ET2_MONO, fontSize: 13, fontWeight: 700, color: ET2P.lime }}>+{r.xp}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(0,255,127,0.05)' }}>
            <ET2Mono color={ET2P.text} size={10.5}>{replay ? 'Replay — no XP banked' : 'XP earned'}</ET2Mono>
            <span style={{ fontFamily: ET2_MONO, fontSize: 17, fontWeight: 700, color: replay ? ET2P.muted : ET2P.lime }}>
              {replay ? '+0' : `+${result.totalXp}`}
            </span>
          </div>
        </div>

        {/* streak */}
        <div style={{ width: '100%', border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
            <ET2Mono size={10}>Streak</ET2Mono>
            <span style={{ fontFamily: ET2_MONO, fontSize: 13, fontWeight: 700, color: ET2P.lime }}>{progress.streak} days</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {days.map((d, i) => {
              const lit = i >= litFrom && i <= todayIdx;
              const isToday = i === todayIdx;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', aspectRatio: '1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: lit ? 'rgba(0,255,127,0.1)' : ET2P.surface2,
                    border: `1px solid ${isToday ? ET2P.lime : lit ? 'rgba(0,255,127,0.35)' : ET2P.line}` }}>
                    <KeylineIcon name="streak" size={15} color={lit ? ET2P.lime : ET2P.line2} accent={lit ? ET2P.lime : ET2P.line2} />
                  </div>
                  <span style={{ fontFamily: ET2_MONO, fontSize: 9, fontWeight: 700, color: isToday ? ET2P.text : ET2P.muted }}>{d}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ET2Cta label="Back to the map" onClick={onMap} />
    </ET2Shell>
  );
}

Object.assign(window, { ET2RewardsScreen });
