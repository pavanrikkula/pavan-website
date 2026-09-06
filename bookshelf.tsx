"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Book } from "@/data/books";
import { formatDate } from "@/lib/format";

function Spine({ book }: { book: Book }) {
  if (book.coverUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external cover URLs, domain unknown until the real book list is added
      <img
        src={book.coverUrl}
        alt={`Cover of ${book.title}`}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between p-3">
      <span className="text-xs leading-snug">{book.title}</span>
      <span className="text-[0.6875rem] leading-snug text-fg-muted">
        {book.author}
      </span>
    </div>
  );
}

export function Bookshelf({ books }: { books: Book[] }) {
  const [selected, setSelected] = useState<Book | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        {books.map((book) => {
          const hasDetail = Boolean(book.note || book.dateRead);
          const isSelected = selected?.slug === book.slug;

          return (
            <button
              key={book.slug}
              type="button"
              onClick={() =>
                hasDetail && setSelected(isSelected ? null : book)
              }
              className="group text-left"
              aria-pressed={isSelected}
            >
              <div
                className={`aspect-[2/3] w-full overflow-hidden border transition-transform duration-300 ease-out group-hover:-translate-y-1.5 ${
                  isSelected ? "border-fg" : "border-hairline"
                }`}
              >
                <Spine book={book} />
              </div>
              <p className="mt-2.5 text-xs leading-snug sm:text-sm">
                {book.title}
              </p>
              <p className="text-[0.6875rem] leading-snug text-fg-muted">
                {book.author}
              </p>
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
              <span className="text-fg-muted"> — {selected.author}</span>
            </p>
            {selected.dateRead && (
              <p className="mt-1 text-xs text-fg-muted">
                Read {formatDate(selected.dateRead)}
              </p>
            )}
            {selected.note && (
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {selected.note}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
