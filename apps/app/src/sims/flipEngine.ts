// flipEngine.ts — PURE TypeScript port of the "Flip It" P&L math from
// et2-sim-flip.jsx. No React, no DOM, no "use client". The UI layer
// (FlipSim.tsx) consumes these helpers; the math here is the single source of
// truth and mirrors `flipCompute` from the prototype exactly.

import { FLIP, type FlipItem, type FlipGrade } from "@/data/curriculum";
import type { Grade } from "@/lib/types";

export interface FlipBreakdown {
  /** ids of the rehab line items the player selected, in FLIP.items order */
  selectedIds: string[];
  /** final list price the market grades you at */
  salePrice: number;
  /** total rehab spend (sum of selected item costs) */
  rehab: number;
  /** total project duration in weeks (baseWeeks + selected weeks) */
  weeks: number;
  /** holding cost = weeks * holdPerWeek */
  holding: number;
  /** selling cost = salePrice * sellPct */
  selling: number;
  /** buyer-credit penalties for skipped essential items */
  penalties: number;
  /** net profit at the closing table */
  profit: number;
  /** grade letter from FLIP.grades */
  grade: Grade;
  /** XP awarded for the achieved grade */
  xp: number;
  /** flavor line for the achieved grade */
  line: string;
  /** true when rehab spend exceeds FLIP.budget */
  overBudget: boolean;
}

/** Per-penalty detail — used by the run-phase log + results buyer-credit rows. */
export interface FlipPenalty {
  id: string;
  label: string;
  amount: number;
}

/** Select FLIP.items in declared order matching the given id set. */
function selectedItems(selectedIds: string[]): FlipItem[] {
  return FLIP.items.filter((it) => selectedIds.includes(it.id));
}

/**
 * Skipped-essential penalties. Each essential item NOT selected costs a buyer
 * credit equal to its `penalty`, subtracted from the sale price.
 * Mirrors the prototype's penalties accumulation.
 */
export function flipPenalties(selectedIds: string[]): FlipPenalty[] {
  const out: FlipPenalty[] = [];
  for (const it of FLIP.items) {
    if (it.essential && !selectedIds.includes(it.id)) {
      out.push({ id: it.id, label: it.label, amount: it.penalty ?? 0 });
    }
  }
  return out;
}

/**
 * Running scope totals for the LIVE budget + timeline meters in the scope phase.
 * `cost` is rehab spend so far; `weeks` is total project weeks (incl. baseWeeks).
 */
export function scopeTotals(selectedIds: string[]): { cost: number; weeks: number } {
  const sel = selectedItems(selectedIds);
  const cost = sel.reduce((s, it) => s + it.cost, 0);
  const weeks = FLIP.baseWeeks + sel.reduce((s, it) => s + it.weeks, 0);
  return { cost, weeks };
}

/**
 * Excludes rule (luxkit ⇄ kitchen): returns the id that selecting `item` would
 * force OFF, or null. The relationship is symmetric even though only one side
 * declares `excludes` in the data:
 *  - if `item.excludes` is set, that id is mutually exclusive with `item`;
 *  - if some other item declares `excludes === item.id`, that item conflicts too.
 * Mirrors the prototype's toggle() de-selection logic.
 */
export function excludesConflict(_selectedIds: string[], item: FlipItem): string | null {
  if (item.excludes) return item.excludes;
  const excludedBy = FLIP.items.find((o) => o.excludes === item.id);
  return excludedBy ? excludedBy.id : null;
}

/** Grade lookup: first grade (descending min order) whose min ≤ profit. */
function gradeFor(profit: number): FlipGrade {
  const g = FLIP.grades.find((gr) => profit >= gr.min);
  // grades end at min: -Infinity (F), so a match is always found; fall back to
  // the last grade defensively to keep the return type non-null.
  return g ?? FLIP.grades[FLIP.grades.length - 1];
}

/**
 * Full P&L for a set of selected rehab items. Pure; deterministic.
 *
 * salePrice = FLIP.asIs + Σ add(selected) − Σ penalty(skipped essentials)
 * rehab     = Σ cost(selected)
 * weeks     = FLIP.baseWeeks + Σ weeks(selected)
 * holding   = round(weeks * FLIP.holdPerWeek)
 * selling   = round(salePrice * FLIP.sellPct)
 * profit    = salePrice − FLIP.purchase − rehab − holding − selling
 *
 * Note: in the reference, penalties are folded into `value` (the sale price)
 * before profit is computed, so they are NOT subtracted a second time from
 * profit. We replicate that exactly: `penalties` is reported for display, but
 * its effect on profit flows through `salePrice`.
 */
export function computeFlip(selectedIds: string[]): FlipBreakdown {
  const sel = selectedItems(selectedIds);

  const rehab = sel.reduce((s, it) => s + it.cost, 0);
  const weeks = FLIP.baseWeeks + sel.reduce((s, it) => s + it.weeks, 0);
  const holding = Math.round(weeks * FLIP.holdPerWeek);

  let value = FLIP.asIs + sel.reduce((s, it) => s + it.add, 0);
  const pens = flipPenalties(selectedIds);
  const penalties = pens.reduce((s, p) => s + p.amount, 0);
  value -= penalties;

  const salePrice = value;
  const selling = Math.round(salePrice * FLIP.sellPct);
  const profit = salePrice - FLIP.purchase - rehab - holding - selling;

  const g = gradeFor(profit);

  return {
    selectedIds: sel.map((it) => it.id),
    salePrice,
    rehab,
    weeks,
    holding,
    selling,
    penalties,
    profit,
    grade: g.g,
    xp: g.xp,
    line: g.line,
    overBudget: rehab > FLIP.budget,
  };
}
