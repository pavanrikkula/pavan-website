"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScrambleText } from "./scramble-text";
import { useSound } from "./sound-provider";

type WanderTarget =
  | { type: "book"; slug: string }
  | { type: "external"; href: string };

/**
 * Client-side random discovery, no backend involved: picks from the
 * site's own book slugs and recent Substack links (passed down from
 * the server component that already fetched them for the homepage
 * teaser) and either routes to that book on /reading or opens the
 * Substack post in a new tab.
 */
export function WanderButton({
  bookSlugs,
  externalLinks,
}: {
  bookSlugs: string[];
  externalLinks: string[];
}) {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  const { play } = useSound();

  function handleWander() {
    play("click");
    const pool: WanderTarget[] = [
      ...bookSlugs.map((slug) => ({ type: "book" as const, slug })),
      ...externalLinks.map((href) => ({ type: "external" as const, href })),
    ];
    if (pool.length === 0) return;

    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick.type === "book") {
      router.push(`/reading?book=${pick.slug}`);
    } else {
      window.open(pick.href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={handleWander}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="bracket-link text-sm text-fg-muted"
    >
      <ScrambleText text="wander" active={hovering} />
    </button>
  );
}
