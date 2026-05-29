"use client";

import { useEffect, useRef } from "react";

type CursorState = "default" | "hover" | "view";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Touch / coarse pointer devices: don't render
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const lerp = reducedMotion ? 1 : 0.18;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    let state: CursorState = "default";
    let visible = false;
    let raf = 0;

    const setState = (next: CursorState) => {
      if (next === state) return;
      state = next;
      ring.dataset.state = state;
      dot.dataset.state = state;
    };

    const setVisible = (v: boolean) => {
      if (visible === v) return;
      visible = v;
      ring.dataset.visible = String(v);
      dot.dataset.visible = String(v);
    };

    const tick = () => {
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onOver = (e: MouseEvent) => {
      const node = e.target as HTMLElement | null;
      if (!node) return;
      // Explicit data-cursor wins
      const explicit = node.closest("[data-cursor]") as HTMLElement | null;
      if (explicit) {
        setState(
          (explicit.dataset.cursor as CursorState | undefined) ?? "default"
        );
        return;
      }
      // Auto-detect interactive elements as 'hover'
      if (
        node.closest(
          "a, button, [role='button'], input, textarea, select, label, summary"
        )
      ) {
        setState("hover");
        return;
      }
      setState("default");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        data-state="default"
        data-visible="false"
        aria-hidden="true"
        className="custom-cursor-ring"
      >
        <svg
          className="custom-cursor-eye"
          viewBox="0 0 32 24"
          width="30"
          height="22"
          aria-hidden="true"
        >
          <path
            className="custom-cursor-eye-shape"
            fill="currentColor"
            d="M2 12 C 5 3, 11 1, 16 1 C 21 1, 27 3, 30 12 C 27 21, 21 23, 16 23 C 11 23, 5 21, 2 12 Z"
          />
          <circle
            className="custom-cursor-eye-iris"
            cx="16"
            cy="12"
            r="4.5"
            fill="#ffffff"
          />
        </svg>
      </div>
      <div
        ref={dotRef}
        data-state="default"
        data-visible="false"
        aria-hidden="true"
        className="custom-cursor-dot"
      />
    </>
  );
}
