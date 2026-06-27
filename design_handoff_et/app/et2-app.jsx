// et2-app.jsx — connected app: router, persistent progress, tweaks.

const ET2_STORE_KEY = 'et2-progress-v1';
// Full palette for screens reused from the onboarding prototype (Home).
const ET2_HOME_PALETTE = {
  id: 'lime', label: 'Lime · Black', mode: 'dark',
  bg: '#000000', surface: '#141414', surfaceActive: '#1c1c1c',
  line: '#252525', line2: '#3a3a3a',
  text: '#FFFFFF', muted: '#8A8A8A',
  accent: '#1E5BFF', accent2: '#1E5BFF', accentText: '#FFFFFF', copyAccent: 'accent2',
};
window.ET2_HOME_PALETTE = ET2_HOME_PALETTE;
const ET2_DEFAULT_PROGRESS = {
  completed: ['spot', 'buybox', 'underwrite'],
  xp: 1240, streak: 6, simGrades: {}, onboarded: false,
};
// 3-tab nav: Home · Lessons · Pegasus (profile lives top-right).
const ET2_TABS = [
  { id: 'dashboard', label: 'Home',    icon: 'home' },
  { id: 'lessons',   label: 'Lessons', icon: 'lessons' },
  { id: 'pegasus',   label: 'Pegasus', icon: 'pegasus' },
];
window.ET2_TABS = ET2_TABS;

function et2LoadProgress() {
  try {
    const raw = localStorage.getItem(ET2_STORE_KEY);
    if (raw) return { ...ET2_DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {}
  return { ...ET2_DEFAULT_PROGRESS };
}

function ET2App() {
  const [tweak, setTweak] = useTweaks({ mapSkin: 'duo', homeStyle: 'glow', showFrame: true });
  const [progress, setProgress] = React.useState(et2LoadProgress);
  const [screen, setScreen] = React.useState('home'); // home | map | intro | cards | quiz | sim | rewards
  const [active, setActive] = React.useState(null);   // lesson object
  const [quizCorrect, setQuizCorrect] = React.useState(0);
  const [lastResult, setLastResult] = React.useState(null);
  const [wasReplay, setWasReplay] = React.useState(false);

  const { MODULE, LESSONS, QUIZ_XP } = ET2DATA;
  const skin = ET2_SKINS[tweak.mapSkin] || ET2_SKINS.duo;

  const saveProgress = (p) => {
    setProgress(p);
    try { localStorage.setItem(ET2_STORE_KEY, JSON.stringify(p)); } catch (e) {}
  };

  const stateOf = (lesson) => {
    if (progress.completed.includes(lesson.id)) return 'done';
    const firstIncomplete = LESSONS.find((l) => !progress.completed.includes(l.id));
    return firstIncomplete && firstIncomplete.id === lesson.id ? 'current' : 'locked';
  };

  const simsPassed = Object.keys(progress.simGrades).length;
  const openLesson = (lesson) => { setActive(lesson); setQuizCorrect(0); setScreen('intro'); };
  const handleTab = (t) => {
    if (t === 'dashboard') setScreen('home');
    else if (t === 'lessons') setScreen('map');
    else if (t === 'pegasus') setScreen('pegasus');
    else if (t === 'league') setScreen('leaderboard');
    else if (t === 'profile') setScreen('profile');
  };

  const finishLesson = (simResult) => {
    const replay = progress.completed.includes(active.id);
    const quizXp = quizCorrect * QUIZ_XP;
    const totalXp = quizXp + (simResult ? simResult.xp : 0);
    setWasReplay(replay);
    setLastResult({
      quizCorrect, quizTotal: active.quiz.length,
      simGrade: simResult ? simResult.grade : null,
      simXp: simResult ? simResult.xp : 0,
      simLine: simResult ? simResult.line : null,
      totalXp,
    });
    const next = { ...progress, simGrades: { ...progress.simGrades } };
    if (simResult) {
      const prev = next.simGrades[active.sim.id];
      const rank = { S: 5, A: 4, B: 3, C: 2, F: 1 };
      if (!prev || rank[simResult.grade] > rank[prev]) next.simGrades[active.sim.id] = simResult.grade;
    }
    if (!replay) {
      next.completed = [...next.completed, active.id];
      next.xp = next.xp + totalXp;
    }
    saveProgress(next);
    setScreen('rewards');
  };

  const resetProgress = () => {
    try { localStorage.removeItem(ET2_STORE_KEY); } catch (e) {}
    setProgress({ ...ET2_DEFAULT_PROGRESS });
    setActive(null);
    setScreen('home');
  };

  const finishOnboarding = () => {
    saveProgress({ ...progress, onboarded: true });
    setScreen('home');
  };
  const replayOnboarding = () => { setProgress((p) => ({ ...p, onboarded: false })); };

  const renderScreen = () => {
    switch (screen) {
      case 'home': {
        const current = LESSONS.find((l) => stateOf(l) === 'current');
        const doneCount = LESSONS.filter((l) => stateOf(l) === 'done').length;
        return <Home
          ctx={{ palette: ET2_HOME_PALETTE, tweak: { homeStyle: tweak.homeStyle, logoVariant: 'trail' }, state: { name: 'Alex Chen' }, setState: () => {} }}
          go={(s) => {
            if (s === 'lesson') { if (current) openLesson(current); else setScreen('map'); }
            else if (s === 'profile') setScreen('profile');
          }}
          onTab={handleTab}
          data={{
            tabs: ET2_TABS,
            headerProfile: true,
            streak: progress.streak,
            lessonsDone: doneCount,
            heroEyebrow: current ? `Today \u00b7 Stop ${current.n} / ${LESSONS.length}` : 'Module complete',
            heroMins: current ? `~${current.mins.replace(' min', '')} min` : '',
            heroTitle: current ? current.title : 'Module 01 — in the books.',
            heroPct: Math.round((doneCount / LESSONS.length) * 100),
            heroModule: MODULE.title,
          }} />;
      }
      case 'map':
        return <ET2MapScreen module={MODULE} lessons={LESSONS} stateOf={stateOf} skin={skin}
          onBack={() => setScreen('home')} onOpen={openLesson} />;
      case 'intro':
        return <ET2LessonIntro lesson={active} onBack={() => setScreen('map')} onStart={() => setScreen('cards')} />;
      case 'cards':
        return <ET2LessonCards lesson={active} onBack={() => setScreen('intro')} onClose={() => setScreen('map')}
          onDone={() => setScreen('quiz')} />;
      case 'quiz':
        return <ET2LessonQuiz lesson={active} onBack={() => setScreen('cards')} onClose={() => setScreen('map')}
          onDone={(correct) => { setQuizCorrect(correct); setScreen('sim'); }} />;
      case 'sim':
        return <ET2SimScreen lesson={active} onBack={() => setScreen('quiz')}
          onComplete={(simResult) => finishLesson(simResult)} onSkip={() => finishLesson(null)} />;
      case 'rewards':
        return <ET2RewardsScreen lesson={active} result={lastResult} replay={wasReplay}
          progress={{ ...progress, simsPassed }} onMap={() => setScreen('map')} />;
      case 'profile':
        return <ET2ProfileScreen progress={progress} lessons={LESSONS}
          onTab={handleTab} onLeague={() => setScreen('leaderboard')}
          onSettings={() => setScreen('settings')} onPaywall={() => setScreen('paywall')} />;
      case 'pegasus':
        return <ET2PegasusScreen onTab={handleTab} onProfile={() => setScreen('profile')} />;
      case 'leaderboard':
        return <ET2LeaderboardScreen progress={progress} onTab={handleTab} />;
      case 'settings':
        return <ET2SettingsScreen onBack={() => setScreen('profile')}
          onNotifications={() => setScreen('notifications')} onPaywall={() => setScreen('paywall')} />;
      case 'notifications':
        return <ET2NotificationsScreen onBack={() => setScreen('settings')} />;
      case 'paywall':
        return <ET2PaywallScreen onClose={() => setScreen('profile')} />;
      default:
        return null;
    }
  };

  const app = (
    <div key={screen} className="et2-screenfade" style={{ width: '100%', height: '100%' }}>
      {progress.onboarded === false
        ? <ET2Onboarding palette={ET2_HOME_PALETTE} onFinish={finishOnboarding} />
        : renderScreen()}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      {tweak.showFrame ? (
        <ET2Phone>{app}</ET2Phone>
      ) : (
        <div style={{ width: 393, height: 852, borderRadius: 32, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.55)' }}>
          {app}
        </div>
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Home">
          <TweakSelect label="Style" value={tweak.homeStyle}
            options={['clean', 'glow', 'glass', 'glass-v2']}
            onChange={(v) => setTweak('homeStyle', v)} />
        </TweakSection>
        <TweakSection label="Map">
          <TweakRadio label="Skin" value={tweak.mapSkin}
            options={[{ value: 'duo', label: 'Duo' }, { value: 'green', label: 'Green' }, { value: 'mono', label: 'Mono' }]}
            onChange={(v) => setTweak('mapSkin', v)} />
        </TweakSection>
        <TweakSection label="Device">
          <TweakToggle label="Phone frame" value={tweak.showFrame} onChange={(v) => setTweak('showFrame', v)} />
        </TweakSection>
        <TweakSection label="Prototype">
          <TweakButton label="Replay onboarding" onClick={replayOnboarding} />
          <TweakButton label="Reset progress" onClick={resetProgress} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function et2Boot() {
  const need = ['ET2DATA', 'Home', 'ET2MapScreen', 'ET2LessonIntro', 'ET2SimScreen', 'ET2RewardsScreen', 'ET2Phone', 'TweaksPanel', 'ETLogo', 'ET2Onboarding', 'ET2PegasusScreen', 'Intro', 'Goal'];
  if (need.some((n) => typeof window[n] === 'undefined')) return setTimeout(et2Boot, 50);
  ReactDOM.createRoot(document.getElementById('root')).render(<ET2App />);
}
et2Boot();
