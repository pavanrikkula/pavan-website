"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { ScrambleText } from "./scramble-text";
import { useSound } from "./sound-provider";

/**
 * Six points, six subjects from the actual shelf, each orbiting at
 * its own natural frequency but coupled to the others — the Kuramoto
 * model of synchronization. Watch long enough and they drift in and
 * out of phase with each other: not a random particle swarm, an
 * actual (if toy) dynamical system, which felt like the right kind of
 * quiet ambient animation for a site that shares a name with
 * "ergodic."
 */
const SUBJECTS = [
  { label: "Mathematics", radius: 24, omega: 0.5 },
  { label: "Physics & Science", radius: 34, omega: 0.38 },
  { label: "Finance & Economics", radius: 44, omega: 0.63 },
  { label: "History & Politics", radius: 30, omega: 0.29 },
  { label: "Computer Science", radius: 39, omega: 0.55 },
  { label: "Fiction", radius: 49, omega: 0.42 },
] as const;

const N = SUBJECTS.length;
const COUPLING = 0.9;
const CENTER = 52;
const VIEW = 104;

export function DynamicalSystem() {
  const reducedMotion = usePrefersReducedMotion();
  const [phases, setPhases] = useState<number[]>(() =>
    SUBJECTS.map((_, i) => (i / N) * Math.PI * 2),
  );
  const [hovered, setHovered] = useState<number | null>(null);
  const { play } = useSound();

  useEffect(() => {
    if (reducedMotion) return;

    let last = performance.now();
    let skip = 0;
    let frameId: number;

    function tick(now: number) {
      frameId = requestAnimationFrame(tick);
      // Throttle state updates to ~30fps — plenty smooth for motion
      // this slow, half the re-renders of a full 60fps loop.
      skip += 1;
      if (skip % 2 !== 0) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Functional update reads the latest phases straight from
      // React's queue, so no ref is needed to bridge the RAF loop
      // and render state.
      setPhases((current) =>
        current.map((theta, i) => {
          let coupling = 0;
          for (let j = 0; j < N; j++) coupling += Math.sin(current[j] - theta);
          const dtheta = SUBJECTS[i].omega + (COUPLING / N) * coupling;
          return theta + dtheta * dt;
        }),
      );
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion]);

  const hoveredLabel = hovered !== null ? SUBJECTS[hovered].label : null;

  return (
    <div className="inline-block">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        width={VIEW}
        height={VIEW}
        className="text-fg-muted"
        role="img"
        aria-label="A small diagram of six orbiting points, each a subject I read about"
      >
        {SUBJECTS.map((s) => (
          <circle
            key={`ring-${s.label}`}
            cx={CENTER}
            cy={CENTER}
            r={s.radius}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.14}
          />
        ))}
        {SUBJECTS.map((s, i) => {
          const x = CENTER + s.radius * Math.cos(phases[i]);
          const y = CENTER + s.radius * Math.sin(phases[i]) * 0.85;
          const isHovered = hovered === i;

          return (
            <circle
              key={s.label}
              cx={x}
              cy={y}
              r={isHovered ? 3.4 : 2.3}
              fill={isHovered ? "var(--color-accent)" : "currentColor"}
              tabIndex={0}
              role="button"
              aria-label={s.label}
              className="cursor-help outline-none"
              onMouseEnter={() => {
                setHovered(i);
                play("reveal");
              }}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => {
                setHovered(i);
                play("reveal");
              }}
              onBlur={() => setHovered(null)}
            />
          );
        })}
      </svg>

      <div className="mt-1 h-4 font-mono text-xs text-fg-muted">
        <AnimatePresence>
          {hoveredLabel && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ScrambleText text={hoveredLabel} active />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
