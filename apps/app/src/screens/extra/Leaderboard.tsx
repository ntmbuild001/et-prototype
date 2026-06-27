"use client";

// Leaderboard.tsx — ported from ET2LeaderboardScreen (et2-screens-extra.jsx).
// Weekly Rookie League: 8 ranked users, "You" highlighted and positioned by
// progress.xp. ET2P.lime -> colors.blue (Blue·Blue, never green).
import React from "react";
import { Shell, Card, Mono, colors, fontFamily } from "@et/brand";
import { TabBar } from "@et/screens";
import type { Progress } from "@/lib/types";
import { SimCallout } from "@/sims/simShared";

interface LeagueRow {
  name: string;
  xp: number | null;
  me?: boolean;
}

// Reference roster (names + weekly scores). "You" (Alex Chen) gets live XP.
const ET2_LEAGUE: LeagueRow[] = [
  { name: "Dre Whitfield", xp: 2210 },
  { name: "Jaylen Brooks", xp: 1950 },
  { name: "Marcus Vale", xp: 1820 },
  { name: "Alex Chen", xp: null, me: true },
  { name: "Tory Lammers", xp: 1130 },
  { name: "Cam Ridley", xp: 980 },
  { name: "DeShawn Pope", xp: 840 },
  { name: "Isaiah Granger", xp: 720 },
];

const PROMO = 3;

export function Leaderboard({ progress, onTab }: { progress: Progress; onTab: (t: string) => void }) {
  const rows = ET2_LEAGUE.map((r) => ({ ...r, xp: r.me ? progress.xp : (r.xp as number) })).sort(
    (a, b) => b.xp - a.xp
  );

  return (
    <Shell label="Leaderboard">
      <div style={{ padding: "24px 22px 0", flexShrink: 0 }}>
        <Mono color={colors.blue} style={{ marginBottom: 6 }}>
          Weekly league · 4 days left
        </Mono>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>Rookie League</div>
        <div style={{ fontSize: 13.5, color: colors.muted, marginTop: 4 }}>
          Top {PROMO} advance to Contender League.
        </div>
      </div>

      <div className="et-scroll" style={{ flex: 1, overflowY: "auto", padding: "18px 22px 40px" }}>
        <Card style={{ overflow: "hidden" }}>
          {rows.map((r, i) => {
            const isPromo = i < PROMO;
            return (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 16px",
                  background: r.me ? "rgba(30,91,255,0.08)" : "transparent",
                  borderLeft: r.me ? `3px solid ${colors.blue}` : "3px solid transparent",
                  borderBottom: i === rows.length - 1 ? 0 : `1px solid ${colors.line}`,
                }}
              >
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 12,
                    fontWeight: 700,
                    width: 20,
                    flexShrink: 0,
                    color: isPromo ? colors.blue : colors.muted,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: colors.surface2,
                    border: `1px solid ${r.me ? colors.blue : colors.line2}`,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fontFamily.mono,
                    fontSize: 11,
                    fontWeight: 700,
                    color: r.me ? colors.blue : colors.muted,
                  }}
                >
                  {r.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: r.me ? 800 : 600 }}>
                  {r.name}
                  {r.me && (
                    <span
                      style={{
                        color: colors.blue,
                        fontFamily: fontFamily.mono,
                        fontSize: 9.5,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        marginLeft: 8,
                      }}
                    >
                      YOU
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontFamily: fontFamily.mono,
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: isPromo ? colors.blue : colors.muted,
                    flexShrink: 0,
                  }}
                >
                  {r.xp.toLocaleString()}
                </span>
              </div>
            );
          })}
        </Card>

        <div style={{ marginTop: 14 }}>
          <SimCallout color={colors.blue}>
            <span style={{ fontWeight: 700 }}>XP counts this week only.</span> Lessons, quizzes and sim grades all feed the
            league.
          </SimCallout>
        </div>
      </div>

      <TabBar active="profile" onTab={onTab} />
    </Shell>
  );
}
