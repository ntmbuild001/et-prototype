// et2-lesson.jsx — lesson intro, reading cards, and quiz player.
// Layout/UX matches the original lesson-screen explorations (LS_* designs):
// round back/close chrome, solid progress strip, surface cards r16–22,
// radio-circle quiz options with lime glow, blockquote pull-quotes.

// ── Lesson intro ─────────────────────────────────────────────────
function ET2LessonIntro({ lesson, onBack, onStart }) {
  return (
    <ET2Shell label={`Lesson ${lesson.n} Intro`}>
      <ET2Header onBack={onBack} eyebrow={`Stop ${lesson.n} · ${lesson.mins}`} title={lesson.title} sub={lesson.tagline} />
      <div className="et-scroll" style={{ flex: 1, overflowY: 'auto', padding: '26px 22px 10px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <ET2CapTile state="current" isCurrent skin={ET2_SKINS.duo} size={120} big>
            <ET2Puffy type={lesson.icon} hue="blue" size={64} />
          </ET2CapTile>
        </div>
        <div>
          <div style={{ fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', color: ET2P.lime, marginBottom: 12 }}>WHAT YOU&rsquo;LL LEARN</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lesson.learn.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14.5, lineHeight: 1.5 }}>
                <div style={{ width: 18, height: 18, borderRadius: 6, background: ET2P.lime, color: ET2P.ink,
                  fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginTop: 2, fontFamily: ET2_MONO }}>{i + 1}</div>
                <div>{item}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, borderRadius: 14, padding: '12px 14px',
          background: ET2P.bg, border: `1px dashed ${ET2P.blue}66` }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M6 9h4M8 7v4M15 8.5h.01M17.5 11h.01M4.5 8A2.5 2.5 0 017 5.5h10A2.5 2.5 0 0119.5 8l.8 7a2.3 2.3 0 01-4 1.8L14.5 15h-5l-1.8 1.8a2.3 2.3 0 01-4-1.8z"
              stroke={ET2P.blue} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>Ends in a simulator:</span> {lesson.sim.name} — prove it under pressure.
          </div>
        </div>
      </div>
      <ET2Cta label="Start lesson" onClick={onStart} />
    </ET2Shell>
  );
}

// ── Reading cards ────────────────────────────────────────────────
function ET2LessonCards({ lesson, onBack, onClose, onDone }) {
  const [step, setStep] = React.useState(0);
  const cards = lesson.cards;
  const card = cards[step];
  const last = step === cards.length - 1;
  return (
    <ET2Shell label={`Lesson ${lesson.n} Reading`}>
      <ET2Header onBack={step === 0 ? onBack : () => setStep(step - 1)} onClose={onClose}
        eyebrow={`Stop ${lesson.n} · Lesson`} title={lesson.title} />
      <ET2Progress percent={((step + 1) / (cards.length + lesson.quiz.length + 1)) * 100} color={ET2P.blue} />
      <div key={step} className="et-scroll et2-fade" style={{ flex: 1, overflowY: 'auto', padding: '28px 22px 10px' }}>
        <div style={{ fontFamily: ET2_MONO, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: ET2P.blue, marginBottom: 12 }}>{card.eyebrow}</div>
        <h1 style={{ margin: '0 0 14px', fontFamily: ET2_FONT, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, textWrap: 'balance' }}>{card.title}</h1>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: ET2P.text, textWrap: 'pretty' }}>{card.body}</p>
        {card.quote && (
          <blockquote style={{ margin: '22px 0 0', padding: '14px 18px',
            borderLeft: `3px solid ${ET2P.lime}`, background: ET2P.surface, borderRadius: 12 }}>
            <div style={{ fontFamily: ET2_SERIF, fontStyle: 'italic', fontSize: 22, lineHeight: 1.25, color: ET2P.text }}>
              &ldquo;{card.quote}&rdquo;
            </div>
          </blockquote>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 7, paddingBottom: 4, flexShrink: 0 }}>
        {cards.map((_, i) => (
          <span key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: 999, transition: 'all .25s',
            background: i === step ? ET2P.lime : i < step ? 'rgba(0,255,127,0.4)' : ET2P.line2 }}></span>
        ))}
      </div>
      <ET2Cta label={last ? 'Take the quiz' : 'Next'} onClick={last ? onDone : () => setStep(step + 1)} />
    </ET2Shell>
  );
}

// ── Quiz — matches LS_Quiz: radio circles, lime selection glow ───
function ET2LessonQuiz({ lesson, onBack, onClose, onDone }) {
  const quiz = lesson.quiz;
  const [idx, setIdx] = React.useState(0);
  const [sel, setSel] = React.useState(null);
  const [locked, setLocked] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const q = quiz[idx];
  const isCorrect = sel === q.correct;
  const last = idx === quiz.length - 1;

  const submit = () => {
    setLocked(true);
    if (sel === q.correct) setCorrectCount((c) => c + 1);
  };
  const next = () => {
    if (last) { onDone(correctCount); return; }
    setIdx(idx + 1); setSel(null); setLocked(false);
  };

  return (
    <ET2Shell label={`Lesson ${lesson.n} Quiz`}>
      <div style={{ padding: '14px 22px 0', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <ET2RoundBtn onClick={onBack || onClose} label="Back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
        </ET2RoundBtn>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: ET2P.muted, marginBottom: 2 }}>{lesson.title}</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>
            Question {idx + 1} <span style={{ color: ET2P.muted, fontWeight: 600 }}>of {quiz.length}</span>
          </div>
        </div>
      </div>
      <ET2Progress percent={((lesson.cards.length + idx + 1) / (lesson.cards.length + quiz.length + 1)) * 100} />
      <div key={idx} className="et-scroll et2-fade" style={{ flex: 1, overflowY: 'auto', padding: '30px 22px 10px' }}>
        <h1 style={{ margin: 0, fontFamily: ET2_FONT, fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, textWrap: 'balance' }}>{q.q}</h1>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.opts.map((o) => {
            const active = sel === o.id;
            const showRight = locked && o.id === q.correct;
            const showWrong = locked && active && o.id !== q.correct;
            const border = showRight ? ET2P.lime : showWrong ? ET2P.red : active ? ET2P.lime : ET2P.line;
            const dot = showWrong ? ET2P.red : ET2P.lime;
            return (
              <button key={o.id} onClick={locked ? undefined : () => setSel(o.id)} style={{
                appearance: 'none', cursor: locked ? 'default' : 'pointer', textAlign: 'left',
                background: ET2P.surface,
                border: `2px solid ${border}`,
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
                color: ET2P.text, fontFamily: ET2_FONT,
                boxShadow: (active && !locked) || showRight ? `0 0 30px ${ET2P.lime}33` : 'none',
                transition: 'border-color .15s ease, box-shadow .15s ease' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%',
                  border: `2px solid ${active || showRight ? (showWrong ? ET2P.red : ET2P.lime) : ET2P.line2}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {(active || showRight) && <div style={{ width: 11, height: 11, borderRadius: '50%', background: showRight ? ET2P.lime : dot }}></div>}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{o.label}</div>
              </button>
            );
          })}
        </div>
        {locked && (
          <div className="et2-fade" style={{ marginTop: 18, borderRadius: 16, padding: '14px 16px',
            background: ET2P.surface,
            border: `1px solid ${isCorrect ? `${ET2P.lime}66` : `${ET2P.red}66`}` }}>
            <div style={{ fontFamily: ET2_MONO, fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
              color: isCorrect ? ET2P.lime : ET2P.red, marginBottom: 6 }}>
              {isCorrect ? 'CORRECT · +25 XP' : 'NOT QUITE'}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>{q.why}</div>
          </div>
        )}
      </div>
      <ET2Cta
        label={!locked ? 'Submit answer' : last ? 'To the simulator' : 'Next question'}
        disabled={!locked && sel === null}
        onClick={!locked ? submit : next}
      />
    </ET2Shell>
  );
}

Object.assign(window, { ET2LessonIntro, ET2LessonCards, ET2LessonQuiz });
