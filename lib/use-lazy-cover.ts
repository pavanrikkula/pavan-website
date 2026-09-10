"use client";

import { useEffect, useRef, useState } from "react";

const CACHE_PREFIX = "pavanrikkula:cover:";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

type CacheEntry = { url: string | null; ts: number };

function readCache(slug: string): string | null | undefined {
  try {
    const raw = window.localStorage.getItem(CACHE_PREFIX + slug);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as CacheEntry;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return undefined;
    return parsed.url;
  } catch {
    return undefined;
  }
}

function writeCache(slug: string, url: string | null) {
  try {
    const entry: CacheEntry = { url, ts: Date.now() };
    window.localStorage.setItem(CACHE_PREFIX + slug, JSON.stringify(entry));
  } catch {
    // Storage disabled, private mode, or full — fine, it just gets
    // looked up again next time rather than staying cached.
  }
}

/**
 * Resolves a book's cover lazily — only once the element `ref` is
 * attached to actually scrolls into view — via our own same-origin
 * /api/cover route (see app/api/cover/route.ts). Never runs during
 * the page's own render or the site's build. A hit or a confirmed
 * miss is cached in localStorage, so scrolling past the same book
 * again, or a later visit, doesn't re-request it.
 *
 * `enabled` should be false whenever the book already has a coverUrl
 * of its own (manual override or ISBN-derived) — nothing to look up.
 */
export function useLazyCover(
  slug: string,
  title: string,
  author: string | undefined,
  enabled: boolean,
): { ref: React.RefObject<HTMLDivElement | null>; coverUrl: string | null } {
  const ref = useRef<HTMLDivElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const cached = readCache(slug);
        if (cached !== undefined) {
          if (!cancelled) setCoverUrl(cached);
          return;
        }

        const params = new URLSearchParams({ title });
        if (author) params.set("author", author);

        fetch(`/api/cover?${params.toString()}`)
          .then((res) => (res.ok ? res.json() : { coverUrl: null }))
          .then((data: { coverUrl: string | null }) => {
            writeCache(slug, data.coverUrl);
            if (!cancelled) setCoverUrl(data.coverUrl);
          })
          .catch(() => writeCache(slug, null));
      },
      { rootMargin: "300px" }, // start the lookup a little before it's actually visible
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [slug, title, author, enabled]);

  return { ref, coverUrl };
}
