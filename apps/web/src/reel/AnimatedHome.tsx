"use client";

// AnimatedHome — the real Home product screen inside a scaled, revealing
// PhoneFrame. homeDemo omits `nav`, so no bottom tab bar renders in the reel.

import React from "react";
import { Home, homeDemo } from "@et/screens";
import { PhoneReel } from "./PhoneReel";

export function AnimatedHome() {
  return (
    <PhoneReel>
      <Home {...homeDemo} />
    </PhoneReel>
  );
}
