"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { Book, BookCategory } from "@/data/book-types";
import { CATEGORIES } from "@/data/book-types";
import { formatDate } from "@/lib/format";
import { useSound } from "./sound-provider";
import { useLazyCover } from "@/lib/use-lazy-cover";

type CategoryFilter = "All" | BookCategory;
type StatusFilter = "all" | "read" | "unread";

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`bracket-link text-xs sm:text-sm ${active ? "text-fg" : "text-fg-muted"}`}
    >
      {children}
    </button>
  );
}

function Spine({ book }: { book: Book }) {
  const [imgOk, setImgOk] = useState(true);
  const { ref, coverUrl } = useLazyCover(book.slug, book.title, book.author, !book.coverUrl);
  const resolvedCoverUrl = book.coverUrl ?? coverUrl;

  if (resolvedCoverUrl && imgOk) {
    return (
      <div ref={ref} className="h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- cover source domain varies per book */}
        <img
          src={resolvedCoverUrl}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setImgOk(false)}
          onLoad={(e) => {
            // Open Library sometimes returns a tiny placeholder image
            // instead of a real 404 for "no cover on file" — catch that
            // too, not just hard load failures.
            const img = e.currentTarget;
            if (img.naturalWidth <= 2 || img.naturalHeight <= 2) setImgOk(false);
          }}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-between p-3">
      <span className="text-xs leading-snug">{book.title}</span>
      <span className="text-[0.6875rem] leading-snug text-fg-muted">
        {book.author ?? "\u00A0"}
      </span>
    </div>
  );
}

export function ReadingShelf({ books }: { books: Book[] }) {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("book");
  // A deep link from [wander] or a shared URL: resolved synchronously
  // (useSearchParams is already available at render time here, thanks
  // to the Suspense boundary in the page), so the initial filters and
  // selection can come straight from it — no effect needed for that.
  const initialBook = initialSlug ? books.find((b) => b.slug === initialSlug) ?? null : null;

  const [category, setCategory] = useState<CategoryFilter>(initialBook?.category ?? "All");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [selected, setSelected] = useState<Book | null>(initialBook);
  const { play } = useSound();
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // The one thing that does need an effect: scrolling the deep-linked
  // card into view once it's actually in the DOM.
  useEffect(() => {
    if (!initialBook) return;
    const el = cardRefs.current.get(initialBook.slug);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    // Only for the initial deep link, once, on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of books) map.set(b.category, (map.get(b.category) ?? 0) + 1);
    return map;
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (category !== "All" && b.category !== category) return false;
      if (status === "read" && b.status !== "read") return false;
      if (status === "unread" && b.status === "read") return false;
      return true;
    });
  }, [books, category, status]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-xs sm:text-sm">
        <FilterButton active={category === "All"} onClick={() => setCategory("All")}>
          all ({books.length})
        </FilterButton>
        {CATEGORIES.map((c) => (
          <FilterButton key={c} active={category === c} onClick={() => setCategory(c)}>
            {c.toLowerCase()} ({counts.get(c) ?? 0})
          </FilterButton>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-hairline pt-3 text-xs sm:text-sm">
        <span className="mr-1 text-fg-muted" aria-hidden="true">
          status:
        </span>
        <FilterButton active={status === "all"} onClick={() => setStatus("all")}>
          all
        </FilterButton>
        <FilterButton active={status === "read"} onClick={() => setStatus("read")}>
          read
        </FilterButton>
        <FilterButton active={status === "unread"} onClick={() => setStatus("unread")}>
          unread
        </FilterButton>
      </div>

      <p className="mt-4 text-xs text-fg-muted" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "book" : "books"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((book, i) => {
          const hasDetail = Boolean(book.review || book.notes || book.dateRead || book.rating);
          const isSelected = selected?.slug === book.slug;
          // A deterministic (not random-on-every-render) "one book
          // slightly out of alignment" touch — same books every load,
          // no hydration mismatch.
          const isAskew = i % 13 === 6;

          return (
            <button
              key={book.slug}
              ref={(el) => {
                if (el) cardRefs.current.set(book.slug, el);
                else cardRefs.current.delete(book.slug);
              }}
              type="button"
              onClick={() => {
                play("click");
                setSelected(isSelected ? null : book);
              }}
              className={`group text-left ${isAskew ? "rotate-[-1.5deg]" : ""}`}
              aria-pressed={isSelected}
            >
              <div
                className={`aspect-[2/3] w-full overflow-hidden border transition-transform duration-300 ease-out group-hover:-translate-y-1.5 ${
                  isSelected ? "border-fg" : "border-hairline"
                }`}
              >
                <Spine book={book} />
              </div>
              <p className="mt-2.5 text-xs leading-snug sm:text-sm">{book.title}</p>
              <p className="text-[0.6875rem] leading-snug text-fg-muted">
                {book.author ?? "\u00A0"}
                {book.status === "reading" && (
                  <span className="text-accent"> · reading</span>
                )}
              </p>
              {!hasDetail && (
                <p className="text-[0.6875rem] leading-snug text-fg-muted">
                  {book.status === "unread" ? "unread" : book.status === "read" ? "read" : ""}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-md border-t border-hairline pt-6"
          >
            <p className="text-sm">
              {selected.title}
              {selected.author && <span className="text-fg-muted"> — {selected.author}</span>}
            </p>
            <p className="mt-1 text-xs text-fg-muted">
              {selected.category}
              {" · "}
              {selected.status === "reading" ? "currently reading" : selected.status}
              {selected.rating != null && ` · ${selected.rating}/10`}
            </p>
            {selected.dateRead && (
              <p className="mt-1 text-xs text-fg-muted">Read {formatDate(selected.dateRead)}</p>
            )}
            {selected.review && (
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{selected.review}</p>
            )}
            {selected.notes && (
              <p className="mt-3 text-xs leading-relaxed text-fg-muted italic">
                cataloguing note: {selected.notes}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
