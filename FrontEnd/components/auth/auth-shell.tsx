"use client";

import type { ReactNode } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "framer-motion";
import { FadeIn, SlideIn, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import { ShieldCheckIcon } from "./auth-icons";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const DEFAULT_FOOTER_LINKS = ["Privacy Policy", "Terms of Service", "IT Helpdesk"];
const STAT_AVATARS = ["GN", "RA", "SL"] as const;
const AVATAR_COLORS = ["bg-indigo-500", "bg-rose-400", "bg-teal-500"] as const;

/* ── Page shell ─────────────────────────────────────────────────────────── */

interface AuthShellProps {
  logoIcon: ReactNode;
  hero: ReactNode;
  children: ReactNode;
  footerLinks?: string[];
}

/**
 * Full-height auth layout: brand header, two-column body (hero + form card)
 * and a footer. Shared by every page under `app/auth/*`.
 */
export function AuthShell({
  logoIcon,
  hero,
  children,
  footerLinks = DEFAULT_FOOTER_LINKS,
}: AuthShellProps) {
  return (
    <div
      style={{ fontFamily: plusJakartaSans.style.fontFamily }}
      className="min-h-screen flex flex-col justify-between bg-[#f7f9fd] text-slate-800 antialiased"
    >
      <AuthHeader logoIcon={logoIcon} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <section className="lg:col-span-6 flex flex-col justify-center gap-6">
            {hero}
          </section>
          <SlideIn
            direction="right"
            delay={0.15}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/60 p-7 sm:p-8">
              {children}
            </div>
          </SlideIn>
        </div>
      </main>
      <AuthFooter links={footerLinks} />
    </div>
  );
}

function AuthHeader({ logoIcon }: { logoIcon: ReactNode }) {
  return (
    <motion.header
      className="w-full px-6 lg:px-12 py-5 flex items-center justify-between"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200"
          whileHover={{ scale: 1.08, rotate: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          {logoIcon}
        </motion.div>
        <span className="text-sm font-extrabold tracking-tight text-slate-900 leading-none">
          SiManis
        </span>
      </div>
    </motion.header>
  );
}

function AuthFooter({ links }: { links: string[] }) {
  return (
    <motion.footer
      className="w-full px-6 lg:px-12 py-5 border-t border-slate-200/70 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div>
        © 2026 SMK Mataram. All Rights Reserved. Education Management Platform.
      </div>
      <div className="flex items-center gap-4 text-xs font-medium">
        {links.map((link) => (
          <a key={link} href="#" className="hover:text-slate-800 transition">
            {link}
          </a>
        ))}
      </div>
    </motion.footer>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */

export interface AuthHeroFeature {
  icon: ReactNode;
  title: string;
  description: string;
  footer?: string;
}

interface AuthHeroProps {
  badge: string;
  title: ReactNode;
  description: string;
  features: AuthHeroFeature[];
  stat: {
    title: string;
    subtitle: string;
    chip: string;
    extra: string;
  };
}

export function AuthHero({ badge, title, description, features, stat }: AuthHeroProps) {
  return (
    <>
      <FadeIn delay={0.05}>
        <span className="inline-flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
          <ShieldCheckIcon className="size-3.5" />
          {badge}
        </span>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
            {description}
          </p>
        </div>
      </FadeIn>

      <StaggerChildren staggerDelay={0.1} delayChildren={0.15} className="space-y-3.5 pt-1">
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <AuthFeatureCard {...feature} />
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeIn delay={0.4}>
        <AuthStatBanner {...stat} />
      </FadeIn>
    </>
  );
}

function AuthFeatureCard({ icon, title, description, footer }: AuthHeroFeature) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur border border-slate-200/80 rounded-2xl p-4 flex items-start gap-4 transition hover:border-indigo-200 hover:shadow-sm"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900 leading-snug">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
        {footer ? (
          <p className="mt-2 text-[10px] font-semibold tracking-wide text-indigo-500/90 uppercase">
            {footer}
          </p>
        ) : null}
      </div>
    </motion.div>
  );
}

interface AuthStatBannerProps {
  title: string;
  subtitle: string;
  chip: string;
  extra: string;
}

function AuthStatBanner({ title, subtitle, chip, extra }: AuthStatBannerProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3 px-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex -space-x-2 overflow-hidden shrink-0">
          {STAT_AVATARS.map((initials, i) => (
            <motion.span
              key={initials}
              className={`inline-flex h-7 w-7 rounded-full ring-2 ring-white items-center justify-center text-[9px] font-bold text-white ${AVATAR_COLORS[i]}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {initials}
            </motion.span>
          ))}
          <motion.span
            className="inline-flex h-7 w-7 rounded-full ring-2 ring-white bg-indigo-700 text-white text-[10px] font-bold items-center justify-center"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.66, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {extra}
          </motion.span>
        </div>
        <div className="text-xs min-w-0">
          <span className="font-bold text-slate-800">{title}</span>
          <span className="block text-slate-500 text-[11px] truncate">{subtitle}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>{chip}</span>
      </div>
    </div>
  );
}
