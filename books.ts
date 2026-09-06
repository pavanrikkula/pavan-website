export type Book = {
  slug: string;
  title: string;
  author: string;
  /** ISO date (YYYY-MM-DD). Optional — omit if you don't track this. */
  dateRead?: string;
  /**
   * A cover image URL. If omitted, the shelf renders a plain
   * title/author "spine" card instead of a broken image — so it's
   * safe to leave this out for books you haven't sourced a cover for
   * yet.
   */
  coverUrl?: string;
  /** Optional short personal note, shown when a book is clicked. */
  note?: string;
};

/**
 * Placeholder shelf. This will be replaced with your real book list
 * once you share the spreadsheet — same shape, real titles, and real
 * cover images where available.
 */
export const books: Book[] = [
  {
    slug: "example-book-one",
    title: "Example Book Title",
    author: "Author Name",
    dateRead: "2026-07-18",
    note: "A short personal note on the book — what stayed with you, or nothing at all if you'd rather keep it to cover, title, and author.",
  },
  {
    slug: "example-book-two",
    title: "Another Example Title",
    author: "A. Nother Author",
    dateRead: "2026-05-02",
  },
  {
    slug: "example-book-three",
    title: "A Third Example",
    author: "Author Name",
    dateRead: "2026-02-14",
    note: "Notes are optional per book — leave the field out entirely if there's nothing to add.",
  },
  {
    slug: "example-book-four",
    title: "On Understanding Things",
    author: "Sample Author",
    dateRead: "2025-11-09",
  },
  {
    slug: "example-book-five",
    title: "A Book Read Earlier",
    author: "B. Writer",
    dateRead: "2025-06-30",
  },
  {
    slug: "example-book-six",
    title: "A Sixth Example",
    author: "Author Name",
    dateRead: "2025-03-21",
  },
];
