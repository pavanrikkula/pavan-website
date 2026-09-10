"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useSound } from "./sound-provider";

/**
 * Not a copy of Code.Storage's visual design (that's a text/ASCII-
 * table terminal aesthetic) — a nod to the underlying feeling: a tiny
 * distributed system quietly doing something underneath the page. A
 * handful of nodes, a small fixed rotation of which connections
 * between them are "active" (like replicas reconfiguring), and a
 * pulse traveling along each active connection. Lives in the footer,
 * present on every page, easy to miss and easy to find.
 */

const NODES = [
  { x: 10, y: 22 },
  { x: 38, y: 8 },
  { x: 66, y: 20 },
  { x: 56, y: 46 },
  { x: 20, y: 44 },
] as const;

// A fixed sequence of small subgraphs rather than random rewiring —
// "occasional reconfiguration," not constant flicker.
const EDGE_SETS: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [
    [0, 1],
    [1, 2],
    [3, 4],
  ],
  [
    [0, 4],
    [1, 3],
    [2, 3],
  ],
  [
    [0, 1],
    [2, 3],
    [4, 0],
  ],
  [
    [1, 2],
    [3, 4],
    [4, 0],
  ],
];

const STEP_MS = 4200;

export function MachineDiagram() {
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const { play } = useSound();

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % EDGE_SETS.length);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const edges = EDGE_SETS[step];

  function reveal(i: number) {
    setHovered(i);
    play("reveal");
  }

  return (
    <svg
      viewBox="0 0 76 56"
      width="76"
      height="56"
      className="text-fg-muted"
      role="img"
      aria-label="A small animated diagram of a few connected nodes — a quiet nod to the machinery running underneath"
    >
      {edges.map(([a, b]) => {
        const from = NODES[a];
        const to = NODES[b];
        return (
          <g key={`${step}-${a}-${b}`}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="currentColor"
              strokeOpacity={0.28}
              strokeWidth={0.6}
            />
            {!reducedMotion && (
              <circle r={1.1} fill="var(--color-accent)" fillOpacity={0.85}>
                <animateMotion
                  dur="2.6s"
                  repeatCount="indefinite"
                  path={`M${from.x},${from.y} L${to.x},${to.y}`}
                />
              </circle>
            )}
          </g>
        );
      })}

      {NODES.map((n, i) => (
        <rect
          key={i}
          x={n.x - 2.2}
          y={n.y - 2.2}
          width={4.4}
          height={4.4}
          fill={hovered === i ? "var(--color-accent)" : "none"}
          stroke="currentColor"
          strokeWidth={hovered === i ? 0 : 0.7}
          tabIndex={0}
          role="button"
          aria-label={`node ${i + 1}`}
          className="cursor-help outline-none"
          onMouseEnter={() => reveal(i)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => reveal(i)}
          onBlur={() => setHovered(null)}
        />
      ))}
    </svg>
  );
}
