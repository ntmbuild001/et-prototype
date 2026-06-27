"use client";

// Onboard.tsx — the real ET2 onboarding flow (9 screens), ported faithfully from
// et2-onboard.jsx (the wrapper/flow) + et-intro.jsx (3-slide intro) + et-screens.jsx
// (Welcome / VerifyId / Submitted / Verify) + et-screens-2.jsx (Goal / Experience /
// Topics / Complete). The prototype shared screens over window globals and a
// `palette` object + string-keyed switch; this recreates the same flow as a single
// typed ES module using @et/brand tokens.
//
// Flow: intro → welcome → verifyid → submitted → verify → goal → experience →
//       topics → complete. Branches: Welcome's Google jumps to goal; Verify's
//       "change email" returns to welcome. Selections persist in local state only.

import React from "react";
import { ETLogo, colors, fontFamily, useEntrance } from "@et/brand";

const FONT = fontFamily.sans;
const MONO = fontFamily.mono;
const SERIF = fontFamily.serif;

// ET2 palette (accent === accent2 === blue per the "clean glossy" rollback).
const P = {
  bg: colors.bg,
  text: colors.ink,
  surface: colors.surface,
  line: colors.line,
  line2: colors.line2,
  muted: colors.muted,
  accent: colors.blue,
  accent2: colors.blue,
  accentText: "#ffffff",
};

type Step =
  | "intro"
  | "welcome"
  | "verifyid"
  | "submitted"
  | "verify"
  | "goal"
  | "experience"
  | "topics"
  | "complete";

interface FormState {
  name: string;
  email: string;
  goal: string | null;
  experience: string | null;
  topics: string[];
  verified: boolean;
}

export function Onboard({ onFinish }: { onFinish: () => void }) {
  const [screen, setScreen] = React.useState<Step>("intro");
  const [history, setHistory] = React.useState<Step[]>([]);
  const [form, setForm] = React.useState<FormState>({
    name: "Alex Chen",
    email: "",
    goal: null,
    experience: null,
    topics: [],
    verified: false,
  });

  const go = (next: Step | "home") => {
    if (next === "home") {
      onFinish();
      return;
    }
    setHistory((h) => [...h, screen]);
    setScreen(next);
  };
  const back = () =>
    setHistory((h) => {
      if (h.length === 0) return h;
      setScreen(h[h.length - 1]);
      return h.slice(0, -1);
    });
  const setState = (patch: Partial<FormState>) => setForm((s) => ({ ...s, ...patch }));

  const fadeRef = useEntrance<HTMLDivElement>("screenfade");

  return (
    <div key={screen} ref={fadeRef} style={{ width: "100%", height: "100%" }}>
      {screen === "intro" && <Intro go={go} />}
      {screen === "welcome" && <Welcome form={form} setState={setState} go={go} />}
      {screen === "verifyid" && <VerifyId setState={setState} go={go} />}
      {screen === "submitted" && <Submitted go={go} />}
      {screen === "verify" && <Verify form={form} go={go} />}
      {screen === "goal" && <Goal form={form} setState={setState} go={go} back={back} />}
      {screen === "experience" && <Experience form={form} setState={setState} go={go} back={back} />}
      {screen === "topics" && <Topics form={form} setState={setState} go={go} back={back} />}
      {screen === "complete" && <Complete form={form} go={go} />}
    </div>
  );
}

/* ════════════════════════ shared atoms ════════════════════════ */

function ScreenShell({ children, confetti }: { children: React.ReactNode; confetti?: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: P.bg, color: P.text, fontFamily: FONT, overflow: "hidden" }}>
      {confetti && <Confetti />}
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>{children}</div>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: P.accent }}>
      {children}
    </div>
  );
}

function H1({ children, size = 34 }: { children: React.ReactNode; size?: number }) {
  return (
    <h1 style={{ fontFamily: FONT, fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: P.text, margin: 0 }}>
      {children}
    </h1>
  );
}

function Body({ children, size = 15, style = {} }: { children: React.ReactNode; size?: number; style?: React.CSSProperties }) {
  return <p style={{ fontSize: size, lineHeight: 1.5, color: P.muted, fontWeight: 400, margin: 0, ...style }}>{children}</p>;
}

const SerifEm = ({ children, size = "1.08em" }: { children: React.ReactNode; size?: string }) => (
  <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, color: P.accent, letterSpacing: "-0.01em", fontSize: size }}>{children}</span>
);

type BtnColor = "blue" | "white" | "lime";
function PrimaryBtn({
  children,
  onClick,
  disabled,
  color = "blue",
  arrow = true,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: BtnColor;
  arrow?: boolean;
}) {
  const bg = disabled ? P.surface : color === "lime" ? P.accent : color === "white" ? "#ffffff" : P.accent2;
  const fg = disabled ? P.muted : color === "lime" ? P.accentText : color === "white" ? "#000000" : "#ffffff";
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        appearance: "none",
        border: 0,
        cursor: disabled ? "default" : "pointer",
        background: bg,
        color: fg,
        width: "100%",
        height: 56,
        borderRadius: 999,
        padding: "0 28px",
        fontFamily: FONT,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "-0.005em",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        boxShadow: color === "lime" && !disabled ? `0 0 40px ${P.accent}55` : "none",
      }}
    >
      <span>{children}</span>
      {arrow && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

function TextLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: P.muted, fontFamily: FONT, fontSize: 14, fontWeight: 500, padding: 10 }}>
      {children}
    </button>
  );
}

function TopBar({ onBack, total = 3, step = 0, showBack = true }: { onBack?: () => void; total?: number; step?: number; showBack?: boolean }) {
  return (
    <div style={{ padding: "14px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      {showBack ? (
        <button
          onClick={onBack}
          aria-label="Back"
          style={{ appearance: "none", cursor: "pointer", border: 0, width: 40, height: 40, borderRadius: 12, background: P.surface, color: P.text, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      ) : (
        <div style={{ width: 40 }} />
      )}
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: 3, background: i <= step ? P.accent : P.line, transition: "width .2s ease" }} />
        ))}
      </div>
    </div>
  );
}

function FieldInput({ label, type = "text", placeholder, value, onChange }: { label: string; type?: string; placeholder?: string; value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <div style={{ fontSize: 11, color: P.muted, marginBottom: 8, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: MONO }}>{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{ width: "100%", height: 56, padding: "0 18px", boxSizing: "border-box", background: P.surface, border: `1px solid ${focus ? P.line2 : P.line}`, borderRadius: 14, color: P.text, fontSize: 15, fontFamily: FONT, fontWeight: 500, outline: 0, transition: "border-color .15s ease" }}
      />
    </div>
  );
}

/* ════════════════════════ 1 · intro (3 slides) ════════════════════════ */

interface Slide {
  showLogo?: boolean;
  eyebrow?: string;
  headline: React.ReactNode;
  body: React.ReactNode;
  blob: "br" | "bl" | "tr";
  cta: string;
}
const INTRO_SLIDES: Slide[] = [
  {
    showLogo: true,
    headline: (
      <>
        Own more than
        <br />
        you <SerifEm>earned</SerifEm>.
      </>
    ),
    body: (
      <>
        A wealth education made for <SerifEm size="1.1em">pro athletes</SerifEm>.<br />
        Real estate is the asset. Ownership is the outcome.
      </>
    ),
    blob: "br",
    cta: "BEGIN",
  },
  {
    eyebrow: "The Numbers",
    headline: (
      <>
        Your contract has
        <br />
        an <SerifEm>end date</SerifEm>.
      </>
    ),
    body: (
      <>
        Your portfolio doesn&rsquo;t have to. <SerifEm size="1.1em">68% of former NFL players</SerifEm> file for bankruptcy within two years of retirement. The portfolio is the difference.
      </>
    ),
    blob: "bl",
    cta: "NEXT",
  },
  {
    eyebrow: "Lessons",
    headline: (
      <>
        Real estate,
        <br />
        made <SerifEm>plain</SerifEm>.
      </>
    ),
    body: (
      <>
        One lesson a day. Short, sharp, built for the time you actually have. No jargon. No fluff. Just what you need to <SerifEm size="1.1em">own</SerifEm> — first property, fifth, tenth. A private space, for pro athletes only.
      </>
    ),
    blob: "tr",
    cta: "NEXT",
  },
];

function IntroBlob({ pos }: { pos: "br" | "bl" | "tr" }) {
  const sizes: Record<string, React.CSSProperties> = {
    br: { right: -180, bottom: -160 },
    bl: { left: -200, bottom: -120 },
    tr: { right: -200, top: -120 },
  };
  return (
    <div
      style={{
        position: "absolute",
        width: 540,
        height: 540,
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 50%, ${P.accent}66 0%, ${P.accent}22 38%, transparent 70%)`,
        pointerEvents: "none",
        filter: "blur(8px)",
        ...sizes[pos],
      }}
    />
  );
}

function Intro({ go }: { go: (s: Step | "home") => void }) {
  const [step, setStep] = React.useState(0);
  const slide = INTRO_SLIDES[step];
  const last = step === INTRO_SLIDES.length - 1;
  const next = () => (last ? go("welcome") : setStep(step + 1));
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: P.bg, color: P.text, overflow: "hidden", fontFamily: FONT }}>
      <IntroBlob pos={slide.blob} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", padding: "18px 24px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              aria-label="Back"
              style={{ appearance: "none", cursor: "pointer", border: `1px solid ${P.line}`, width: 40, height: 40, borderRadius: "50%", background: "transparent", color: P.text, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}
        </div>
        <div style={{ height: 60 }} />
        {slide.showLogo ? (
          <div style={{ marginBottom: 18 }}>
            <ETLogo variant="trail" size={32} />
          </div>
        ) : (
          <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.accent, marginBottom: 16 }}>{slide.eyebrow}</div>
        )}
        <h1 style={{ margin: 0, fontFamily: FONT, fontSize: 40, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.025em", color: P.text }}>{slide.headline}</h1>
        <div style={{ marginTop: 22 }}>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: 15, lineHeight: 1.55, color: P.muted, fontWeight: 400, maxWidth: 340 }}>{slide.body}</p>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <PrimaryBtn color="lime" arrow={false} onClick={next}>
            {slide.cta}
          </PrimaryBtn>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {INTRO_SLIDES.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 6, height: 6, borderRadius: 3, background: i === step ? P.accent : P.line, transition: "width .25s ease" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ 2 · welcome (signup) ════════════════════════ */

function Welcome({ form, setState, go }: { form: FormState; setState: (p: Partial<FormState>) => void; go: (s: Step | "home") => void }) {
  const [email, setEmail] = React.useState(form.email);
  const [pw, setPw] = React.useState("");
  return (
    <ScreenShell>
      <div className="et-scroll" style={{ flex: 1, padding: "28px 24px 24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <ETLogo variant="trail" size={28} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <H1 size={36}>
            Players today.
            <br />
            Partners <SerifEm>tomorrow.</SerifEm>
          </H1>
          <Body size={15} style={{ marginTop: 14, maxWidth: 320 }}>
            Drop your email.
          </Body>
        </div>
        <div style={{ background: P.surface, borderRadius: 24, padding: 22, border: `1px solid ${P.line}`, display: "flex", flexDirection: "column", gap: 16, marginBottom: 18 }}>
          <FieldInput label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={setEmail} />
          <FieldInput label="Password" type="password" placeholder="••••••••" value={pw} onChange={setPw} />
          <PrimaryBtn color="blue" onClick={() => { setState({ email }); go("verifyid"); }}>
            Create Account
          </PrimaryBtn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: P.line }} />
            <span style={{ fontSize: 10, color: P.muted, letterSpacing: "0.22em", fontWeight: 600, fontFamily: MONO }}>OR</span>
            <div style={{ flex: 1, height: 1, background: P.line }} />
          </div>
          <SocialBtn onClick={() => go("goal")} />
        </div>
      </div>
    </ScreenShell>
  );
}

function SocialBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ appearance: "none", cursor: "pointer", width: "100%", height: 56, borderRadius: 999, background: P.bg, border: `1px solid ${P.line}`, color: P.text, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, fontSize: 16, fontWeight: 600 }}>
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z" />
        <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.6C4.7 19.7 8.1 22 12 22z" />
        <path fill="#FBBC05" d="M6.4 13.8c-.2-.6-.3-1.3-.3-2s.1-1.3.3-2V7.2H3C2.4 8.7 2 10.3 2 12s.4 3.3 1 4.8l3.4-3z" />
        <path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8.1 2 4.7 4.3 3 7.2l3.4 2.6c.8-2.4 3-4 5.6-4z" />
      </svg>
      Continue with Google
    </button>
  );
}

/* ════════════════════════ 3 · verify identity (ID.me) ════════════════════════ */

function VerifyId({ setState, go }: { setState: (p: Partial<FormState>) => void; go: (s: Step | "home") => void }) {
  return (
    <ScreenShell>
      <div className="et-scroll" style={{ flex: 1, padding: "28px 24px 24px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ marginBottom: 28 }}>
          <ETLogo variant="trail" size={28} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <H1 size={36}>
            Verify it&rsquo;s
            <br />
            really <SerifEm>you.</SerifEm>
          </H1>
          <Body size={15} style={{ marginTop: 14, maxWidth: 320 }}>
            We partner with ID.me to confirm your identity. One scan, fully private.
          </Body>
        </div>
        <div style={{ background: P.surface, borderRadius: 24, padding: 22, border: `1px solid ${P.line}`, display: "flex", flexDirection: "column", gap: 24, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: 6 }}>
            <div style={{ width: 96, height: 96, borderRadius: 28, background: P.bg, border: `1px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BiometricIcon color={P.accent} size={52} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            {["Bank-grade encryption", "Your data stays yours", "Takes under a minute"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: `${P.accent}1f`, border: `1px solid ${P.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L20 7" stroke={P.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ fontSize: 14, fontWeight: 500, color: P.text }}>{t}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setState({ verified: true }); go("submitted"); }}
            style={{ appearance: "none", cursor: "pointer", width: "100%", height: 56, borderRadius: 999, background: P.accent2, border: 0, color: P.accentText, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: FONT, fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke={P.accentText} strokeWidth="2" />
              <path d="M7.5 12.5l3 3 6-7" stroke={P.accentText} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verify with ID.me
          </button>
          <button onClick={() => go("submitted")} style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: P.muted, fontFamily: FONT, fontSize: 13, fontWeight: 600, padding: 0, alignSelf: "center" }}>
            I&rsquo;ll do this later
          </button>
        </div>
      </div>
    </ScreenShell>
  );
}

function BiometricIcon({ color = "#fff", size = 48 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M6 16V10a4 4 0 014-4h6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 16V10a4 4 0 00-4-4h-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 32v6a4 4 0 004 4h6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 32v6a4 4 0 01-4 4h-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="24" cy="20.5" r="4.4" stroke={color} strokeWidth="2.2" />
      <path d="M15.5 35c1-4.4 4.4-7 8.5-7s7.5 2.6 8.5 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ════════════════════════ 4 · submitted ════════════════════════ */

function Submitted({ go }: { go: (s: Step | "home") => void }) {
  return (
    <ScreenShell>
      <div style={{ flex: 1, padding: "32px 28px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 36 }}>
          <ETLogo variant="trail" size={28} />
        </div>
        <div style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 999, background: P.surface, border: `1px solid ${P.line}`, fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: P.muted, marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: P.accent2, boxShadow: `0 0 12px ${P.accent2}` }} />
          Application Received
        </div>
        <H1 size={36}>
          Thanks for
          <br />
          submitting.
        </H1>
        <Body size={15} style={{ marginTop: 16, maxWidth: 320 }}>
          We&rsquo;ll get back to you shortly with the status of your application.
        </Body>
        <div style={{ marginTop: 36, paddingTop: 20, borderTop: `1px solid ${P.line}`, display: "flex", flexDirection: "column", gap: 18 }}>
          <TimelineRow state="done" label="Submitted" meta="Just now" />
          <TimelineRow state="active" label="Under review" meta="24 – 48 hrs" />
          <TimelineRow state="pending" label="Decision" meta="By email" />
        </div>
        <div style={{ flex: 1 }} />
        <PrimaryBtn color="blue" onClick={() => go("verify")}>
          Got it
        </PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

function TimelineRow({ state, label, meta }: { state: "done" | "active" | "pending"; label: string; meta: string }) {
  const isDone = state === "done";
  const isActive = state === "active";
  const dotBg = isDone ? P.accent2 : P.surface;
  const dotBorder = isDone || isActive ? P.accent2 : P.line;
  const labelColor = isDone || isActive ? P.text : P.muted;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: dotBg, border: `1.5px solid ${dotBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: isActive ? `0 0 0 4px ${P.accent2}22` : "none" }}>
        {isDone && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {isActive && <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.accent2 }} />}
      </div>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: labelColor }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: P.muted }}>{meta}</div>
    </div>
  );
}

/* ════════════════════════ 5 · verify email ════════════════════════ */

function Verify({ form, go }: { form: FormState; go: (s: Step | "home") => void }) {
  const email = form.email || "name@example.com";
  return (
    <ScreenShell>
      <div style={{ flex: 1, padding: "32px 28px 28px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: 36 }}>
          <ETLogo variant="trail" size={28} />
        </div>
        <div style={{ width: 76, height: 76, borderRadius: 22, background: P.surface, border: `1px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke={P.text} strokeWidth="1.6" />
            <path d="M3.5 7l8.5 6 8.5-6" stroke={P.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <H1 size={36}>
          Check your
          <br />
          email.
        </H1>
        <Body size={15} style={{ marginTop: 16, maxWidth: 320 }}>
          We sent a verification link to <span style={{ color: P.text, fontWeight: 600 }}>{email}</span>. Open it from this device to continue.
        </Body>
        <div style={{ marginTop: 24, fontFamily: MONO, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: P.muted }}>Didn&rsquo;t get it?</div>
        <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
          <button style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: P.text, fontFamily: FONT, fontSize: 14, fontWeight: 600, padding: 0, textDecoration: "underline", textUnderlineOffset: 4 }}>Resend link</button>
          <button onClick={() => go("welcome")} style={{ appearance: "none", background: "transparent", border: 0, cursor: "pointer", color: P.text, fontFamily: FONT, fontSize: 14, fontWeight: 600, padding: 0, textDecoration: "underline", textUnderlineOffset: 4 }}>Change email</button>
        </div>
        <div style={{ flex: 1 }} />
        <PrimaryBtn color="blue" onClick={() => go("goal")}>
          I verified my email
        </PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════ 6 · goal ════════════════════════ */

const GOAL_OPTIONS = [
  { id: "first", title: "First Property", sub: "Buy my first investment property.", icon: "home" },
  { id: "portfolio", title: "Build a Portfolio", sub: "Scale beyond a single rental.", icon: "stack" },
  { id: "exit", title: "Plan the Exit", sub: "Set up post-career income.", icon: "trend" },
  { id: "learn", title: "Just Learn", sub: "No deal yet — get the basics.", icon: "book" },
] as const;

function GoalIcon({ name, size = 22 }: { name: string; size?: number }) {
  const c = { stroke: "currentColor", strokeWidth: 1.8, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "home") return (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-7h-6v7H5a1 1 0 0 1-1-1v-9z" {...c} /></svg>);
  if (name === "stack") return (<svg width={size} height={size} viewBox="0 0 24 24"><rect x="3" y="10" width="7" height="11" rx="1" {...c} /><rect x="11" y="6" width="7" height="15" rx="1" {...c} /><rect x="19" y="13" width="2" height="8" rx="1" {...c} /></svg>);
  if (name === "trend") return (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 17l5-5 4 4 7-9" {...c} /><path d="M14 7h6v6" {...c} /></svg>);
  return (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h11v17H6a2 2 0 0 0-2 2V5z" {...c} /><path d="M9 8h6M9 12h4" {...c} /></svg>);
}

function Goal({ form, setState, go, back }: { form: FormState; setState: (p: Partial<FormState>) => void; go: (s: Step | "home") => void; back: () => void }) {
  const [sel, setSel] = React.useState<string | null>(form.goal);
  return (
    <ScreenShell>
      <TopBar onBack={back} total={3} step={0} />
      <div style={{ flex: 1, padding: "24px 24px 24px", display: "flex", flexDirection: "column" }}>
        <Eyebrow>Step 1 of 3</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <H1 size={34}>
            What&rsquo;s your
            <br />
            primary goal?
          </H1>
        </div>
        <Body style={{ marginTop: 12 }}>We&rsquo;ll customize your playbook based on what you pick.</Body>
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, alignContent: "start" }}>
          {GOAL_OPTIONS.map((g) => {
            const active = sel === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setSel(g.id)}
                style={{ appearance: "none", cursor: "pointer", textAlign: "left", background: P.surface, border: `1.5px solid ${active ? P.accent : P.line}`, borderRadius: 22, padding: 18, color: P.text, fontFamily: "inherit", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 154 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? P.accent : P.bg, color: active ? P.accentText : P.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GoalIcon name={g.icon} />
                  </div>
                  {active && (
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: P.accent, color: P.accentText, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.15 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: P.muted, marginTop: 4, lineHeight: 1.35 }}>{g.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 18 }}>
          <PrimaryBtn color="white" disabled={!sel} onClick={() => { setState({ goal: sel }); go("experience"); }}>
            Continue
          </PrimaryBtn>
          <TextLink onClick={() => go("experience")}>I&rsquo;ll do this later</TextLink>
        </div>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════ 7 · experience ════════════════════════ */

const EXP_OPTIONS = [
  { id: "beginner", title: "Beginner", sub: "Just starting my journey.", icon: "spark" },
  { id: "intermediate", title: "Intermediate", sub: "I have some industry knowledge.", icon: "pulse" },
  { id: "expert", title: "Expert", sub: "I'm a seasoned professional.", icon: "star" },
] as const;

function ExpIcon({ name, size = 20 }: { name: string; size?: number }) {
  const c = { stroke: "currentColor", strokeWidth: 1.9, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "spark") return (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill="currentColor" stroke="none" /></svg>);
  if (name === "pulse") return (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M3 12h4l2-7 4 14 2-7h6" {...c} /></svg>);
  return (<svg width={size} height={size} viewBox="0 0 24 24"><path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.7 19.6l1-6L3.4 9.4l6-.9L12 3z" {...c} /></svg>);
}

function Experience({ form, setState, go, back }: { form: FormState; setState: (p: Partial<FormState>) => void; go: (s: Step | "home") => void; back: () => void }) {
  const [sel, setSel] = React.useState<string | null>(form.experience);
  return (
    <ScreenShell>
      <TopBar onBack={back} total={3} step={1} />
      <div style={{ flex: 1, padding: "24px 24px 24px", display: "flex", flexDirection: "column" }}>
        <Eyebrow>Step 2 of 3</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <H1 size={34}>
            What is your
            <br />
            experience level?
          </H1>
        </div>
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
          {EXP_OPTIONS.map((o) => {
            const active = sel === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setSel(o.id)}
                style={{ appearance: "none", cursor: "pointer", textAlign: "left", background: P.surface, border: `1.5px solid ${active ? P.accent : P.line}`, borderRadius: 22, padding: "18px 20px", color: P.text, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 16 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 14, background: active ? P.accent : P.bg, color: active ? P.accentText : P.text, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ExpIcon name={o.icon} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: P.muted, marginTop: 2 }}>{o.sub}</div>
                </div>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: active ? P.accent2 : "transparent", border: `2px solid ${active ? P.accent2 : P.line}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                </div>
              </button>
            );
          })}
        </div>
        <PrimaryBtn color="blue" disabled={!sel} onClick={() => { setState({ experience: sel }); go("topics"); }}>
          Continue
        </PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════ 8 · topics ════════════════════════ */

const TOPICS = [
  "Property Investment", "Commercial Leasing", "Tax Strategies",
  "Zoning Laws", "Market Analysis", "Asset Management",
  "Risk Assessment", "REITs", "Portfolio Mgmt",
  "Tax Laws", "Sustainability", "1031 Exchanges",
  "Financing", "Wholesaling", "Property Mgmt",
];

function Topics({ form, setState, go, back }: { form: FormState; setState: (p: Partial<FormState>) => void; go: (s: Step | "home") => void; back: () => void }) {
  const [sel, setSel] = React.useState<string[]>(form.topics);
  const toggle = (t: string) => setSel((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  const valid = sel.length >= 3;
  return (
    <ScreenShell>
      <TopBar onBack={back} total={3} step={2} />
      <div style={{ flex: 1, padding: "24px 24px 24px", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Eyebrow>Step 3 of 3</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <H1 size={34}>
            Personalize your
            <br />
            experience
          </H1>
        </div>
        <Body style={{ marginTop: 12 }}>Select at least 3 topics to help us curate your playbook.</Body>
        <div className="et-scroll" style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8, flex: 1, alignContent: "flex-start", overflowY: "auto" }}>
          {TOPICS.map((t) => {
            const active = sel.includes(t);
            return (
              <button
                key={t}
                onClick={() => toggle(t)}
                style={{ appearance: "none", cursor: "pointer", padding: "11px 18px", borderRadius: 999, background: active ? P.accent : P.surface, border: `1px solid ${active ? P.accent : P.line}`, color: active ? P.accentText : P.text, fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}
              >
                {t}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: P.muted, marginBottom: 10, fontFamily: MONO, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>{sel.length} / 3 minimum</div>
        <PrimaryBtn color="white" disabled={!valid} onClick={() => { setState({ topics: sel }); go("complete"); }}>
          Continue
        </PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

/* ════════════════════════ 9 · complete ════════════════════════ */

function Complete({ form, go }: { form: FormState; go: (s: Step | "home") => void }) {
  const initials = (() => {
    const parts = (form.name || "You").split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "Y") + (parts[1]?.[0] || "")).toUpperCase();
  })();
  const profileChips = (form.topics.length ? form.topics : ["Property Investment", "Portfolio Mgmt", "Tax Laws", "Sustainability"]).slice(0, 4);
  const role =
    form.goal === "first" ? "First-time Investor" :
    form.goal === "portfolio" ? "Building Portfolio" :
    form.goal === "exit" ? "Career Transition" :
    form.goal === "learn" ? "Learning Real Estate" :
    "Real Estate Investor";
  return (
    <ScreenShell confetti>
      <div style={{ flex: 1, padding: "24px 24px 22px", display: "flex", flexDirection: "column", position: "relative", minHeight: 0 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 84, height: 84, borderRadius: "50%", background: P.accent2, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${P.accent2}66` }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <H1 size={30}>You&rsquo;re all set!</H1>
        </div>
        <Body style={{ textAlign: "center", marginBottom: 18 }}>We&rsquo;ve tailored your playbook based on your profile.</Body>
        <div style={{ background: P.surface, borderRadius: 22, padding: "18px 18px 16px", border: `1px solid ${P.line}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ width: 54, height: 54, borderRadius: "50%", background: P.bg, border: `1px solid ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 20, fontWeight: 700, color: P.text, letterSpacing: "0.02em" }}>{initials}</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{form.name || "Alex Chen"}</div>
          <div style={{ fontSize: 12, color: P.muted, marginTop: -2 }}>{role}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 4 }}>
            {profileChips.map((c) => (
              <div key={c} style={{ padding: "5px 11px", borderRadius: 999, background: P.bg, border: `1px solid ${P.line}`, fontSize: 11, fontWeight: 600, color: P.text }}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <PrimaryBtn color="lime" arrow={false} onClick={() => go("home")}>
          Start Learning
        </PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

function Confetti() {
  const specks = React.useMemo(() => {
    const rng = (i: number) => {
      const x = Math.sin(i * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    const palette = [P.accent, P.accent2, P.text, P.text, P.muted];
    return Array.from({ length: 64 }, (_, i) => ({
      x: rng(i) * 100,
      y: rng(i + 200) * 100,
      size: 3 + rng(i + 400) * 6,
      color: palette[Math.floor(rng(i + 600) * palette.length)],
      rot: rng(i + 800) * 360,
      shape: rng(i + 1000) > 0.6 ? "square" : "pill",
    }));
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {specks.map((s, i) => (
        <div key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.shape === "pill" ? s.size * 1.6 : s.size, height: s.size, background: s.color, borderRadius: s.shape === "pill" ? s.size : 1, transform: `rotate(${s.rot}deg)`, opacity: 0.7 }} />
      ))}
    </div>
  );
}
