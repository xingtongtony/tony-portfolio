"use client";

import Image from "next/image";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, X } from "lucide-react";

/**
 * Design boards a reader can open full screen.
 *
 * A case study's boards hold whole flows of small phone screens with notes
 * beside them; at page width the screens are a few dozen pixels across and on
 * a phone they are unreadable. Every `<Board>` opens the viewer: the board
 * fitted to the screen, then zoomed in (a click on a spot zooms into that
 * spot), dragged or scrolled around, and ← → through every board on the page
 * in order. Esc or × closes it and focus returns to the board that opened it.
 *
 * Wrap the page in `<BoardGallery boards={…}>` with the boards in page order.
 */

export type BoardImage = { src: string; alt: string; width: number; height: number };

const BoardContext = createContext<((src: string) => void) | null>(null);

export function BoardGallery({ boards, children }: { boards: BoardImage[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = useCallback(
    (src: string) => {
      const i = boards.findIndex((board) => board.src === src);
      if (i < 0) return;
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setIndex(i);
    },
    [boards],
  );
  const close = useCallback(() => {
    setIndex(null);
    opener.current?.focus();
  }, []);
  return (
    <BoardContext.Provider value={open}>
      {children}
      {index !== null ? <Viewer boards={boards} index={index} onIndex={setIndex} onClose={close} /> : null}
    </BoardContext.Provider>
  );
}

/**
 * A board on the page. `framed` gives it rounded corners and a hairline edge —
 * for boards whose own background differs from the page (dark flows, white
 * sheets). Without it the board sits on the page with no frame at all, which
 * is right when the board's background is the page's colour.
 */
export function Board({
  src,
  alt,
  width,
  height,
  framed = false,
  className = "",
}: BoardImage & { framed?: boolean; className?: string }) {
  const open = useContext(BoardContext);
  return (
    <button
      type="button"
      onClick={() => open?.(src)}
      aria-label={`Enlarge: ${alt}`}
      className={`group relative block w-full rounded-[1.5rem] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c13d22] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 70vw, 100vw"
        className={`h-auto w-full ${framed ? "rounded-[1.5rem] border border-black/[0.06]" : ""}`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-black/70 shadow-[0_2px_10px_rgba(0,0,0,0.12)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100"
      >
        <Maximize2 className="size-4" strokeWidth={2} />
      </span>
    </button>
  );
}

const IconButton = forwardRef<HTMLButtonElement, { label: string; onClick: () => void; children: ReactNode }>(
  function IconButton({ label, onClick, children }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        title={label}
        onClick={onClick}
        className="flex size-9 items-center justify-center rounded-full text-black/70 transition-colors hover:bg-black/[0.06] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c13d22]"
      >
        {children}
      </button>
    );
  },
);

function Viewer({
  boards,
  index,
  onIndex,
  onClose,
}: {
  boards: BoardImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const board = boards[index];
  const [zoom, setZoom] = useState<{ on: boolean; fx: number; fy: number }>({ on: false, fx: 0.5, fy: 0.5 });
  const [width, setWidth] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);

  const go = useCallback(
    (step: number) => {
      setZoom({ on: false, fx: 0.5, fy: 0.5 });
      onIndex((index + step + boards.length) % boards.length);
    },
    [boards.length, index, onIndex],
  );

  // The page under the viewer does not scroll, and focus starts on Close.
  useEffect(() => {
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    closeButton.current?.focus();
    return () => {
      html.style.overflow = before;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Tab stays inside the viewer.
      if (event.key === "Tab" && dialog.current) {
        const items = Array.from(dialog.current.querySelectorAll<HTMLElement>("button"));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") go(1);
      else if (event.key === "ArrowLeft") go(-1);
      else if (event.key === "+" || event.key === "=") setZoom((z) => ({ ...z, on: true }));
      else if (event.key === "-") setZoom((z) => ({ ...z, on: false }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Zoomed width: about two to three times the fitted board, never past
  // what the file holds.
  useLayoutEffect(() => {
    const measure = () => setWidth(scroller.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const zoomedWidth = Math.round(Math.min(board.width * 0.6, Math.max(width * 2, 900), width * 3));

  // Zooming in keeps the spot that was clicked under the pointer's place.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el || !zoom.on) return;
    const height = (zoomedWidth * board.height) / board.width;
    el.scrollLeft = zoom.fx * (zoomedWidth + 48) - el.clientWidth / 2;
    el.scrollTop = zoom.fy * (height + 48) - el.clientHeight / 2;
  }, [zoom, zoomedWidth, board.width, board.height]);

  const zoomAt = (event: ReactMouseEvent<HTMLImageElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    setZoom({ on: true, fx: (event.clientX - box.left) / box.width, fy: (event.clientY - box.top) / box.height });
  };

  return createPortal(
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={board.alt}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[200] flex flex-col bg-[#f3f3f3] text-[#171717]"
    >
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] px-3 sm:px-5">
        <p className="min-w-0 truncate pl-1 text-sm text-black/60">{board.alt}</p>
        <div className="flex shrink-0 items-center gap-0.5">
          <span className="mr-2 hidden text-xs tabular-nums text-black/45 sm:inline">
            {index + 1} / {boards.length}
          </span>
          <IconButton
            label={zoom.on ? "Zoom out" : "Zoom in"}
            onClick={() => setZoom((z) => ({ on: !z.on, fx: 0.5, fy: 0.5 }))}
          >
            {zoom.on ? <Minus className="size-4" strokeWidth={2} /> : <Plus className="size-4" strokeWidth={2} />}
          </IconButton>
          <IconButton label="Previous board" onClick={() => go(-1)}>
            <ChevronLeft className="size-4" strokeWidth={2} />
          </IconButton>
          <IconButton label="Next board" onClick={() => go(1)}>
            <ChevronRight className="size-4" strokeWidth={2} />
          </IconButton>
          <IconButton ref={closeButton} label="Close" onClick={onClose}>
            <X className="size-4" strokeWidth={2} />
          </IconButton>
        </div>
      </div>
      <div
        ref={scroller}
        className={`relative min-h-0 flex-1 ${zoom.on ? "cursor-grab overflow-auto active:cursor-grabbing" : "overflow-hidden"}`}
        onClick={(event) => {
          if (!zoom.on && event.target === event.currentTarget) onClose();
        }}
        onPointerDown={(event) => {
          if (!zoom.on || event.pointerType !== "mouse" || !scroller.current) return;
          drag.current = { x: event.clientX, y: event.clientY, left: scroller.current.scrollLeft, top: scroller.current.scrollTop, moved: false };
        }}
        onPointerMove={(event) => {
          const d = drag.current;
          if (!d || !scroller.current) return;
          const dx = event.clientX - d.x, dy = event.clientY - d.y;
          if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
          scroller.current.scrollLeft = d.left - dx;
          scroller.current.scrollTop = d.top - dy;
        }}
        onPointerUp={() => {
          // A drag that went nowhere was a click: it zooms back out.
          if (drag.current && !drag.current.moved) setZoom((z) => ({ ...z, on: false }));
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        {zoom.on ? (
          <div className="p-6" style={{ width: zoomedWidth + 48 }}>
            <Image
              key={board.src}
              src={board.src}
              alt={board.alt}
              width={board.width}
              height={board.height}
              sizes={`${zoomedWidth}px`}
              draggable={false}
              className="block h-auto select-none"
              style={{ width: zoomedWidth }}
              onClick={(event) => {
                // Touch has no drag handler: a tap zooms back out.
                if (event.nativeEvent instanceof PointerEvent && event.nativeEvent.pointerType !== "mouse") setZoom((z) => ({ ...z, on: false }));
              }}
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center p-4 sm:p-8"
            onClick={(event) => {
              if (event.target === event.currentTarget) onClose();
            }}
          >
            <Image
              key={board.src}
              src={board.src}
              alt={board.alt}
              width={board.width}
              height={board.height}
              sizes="100vw"
              draggable={false}
              onClick={zoomAt}
              className="block h-auto max-h-full w-auto max-w-full cursor-zoom-in select-none"
            />
          </div>
        )}
      </div>
    </motion.div>,
    document.body,
  );
}
