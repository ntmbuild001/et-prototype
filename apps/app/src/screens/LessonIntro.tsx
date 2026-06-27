"use client";

// LessonIntro.tsx — ported from et2-lesson.jsx (ET2LessonIntro).
// Icon tile (Puffy with lesson.icon), learning objectives, simulator callout, CTA.

import React from "react";
import {
  Shell,
  Header,
  Cta,
  CapTile,
  Puffy,
  SKINS,
  colors,
  fontFamily,
} from "@et/brand";
import type { Lesson } from "@/data/curriculum";

export function LessonIntro({
  lesson,
  onBack,
  onStart,
}: {
  lesson: Lesson;
  onBack: () => void;
  onStart: () => void;
}) {
  return (
    <Shell label={`Lesson ${lesson.n} Intro`}>
      <Header
        onBack={onBack}
        eyebrow={`Stop ${lesson.n} · ${lesson.mins}`}
        title={lesson.title}
        sub={lesson.tagline}
      />
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "26px 22px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <CapTile state="current" isCurrent skin={SKINS.duo} size={120} big>
            <Puffy type={lesson.icon} hue="blue" size={64} />
          </CapTile>
        </div>

        <div>
          <div
            style={{
              fontFamily: fontFamily.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: colors.blue,
              marginBottom: 12,
            }}
          >
            What you&rsquo;ll learn
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {lesson.learn.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 14.5,
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 6,
                    background: colors.blue,
                    color: colors.ink,
                    fontSize: 11,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                    fontFamily: fontFamily.mono,
                  }}
                >
                  {i + 1}
                </div>
                <div>{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            borderRadius: 14,
            padding: "12px 14px",
            background: colors.bg,
            border: `1px dashed ${colors.blue}66`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path
              d="M6 9h4M8 7v4M15 8.5h.01M17.5 11h.01M4.5 8A2.5 2.5 0 017 5.5h10A2.5 2.5 0 0119.5 8l.8 7a2.3 2.3 0 01-4 1.8L14.5 15h-5l-1.8 1.8a2.3 2.3 0 01-4-1.8z"
              stroke={colors.blue}
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ fontSize: 13, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 700 }}>Ends in a simulator:</span> {lesson.sim.name} —{" "}
            {lesson.sim.brief}
          </div>
        </div>
      </div>

      <Cta label="Start lesson" onClick={onStart} />
    </Shell>
  );
}
