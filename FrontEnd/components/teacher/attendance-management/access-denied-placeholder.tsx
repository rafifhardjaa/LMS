"use client";

import {
  useState,
  useSyncExternalStore,
  type ComponentType,
  type MouseEvent,
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  GraduationCap,
  Info,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
} from "@/components/ui/animations";

type IconComponent = ComponentType<{ className?: string }>;

type Corner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

type FloatingIcon = {
  Icon: IconComponent;
  className: string;
  duration: number;
  delay: number;
  rotate: number;
};

type CornerBracket = {
  key: Corner;
  className: string;
  delay: number;
};

const ADMIN_EMAIL = "admin@simanis.com";

const noopSubscribe = () => () => {};

const FLOATING_ICONS: FloatingIcon[] = [
  { Icon: ClipboardCheck, className: "left-[7%] top-[13%] text-[#b71422]/15", duration: 6, delay: 0, rotate: -8 },
  { Icon: GraduationCap, className: "right-[8%] top-[15%] text-[#006398]/15", duration: 7, delay: 0.6, rotate: 8 },
  { Icon: CalendarDays, className: "left-[12%] bottom-[16%] text-[#006398]/15", duration: 5.5, delay: 1.2, rotate: 6 },
  { Icon: KeyRound, className: "right-[12%] bottom-[13%] text-[#7A941F]/20", duration: 6.5, delay: 0.3, rotate: -6 },
  { Icon: ShieldCheck, className: "left-[24%] top-[7%] text-[#b71422]/15", duration: 8, delay: 0.9, rotate: 10 },
  { Icon: FileCheck2, className: "right-[26%] top-[9%] text-[#D97706]/20", duration: 7.5, delay: 1.5, rotate: -10 },
  { Icon: ClipboardCheck, className: "left-[44%] bottom-[5%] text-[#006398]/15", duration: 6.8, delay: 0.4, rotate: 8 },
  { Icon: LockKeyhole, className: "right-[42%] top-[4%] text-[#b71422]/15", duration: 5.8, delay: 1.8, rotate: -8 },
];

const SPARKS: { className: string; duration: number; delay: number }[] = [
  { className: "left-[8%] top-[28%] size-1.5", duration: 3.2, delay: 0 },
  { className: "left-[16%] top-[58%] size-1", duration: 3.8, delay: 0.7 },
  { className: "left-[28%] top-[14%] size-1.5", duration: 4.1, delay: 1.3 },
  { className: "left-[38%] top-[78%] size-1", duration: 3.5, delay: 0.4 },
  { className: "left-[52%] top-[10%] size-1.5", duration: 4.4, delay: 1.9 },
  { className: "left-[62%] top-[84%] size-1", duration: 3.6, delay: 1.1 },
  { className: "left-[74%] top-[22%] size-1.5", duration: 4, delay: 0.2 },
  { className: "left-[84%] top-[52%] size-1", duration: 3.4, delay: 1.6 },
  { className: "left-[92%] top-[76%] size-1.5", duration: 4.2, delay: 0.9 },
  { className: "left-[4%] top-[72%] size-1", duration: 3.7, delay: 1.4 },
  { className: "left-[46%] top-[26%] size-1", duration: 3.9, delay: 0.5 },
  { className: "left-[68%] top-[42%] size-1.5", duration: 4.3, delay: 2.1 },
];

const CORNER_BRACKETS: CornerBracket[] = [
  { key: "topLeft", className: "-left-1 -top-1 origin-top-left rounded-tl-2xl border-l-2 border-t-2 border-[#b71422]", delay: 0 },
  { key: "topRight", className: "-right-1 -top-1 origin-top-right rounded-tr-2xl border-r-2 border-t-2 border-[#006398]", delay: 0.03 },
  { key: "bottomLeft", className: "-left-1 -bottom-1 origin-bottom-left rounded-bl-2xl border-b-2 border-l-2 border-[#006398]", delay: 0.06 },
  { key: "bottomRight", className: "-right-1 -bottom-1 origin-bottom-right rounded-br-2xl border-b-2 border-r-2 border-[#b71422]", delay: 0.09 },
];

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

type AccessDeniedPlaceholderProps = {
  userName?: string | null;
  userIdentifier?: string | null;
};

export function AccessDeniedPlaceholder({
  userName,
  userIdentifier,
}: AccessDeniedPlaceholderProps) {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const loop = (
    duration: number,
    delay = 0,
    ease: "easeInOut" | "linear" = "easeInOut",
  ) => ({
    duration,
    delay,
    repeat: reduceMotion ? 0 : Infinity,
    ease,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.4 });
  const springY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.4 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const parallaxX = useTransform(springX, [-0.5, 0.5], [18, -18]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [14, -14]);

  const glowX = useTransform(springX, [-0.5, 0.5], ["22%", "78%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["22%", "78%"]);
  const glowBackground = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(183,20,34,0.14), transparent 55%)`;

  const [activeCorner, setActiveCorner] = useState<Corner | null>(null);
  const [hovered, setHovered] = useState(false);

  const bracketVariants: Variants = {
    rest: { scale: 0.55, opacity: 0 },
    active: { scale: 1, opacity: 0.9 },
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = (event.clientX - rect.left) / rect.width - 0.5;
    const nextY = (event.clientY - rect.top) / rect.height - 0.5;

    if (!reduceMotion) {
      mouseX.set(nextX);
      mouseY.set(nextY);
    }

    const corner: Corner =
      nextY < 0
        ? nextX < 0
          ? "topLeft"
          : "topRight"
        : nextX < 0
          ? "bottomLeft"
          : "bottomRight";
    setActiveCorner((current) => (current === corner ? current : corner));
    setHovered(true);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setActiveCorner(null);
    setHovered(false);
  };

  return (
    <section
      aria-labelledby="akses-denied-title"
      className="relative -mx-6 -mt-12 -mb-6 flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFE4E9] via-[#EAF4FF] to-[#E7F8F0] px-4 py-10 text-[#1E293B] sm:px-6"
    >
      {mounted ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(183,20,34,0.08) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
            initial={{ backgroundPosition: "0px 0px" }}
            animate={{ backgroundPosition: ["0px 0px", "18px 18px"] }}
            transition={loop(20, 0, "linear")}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 sm:size-[760px]"
          >
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-[#b71422]/15"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={loop(60, 0, "linear")}
            />
            <motion.div
              className="absolute inset-12 rounded-full border border-dashed border-[#006398]/15"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={loop(45, 0, "linear")}
            />
            <motion.div
              className="absolute inset-24 rounded-full border border-dashed border-[#7A941F]/15"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ scale: [null, 1.05, 1], opacity: [null, 1, 0.4] }}
              transition={loop(6)}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(183,20,34,0.08), transparent 72deg)",
              }}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={loop(14, 0, "linear")}
            />
            <motion.div
              className="absolute inset-0"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={loop(60, 0, "linear")}
            >
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-[#b71422]/30" />
            </motion.div>
            <motion.div
              className="absolute inset-12"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={loop(45, 0, "linear")}
            >
              <span className="absolute bottom-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#006398]/30" />
            </motion.div>
          </div>

          {FLOATING_ICONS.map(({ Icon, className, duration, delay, rotate }, index) => (
            <motion.span
              key={`${index}-${className}`}
              aria-hidden
              className={`pointer-events-none absolute ${className}`}
              initial={{ x: 0, y: 0, rotate: 0 }}
              animate={{ y: [null, -12, 0], x: [null, 6, 0], rotate: [null, rotate, 0] }}
              transition={loop(duration, delay)}
            >
              <Icon className="size-7" />
            </motion.span>
          ))}

          {SPARKS.map((spark, index) => (
            <motion.span
              key={`${index}-${spark.className}`}
              aria-hidden
              className={`pointer-events-none absolute rounded-full bg-white ring-1 ring-[#b71422]/25 ${spark.className}`}
              initial={{ opacity: 0.15, scale: 0.8 }}
              animate={{ opacity: [null, 0.7, 0.15], scale: [null, 1.2, 0.8] }}
              transition={loop(spark.duration, spark.delay)}
            />
          ))}

          <motion.div
            aria-hidden
            initial={{ x: 0, y: 0 }}
            animate={{ y: [null, -16, 0], x: [null, 10, 0] }}
            transition={loop(7)}
            className="pointer-events-none absolute -left-20 top-10 size-72 rounded-full bg-[#b71422]/14 blur-3xl"
          />
          <motion.div
            aria-hidden
            initial={{ x: 0, y: 0 }}
            animate={{ y: [null, 18, 0], x: [null, -12, 0] }}
            transition={loop(8, 1)}
            className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-[#006398]/14 blur-3xl"
          />
          <motion.div
            aria-hidden
            initial={{ x: 0, y: 0 }}
            animate={{ y: [null, -12, 0] }}
            transition={loop(6, 0.5)}
            className="pointer-events-none absolute left-1/3 top-16 size-40 rounded-full bg-[#7A941F]/14 blur-3xl"
          />
          <motion.div
            aria-hidden
            initial={{ x: 0, y: 0 }}
            animate={{ y: [null, 14, 0], x: [null, -8, 0] }}
            transition={loop(9, 1.6)}
            className="pointer-events-none absolute right-[12%] top-[8%] size-56 rounded-full bg-[#D97706]/14 blur-3xl"
          />
        </>
      ) : null}

      <FadeIn className="relative z-10 w-full max-w-3xl">
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }}
            animate={{
              boxShadow: hovered
                ? "0 28px 70px -18px rgba(183,20,34,0.38)"
                : "0 18px 50px -20px rgba(183,20,34,0.25)",
            }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 24 }}
            className="relative grid gap-6 rounded-3xl border border-[#E2E8F0] bg-white/95 p-6 backdrop-blur md:grid-cols-[220px_1fr] md:p-8"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ background: glowBackground }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
            />

            {CORNER_BRACKETS.map(({ key, className, delay }) => (
              <motion.span
                key={key}
                aria-hidden
                initial="rest"
                animate={activeCorner === key ? "active" : "rest"}
                variants={bracketVariants}
                transition={reduceMotion ? { duration: 0, delay } : { type: "spring", stiffness: 340, damping: 22, delay }}
                className={`pointer-events-none absolute size-9 ${className}`}
              />
            ))}

            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              className="relative flex min-h-44 items-center justify-center"
            >
              <motion.span
                aria-hidden
                className="absolute size-36 rounded-full bg-[#b71422]/20 blur-lg"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: [null, 1.18, 1], opacity: [null, 0, 0.5] }}
                transition={loop(2.8)}
              />
              <span className="absolute size-36 rounded-full border border-[#F3C4C4] bg-[#FFEBEB]/40" />
              <span className="absolute size-28 rounded-full border border-[#F3C4C4] bg-[#FFEBEB]/60" />
              <span className="relative flex size-24 items-center justify-center rounded-3xl border border-[#F3C4C4] bg-[#FFEBEB] text-[#b71422] shadow-[0_10px_24px_-12px_rgba(183,20,34,0.6)]">
                <ShieldAlert className="size-12" />
              </span>
              <motion.span
                aria-hidden
                initial={{ y: 0 }}
                animate={{ y: [null, -8, 0] }}
                transition={loop(3.2)}
                className="absolute -left-2 top-6 flex size-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#006398] shadow-md"
              >
                <ClipboardCheck className="size-5" />
              </motion.span>
              <motion.span
                aria-hidden
                initial={{ y: 0 }}
                animate={{ y: [null, 8, 0] }}
                transition={loop(3.6, 0.4)}
                className="absolute -right-2 top-10 flex size-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#b71422] shadow-md"
              >
                <LockKeyhole className="size-5" />
              </motion.span>
              <motion.span
                aria-hidden
                initial={{ y: 0 }}
                animate={{ y: [null, -6, 0] }}
                transition={loop(3, 0.8)}
                className="absolute bottom-2 left-6 flex size-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-white text-[#D97706] shadow-md"
              >
                <Clock3 className="size-5" />
              </motion.span>
            </motion.div>

            <StaggerChildren className="flex flex-col gap-4">
              <StaggerItem>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF3C7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[#D97706]">
                  <LockKeyhole className="size-3.5" />
                  Akses Terbatas
                </span>
              </StaggerItem>

              <StaggerItem>
                <h1
                  id="akses-denied-title"
                  className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-[#1E293B]"
                >
                  Hanya wali kelas yang dapat membuka presensi
                </h1>
              </StaggerItem>

              <StaggerItem>
                <p className="max-w-xl text-[13px] leading-6 text-[#475569]">
                  Hanya wali kelas yang dapat membuka sesi presensi. Jika menurut
                  Anda ini kesalahan, silakan hubungi admin.
                </p>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[11px] font-semibold text-[#475569]">
                    <GraduationCap className="size-4 text-[#006398]" />
                    Wali kelas hanya untuk satu kelas
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[11px] font-semibold text-[#475569]">
                    <Info className="size-4 text-[#D97706]" />
                    Akses dapat diajukan ke admin
                  </span>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFEBEB] text-[12px] font-bold text-[#b71422]">
                    {initials(userName ?? "")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-[#94A3B8]">
                      Anda masuk sebagai
                    </p>
                    <p className="truncate text-[12px] font-bold text-[#1E293B]">
                      {userName ?? "-"}
                    </p>
                  </div>
                  {userIdentifier ? (
                    <span className="ml-auto rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#475569]">
                      Nomor Induk: {userIdentifier}
                    </span>
                  ) : null}
                </div>
              </StaggerItem>

              <StaggerItem>
                <a
                  href={`mailto:${ADMIN_EMAIL}?subject=Permintaan%20akses%20presensi`}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#b71422] px-5 text-xs font-semibold text-white shadow-[0_10px_24px_-12px_rgba(183,20,34,0.8)] transition hover:bg-[#8f0f1a]"
                >
                  <Mail className="size-4" />
                  Hubungi Admin
                </a>
              </StaggerItem>
            </StaggerChildren>
          </motion.div>
        </div>
      </FadeIn>
    </section>
  );
}
