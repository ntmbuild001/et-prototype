"use client";

// App.tsx — App shell, routing, frozen settings (ported from et-app.jsx).
// The Claude Design runtime layer is removed: no useTweaks, no window.__et host
// binding, no ReactDOM.createRoot mount, and no Tweaks UI. Settings are frozen
// (crimson "Blue · Blue", trail logo, glow home, iOS frame). Next mounts <App/>.

import React from "react";
import { PALETTES, TWEAK, FLOW } from "./constants";
import { IOSStatusBar } from "./IOSFrame";
import { Intro } from "./intro";
import { Welcome, Submitted, Verify, VerifyId } from "./screens";
import { Goal, Experience, Topics, Complete } from "./screens-2";
import { Home } from "./screens-3";

// Reserve vertical room for the caption + restart pill + gaps around the phone.
const PHONE_W = 412;
const PHONE_H = 891;
const V_CHROME = 120; // caption + pill + gaps
const H_PAD = 24;

// Scale the fixed-size phone frame to fit any viewport (capped at 1:1).
function useFitScale() {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(
        1,
        (vw - H_PAD * 2) / PHONE_W,
        (vh - V_CHROME) / PHONE_H
      );
      setScale(s > 0 ? s : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return scale;
}

export default function App() {
  const tweak = TWEAK;
  const palette = PALETTES.crimson;

  const [screen, setScreen] = React.useState("intro");
  const [history, setHistory] = React.useState<string[]>([]);
  const [formState, setFormState] = React.useState<any>({ name: "Alex Chen" });

  const scale = useFitScale();

  const go = (next: string) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
  };
  const back = () => {
    setHistory((h) => {
      if (h.length === 0) {
        setScreen("welcome");
        return h;
      }
      const prev = h[h.length - 1];
      setScreen(prev);
      return h.slice(0, -1);
    });
  };

  const setState = (patch: any) => setFormState((s: any) => ({ ...s, ...patch }));
  const ctx = { palette, tweak, state: formState, setState };

  const renderScreen = () => {
    const props = { ctx, go, back };
    switch (screen) {
      case "intro":      return <Intro      {...props} />;
      case "welcome":    return <Welcome    {...props} />;
      case "submitted":  return <Submitted  {...props} />;
      case "verify":     return <Verify     {...props} />;
      case "verifyid":   return <VerifyId   {...props} />;
      case "goal":       return <Goal       {...props} />;
      case "experience": return <Experience {...props} />;
      case "topics":     return <Topics     {...props} />;
      case "complete":   return <Complete   {...props} />;
      case "home":       return <Home       {...props} />;
      default:           return <Welcome    {...props} />;
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
      width: '100%', maxWidth: 460,
    }}>
      {/* Intended design header — hardcoded literal, not derived from settings. */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
        color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase',
      }}>BLUE · BLUE · TRAIL</div>

      {/* Scaled box reserves the on-screen footprint so layout stays centered. */}
      <div style={{ width: PHONE_W * scale, height: PHONE_H * scale, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          <PhoneShell statusDark={palette.mode === 'dark'} contentBg={palette.bg} homeIndicatorOnLight={palette.mode === 'light'}>
            <div key={screen} style={{ width: '100%', height: '100%' }} className="et-screen-fade">
              {renderScreen()}
            </div>
          </PhoneShell>
        </div>
      </div>

      <ResetPill onClick={() => { setScreen('intro'); setHistory([]); }} />
    </div>
  );
}

function ResetPill({ onClick }: any) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer',
      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 999, padding: '6px 14px', fontSize: 11,
      fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase',
    }}>↺ Restart flow</button>
  );
}

function PhoneShell({ children, statusDark = true, contentBg = '#000', homeIndicatorOnLight = false }: any) {
  return (
    <div style={{
      width: 412, height: 891,
      background: '#1a1a1a',
      borderRadius: 52,
      padding: 9,
      boxShadow: '0 30px 80px rgba(0,0,0,.6), inset 0 0 0 1.5px #2a2a2a',
      position: 'relative',
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 44,
        overflow: 'hidden', background: contentBg, position: 'relative',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 122, height: 36, borderRadius: 18, background: '#000', zIndex: 30,
        }} />
        <div style={{ flexShrink: 0 }}>
          <IOSStatusBar dark={statusDark} />
        </div>
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {children}
        </div>
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 3,
          background: homeIndicatorOnLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)',
          zIndex: 30,
        }} />
      </div>
    </div>
  );
}
