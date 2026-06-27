// et2-sims.jsx — simulator router + shared sim UI (spec rows, results screen).

const SIM_XP = { S: 200, A: 150, B: 100, C: 50, F: 25 };
const simGradeColor = (g) => (g === 'S' || g === 'A') ? ET2P.lime : g === 'B' ? ET2P.blue : g === 'C' ? '#FFB347' : ET2P.red;
const sim$ = (n) => `$${Math.round(Math.abs(n)).toLocaleString()}`;
const simSigned = (n) => `${n < 0 ? '−' : '+'}$${Math.round(Math.abs(n)).toLocaleString()}`;

function SimSpecRow({ k, v, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${ET2P.line}` }}>
      <span style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: ET2P.muted, textTransform: 'uppercase' }}>{k}</span>
      <span style={{ fontFamily: ET2_MONO, fontSize: 12.5, fontWeight: 700, color: accent || ET2P.text, textAlign: 'right' }}>{v}</span>
    </div>
  );
}

function SimCallout({ color, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 14, padding: '12px 14px',
      background: ET2P.bg, border: `1px dashed ${color || ET2P.lime}66` }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="9" stroke={color || ET2P.lime} strokeWidth="1.7"></circle>
        <path d="M12 11v6M12 7.5v.5" stroke={color || ET2P.lime} strokeWidth="1.9" strokeLinecap="round"></path>
      </svg>
      <div style={{ fontSize: 13, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

// Shared results screen — grade badge + breakdown card + serif line.
function ET2SimResults({ label, eyebrow, title, grade, line, rows, onRetry, onCollect }) {
  const gradeColor = simGradeColor(grade);
  const xp = SIM_XP[grade];
  return (
    <ET2Shell bg="radial-gradient(120% 75% at 50% -10%, #0a1410 0%, #000 60%)" label={label}>
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '30px 22px 10px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <div>
            <ET2Mono color={gradeColor} size={10} style={{ marginBottom: 6 }}>{eyebrow}</ET2Mono>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.04 }}>{title}</div>
          </div>
          <div className="et2-pop" style={{ width: 84, height: 84, border: `2px solid ${gradeColor}`, borderRadius: 20,
            background: ET2P.surface,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: gradeColor, flexShrink: 0, boxShadow: `0 0 28px ${gradeColor}33` }}>
            <span style={{ fontFamily: ET2_MONO, fontSize: 8, fontWeight: 700, letterSpacing: '0.22em' }}>GRADE</span>
            <span style={{ fontSize: 42, fontWeight: 800, lineHeight: 1 }}>{grade}</span>
          </div>
        </div>

        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          {rows.map((r, i) => <SimSpecRow key={i} k={r.k} v={r.v} accent={r.accent} />)}
        </div>

        <div style={{ fontFamily: ET2_SERIF, fontStyle: 'italic', fontSize: 19, lineHeight: 1.35, color: 'rgba(255,255,255,0.85)', textWrap: 'balance' }}>
          {line}
        </div>

        <button onClick={onRetry} style={{ appearance: 'none', cursor: 'pointer', background: 'transparent',
          border: `1px solid ${ET2P.line2}`, borderRadius: 999, color: ET2P.muted, padding: '12px 16px',
          fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          ↺ Run it back
        </button>
      </div>
      <ET2Cta label={`Collect rewards · +${xp} XP`} onClick={onCollect} />
    </ET2Shell>
  );
}

// Fallback for anything not yet built.
function ET2SimSoon({ lesson, onBack, onFinish }) {
  const sim = lesson.sim;
  return (
    <ET2Shell label={`Sim ${sim.name} Soon`}>
      <ET2Header onBack={onBack} eyebrow={`Simulator ${String(lesson.n).padStart(2, '0')}`} eyebrowColor={ET2P.lime}
        title={sim.name} />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '26px 22px 10px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ border: `1px solid ${ET2P.line}`, borderRadius: 22, background: ET2P.surface, overflow: 'hidden' }}>
          <div style={{ padding: '18px 16px', fontFamily: ET2_MONO }}>
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.blue, marginBottom: 12 }}>STATUS — DEPLOYING SOON</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.02em' }}>
              {sim.brief}
            </div>
          </div>
        </div>
      </div>
      <ET2Cta label="Finish lesson" onClick={onFinish} />
    </ET2Shell>
  );
}

// Router: lesson → simulator implementation.
function ET2SimScreen({ lesson, onBack, onComplete, onSkip }) {
  switch (lesson.sim.id) {
    case 'spotter':     return <ET2SpotterSim onBack={onBack} onComplete={onComplete} />;
    case 'buyboxsim':   return <ET2BuyBoxSim onBack={onBack} onComplete={onComplete} />;
    case 'underwriter': return <ET2UnderwriteSim onBack={onBack} onComplete={onComplete} />;
    case 'flipit':      return <ET2FlipSim onBack={onBack} onComplete={onComplete} />;
    case 'blockroyale': return <ET2BlockSim onBack={onBack} onComplete={onComplete} />;
    default:            return <ET2SimSoon lesson={lesson} onBack={onBack} onFinish={onSkip} />;
  }
}

Object.assign(window, { ET2SimScreen, ET2SimSoon, ET2SimResults, SimSpecRow, SimCallout, SIM_XP, simGradeColor, sim$, simSigned });
