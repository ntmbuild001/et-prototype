// Core runtime contracts shared across the app.

export type Grade = "S" | "A" | "B" | "C" | "F";

/** Every simulator resolves to one of these. */
export interface SimResult {
  grade: Grade;
  xp: number;
  line: string;
}

/** Persisted player progress (localStorage key: et2-progress-v1). */
export interface Progress {
  completed: string[]; // lesson ids
  xp: number;
  streak: number;
  simGrades: Record<string, Grade>; // keyed by sim id
  onboarded: boolean;
}

export type LessonState = "done" | "current" | "locked";

export const SIM_XP: Record<Grade, number> = { S: 200, A: 150, B: 100, C: 50, F: 25 };

export const GRADE_RANK: Record<Grade, number> = { S: 5, A: 4, B: 3, C: 2, F: 1 };
