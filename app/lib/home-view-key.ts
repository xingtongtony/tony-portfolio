// Kept apart from home-view.ts so the root layout (a server component) can
// put the script in the page's HTML without pulling in that file's
// client-side code.

/** Where the visit's choice of homepage view is kept (sessionStorage). */
export const HOME_VIEW_KEY = "home-view";

/**
 * Runs before the page paints, on every full load: a visit that chose the
 * cards and reloads the homepage opens on the cards, with no flash of the
 * stage's loader. (sessionStorage: a new visit always opens on the stage.)
 */
export const HOME_VIEW_SCRIPT = `try{if(sessionStorage.getItem("${HOME_VIEW_KEY}")==="cards")document.documentElement.dataset.homeView="cards"}catch(e){}`;
