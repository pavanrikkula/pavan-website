/**
 * Open Library cover lookups. Used only by app/api/cover/route.ts,
 * called lazily from the browser one book at a time (see
 * lib/use-lazy-cover.ts and components/reading-shelf.tsx) — never
 * during the Next.js build or /reading's own static generation.
 *
 * That split is deliberate: doing all 398 lookups during static
 * generation is what blew past Vercel's 60-second page-generation
 * limit. A single lookup, requested on demand once a book actually
 * scrolls into view, is cheap and fine to wait a moment for; the page
 * itself never depends on Open Library being reachable at all.
 */

const LOOKUP_TIMEOUT_MS = 5000;

/** A direct cover URL — no lookup needed at all. Pure string
 *  formatting, safe to call anywhere including at build time. */
export function isbnCoverUrl(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

export async function lookupCoverUrl(title: string, author?: string): Promise<string | null> {
  const params = new URLSearchParams({ title, fields: "cover_i", limit: "5" });
  if (author) params.set("author", author);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LOOKUP_TIMEOUT_MS);

  try {
    const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "pavanrikkula-personal-site/1.0 (cover lookup; contact via site)",
      },
    });
    if (!res.ok) return null;

    const data = (await res.json()) as { docs?: Array<{ cover_i?: number }> };
    const hit = data.docs?.find((doc) => typeof doc.cover_i === "number");
    return hit?.cover_i ? `https://covers.openlibrary.org/b/id/${hit.cover_i}-M.jpg` : null;
  } catch {
    // Network error, timeout, blocked host, malformed response — any
    // of these just mean "no cover this time," never a broken request.
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
