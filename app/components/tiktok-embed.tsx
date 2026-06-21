"use client";

import { useEffect } from "react";

/**
 * Live TikTok video embed. Renders TikTok's official `.tiktok-embed`
 * blockquote and loads `embed.js`, which scans the DOM and swaps the
 * blockquote for TikTok's iframe player. Re-adding the script on mount makes
 * it re-scan after client-side navigation into the page.
 *
 * Used in the TikTok Restructure "Video Share & Embed" section to demonstrate
 * the embed feature with a real video.
 */
export function TikTokEmbed({
  videoId,
  username,
  videoUrl,
  caption,
  className = "",
}: {
  videoId: string;
  username: string;
  videoUrl: string;
  caption?: string;
  className?: string;
}) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className={className}>
      <blockquote
        className="tiktok-embed"
        cite={videoUrl}
        data-video-id={videoId}
        style={{ maxWidth: "605px", minWidth: "325px" }}
      >
        <section>
          <a
            target="_blank"
            rel="noreferrer"
            title={`@${username}`}
            href={`https://www.tiktok.com/@${username}?refer=embed`}
          >
            @{username}
          </a>
          {caption ? ` ${caption}` : null}
        </section>
      </blockquote>
    </div>
  );
}
