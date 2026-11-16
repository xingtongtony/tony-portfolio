// Shared mutable state between the DOM overlay (chips, log, agent cursors) and
// the 3D scene's frame loop. It is one module-level object: both sides read
// and write it in event handlers, ref callbacks and the frame loop — never
// during render — and only coarse changes go through React state.

import type { PartRuntime } from "./figure-builder";

export type BuildItem = {
  figId: string;
  partId: string;
  label: string;
  agent: number;
  /** Seconds from the build's start: agent sets off, fill starts, fill ends. */
  tGo: number;
  tStart: number;
  tEnd: number;
  started: boolean;
  ended: boolean;
};

export type Build = {
  figId: string;
  /** performance.now() / 1000 at the start, shifted forward by any pauses. */
  t0: number;
  items: BuildItem[];
  paused: boolean;
  pausedAt: number;
};

export type Engine = {
  /** Keyed `${figureId}/${partId}`; filled in by the scene once it has measured. */
  parts: Record<string, PartRuntime>;
  build: Build | null;
  /** The agents' DOM cursors, positioned by the scene every frame. */
  agentEls: (HTMLElement | null)[];
  /** DOM labels pinned to 3D points: `cap/<figure>` and `n/<figure>/<numeral>`. */
  labelEls: Record<string, HTMLElement | null>;
  /**
   * Set when something outside the frame loop changed the 3D picture (a part
   * jumped state, a texture arrived). The scene only redraws when it has to.
   */
  dirty: boolean;
};

/** There is one stage on the page, so one engine. */
export const engine: Engine = { parts: {}, build: null, agentEls: [], labelEls: {}, dirty: true };

export const now = () => performance.now() / 1000;

/**
 * Jump a part straight to drawn or built. Lives here, not in figure-builder,
 * so the DOM layer can call it without pulling three.js into the page's first
 * load — keep this file free of three imports.
 */
export function setPartBuilt(rt: PartRuntime, built: boolean) {
  rt.h.value = built ? 1e3 : -1e3;
  rt.bandOn.value = 0;
  rt.progress = built ? 1 : 0;
  engine.dirty = true;
}
