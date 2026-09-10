import { NextResponse } from "next/server";
import { lookupCoverUrl } from "@/lib/open-library";

/**
 * A thin same-origin proxy in front of Open Library's search API.
 * Exists for one reason: Open Library's search.json endpoint doesn't
 * reliably support cross-origin fetch() from a browser (their own
 * GitHub issues confirm ongoing CORS problems), so the lookup has to
 * happen server-side somewhere. A browser calling our own /api/cover
 * is same-origin — no CORS involved — and this route's own
 * server-to-server request to Open Library isn't subject to CORS
 * either (CORS is a browser-only restriction).
 *
 * Called lazily, one book at a time, only once a book's card scrolls
 * into view on /reading (see lib/use-lazy-cover.ts). Never invoked
 * during the build — Next.js treats a route reading the request URL
 * like this as dynamic by default, so it only ever runs per-request,
 * on demand, exactly where the cost of waiting on Open Library
 * belongs.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title");
  const author = searchParams.get("author") ?? undefined;

  if (!title) {
    return NextResponse.json({ coverUrl: null }, { status: 400 });
  }

  const coverUrl = await lookupCoverUrl(title, author);

  return NextResponse.json(
    { coverUrl },
    {
      headers: {
        // Cache an identical title+author lookup on Vercel's edge for
        // 30 days — across every visitor, not just whichever browser
        // asked first — so repeat traffic barely touches Open Library
        // at all.
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
      },
    },
  );
}
