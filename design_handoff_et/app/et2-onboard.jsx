// et2-onboard.jsx — wraps the existing onboarding screens (intro → welcome →
// verify id → submitted → verify → goal → experience → topics → complete)
// into a self-contained flow that hands off to the main app on finish.

const ET2_ONBOARD_FLOW = ['intro', 'welcome', 'verifyid', 'submitted', 'verify', 'goal', 'experience', 'topics', 'complete'];

function ET2Onboarding({ palette, onFinish, onState }) {
  const [screen, setScreen] = React.useState('intro');
  const [history, setHistory] = React.useState([]);
  const [form, setForm] = React.useState({ name: 'Alex Chen' });

  const go = (next) => {
    if (next === 'home') { onFinish && onFinish(form); return; }
    setHistory((h) => [...h, screen]);
    setScreen(next);
  };
  const back = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      setScreen(h[h.length - 1]);
      return h.slice(0, -1);
    });
  };
  const setState = (patch) => setForm((s) => { const n = { ...s, ...patch }; onState && onState(n); return n; });

  const ctx = { palette, tweak: { logoVariant: 'trail' }, state: form, setState };
  const props = { ctx, go, back };

  const render = () => {
    switch (screen) {
      case 'intro':      return <Intro {...props} />;
      case 'welcome':    return <Welcome {...props} />;
      case 'verifyid':   return <VerifyId {...props} />;
      case 'submitted':  return <Submitted {...props} />;
      case 'verify':     return <Verify {...props} />;
      case 'goal':       return <Goal {...props} />;
      case 'experience': return <Experience {...props} />;
      case 'topics':     return <Topics {...props} />;
      case 'complete':   return <Complete {...props} />;
      default:           return <Intro {...props} />;
    }
  };

  return (
    <div key={screen} className="et2-screenfade" style={{ width: '100%', height: '100%' }}>
      {render()}
    </div>
  );
}

Object.assign(window, { ET2Onboarding, ET2_ONBOARD_FLOW });
