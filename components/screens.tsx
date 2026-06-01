"use client";

// screens.tsx — Atoms + Welcome (auth-style signup) + early flow screens
// (ported from et-screens.jsx). Inline style objects are preserved verbatim.

import React from "react";
import { ETLogo } from "./ETLogo";

export const FONT = "'Inter Tight', -apple-system, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', ui-monospace, monospace";

// ─── Shell ──────────────────────────────────────────────────────
export function ScreenShell({ children, palette, confetti }: any) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: palette.bg, color: palette.text,
      fontFamily: FONT, overflow: 'hidden'
    }}>
      {confetti && <Confetti palette={palette} />}
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>);

}

// ─── Typography ─────────────────────────────────────────────────
export function Eyebrow({ children, palette }: any) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: palette.accent
    }}>{children}</div>);

}

export function H1({ children, palette, size = 34 }: any) {
  return (
    <h1 style={{
      fontFamily: FONT, fontSize: size, fontWeight: 700,
      lineHeight: 1.08, letterSpacing: '-0.02em',
      color: palette.text, margin: "3px"
    }}>{children}</h1>);

}

export function Body({ children, palette, size = 15, style = {} }: any) {
  return (
    <p style={{
      fontSize: size, lineHeight: 1.5,
      color: palette.muted, fontWeight: 400, ...style, padding: "0px 0px 2px", margin: "0px"
    }}>{children}</p>);

}

// ─── Buttons ────────────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, palette, disabled, color = 'blue', arrow = true }: any) {
  // color: 'blue' (auth/continue) | 'white' (secondary continue — flips to
  // dark surface on light palettes for contrast) | 'lime' (success)
  const isLight = palette.mode === 'light';
  const bg = disabled ? palette.surface :
  color === 'lime' ? palette.accent :
  color === 'white' ? isLight ? palette.text : '#ffffff' :
  palette.accent2;
  const fg = disabled ? palette.muted :
  color === 'lime' ? palette.accentText :
  color === 'white' ? isLight ? palette.bg : '#000000' :
  '#ffffff';
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
      appearance: 'none', border: 0, cursor: disabled ? 'default' : 'pointer',
      background: bg, color: fg, width: '100%',
      height: 56, borderRadius: 999, padding: '0 28px',
      fontFamily: FONT, fontSize: 16, fontWeight: 600,
      letterSpacing: '-0.005em',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      transition: 'transform .08s ease, background .15s ease',
      boxShadow: color === 'lime' && !disabled ? `0 0 40px ${palette.accent}55` : 'none'
    }}
    onPointerDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.985)')}
    onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      <span>{children}</span>
      {arrow &&
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h13M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      }
    </button>);

}

export function TextLink({ children, onClick, palette, color }: any) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer',
      color: color || palette.muted, fontFamily: FONT, fontSize: 14, fontWeight: 500,
      padding: 10
    }}>{children}</button>);

}

// ─── Top bar (step pill + back) ─────────────────────────────────
export function TopBar({ palette, onBack, total = 3, step = 0, showBack = true }: any) {
  return (
    <div style={{ padding: '14px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {showBack ?
      <button onClick={onBack} aria-label="Back" style={{
        appearance: 'none', cursor: 'pointer', border: 0,
        width: 40, height: 40, borderRadius: 12,
        background: palette.surface, color: palette.text,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12h11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button> :
      <div style={{ width: 40 }} />}
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: total }, (_, i) =>
        <div key={i} style={{
          width: i === step ? 18 : 6, height: 6, borderRadius: 3,
          background: i <= step ? palette.accent : palette.line,
          transition: 'width .2s ease'
        }} />
        )}
      </div>
    </div>);

}

// ─── Inputs ─────────────────────────────────────────────────────
export function FieldInput({ palette, label, type = 'text', placeholder, value, onChange }: any) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div>
      <div style={{
        fontSize: 11, color: palette.muted, marginBottom: 8, fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: MONO
      }}>{label}</div>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', height: 56, padding: '0 18px',
          background: palette.surface,
          border: `1px solid ${focus ? palette.line2 || palette.muted : palette.line}`,
          borderRadius: 14, color: palette.text, fontSize: 15,
          fontFamily: FONT, fontWeight: 500, outline: 0,
          transition: 'border-color .15s ease'
        }} />
    </div>);

}

// ─── Confetti for success screen ────────────────────────────────
export function Confetti({ palette }: any) {
  // Random-ish scattered specks, deterministic seed
  const specks = React.useMemo(() => {
    const rng = (i: number) => {const x = Math.sin(i * 9301 + 49297) * 233280;return x - Math.floor(x);};
    const colors = [palette.accent, palette.accent2, palette.text, palette.text, palette.muted];
    return Array.from({ length: 64 }, (_, i) => ({
      x: rng(i) * 100,
      y: rng(i + 200) * 100,
      size: 3 + rng(i + 400) * 6,
      color: colors[Math.floor(rng(i + 600) * colors.length)],
      rot: rng(i + 800) * 360,
      shape: rng(i + 1000) > 0.6 ? 'square' : 'pill'
    }));
  }, [palette]);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {specks.map((s, i) =>
      <div key={i} style={{
        position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
        width: s.shape === 'pill' ? s.size * 1.6 : s.size,
        height: s.size,
        background: s.color,
        borderRadius: s.shape === 'pill' ? s.size : 1,
        transform: `rotate(${s.rot}deg)`,
        opacity: 0.7
      }} />
      )}
    </div>);

}

// ─── Welcome (auth-style signup) ────────────────────────────────
export function Welcome({ ctx, go }: any) {
  const { palette, tweak } = ctx;
  const [email, setEmail] = React.useState(ctx.state.email || '');
  const [pw, setPw] = React.useState('');
  return (
    <ScreenShell palette={palette}>
      <div style={{ flex: 1, padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="et-scroll">
        {/* Small wordmark top-left */}
        <div style={{ marginBottom: 28 }}>
          <ETLogo variant={tweak.logoVariant} size={28} color={palette.text} accent={palette.accent} />
        </div>

        {/* Hero copy */}
        <div style={{ marginBottom: 24 }}>
          <H1 palette={palette} size={36}>Players today.<br />Partners <span style={{
              fontFamily: "'Instrument Serif', 'Times New Roman', serif",
              fontStyle: 'italic', fontWeight: 400, color: palette.accent,
              letterSpacing: '-0.01em', fontSize: '1.08em'
            }}>tomorrow.</span></H1>
          <Body palette={palette} size={15} style={{ marginTop: 14, maxWidth: 320 }}>
            Drop your email.
          </Body>
        </div>

        {/* Form card */}
        <div style={{
          background: palette.surface, borderRadius: 24, padding: 22,
          border: `1px solid ${palette.line}`,
          display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 18
        }}>
          <FieldInput palette={palette} label="Email Address" type="email"
          placeholder="name@example.com" value={email} onChange={setEmail} />
          <FieldInput palette={palette} label="Password" type="password"
          placeholder="••••••••" value={pw} onChange={setPw} />

          <PrimaryBtn palette={palette} onClick={() => {ctx.setState({ email });go('verifyid');}} color="blue">Create Account</PrimaryBtn>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: palette.line }} />
            <span style={{ fontSize: 10, color: palette.muted, letterSpacing: '0.22em', fontWeight: 600, fontFamily: MONO }}>OR</span>
            <div style={{ flex: 1, height: 1, background: palette.line }} />
          </div>

          {/* Google auth */}
          <SocialBtn palette={palette} onClick={() => go('goal')} icon="google" label="Continue with Google" />
        </div>
      </div>
    </ScreenShell>);

}

// ─── Application Submitted ──────────────────────────────────────
export function Submitted({ ctx, go }: any) {
  const { palette, tweak } = ctx;
  return (
    <ScreenShell palette={palette}>
      <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 36 }}>
          <ETLogo variant={tweak.logoVariant} size={28} color={palette.text} accent={palette.accent} />
        </div>

        <div style={{
          alignSelf: 'flex-start',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: palette.surface, border: `1px solid ${palette.line}`,
          fontFamily: MONO, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: palette.muted, marginBottom: 28
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: palette.accent2,
            boxShadow: `0 0 12px ${palette.accent2}`
          }} />
          Application Received
        </div>

        <H1 palette={palette} size={36}>Thanks for<br />submitting.</H1>
        <Body palette={palette} size={15} style={{ marginTop: 16, maxWidth: 320 }}>
          We&rsquo;ll get back to you shortly with the status of your application.
        </Body>

        <div style={{
          marginTop: 36, paddingTop: 20,
          borderTop: `1px solid ${palette.line}`,
          display: 'flex', flexDirection: 'column', gap: 18
        }}>
          <TimelineRow palette={palette} state="done" label="Submitted" meta="Just now" />
          <TimelineRow palette={palette} state="active" label="Under review" meta="24 – 48 hrs" />
          <TimelineRow palette={palette} state="pending" label="Decision" meta="By email" />
        </div>

        <div style={{ flex: 1 }} />
        <PrimaryBtn palette={palette} color="blue" onClick={() => go('verify')}>Got it</PrimaryBtn>
      </div>
    </ScreenShell>);

}

function TimelineRow({ palette, state, label, meta }: any) {
  const isDone = state === 'done';
  const isActive = state === 'active';
  const dotBg = isDone ? palette.accent2 : palette.surface;
  const dotBorder = isDone || isActive ? palette.accent2 : palette.line;
  const labelColor = isDone || isActive ? palette.text : palette.muted;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: dotBg, border: `1.5px solid ${dotBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: isActive ? `0 0 0 4px ${palette.accent2}22` : 'none'
      }}>
        {isDone &&
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
        {isActive && <div style={{ width: 6, height: 6, borderRadius: '50%', background: palette.accent2 }} />}
      </div>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: labelColor }}>{label}</div>
      <div style={{
        fontFamily: MONO, fontSize: 10, fontWeight: 600,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: palette.muted
      }}>{meta}</div>
    </div>);

}

// ─── Verify Email ───────────────────────────────────────────────
export function Verify({ ctx, go }: any) {
  const { palette, tweak } = ctx;
  const email = ctx.state.email || 'name@example.com';
  return (
    <ScreenShell palette={palette}>
      <div style={{ flex: 1, padding: '32px 28px 28px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 36 }}>
          <ETLogo variant={tweak.logoVariant} size={28} color={palette.text} accent={palette.accent} />
        </div>

        <div style={{
          width: 76, height: 76, borderRadius: 22,
          background: palette.surface, border: `1px solid ${palette.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="2" stroke={palette.text} strokeWidth="1.6" />
            <path d="M3.5 7l8.5 6 8.5-6" stroke={palette.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <H1 palette={palette} size={36}>Check your<br />email.</H1>
        <Body palette={palette} size={15} style={{ marginTop: 16, maxWidth: 320 }}>
          We sent a verification link to{' '}
          <span style={{ color: palette.text, fontWeight: 600 }}>{email}</span>. Open it from this device to continue.
        </Body>

        <div style={{
          marginTop: 24,
          fontFamily: MONO, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.muted
        }}>Didn&rsquo;t get it?</div>
        <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
          <button style={{
            appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer',
            color: palette.text, fontFamily: FONT, fontSize: 14, fontWeight: 600,
            padding: 0, textDecoration: 'underline', textUnderlineOffset: 4
          }}>Resend link</button>
          <button onClick={() => go('welcome')} style={{
            appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer',
            color: palette.text, fontFamily: FONT, fontSize: 14, fontWeight: 600,
            padding: 0, textDecoration: 'underline', textUnderlineOffset: 4
          }}>Change email</button>
        </div>

        <div style={{ flex: 1 }} />
        <PrimaryBtn palette={palette} color="blue" onClick={() => go('goal')}>
          I verified my email
        </PrimaryBtn>
      </div>
    </ScreenShell>);

}

// ─── Verify Identity (ID.me) ────────────────────────────────────
export function VerifyId({ ctx, go }: any) {
  const { palette, tweak } = ctx;
  return (
    <ScreenShell palette={palette}>
      <div style={{ flex: 1, padding: '28px 24px 24px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="et-scroll">
        {/* Small wordmark top-left */}
        <div style={{ marginBottom: 28 }}>
          <ETLogo variant={tweak.logoVariant} size={28} color={palette.text} accent={palette.accent} />
        </div>

        {/* Hero copy */}
        <div style={{ marginBottom: 24, padding: "5px", margin: "0px 0px 24px" }}>
          <H1 palette={palette} size={36}>Verify it&rsquo;s<br />really <span style={{
              fontFamily: "'Instrument Serif', 'Times New Roman', serif",
              fontStyle: 'italic', fontWeight: 400, color: palette.accent,
              letterSpacing: '-0.01em', fontSize: '1.08em'
            }}>you.</span></H1>
          <Body palette={palette} size={15} style={{ marginTop: 14, maxWidth: 320 }}>
            We partner with ID.me to confirm your identity. One scan, fully private.
          </Body>
        </div>

        {/* Verification card */}
        <div style={{
          background: palette.surface, borderRadius: 24, padding: 22,
          border: `1px solid ${palette.line}`,
          display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 18
        }}>
          {/* Biometric face-scan icon tile */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{
              width: 96, height: 96, borderRadius: 28,
              background: palette.bg, border: `1px solid ${palette.line}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <BiometricIcon color={palette.accent} size={52} />
            </div>
          </div>

          {/* Reassurance rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <VerifyPoint palette={palette} label="Bank-grade encryption" />
            <VerifyPoint palette={palette} label="Your data stays yours" />
            <VerifyPoint palette={palette} label="Takes under a minute" />
          </div>

          {/* ID.me branded CTA */}
          <button onClick={() => {ctx.setState({ verified: true });go('submitted');}} style={{
            appearance: 'none', cursor: 'pointer',
            width: '100%', height: 56, borderRadius: 999,
            background: palette.accent2, border: 0,
            color: palette.accentText,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontFamily: FONT, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em'
          }}>
            <IdMeMark color={palette.accentText} height={18} />
            Verify with ID.me
          </button>

          <button onClick={() => go('submitted')} style={{
            appearance: 'none', background: 'transparent', border: 0, cursor: 'pointer',
            color: palette.muted, fontFamily: FONT, fontSize: 13, fontWeight: 600,
            padding: 0, alignSelf: 'center'
          }}>I&rsquo;ll do this later</button>
        </div>
      </div>
    </ScreenShell>);

}

function VerifyPoint({ palette, label }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        background: `${palette.accent}1f`, border: `1px solid ${palette.accent}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M5 12l5 5L20 7" stroke={palette.accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: palette.text }}>{label}</div>
    </div>);

}

// Face-scan biometric glyph: corner brackets framing a simplified face.
function BiometricIcon({ color = '#fff', size = 48 }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      {/* Corner brackets */}
      <path d="M6 16V10a4 4 0 014-4h6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 16V10a4 4 0 00-4-4h-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 32v6a4 4 0 004 4h6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M42 32v6a4 4 0 01-4 4h-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      {/* Face */}
      <circle cx="24" cy="20.5" r="4.4" stroke={color} strokeWidth="2.2" />
      <path d="M15.5 35c1-4.4 4.4-7 8.5-7s7.5 2.6 8.5 7" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>);

}

// Simple "ID" check mark used inside the ID.me button.
function IdMeMark({ color = '#fff', height = 18 }: any) {
  return (
    <svg width={height} height={height} viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="2.5" width="19" height="19" rx="6" stroke={color} strokeWidth="2" />
      <path d="M7.5 12.5l3 3 6-7" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

export function SocialBtn({ palette, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} style={{
      appearance: 'none', cursor: 'pointer',
      width: '100%', height: 56, borderRadius: 999,
      background: palette.bg, border: `1px solid ${palette.line}`,
      color: palette.text, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      fontFamily: FONT, fontSize: 16, fontWeight: 600
    }}>
      {icon === 'google' &&
      <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6c-.2 1.3-1 2.4-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z" />
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.6c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3v2.6C4.7 19.7 8.1 22 12 22z" />
          <path fill="#FBBC05" d="M6.4 13.8c-.2-.6-.3-1.3-.3-2s.1-1.3.3-2V7.2H3C2.4 8.7 2 10.3 2 12s.4 3.3 1 4.8l3.4-3z" />
          <path fill="#EA4335" d="M12 5.8c1.5 0 2.8.5 3.9 1.5l2.9-2.9C17 2.9 14.7 2 12 2 8.1 2 4.7 4.3 3 7.2l3.4 2.6c.8-2.4 3-4 5.6-4z" />
        </svg>
      }
      {icon === 'apple' &&
      <svg width="18" height="18" viewBox="0 0 24 24" fill={palette.text}>
          <path d="M17.05 12.04c.03 3.07 2.72 4.09 2.75 4.1-.02.07-.43 1.46-1.41 2.89-.85 1.24-1.74 2.47-3.14 2.5-1.37.03-1.82-.8-3.39-.8-1.57 0-2.06.78-3.36.83-1.35.05-2.38-1.34-3.24-2.57C3.5 16.49 2.16 11.85 4 8.7c.91-1.55 2.54-2.53 4.3-2.55 1.32-.03 2.57.89 3.39.89.81 0 2.33-1.1 3.94-.94.67.03 2.55.27 3.76 2.03-.1.06-2.24 1.31-2.22 3.91M14.36 4.45c.72-.87 1.21-2.08 1.08-3.28-1.04.04-2.31.7-3.06 1.56-.67.77-1.26 2.01-1.1 3.18 1.16.09 2.35-.59 3.08-1.46" />
        </svg>
      }
      {label}
    </button>);

}
