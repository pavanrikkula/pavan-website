import { XMLParser } from "fast-xml-parser";

/**
 * Your Substack's RSS feed. Substack publications expose this
 * automatically at https://<your-subdomain>.substack.com/feed —
 * this is the subdomain behind https://substack.com/@pavanrikkula
 * ("Mandelbrot's Footnotes"). If you ever rename or move the
 * publication, update this one URL.
 */
const FEED_URL = "https://ergodicantilibrary.substack.com/feed";

export type SubstackPost = {
  title: string;
  link: string;
  date: string; // ISO date
  description: string;
};

function unwrapCdata(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "__cdata" in (value as Record<string, unknown>)) {
    return String((value as Record<string, unknown>).__cdata ?? "");
  }
  return String(value);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

/**
 * Fetches recent posts from Substack. Returns an empty array (never
 * throws) if the feed is unreachable, so the page can render a quiet
 * fallback instead of breaking.
 */
export async function getSubstackPosts(limit?: number): Promise<SubstackPost[]> {
  try {
    const res = await fetch(FEED_URL, {
      // Revalidate hourly rather than refetching on every request.
      next: { revalidate: 3600 },
      headers: { "User-Agent": "pavanrikkula.com" },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      cdataPropName: "__cdata",
    });
    const data = parser.parse(xml);

    const rawItems = data?.rss?.channel?.item;
    const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

    const posts: SubstackPost[] = items.map((item: Record<string, unknown>) => {
      const title = unwrapCdata(item.title);
      const link = unwrapCdata(item.link);
      const pubDate = unwrapCdata(item.pubDate);
      const rawDescription = unwrapCdata(item.description);

      return {
        title,
        link,
        date: pubDate ? new Date(pubDate).toISOString() : "",
        description: truncate(stripHtml(rawDescription), 140),
      };
    });

    return typeof limit === "number" ? posts.slice(0, limit) : posts;
  } catch {
    return [];
  }
}
