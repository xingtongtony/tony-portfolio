"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const StaggerCtx = createContext({ cols: 3 });

/**
 * Scroll-reveal wrapper: each instance triggers individually when it scrolls
 * into the viewport. Use for paragraphs, media blocks, sub-sections — anywhere
 * you want a block to animate when the user actually reaches it.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  y = 48,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const Comp = as === "section" ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={reduce ? undefined : { duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Detects its own column count from the rendered grid-template-columns and
 * provides it to StaggerItem children, so the intra-row cascade always matches
 * the *actual* grid layout (responsive auto-fit included).
 */
export function StaggerGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const tpl = getComputedStyle(el).gridTemplateColumns;
      const count = tpl && tpl !== "none" ? tpl.split(" ").length : 1;
      setCols(Math.max(1, count));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <StaggerCtx.Provider value={{ cols }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerCtx.Provider>
  );
}

/**
 * Grid item with its own viewport trigger. Delay = `(index % cols) * 0.08`,
 * where `cols` is auto-detected from the parent StaggerGrid. Result: cards in
 * the same row animate left → right; the cascade resets on every new row.
 */
export function StaggerItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const { cols } = useContext(StaggerCtx);
  const delay = (index % cols) * 0.08;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={reduce ? undefined : { duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
