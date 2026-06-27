// et2-map.jsx — in-app journey map (glossy key-cap style), driven by progress.

const ET2MAP_PTS = [
  { x: 100, y: 588 }, { x: 276, y: 486 }, { x: 122, y: 360 },
  { x: 286, y: 240 }, { x: 168, y: 116 },
];
const ET2MAP_VBW = 394, ET2MAP_VBH = 700;

function ET2MapStop({ lesson, state, skin, onOpen }) {
  const isCurrent = state === 'current', isLocked = state === 'locked';
  const hue = skin.iconHue[state];
  const eyebrow = isCurrent ? 'IN PROGRESS' : isLocked ? 'LOCKED' : `STOP ${lesson.n}`;
  const eColor = isCurrent ? ET2P.blue : isLocked ? ET2P.muted : ET2P.lime;
  const pt = ET2MAP_PTS[lesson.n - 1];
  return (
    <div style={{ position: 'absolute', left: `${(pt.x / ET2MAP_VBW) * 100}%`, top: `${(pt.y / ET2MAP_VBH) * 100}%`,
      transform: 'translate(-50%,-50%)', width: 168, display: 'flex', flexDirection: 'column', alignItems: 'center',
      zIndex: isCurrent ? 6 : 2 }}>
      <button onClick={isLocked ? undefined : () => onOpen(lesson)} style={{
        appearance: 'none', border: 0, background: 'transparent', padding: 0,
        cursor: isLocked ? 'default' : 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', opacity: isLocked ? 0.62 : 1 }}>
          <ET2CapTile state={state} isCurrent={isCurrent} skin={skin} big>
            <ET2Puffy type={lesson.icon} hue={hue} size={isCurrent ? 60 : 52} />
          </ET2CapTile>
          <div style={{ position: 'absolute', right: -6, top: -6, zIndex: 4 }}>
            <ET2MapNode state={state} size={isCurrent ? 36 : 30} />
          </div>
        </div>
        <div style={{ marginTop: 14, textAlign: 'center', maxWidth: 150 }}>
          <ET2Mono color={eColor} size={9.5} style={{ marginBottom: 5 }}>{eyebrow}</ET2Mono>
          <div style={{ fontFamily: ET2_FONT, fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2,
            color: isLocked ? ET2P.muted : ET2P.text, textWrap: 'balance' }}>{lesson.title}</div>
        </div>
      </button>
    </div>
  );
}

function ET2MapNode({ state, size = 32 }) {
  const isDone = state === 'done', isCurrent = state === 'current';
  const bg = isDone ? ET2P.lime : isCurrent ? ET2P.blue : ET2P.surface;
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg,
      border: state === 'locked' ? `1px solid ${ET2P.line2}` : 0,
      boxShadow: isDone ? `0 2px 8px ${ET2P.lime}66` : isCurrent ? `0 0 16px ${ET2P.blue}aa` : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {isDone && <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={ET2P.ink} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
      {isCurrent && <svg width={size * 0.4} height={size * 0.4} viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"></path></svg>}
      {state === 'locked' && <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="1.6" stroke={ET2P.muted} strokeWidth="1.8"></rect><path d="M8 11V8a4 4 0 018 0v3" stroke={ET2P.muted} strokeWidth="1.8" strokeLinecap="round"></path></svg>}
    </div>
  );
}

function ET2MapScreen({ module, lessons, stateOf, skin, onBack, onOpen }) {
  const doneCount = lessons.filter((l) => stateOf(l) === 'done').length;
  const current = lessons.find((l) => stateOf(l) === 'current');
  const allDone = doneCount === lessons.length;
  return (
    <ET2Shell bg={skin.bg} label="Journey Map">
      <div style={{ padding: '14px 22px 0', display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
        <ET2RoundBtn onClick={onBack} label="Back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </ET2RoundBtn>
        <div style={{ flex: 1, paddingTop: 1 }}>
          <ET2Mono color={ET2P.blue} style={{ marginBottom: 4 }}>{module.eyebrow} · {module.title}</ET2Mono>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05 }}>Your Journey</div>
        </div>
        <div style={{ fontFamily: ET2_MONO, fontSize: 12, fontWeight: 700, color: ET2P.muted, paddingTop: 6 }}>{doneCount}/{lessons.length}</div>
      </div>
      <ET2Progress percent={(doneCount / lessons.length) * 100} />
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <svg viewBox={`0 0 ${ET2MAP_VBW} ${ET2MAP_VBH}`} preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {[[0, 1], [1, 2], [2, 3], [3, 4]].map(([a, b], i) => {
            const A = ET2MAP_PTS[a], B = ET2MAP_PTS[b];
            const sa = stateOf(lessons[a]), sb = stateOf(lessons[b]);
            const lit = sb === 'done' || (sa === 'done' && sb === 'current');
            return <line key={i} x1={A.x} y1={A.y + 6} x2={B.x} y2={B.y + 6}
              stroke={lit ? ET2P.lime : skin.pathLocked} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={lit ? 'none' : '2 13'} strokeOpacity={lit ? 0.5 : 1}></line>;
          })}
        </svg>
        {lessons.map((l) => <ET2MapStop key={l.id} lesson={l} state={stateOf(l)} skin={skin} onOpen={onOpen} />)}
      </div>
      <ET2Cta
        label={allDone ? 'Module complete' : `Continue · ${current ? current.title : ''}`}
        color={allDone ? 'ghost' : 'lime'}
        arrow={!allDone}
        onClick={allDone || !current ? undefined : () => onOpen(current)}
      />
    </ET2Shell>
  );
}

Object.assign(window, { ET2MapScreen });
