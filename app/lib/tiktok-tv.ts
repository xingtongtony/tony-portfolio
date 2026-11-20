// Shared by the four TikTok TV case studies (visual, navigation, profile,
// search): their canvas and their one accent. The pages are written with the
// `--cs-*` tokens only, so switching CANVAS switches all four.

type Canvas = "dark" | "light";
export const CANVAS = "dark" as Canvas;

/** TikTok red, as the chapter numbers' colour (small text): brighter on dark, deeper on light for contrast. */
export const TT_ACCENT = "text-[#ff4d6d] [[data-cs-theme=light]_&]:text-[#d6153d]";
/** TikTok red for graphics (arrows, bars). */
export const TT_RED = "#fe2c55";

export const TV_CANVAS = {
  theme: CANVAS === "light" ? ("light" as const) : undefined,
  shell:
    CANVAS === "light"
      ? {
          sidebarTheme: "light" as const,
          mainClassName: "bg-white text-[#171717]",
          contentClassName: "min-w-0 bg-white text-[#171717]",
        }
      : {
          sidebarTheme: "tiktok-tv" as const,
          mainClassName: "bg-[#161616] text-white",
          rootBg: "#161616",
          contentClassName: "min-w-0 bg-[#161616] text-white",
        },
};
