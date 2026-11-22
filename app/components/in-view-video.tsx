"use client";

import { useEffect, useRef } from "react";

/**
 * A muted looping demo video that plays only while it is on screen.
 *
 * A case study can have ten or more loops; with every one of them running at
 * once the reader has no idea where to look, and the page pays for decoding
 * all of them. This one plays when at least a third of it is visible and
 * pauses when it leaves, so the motion on screen is the motion being read
 * about. With reduced motion it does not play by itself.
 */
export function InViewVideo({
  src,
  className = "",
  poster,
}: {
  src: string;
  className?: string;
  /** First frame shown before the loop plays (or instead of it, with reduced motion). */
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.33 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return <video ref={ref} src={src} poster={poster} className={className} loop muted playsInline preload="metadata" />;
}
