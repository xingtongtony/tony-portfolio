"use client";

import { useSyncExternalStore } from "react";
import { setSound, soundOn, subscribeSound } from "../lib/sound";

/**
 * The sound switch: three small bars that move while sound is on and lie flat
 * when it is off. In the navigation panel and the phone header.
 */
export function SoundToggle({ className = "", label = true }: { className?: string; label?: boolean }) {
  const on = useSyncExternalStore(subscribeSound, soundOn, () => true);
  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Sound on" : "Sound off"}
      title={on ? "Sound on" : "Sound off"}
      className={`inline-flex items-center gap-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      <span aria-hidden className={`sound-bars ${on ? "is-on" : ""}`}>
        <span />
        <span />
        <span />
      </span>
      {label ? <span>{on ? "Sound" : "Muted"}</span> : null}
    </button>
  );
}
