"use client";

// LessonQuiz.tsx — ported from et2-lesson.jsx (ET2LessonQuiz).
// One question at a time: radio options; on submit reveal correct/incorrect +
// the `why`; tally correct answers; after the last question -> onDone(count).

import React from "react";
import { Shell, Progress, Cta, RoundButton, colors, fontFamily } from "@et/brand";
import type { Lesson } from "@/data/curriculum";

export function LessonQuiz({
  lesson,
  onBack,
  onClose,
  onDone,
}: {
  lesson: Lesson;
  onBack: () => void;
  onClose: () => void;
  onDone: (correctCount: number) => void;
}) {
  const quiz = lesson.quiz;
  const [idx, setIdx] = React.useState(0);
  const [sel, setSel] = React.useState<string | null>(null);
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
    if (last) {
      onDone(correctCount);
      return;
    }
    setIdx(idx + 1);
    setSel(null);
    setLocked(false);
  };

  // progress accounts for the reading cards already completed before the quiz.
  const totalSteps = lesson.cards.length + quiz.length + 1;
  const percent = ((lesson.cards.length + idx + 1) / totalSteps) * 100;

  return (
    <Shell label={`Lesson ${lesson.n} Quiz`}>
      <div
        style={{
          padding: "14px 22px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <RoundButton onClick={onBack || onClose} label="Back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </RoundButton>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: colors.muted, marginBottom: 2 }}>{lesson.title}</div>
          <div style={{ fontSize: 17, fontWeight: 700 }}>
            Question {idx + 1} <span style={{ color: colors.muted, fontWeight: 600 }}>of {quiz.length}</span>
          </div>
        </div>
      </div>

      <Progress percent={percent} />

      <div key={idx} style={{ flex: 1, overflowY: "auto", padding: "30px 22px 10px" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: fontFamily.sans,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            textWrap: "balance",
          }}
        >
          {q.q}
        </h1>

        <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
          {q.opts.map((o) => {
            const active = sel === o.id;
            const showRight = locked && o.id === q.correct;
            const showWrong = locked && active && o.id !== q.correct;
            const border = showRight
              ? colors.blue
              : showWrong
              ? colors.error
              : active
              ? colors.blue
              : colors.line;
            const dot = showWrong ? colors.error : colors.blue;
            return (
              <button
                key={o.id}
                onClick={locked ? undefined : () => setSel(o.id)}
                style={{
                  appearance: "none",
                  cursor: locked ? "default" : "pointer",
                  textAlign: "left",
                  background: colors.surface,
                  border: `2px solid ${border}`,
                  borderRadius: 16,
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  color: colors.text,
                  fontFamily: fontFamily.sans,
                  boxShadow: (active && !locked) || showRight ? `0 0 30px ${colors.blue}33` : "none",
                  transition: "border-color .15s ease, box-shadow .15s ease",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${
                      active || showRight ? (showWrong ? colors.error : colors.blue) : colors.line2
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {(active || showRight) && (
                    <div
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: showRight ? colors.blue : dot,
                      }}
                    />
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{o.label}</div>
              </button>
            );
          })}
        </div>

        {locked && (
          <div
            style={{
              marginTop: 18,
              borderRadius: 16,
              padding: "14px 16px",
              background: colors.surface,
              border: `1px solid ${isCorrect ? `${colors.blue}66` : `${colors.error}66`}`,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily.mono,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: isCorrect ? colors.blue : colors.error,
                marginBottom: 6,
              }}
            >
              {isCorrect ? "CORRECT · +25 XP" : "NOT QUITE"}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(var(--et-ink-rgb),0.85)" }}>{q.why}</div>
          </div>
        )}
      </div>

      <Cta
        label={!locked ? "Submit answer" : last ? "To the simulator" : "Next question"}
        disabled={!locked && sel === null}
        onClick={!locked ? submit : next}
      />
    </Shell>
  );
}
