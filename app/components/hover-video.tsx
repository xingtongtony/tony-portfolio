"use client";

import { useRef } from "react";

/**
 * "Hover to play" video — mirrors the source case study's wireframe clips that
 * only play while hovered. Plays on pointer enter, pauses + rewinds on leave.
 * Tap toggles on touch (no hover). A "Hover to play" badge fades out while
 * playing. Muted/loop/playsInline so it can autoplay-on-hover without a gesture.
 */
export function HoverVideo({
  src,
  className = "",
  label = "Hover to play",
}: {
  src: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => {
    ref.current?.play().catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) play();
    else stop();
  };

  return (
    <div className="group/hv relative overflow-hidden rounded-[1.5rem] border border-[var(--cs-border)]">
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={play}
        onMouseLeave={stop}
        onClick={toggle}
        className={`block h-auto w-full ${className}`}
      />
      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-sm transition-opacity duration-300 group-hover/hv:opacity-0">
        {label}
      </span>
    </div>
  );
}
