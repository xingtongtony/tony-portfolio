// The desktop homepage shows the same eleven projects two ways:
//
// - "stage" — the blueprint stage: one project at a time, built by the agents.
// - "cards" — Tony's hand-made cards, all eleven at once, in a page that scrolls.
//
// Which one is on is a choice of the visit, kept here so the three places that
// care agree: the switch in the navigation panel, the index under it, and the
// page. It lives outside React because the page must already be right before
// React starts (see `HOME_VIEW_SCRIPT` in home-view-key.ts), and because it has
// to survive going to a case study and coming back.
//
// How the page follows it: `<html data-home-view>` — the two views are both in
// the page, and CSS (globals.css) shows one of them. React is only asked
// whether the stage is worth mounting, and which button is pressed.

import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { HOME_VIEW_KEY as KEY } from "./home-view-key";

export type HomeView = "stage" | "cards";

/** A project being pointed at in the cards view, and from which side. */
export type Pointed = { id: string; from: "card" | "index" };

const state: {
  view: HomeView;
  /** Whether this visit has had the stage on screen: only then is it mounted. */
  stageSeen: boolean;
  pointed: Pointed | null;
} = { view: "stage", stageSeen: true, pointed: null };

let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Reads the visit's choice, once. Browser only. */
function load() {
  if (loaded) return;
  loaded = true;
  try {
    if (window.sessionStorage.getItem(KEY) === "cards") {
      state.view = "cards";
      state.stageSeen = false;
    }
  } catch {
    // No storage (private mode, blocked): the visit starts on the stage.
  }
}

export function getHomeView(): HomeView {
  load();
  return state.view;
}

/**
 * Makes the page agree with the choice. The homepage calls it when it mounts,
 * in case the script could not (storage that reads but did not at that moment).
 */
export function syncHomeView() {
  document.documentElement.dataset.homeView = getHomeView();
}

function setHomeView(view: HomeView) {
  if (getHomeView() === view) return;
  state.view = view;
  if (view === "stage") state.stageSeen = true;
  state.pointed = null;
  try {
    window.sessionStorage.setItem(KEY, view);
  } catch {
    // Not remembered, then.
  }
  syncHomeView();
  emit();
}

type ViewTransition = { ready?: Promise<unknown>; finished?: Promise<unknown> };
type DocVT = Document & { startViewTransition?: (update: () => void) => ViewTransition | undefined };

/**
 * Changes the view, as one cross-dissolve of the whole page where the browser
 * can do that (the same View Transitions fade the site uses between pages).
 */
export function switchHomeView(view: HomeView) {
  if (getHomeView() === view) return;
  const apply = () => flushSync(() => setHomeView(view));
  const start = (document as DocVT).startViewTransition;
  if (typeof start !== "function") return apply();
  // The change is made either way; a browser that skips the fade (the window
  // is in the background, say) rejects these, and that is not an error.
  const transition = start.call(document, apply);
  transition?.ready?.catch(() => {});
  transition?.finished?.catch(() => {});
}

/** Server and first client render say "stage": that is what the server drew. */
export function useHomeView(): HomeView {
  return useSyncExternalStore(subscribe, getHomeView, () => "stage");
}

/**
 * Whether to mount the stage at all. A visit that reloads on the cards has no
 * use for three.js until it asks for the stage; once it has, the stage stays
 * mounted (hidden) so that coming back to it is immediate.
 */
export function useStageWanted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => (load(), state.stageSeen),
    () => true,
  );
}

export function usePointed(): Pointed | null {
  return useSyncExternalStore(
    subscribe,
    () => state.pointed,
    () => null,
  );
}

export function point(next: Pointed | null) {
  const before = state.pointed;
  if (before?.id === next?.id && before?.from === next?.from) return;
  state.pointed = next;
  emit();
}
