"use client";

// AppRoot.tsx — the connected app: screen router, persistent progress, lesson
// flow, 4-tab navigation. Ported from et2-app.jsx.
import React from "react";
import { PhoneFrame, colors } from "@et/brand";
import { Home, Map, Pegasus, Portfolio, portfolioDemo, type TabId, type MapNode } from "@et/screens";

import { LESSONS, MODULE, QUIZ_XP, type Lesson } from "@/data/curriculum";
import type { Grade, LessonState, Progress, SimResult } from "@/lib/types";
import { GRADE_RANK } from "@/lib/types";
import { useProgress } from "@/store/useProgress";

import { Onboard } from "@/screens/Onboard";
import { LessonIntro } from "@/screens/LessonIntro";
import { LessonCards } from "@/screens/LessonCards";
import { LessonQuiz } from "@/screens/LessonQuiz";
import { Rewards } from "@/screens/Rewards";
import { Profile } from "@/screens/extra/Profile";
import { Leaderboard } from "@/screens/extra/Leaderboard";
import { Settings } from "@/screens/extra/Settings";
import { Notifications } from "@/screens/extra/Notifications";
import { Paywall } from "@/screens/extra/Paywall";
import { SimScreen } from "@/sims/SimScreen";

type Screen =
  | "home"
  | "map"
  | "intro"
  | "cards"
  | "quiz"
  | "sim"
  | "rewards"
  | "profile"
  | "pegasus"
  | "portfolio"
  | "leaderboard"
  | "settings"
  | "notifications"
  | "paywall";

interface LessonResult {
  quizCorrect: number;
  quizTotal: number;
  simGrade: Grade | null;
  simXp: number;
  simLine: string | null;
  totalXp: number;
}

const DEV = process.env.NODE_ENV !== "production";

export function AppRoot() {
  const { progress, updateProgress, reset } = useProgress();
  const [screen, setScreen] = React.useState<Screen>("home");
  const [active, setActive] = React.useState<Lesson | null>(null);
  const [quizCorrect, setQuizCorrect] = React.useState(0);
  const [lastResult, setLastResult] = React.useState<LessonResult | null>(null);
  const [wasReplay, setWasReplay] = React.useState(false);

  const stateOf = React.useCallback(
    (lesson: Lesson): LessonState => {
      if (progress.completed.includes(lesson.id)) return "done";
      const firstIncomplete = LESSONS.find((l) => !progress.completed.includes(l.id));
      return firstIncomplete && firstIncomplete.id === lesson.id ? "current" : "locked";
    },
    [progress.completed]
  );

  const openLesson = (lesson: Lesson) => {
    setActive(lesson);
    setQuizCorrect(0);
    setScreen("intro");
  };

  // Accepts the 5-tab nav ids plus the legacy string ids used by the inline
  // Profile/Leaderboard tab strips ("dashboard" / "league").
  const handleTab = (t: string) => {
    switch (t) {
      case "home":
      case "dashboard":
        setScreen("home");
        break;
      case "learn":
      case "lessons":
        setScreen("map");
        break;
      case "portfolio":
        setScreen("portfolio");
        break;
      case "pegasus":
        setScreen("pegasus");
        break;
      case "profile":
        setScreen("profile");
        break;
      case "league":
        setScreen("leaderboard");
        break;
    }
  };

  const finishLesson = (simResult: SimResult | null) => {
    if (!active) return;
    const replay = progress.completed.includes(active.id);
    const quizXp = quizCorrect * QUIZ_XP;
    const totalXp = quizXp + (simResult ? simResult.xp : 0);
    setWasReplay(replay);
    setLastResult({
      quizCorrect,
      quizTotal: active.quiz.length,
      simGrade: simResult ? simResult.grade : null,
      simXp: simResult ? simResult.xp : 0,
      simLine: simResult ? simResult.line : null,
      totalXp,
    });
    updateProgress((prev) => {
      const next: Progress = { ...prev, simGrades: { ...prev.simGrades } };
      if (simResult) {
        const prevGrade = next.simGrades[active.sim.id];
        if (!prevGrade || GRADE_RANK[simResult.grade] > GRADE_RANK[prevGrade]) {
          next.simGrades[active.sim.id] = simResult.grade;
        }
      }
      if (!replay) {
        next.completed = [...next.completed, active.id];
        next.xp = next.xp + totalXp;
      }
      return next;
    });
    setScreen("rewards");
  };

  const finishOnboarding = () => {
    updateProgress((p) => ({ ...p, onboarded: true }));
    setScreen("home");
  };

  const simsPassed = Object.keys(progress.simGrades).length;
  const doneCount = LESSONS.filter((l) => stateOf(l) === "done").length;
  const current = LESSONS.find((l) => stateOf(l) === "current");

  const mapNodes: MapNode[] = LESSONS.map((l) => ({ id: l.id, n: l.n, title: l.title, icon: l.icon, state: stateOf(l) }));

  const coachLine = current
    ? `Here is your next move, Austin. Finish ${current.title}, then we'll underwrite a real one together.`
    : "You've cleared Module 01, Austin. Let's underwrite a real one together — ask me anything.";

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return (
          <Home
            name="Austin"
            initials="AB"
            coachLine={coachLine}
            continueEyebrow={`${MODULE.eyebrow} · Continue`}
            continueTitle={current ? current.title : "Module 01 — in the books."}
            continueDone={doneCount}
            continueTotal={LESSONS.length}
            onContinue={() => (current ? openLesson(current) : setScreen("map"))}
            onFinishLesson={() => (current ? openLesson(current) : setScreen("map"))}
            onPegasus={() => setScreen("pegasus")}
            onProfile={() => setScreen("profile")}
            onPortfolio={() => setScreen("portfolio")}
            nav={{ active: "home", onTab: handleTab }}
          />
        );
      case "map":
        return (
          <Map
            module={{ eyebrow: MODULE.eyebrow, title: MODULE.title, sub: MODULE.sub }}
            nodes={mapNodes}
            onOpen={(id) => {
              const lesson = LESSONS.find((l) => l.id === id);
              if (lesson && stateOf(lesson) !== "locked") openLesson(lesson);
            }}
            onBack={() => setScreen("home")}
            nav={{ active: "learn", onTab: handleTab }}
          />
        );
      case "intro":
        return active ? <LessonIntro lesson={active} onBack={() => setScreen("map")} onStart={() => setScreen("cards")} /> : null;
      case "cards":
        return active ? (
          <LessonCards lesson={active} onBack={() => setScreen("intro")} onClose={() => setScreen("map")} onDone={() => setScreen("quiz")} />
        ) : null;
      case "quiz":
        return active ? (
          <LessonQuiz
            lesson={active}
            onBack={() => setScreen("cards")}
            onClose={() => setScreen("map")}
            onDone={(correct) => {
              setQuizCorrect(correct);
              setScreen("sim");
            }}
          />
        ) : null;
      case "sim":
        return active ? <SimScreen lesson={active} onBack={() => setScreen("quiz")} onComplete={finishLesson} onSkip={() => finishLesson(null)} /> : null;
      case "rewards":
        return active && lastResult ? (
          <Rewards lesson={active} result={lastResult} replay={wasReplay} progress={{ ...progress, simsPassed }} onMap={() => setScreen("map")} />
        ) : null;
      case "profile":
        return (
          <Profile
            progress={progress}
            lessons={LESSONS}
            onTab={(t) => handleTab(t as TabId)}
            onLeague={() => setScreen("leaderboard")}
            onSettings={() => setScreen("settings")}
            onPaywall={() => setScreen("paywall")}
            onPortfolio={() => setScreen("portfolio")}
          />
        );
      case "pegasus":
        return <Pegasus onProfile={() => setScreen("profile")} nav={{ active: "pegasus", onTab: handleTab }} />;
      case "portfolio":
        return <Portfolio {...portfolioDemo} onProfile={() => setScreen("profile")} onReview={() => setScreen("pegasus")} nav={{ active: "portfolio", onTab: handleTab }} />;
      case "leaderboard":
        return <Leaderboard progress={progress} onTab={(t) => handleTab(t as TabId)} />;
      case "settings":
        return <Settings onBack={() => setScreen("profile")} onNotifications={() => setScreen("notifications")} onPaywall={() => setScreen("paywall")} />;
      case "notifications":
        return <Notifications onBack={() => setScreen("settings")} />;
      case "paywall":
        return <Paywall onClose={() => setScreen("profile")} />;
      default:
        return null;
    }
  };

  const body = (
    <div key={screen} className="et2-screenfade" style={{ width: "100%", height: "100%" }}>
      {progress.onboarded === false ? <Onboard onFinish={finishOnboarding} /> : renderScreen()}
    </div>
  );

  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        background: colors.bg,
        padding: "24px 12px",
      }}
    >
      <PhoneFrame>{body}</PhoneFrame>
      {DEV && (
        <div style={{ display: "flex", gap: 8 }}>
          <DevButton label="Replay onboarding" onClick={() => updateProgress((p) => ({ ...p, onboarded: false }))} />
          <DevButton
            label="Reset progress"
            onClick={() => {
              reset();
              setActive(null);
              setScreen("home");
            }}
          />
        </div>
      )}
    </main>
  );
}

function DevButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: "none",
        cursor: "pointer",
        background: colors.surface,
        border: `1px solid ${colors.line}`,
        borderRadius: 999,
        color: colors.muted,
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
