"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants, useInView } from "framer-motion";

// ─── Shared Variants ──────────────────────────────────────────────────────────

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── FadeIn ───────────────────────────────────────────────────────────────────
// Wrap any element to fade + slide up on mount or when entering viewport

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  /** If true, animates every time it enters the viewport (not just once) */
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.45,
  className,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── SlideIn ──────────────────────────────────────────────────────────────────

interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function SlideIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.45,
  className,
  once = true,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });

  const initial = {
    opacity: 0,
    x: direction === "left" ? -28 : direction === "right" ? 28 : 0,
    y: direction === "up" ? 24 : direction === "down" ? -24 : 0,
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : initial
      }
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerChildren ──────────────────────────────────────────────────────────
// Wrap a list container — children will animate in sequence

interface StaggerChildrenProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "ul" | "ol" | "section";
}

export function StaggerChildren({
  children,
  staggerDelay = 0.08,
  delayChildren = 0.05,
  className,
  once = true,
  as = "div",
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </Component>
  );
}

// ─── StaggerItem ──────────────────────────────────────────────────────────────
// Direct child of StaggerChildren

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={staggerItemVariants}>
      {children}
    </motion.div>
  );
}

// ─── CountUp ──────────────────────────────────────────────────────────────────
// Animates a number from 0 to the target value

interface CountUpProps {
  /** Target number to count up to */
  to: number;
  /** Displayed suffix like "%" or "k" */
  suffix?: string;
  /** Displayed prefix like "$" */
  prefix?: string;
  /** Duration in seconds */
  duration?: number;
  /** Decimal places */
  decimals?: number;
  className?: string;
  /** Format number with locale separators (e.g. 1,842) */
  locale?: boolean;
}

export function CountUp({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
  decimals = 0,
  className,
  locale = false,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * to).toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isInView, to, duration, decimals]);

  const display = locale
    ? value.toLocaleString("id-ID", { maximumFractionDigits: decimals })
    : value.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

// ─── PulseDot ─────────────────────────────────────────────────────────────────
// Persistent "live" indicator: steady dot + soft expanding ping

interface PulseDotProps {
  /** Dot color + any static ring utilities, e.g. "bg-[#14b8a6] ring-2 ring-white" */
  className: string;
  /** Positioning classes for the dot itself, e.g. "absolute top-1 right-1" */
  wrapClassName?: string;
  /** Color used for the ping element (defaults to className, strip ring if needed) */
  pingClassName?: string;
  /** Dot size, e.g. "size-2", "size-2.5", "size-4" */
  size?: string;
}

export function PulseDot({
  className,
  wrapClassName,
  pingClassName,
  size = "size-2.5",
}: PulseDotProps) {
  return (
    <span aria-hidden className={`relative flex ${wrapClassName ?? ""}`}>
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-70 ${pingClassName ?? className}`}
      />
      <span className={`relative inline-flex ${size} rounded-full ${className}`} />
    </span>
  );
}

// ─── ScaleIn ──────────────────────────────────────────────────────────────────

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  once?: boolean;
}

export function ScaleIn({
  children,
  delay = 0,
  className,
  once = true,
}: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
