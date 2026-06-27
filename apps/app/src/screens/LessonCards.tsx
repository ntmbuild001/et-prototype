"use client";

// LessonCards.tsx — ported from et2-lesson.jsx (ET2LessonCards).
// Carousel of teaching cards (eyebrow/title/body, optional serif blockquote),
// progress dots + prev/next; final next -> onDone.

import React from "react";
import { Shell, Header, Progress, Cta, colors, fontFamily } from "@et/brand";
import type { Lesson } from "@/data/curriculum";

export function LessonCards({
  lesson,
  onBack,
  onClose,
  onDone,
}: {
  lesson: Lesson;
  onBack: () => void;
  onClose: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = React.useState(0);
  const cards = lesson.cards;
  const card = cards[step];
  const last = step === cards.length - 1;

  // total steps across the lesson = reading cards + quiz questions + the
  // simulator hand-off (mirrors the prototype's denominator).
  const totalSteps = cards.length + lesson.quiz.length + 1;
  const percent = ((step + 1) / totalSteps) * 100;

  return (
    <Shell label={`Lesson ${lesson.n} Reading`}>
      <Header
        onBack={step === 0 ? onBack : () => setStep(step - 1)}
        onClose={onClose}
        eyebrow={`Stop ${lesson.n} · Lesson`}
        title={lesson.title}
      />
      <Progress percent={percent} color={colors.blue} />

      <div
        key={step}
        style={{ flex: 1, overflowY: "auto", padding: "28px 22px 10px" }}
      >
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
          {card.eyebrow}
        </div>
        <h1
          style={{
            margin: "0 0 14px",
            fontFamily: fontFamily.sans,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            textWrap: "balance",
          }}
        >
          {card.title}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 15.5,
            lineHeight: 1.65,
            color: colors.text,
            textWrap: "pretty",
          }}
        >
          {card.body}
        </p>
        {card.quote && (
          <blockquote
            style={{
              margin: "22px 0 0",
              padding: "14px 18px",
              borderLeft: `3px solid ${colors.blue}`,
              background: colors.surface,
              borderRadius: 12,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily.serif,
                fontStyle: "italic",
                fontSize: 22,
                lineHeight: 1.25,
                color: colors.text,
              }}
            >
              &ldquo;{card.quote}&rdquo;
            </div>
          </blockquote>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 7,
          paddingBottom: 4,
          flexShrink: 0,
        }}
      >
        {cards.map((_, i) => (
          <span
            key={i}
            style={{
              width: i === step ? 18 : 6,
              height: 6,
              borderRadius: 999,
              transition: "all .25s",
              background:
                i === step
                  ? colors.blue
                  : i < step
                  ? "rgba(30,91,255,0.4)"
                  : colors.line2,
            }}
          />
        ))}
      </div>

      <Cta
        label={last ? "Take the quiz" : "Next"}
        onClick={last ? onDone : () => setStep(step + 1)}
      />
    </Shell>
  );
}
