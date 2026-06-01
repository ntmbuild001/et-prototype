"use client";

// screens-2.tsx — Step screens: Goal, Experience, Topics, Complete
// (ported from et-screens-2.jsx). Inline styles preserved verbatim.

import React from "react";
import {
  ScreenShell,
  TopBar,
  Eyebrow,
  H1,
  Body,
  PrimaryBtn,
  TextLink,
  FONT,
} from "./screens";

// ─── GOAL (2×2 grid, single-select) ─────────────────────────────
const GOAL_OPTIONS = [
  { id: 'first',     title: 'First Property',    sub: 'Buy my first investment property.', icon: 'home' },
  { id: 'portfolio', title: 'Build a Portfolio', sub: 'Scale beyond a single rental.',    icon: 'stack' },
  { id: 'exit',      title: 'Plan the Exit',     sub: 'Set up post-career income.',       icon: 'trend' },
  { id: 'learn',     title: 'Just Learn',        sub: 'No deal yet — get the basics.',    icon: 'book' },
];

function GoalIcon({ name, color, size = 22 }: any) {
  const c: any = { stroke: color, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'home') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-7h-6v7H5a1 1 0 0 1-1-1v-9z" {...c} />
    </svg>);
  if (name === 'stack') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="3"  y="10" width="7" height="11" rx="1" {...c} />
      <rect x="11" y="6"  width="7" height="15" rx="1" {...c} />
      <rect x="19" y="13" width="2" height="8"  rx="1" {...c} />
    </svg>);
  if (name === 'trend') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 17l5-5 4 4 7-9" {...c} />
      <path d="M14 7h6v6" {...c} />
    </svg>);
  if (name === 'book') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M4 5a2 2 0 0 1 2-2h11v17H6a2 2 0 0 0-2 2V5z" {...c} />
      <path d="M9 8h6M9 12h4" {...c} />
    </svg>);
  return null;
}

export function Goal({ ctx, go, back }: any) {
  const { palette, state, setState } = ctx;
  const [sel, setSel] = React.useState(state.goal || null);
  return (
    <ScreenShell palette={palette}>
      <TopBar palette={palette} onBack={back} total={3} step={0} />
      <div style={{ flex: 1, padding: '24px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <Eyebrow palette={palette}>Step 1 of 3</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <H1 palette={palette} size={34}>What's your<br/>primary goal?</H1>
        </div>
        <Body palette={palette} style={{ marginTop: 12 }}>
          We'll customize your playbook based on what you pick.
        </Body>

        <div style={{
          marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, alignContent: 'start',
        }}>
          {GOAL_OPTIONS.map((g) => {
            const active = sel === g.id;
            return (
              <button key={g.id} onClick={() => setSel(g.id)} style={{
                appearance: 'none', cursor: 'pointer', textAlign: 'left',
                background: palette.surface,
                border: `1.5px solid ${active ? palette.accent : palette.line}`,
                borderRadius: 22, padding: 18,
                color: palette.text, fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                minHeight: 154, position: 'relative',
                transition: 'border-color .15s ease',
              }}>
                {/* icon square */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: active ? palette.accent : palette.bg,
                    color: active ? palette.accentText : palette.text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <GoalIcon name={g.icon} color="currentColor" />
                  </div>
                  {active && (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: palette.accent, color: palette.accentText,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.15 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: palette.muted, marginTop: 4, lineHeight: 1.35 }}>{g.sub}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 18 }}>
          <PrimaryBtn palette={palette} color="white" disabled={!sel}
            onClick={() => { setState({ goal: sel }); go('experience'); }}>Continue</PrimaryBtn>
          <TextLink palette={palette} onClick={() => go('experience')}>I'll do this later</TextLink>
        </div>
      </div>
    </ScreenShell>
  );
}

// ─── EXPERIENCE (stacked, single-select with radio) ─────────────
const EXP_OPTIONS = [
  { id: 'beginner',     title: 'Beginner',     sub: 'Just starting my journey.',          icon: 'spark' },
  { id: 'intermediate', title: 'Intermediate', sub: 'I have some industry knowledge.',    icon: 'pulse' },
  { id: 'expert',       title: 'Expert',       sub: "I'm a seasoned professional.",       icon: 'star' },
];

function ExpIcon({ name, color, size = 20 }: any) {
  const c: any = { stroke: color, strokeWidth: 1.9, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'spark') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} stroke="none" />
    </svg>);
  if (name === 'pulse') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M3 12h4l2-7 4 14 2-7h6" {...c} />
    </svg>);
  if (name === 'star') return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.7 19.6l1-6L3.4 9.4l6-.9L12 3z" {...c} />
    </svg>);
  return null;
}

export function Experience({ ctx, go, back }: any) {
  const { palette, state, setState } = ctx;
  const [sel, setSel] = React.useState(state.experience || null);
  return (
    <ScreenShell palette={palette}>
      <TopBar palette={palette} onBack={back} total={3} step={1} />
      <div style={{ flex: 1, padding: '24px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <Eyebrow palette={palette}>Step 2 of 3</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <H1 palette={palette} size={34}>What is your<br/>experience level?</H1>
        </div>

        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
          {EXP_OPTIONS.map((o) => {
            const active = sel === o.id;
            return (
              <button key={o.id} onClick={() => setSel(o.id)} style={{
                appearance: 'none', cursor: 'pointer', textAlign: 'left',
                background: palette.surface,
                border: `1.5px solid ${active ? palette.accent : palette.line}`,
                borderRadius: 22, padding: '18px 20px',
                color: palette.text, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 16,
                transition: 'border-color .15s ease',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: active ? palette.accent : palette.bg,
                  color: active ? palette.accentText : palette.text,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <ExpIcon name={o.icon} color="currentColor" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: palette.muted, marginTop: 2 }}>{o.sub}</div>
                </div>
                {/* radio */}
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: active ? palette.accent2 : 'transparent',
                  border: `2px solid ${active ? palette.accent2 : palette.line}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                </div>
              </button>
            );
          })}
        </div>

        <PrimaryBtn palette={palette} color="blue" disabled={!sel}
          onClick={() => { setState({ experience: sel }); go('topics'); }}>Continue</PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

// ─── TOPICS (chip cloud, multi-select) ──────────────────────────
const TOPICS = [
  'Property Investment', 'Commercial Leasing', 'Tax Strategies',
  'Zoning Laws', 'Market Analysis', 'Asset Management',
  'Risk Assessment', 'REITs', 'Portfolio Mgmt',
  'Tax Laws', 'Sustainability', '1031 Exchanges',
  'Financing', 'Wholesaling', 'Property Mgmt',
];

export function Topics({ ctx, go, back }: any) {
  const { palette, state, setState } = ctx;
  const [sel, setSel] = React.useState<string[]>(state.topics || []);
  const toggle = (t: string) => setSel((s) => s.includes(t) ? s.filter((x) => x !== t) : [...s, t]);
  const valid = sel.length >= 3;
  return (
    <ScreenShell palette={palette}>
      <TopBar palette={palette} onBack={back} total={3} step={2} />
      <div style={{ flex: 1, padding: '24px 24px 24px', display: 'flex', flexDirection: 'column' }}>
        <Eyebrow palette={palette}>Step 3 of 3</Eyebrow>
        <div style={{ marginTop: 8 }}>
          <H1 palette={palette} size={34}>Personalize your<br/>experience</H1>
        </div>
        <Body palette={palette} style={{ marginTop: 12 }}>
          Select at least 3 topics to help us curate your playbook.
        </Body>

        <div style={{
          marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1, alignContent: 'flex-start',
          overflowY: 'auto',
        }} className="et-scroll">
          {TOPICS.map((t) => {
            const active = sel.includes(t);
            return (
              <button key={t} onClick={() => toggle(t)} style={{
                appearance: 'none', cursor: 'pointer',
                padding: '11px 18px', borderRadius: 999,
                background: active ? palette.accent : palette.surface,
                border: `1px solid ${active ? palette.accent : palette.line}`,
                color: active ? palette.accentText : palette.text,
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                transition: 'background .12s ease, color .12s ease',
              }}>{t}</button>
            );
          })}
        </div>

        <div style={{
          fontSize: 12, color: palette.muted, marginBottom: 10, fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
        }}>
          {sel.length} / 3 minimum
        </div>
        <PrimaryBtn palette={palette} color="white" disabled={!valid}
          onClick={() => { setState({ topics: sel }); go('complete'); }}>Continue</PrimaryBtn>
      </div>
    </ScreenShell>
  );
}

// ─── COMPLETE / All Set ─────────────────────────────────────────
export function Complete({ ctx, go }: any) {
  const { palette, state } = ctx;
  const initials = (() => {
    const name = state.name || 'You';
    const parts = name.split(' ').filter(Boolean);
    return ((parts[0]?.[0] || 'Y') + (parts[1]?.[0] || '')).toUpperCase();
  })();
  // Build chip list from topic selections (cap at 4 for visual rhythm)
  const profileChips = (state.topics || ['Property Investment', 'Portfolio Mgmt', 'Tax Laws', 'Sustainability']).slice(0, 4);
  const role = (() => {
    const goal = state.goal;
    if (goal === 'first')     return 'First-time Investor';
    if (goal === 'portfolio') return 'Building Portfolio';
    if (goal === 'exit')      return 'Career Transition';
    if (goal === 'learn')     return 'Learning Real Estate';
    return 'Real Estate Investor';
  })();

  return (
    <ScreenShell palette={palette} confetti>
      <div style={{ flex: 1, padding: '24px 24px 22px', display: 'flex', flexDirection: 'column', position: 'relative', minHeight: 0 }}>
        {/* Big blue check circle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: palette.accent2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 50px ${palette.accent2}66`,
          }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 6 }}>
          <H1 palette={palette} size={30}>You're all set!</H1>
        </div>
        <Body palette={palette} style={{ textAlign: 'center', marginBottom: 18 }}>
          We've tailored your playbook based on your profile.
        </Body>

        {/* Profile card */}
        <div style={{
          background: palette.surface, borderRadius: 22, padding: '18px 18px 16px',
          border: `1px solid ${palette.line}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: palette.bg, border: `1px solid ${palette.line}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT, fontSize: 20, fontWeight: 700, color: palette.text,
            letterSpacing: '0.02em',
          }}>{initials}</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{state.name || 'Alex Chen'}</div>
          <div style={{ fontSize: 12, color: palette.muted, marginTop: -2 }}>{role}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 4 }}>
            {profileChips.map((c: string) => (
              <div key={c} style={{
                padding: '5px 11px', borderRadius: 999,
                background: palette.bg, border: `1px solid ${palette.line}`,
                fontSize: 11, fontWeight: 600, color: palette.text,
              }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <PrimaryBtn palette={palette} color="lime" onClick={() => go('home')}>Start Learning</PrimaryBtn>
      </div>
    </ScreenShell>
  );
}
