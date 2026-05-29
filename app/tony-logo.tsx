"use client";

import Lottie from "lottie-react";
import tonyLogo from "@/public/tonylogo.json";

export function TonyLogo() {
  return (
    <Lottie
      animationData={tonyLogo}
      loop
      autoplay
      className="h-auto w-[48px]"
      aria-label="Tony Xing logo"
    />
  );
}
