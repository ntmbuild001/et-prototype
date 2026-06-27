"use client";

// SimScreen.tsx — routes a lesson to its simulator implementation.
import React from "react";
import { Shell, Header, Cta, colors, fontFamily } from "@et/brand";
import type { Lesson } from "@/data/curriculum";
import type { SimResult } from "@/lib/types";
import { SpotterSim } from "./SpotterSim";
import { BuyBoxSim } from "./BuyBoxSim";
import { UnderwriteSim } from "./UnderwriteSim";
import { FlipSim } from "./FlipSim";
import { BlockSim } from "./BlockSim";

function SimSoon({ lesson, onBack, onFinish }: { lesson: Lesson; onBack: () => void; onFinish: () => void }) {
  return (
    <Shell label={`Sim ${lesson.sim.name} soon`}>
      <Header onBack={onBack} eyebrow={`Simulator ${String(lesson.n).padStart(2, "0")}`} eyebrowColor={colors.blue} title={lesson.sim.name} />
      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "26px 22px 10px" }}>
        <div style={{ border: `1px solid ${colors.line}`, borderRadius: 22, background: colors.surface, padding: "18px 16px" }}>
          <div style={{ fontFamily: fontFamily.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", color: colors.blue, marginBottom: 12 }}>STATUS — DEPLOYING SOON</div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(var(--et-ink-rgb),0.75)" }}>{lesson.sim.brief}</div>
        </div>
      </div>
      <Cta label="Finish lesson" onClick={onFinish} />
    </Shell>
  );
}

export function SimScreen({
  lesson,
  onBack,
  onComplete,
  onSkip,
}: {
  lesson: Lesson;
  onBack: () => void;
  onComplete: (r: SimResult) => void;
  onSkip: () => void;
}) {
  switch (lesson.sim.id) {
    case "spotter":
      return <SpotterSim onBack={onBack} onComplete={onComplete} />;
    case "buyboxsim":
      return <BuyBoxSim onBack={onBack} onComplete={onComplete} />;
    case "underwriter":
      return <UnderwriteSim onBack={onBack} onComplete={onComplete} />;
    case "flipit":
      return <FlipSim onBack={onBack} onComplete={onComplete} />;
    case "blockroyale":
      return <BlockSim onBack={onBack} onComplete={onComplete} />;
    default:
      return <SimSoon lesson={lesson} onBack={onBack} onFinish={onSkip} />;
  }
}
