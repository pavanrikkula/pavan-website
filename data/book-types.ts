/**
 * The library's categories, in the order they should always appear
 * (shelf order, filter order, etc). This is the one place that list
 * lives — add a category here and it propagates everywhere.
 */
export const CATEGORIES = [
  "Mathematics",
  "Physics & Science",
  "Finance & Economics",
  "History & Politics",
  "Philosophy & Religion",
  "Computer Science",
  "Fiction",
  "Psychology",
  "Poetry",
  "Biography & Memoir",
  "Reference",
  "Other",
] as const;

export type BookCategory = (typeof CATEGORIES)[number];

export type BookStatus = "read" | "unread" | "reading";

export type Book = {
  /** Unique, lowercase, hyphenated. Used as the React key and in the
   *  book's shareable/wander URL (?book=slug). */
  slug: string;
  title: string;
  /** Omitted for the handful of books catalogued without a clear author. */
  author?: string;
  category: BookCategory;
  status: BookStatus;
  /** ISO date (YYYY-MM-DD), optional — not tracked for most of the shelf yet. */
  dateRead?: string;
  /** Add this if you ever have it and lib/open-library.ts will use it
   *  directly for a cover image — no lookup needed, most reliable. */
  isbn?: string;
  /** Cover image URL. Leave out and either lib/open-library.ts
   *  resolves one automatically at request time, or the shelf renders
   *  a plain spine card if nothing is found. Set this by hand to
   *  override whatever would otherwise be looked up. */
  coverUrl?: string;
  /** Out of 10. Only set this once you've actually rated the book. */
  rating?: number;
  /** Your personal 2-3 sentence take on the book. Read books only —
   *  never auto-filled. Leave unset until you write one. */
  review?: string;
  /** Private cataloguing notes (e.g. "possible duplicate, check spine") —
   *  shown differently from a review, never presented as your opinion
   *  of the book. */
  notes?: string;
};
