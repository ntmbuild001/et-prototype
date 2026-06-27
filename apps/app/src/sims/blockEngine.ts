// blockEngine.ts — pure equity math for the "BLOCK ROYALE" capstone simulator
// (Sim 05). Ported from design_handoff_et/app/et2-sim-block.jsx. No React.
//
// Five properties hit the courthouse steps against rival buyers. Sealed bids,
// one per property, fixed capital. Equity created decides the grade —
// overpaying counts against you.

import type { Grade } from "../lib/types";
import { SIM_XP } from "../lib/types";

export type PuffyLotIcon = "house" | "apartments" | "villa" | "bank";

export interface BlockLot {
  /** Stable id used to key bids and outcomes. */
  id: number;
  /** Street address shown as the lot title. */
  addr: string;
  /** One-line descriptor (duplex / fourplex / etc.). */
  desc: string;
  /** Puffy icon hue/type for the lot card. */
  icon: PuffyLotIcon;
  /** Opening / listing price. */
  list: number;
  /** Worth-to-you (your underwriting). Equity = worth − bid. */
  worth: number;
  /** Rival's top sealed bid. You win when your bid > this. */
  rival: number;
  /** Intel flavor text. */
  intel: string;
}

/** Fixed capital available across all five sealed bids. */
export const BLOCK_CAPITAL = 750000;

/** The five lots on the Lucy Ave block — exact numbers from the reference. */
export const BLOCK_LOTS: readonly BlockLot[] = [
  {
    id: 1,
    addr: "1942 Cella St",
    desc: "Duplex · tired but solid",
    icon: "house",
    list: 145000,
    worth: 205000,
    rival: 172000,
    intel: "Estate sale. Other buyers smell it too.",
  },
  {
    id: 2,
    addr: "1944 Cella St",
    desc: "Duplex · the neighbor",
    icon: "house",
    list: 150000,
    worth: 195000,
    rival: 201000,
    intel: "A cash buyer from out of state loves this one. Loves it a little too much.",
  },
  {
    id: 3,
    addr: "506 Lucy Ave",
    desc: "Fourplex · corner lot",
    icon: "apartments",
    list: 210000,
    worth: 290000,
    rival: 252000,
    intel: "Best rent roll on the block. Expect a fight.",
  },
  {
    id: 4,
    addr: "510 Lucy Ave",
    desc: "Boarded shell · needs everything",
    icon: "villa",
    list: 55000,
    worth: 88000,
    rival: 64000,
    intel: "Everyone else is scared of it. Fear is a discount.",
  },
  {
    id: 5,
    addr: "515 Lucy Ave",
    desc: "Brick sixplex · the anchor",
    icon: "bank",
    list: 280000,
    worth: 360000,
    rival: 338000,
    intel: "The trophy. Trophies are where discipline goes to die.",
  },
] as const;

interface GradeBand {
  min: number;
  g: Grade;
  line: string;
}

/** Grade thresholds on total equity created — highest band first. */
const BLOCK_GRADES: readonly GradeBand[] = [
  { min: 60000, g: "S", line: "You bought equity, not buildings. The block answers to you now." },
  { min: 40000, g: "A", line: "Strong campaign. You won where it was cheap and walked where it wasn’t." },
  { min: 25000, g: "B", line: "Profitable — but you left equity on the table or paid for the privilege." },
  { min: 1, g: "C", line: "You own property. Barely ahead. Winning the bid isn’t winning the deal." },
  { min: -Infinity, g: "F", line: "You won auctions and lost money. The rivals send their thanks." },
];

/** Shown when the player won nothing — disciplined, but deal-less. */
export const BLOCK_ZERO_LINE =
  "You never overpaid — and never bought. Discipline without deals is just window shopping.";

/** Per-lot outcome after resolving a full set of bids. */
export interface BlockLotOutcome {
  id: number;
  addr: string;
  /** The bid the player committed for this lot (0 if they passed / no bid). */
  bid: number;
  /** True when the player won the lot. */
  won: boolean;
  /** Equity created on a win (worth − bid). 0 when not won. */
  equity: number;
}

export interface BlockResult {
  /** Sum of equity across all won lots. */
  totalEquity: number;
  /** Number of lots won. */
  wins: number;
  /** Total capital deployed (sum of winning bids). */
  spent: number;
  grade: Grade;
  xp: number;
  line: string;
  /** Per-lot breakdown in dataset order. */
  lots: BlockLotOutcome[];
}

/**
 * Resolve a sealed-bid round.
 *
 * Bids are keyed by lot id (as string). A lot is WON when the player's bid is
 * strictly greater than the rival's top bid AND the bid still fits within the
 * remaining capital at the moment it is placed (lots resolve in dataset order,
 * capital is consumed as wins land). Equity for a win = worth − bid. Total
 * equity is the sum over wins. Missing / non-positive bids count as a pass.
 *
 * Grade bands on total equity: ≥$60k → S, ≥$40k → A, ≥$25k → B, ≥$1 → C,
 * else F. Winning zero lots is graded F with the special "window shopping"
 * line (in the prototype this stayed graded but with no deals; here a
 * deal-less run is an honest F).
 */
export function computeBlock(bids: Record<string, number>): BlockResult {
  const lots: BlockLotOutcome[] = [];
  let spent = 0;
  let wins = 0;
  let totalEquity = 0;

  for (const lot of BLOCK_LOTS) {
    const raw = bids[String(lot.id)];
    const bid = typeof raw === "number" && raw > 0 ? raw : 0;
    const remaining = BLOCK_CAPITAL - spent;
    const won = bid > lot.rival && bid <= remaining;
    const equity = won ? lot.worth - bid : 0;

    if (won) {
      spent += bid;
      wins += 1;
      totalEquity += equity;
    }

    lots.push({ id: lot.id, addr: lot.addr, bid, won, equity });
  }

  let band = BLOCK_GRADES.find((b) => totalEquity >= b.min) ?? BLOCK_GRADES[BLOCK_GRADES.length - 1];
  let line = band.line;

  if (wins === 0) {
    band = BLOCK_GRADES[BLOCK_GRADES.length - 1]; // F
    line = BLOCK_ZERO_LINE;
  }

  return {
    totalEquity,
    wins,
    spent,
    grade: band.g,
    xp: SIM_XP[band.g],
    line,
    lots,
  };
}
