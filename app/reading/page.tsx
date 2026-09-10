import type { Metadata } from "next";
import { Suspense } from "react";
import { books } from "@/data/books";
import { isbnCoverUrl } from "@/lib/open-library";
import { ReadingShelf } from "@/components/reading-shelf";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Reading — Pavan Rikkula",
};

// isbnCoverUrl is pure string formatting (no network call), so it's
// safe to apply here at zero cost — every other cover is resolved
// lazily in the browser instead (see components/reading-shelf.tsx and
// lib/use-lazy-cover.ts), never during this page's own static
// generation.
const displayBooks = books.map((book) =>
  book.coverUrl || !book.isbn ? book : { ...book, coverUrl: isbnCoverUrl(book.isbn) },
);

export default function ReadingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 sm:px-8 sm:py-24">
      <Reveal>
        <h1 className="font-pixel text-lg leading-relaxed sm:text-xl">
          READING
        </h1>
        <p className="mt-4 max-w-md text-sm text-fg-muted">
          A personal shelf, not a database — books, and eventually a small
          canon of articles and papers alongside them.
        </p>
      </Reveal>

      <div className="mt-10">
        <Reveal>
          <Suspense fallback={null}>
            <ReadingShelf books={displayBooks} />
          </Suspense>
        </Reveal>
      </div>
    </div>
  );
}
