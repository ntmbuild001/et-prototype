"use client";

// AnimatedPortfolio — the real Portfolio screen inside a scaled, revealing
// PhoneFrame.

import React from "react";
import { Portfolio, portfolioDemo } from "@et/screens";
import { PhoneReel } from "./PhoneReel";

export function AnimatedPortfolio() {
  return (
    <PhoneReel>
      <Portfolio {...portfolioDemo} />
    </PhoneReel>
  );
}
