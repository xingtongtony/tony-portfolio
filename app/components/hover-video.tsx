"use client";

import { useRef, useState } from "react";

/**
 * "Hover to play" video — mirrors the source case study's wireframe clips that
 * only play while hovered. Plays on pointer enter, pauses + rewinds on leave.
 * Tap toggles on touch (no hover), where the badge reads "Tap to play". The
 * badge fades out while the clip plays. Muted/loop/playsInline so it can
 * autoplay-on-hover without a gesture.
 */
export function HoverVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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
      {/* `#t=0.001` makes iOS Safari paint the first frame; with
          preload="metadata" alone it shows an empty box until played. */}
      <video
        ref={ref}
        src={`${src}#t=0.001`}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={play}
        onMouseLeave={stop}
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`block h-auto w-full ${className}`}
      />
      <span
        className={`pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white/85 backdrop-blur-sm transition-opacity duration-300 group-hover/hv:opacity-0 ${playing ? "opacity-0" : ""}`}
      >
        <span className="pointer-coarse:hidden">Hover to play</span>
        <span className="hidden pointer-coarse:inline">Tap to play</span>
      </span>
    </div>
  );
}
