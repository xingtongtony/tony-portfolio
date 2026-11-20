"use client";

import { useLayoutEffect } from "react";
import { BlueprintStage } from "./blueprint/blueprint-stage";
import { syncHomeView, useStageWanted } from "../lib/home-view";

/**
 * The stage view of the desktop homepage (see app/lib/home-view.ts).
 *
 * The stage is mounted whenever the visit has had it on screen, and hidden —
 * not unmounted — while the cards are showing, so coming back to it is
 * immediate and finds the figure where it was left. A visit that reloads on
 * the cards has not had it yet: three.js is not started until it is asked for.
 */
export function HomeStage() {
  const wanted = useStageWanted();
  // Arriving from another page, nothing has told the page which view is on.
  useLayoutEffect(syncHomeView, []);
  return wanted ? <BlueprintStage /> : null;
}
