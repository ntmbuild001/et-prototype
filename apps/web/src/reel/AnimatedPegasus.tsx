"use client";

// AnimatedPegasus — the real Pegasus AI-coach screen inside a scaled, revealing
// PhoneFrame.

import React from "react";
import { Pegasus, pegasusDemo } from "@et/screens";
import { PhoneReel } from "./PhoneReel";

export function AnimatedPegasus() {
  return (
    <PhoneReel>
      <Pegasus {...pegasusDemo} />
    </PhoneReel>
  );
}
