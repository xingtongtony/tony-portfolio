"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { InViewVideo } from "../../components/in-view-video";
import { A, MARK_PATH, MARK_VIEW, WORDMARK_LETTERS, WORDMARK_VIEW } from "./brand-paths";

// The texture each letter carries in the app's loading wordmark.
const LETTER_TEXTURES = ["loop-orange-amber", "drop-blue-lightblue", "stripe-teal-green", "dash-pink-orange"];
const TILE = 520;

/**
 * Okou's wordmark, each letter cut from one of the brand textures, which
 * drift slowly inside it. The letters hop once when it comes on screen and
 * again whenever it is pointed at — the hop of the app's loading mark.
 */
export function Wordmark({ className = "", loop = false, id = "wm" }: { className?: string; loop?: boolean; id?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const [run, setRun] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WORDMARK_VIEW.width} ${WORDMARK_VIEW.height}`}
      role="img"
      aria-label="Okou"
      data-hop={seen && !loop ? "on" : undefined}
      data-loop={loop ? "on" : undefined}
      onPointerEnter={() => setRun((n) => n + 1)}
      className={`okou-wordmark ${className}`}
    >
      <defs>
        {LETTER_TEXTURES.map((texture, i) => (
          <pattern key={texture} id={`${id}-${i}`} patternUnits="userSpaceOnUse" width={TILE} height={TILE}>
            <image href={`${A}/textures/${texture}.svg`} width={TILE} height={TILE} />
            <animateTransform
              attributeName="patternTransform"
              type="translate"
              from="0 0"
              to={`${i % 2 ? -TILE : TILE} ${-TILE}`}
              dur={`${44 + i * 6}s`}
              repeatCount="indefinite"
            />
          </pattern>
        ))}
      </defs>
      {WORDMARK_LETTERS.map((d, i) => (
        <path
          // A new key restarts the hop.
          key={`${i}-${run}`}
          d={d}
          fill={`url(#${id}-${i})`}
          className="okou-letter"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </svg>
  );
}

/** The flower mark, in one colour. */
export function Mark({ className = "", color = "#ffa500" }: { className?: string; color?: string }) {
  return (
    <svg viewBox={`0 0 ${MARK_VIEW.width} ${MARK_VIEW.height}`} aria-hidden className={className}>
      <path d={MARK_PATH} fill={color} />
    </svg>
  );
}

export type Mood =
  | "idle" | "happy" | "nod" | "shake" | "sleepy" | "surprise" | "think" | "shy" | "laugh" | "wink" | "angry"
  | "cry" | "pout" | "confused" | "sweat" | "party" | "cool" | "please" | "kiss" | "dizzy" | "focus";

/**
 * Okou's avatar in one of its moods: the product's own rig, rendered to a
 * loop on its brand tile. The 29.5% radius is the avatar's squircle.
 */
export function Avatar({ mood = "idle", className = "", still = false }: { mood?: Mood; className?: string; still?: boolean }) {
  if (still) {
    return (
      <Image
        src={`${A}/avatar/${mood}.jpg`}
        alt=""
        width={360}
        height={360}
        className={`aspect-square rounded-[29.5%] ${className}`}
      />
    );
  }
  return (
    <div className={`aspect-square overflow-hidden rounded-[29.5%] bg-cover ${className}`} style={{ backgroundImage: `url(${A}/avatar/${mood}.jpg)` }}>
      <InViewVideo src={`${A}/avatar/${mood}.mp4`} poster={`${A}/avatar/${mood}.jpg`} className="block size-full" />
    </div>
  );
}

/** A surface covered in one of the brand textures. */
export function Texture({
  name,
  size = 260,
  className = "",
  children,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${A}/textures/${name}.svg)`, backgroundSize: `${size}px ${size}px`, ...style }}
    >
      {children}
    </div>
  );
}

/**
 * A bare app screen — an image, or a loop that plays while it is on screen.
 * No device: the display's own radius, a hairline and a soft shadow.
 */
export function Screen({
  image,
  video,
  alt,
  priority = false,
  tone = "light",
  className = "",
  sizes = "(min-width: 1180px) 300px, (min-width: 640px) 30vw, 45vw",
}: {
  image?: string;
  video?: string;
  alt: string;
  priority?: boolean;
  tone?: "light" | "dark";
  className?: string;
  sizes?: string;
}) {
  return (
    <div className={`okou-screen ${className}`} data-tone={tone}>
      {video ? (
        <>
          <InViewVideo src={`${A}/${video}.mp4`} poster={`${A}/${video}-poster.jpg`} />
          <span className="sr-only">{alt}</span>
        </>
      ) : (
        <Image src={`${A}/${image}.jpg`} alt={alt} width={1206} height={2622} priority={priority} sizes={sizes} />
      )}
    </div>
  );
}

export type Tone = "warm" | "sky" | "pink" | "lime" | "butter" | "ink";

/**
 * The ground every screen stands on. A screen is white, and so is the page,
 * so a screen never sits on the page itself: it sits whole on a stage in one
 * of Okou's own colours, where it reads as an object.
 */
export function Stage({
  tone = "warm",
  texture,
  className = "",
  children,
}: {
  tone?: Tone;
  /** A brand texture laid faintly over the colour. */
  texture?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`okou-stage relative overflow-hidden rounded-[2rem] ${className}`} data-tone={tone}>
      {texture ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-soft-light"
          style={{ backgroundImage: `url(${A}/textures/${texture}.svg)`, backgroundSize: "360px 360px" }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * One whole screen with its name and a line about it. The screen is always
 * complete and phone-shaped; it is never cropped or enlarged.
 */
export function Shot({
  image,
  video,
  alt,
  title,
  note,
  n,
  tone,
  className = "",
}: {
  image?: string;
  video?: string;
  alt: string;
  title: string;
  note?: string;
  n?: string;
  tone?: Tone;
  className?: string;
}) {
  const light = tone === "ink";
  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <Screen image={image} video={video} alt={alt} className="w-full max-w-[272px]" />
      <figcaption className="mt-7 w-full max-w-[272px]">
        <p className={`flex items-baseline gap-2.5 text-[1.0625rem] font-semibold leading-[1.3] tracking-[-0.01em] ${light ? "text-white" : "text-[var(--okou-ink)]"}`}>
          {n ? <span className={`text-[11px] font-semibold tabular-nums tracking-[0.08em] ${light ? "text-white/50" : "text-[rgb(37_33_33/0.45)]"}`}>{n}</span> : null}
          {title}
        </p>
        {note ? <p className={`mt-1.5 text-sm leading-[1.5] ${light ? "text-white/60" : "text-[rgb(37_33_33/0.64)]"}`}>{note}</p> : null}
      </figcaption>
    </figure>
  );
}

/**
 * Every mood on one wall. Twenty-one loops at once would be a lot to look at
 * and to decode, so the tiles rest on their best frame and a few at a time
 * play through once, in turn; pointing at one plays it too.
 */
export function MoodWall({ moods, className = "" }: { moods: Mood[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let next = 0;
    let timer: number | undefined;
    const playNext = () => {
      const video = videos.current[next % moods.length];
      next += 1;
      if (video && video.paused) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (entry.isIntersecting) {
          playNext();
          timer = window.setInterval(playNext, 900);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [moods.length]);

  return (
    <div ref={root} className={className}>
      {moods.map((mood, i) => (
        <figure key={mood} className="flex flex-col items-center">
          <div
            className="aspect-square w-full overflow-hidden rounded-[29.5%] bg-cover"
            style={{ backgroundImage: `url(${A}/avatar/${mood}.jpg)` }}
          >
            <video
              ref={(el) => {
                videos.current[i] = el;
              }}
              src={`${A}/avatar/${mood}.mp4`}
              poster={`${A}/avatar/${mood}.jpg`}
              muted
              playsInline
              preload="none"
              onPointerEnter={(e) => {
                const video = e.currentTarget;
                if (video.paused) {
                  video.currentTime = 0;
                  video.play().catch(() => {});
                }
              }}
              className="block size-full"
            />
          </div>
          <figcaption className="mt-2 text-[11px] font-medium capitalize tracking-[0.01em] text-[var(--cs-body-sm)]">{mood}</figcaption>
        </figure>
      ))}
    </div>
  );
}
