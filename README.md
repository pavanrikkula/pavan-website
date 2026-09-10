# Pavan Rikkula — personal site (v2)

A minimal, old-web personal site: a homepage, writing pulled live from
Substack, a personal library, and an about page. Dark teal/green
background (tuned to match Mandelbrot's Footnotes), warm off-white
type, pixel/monospace typography, bracketed navigation with a
decode/scramble hover effect, four small interactive systems, and an
optional sound layer. Built with Next.js, TypeScript, and Tailwind
CSS, meant to be deployed on Vercel.

This README assumes no prior experience with this codebase — just enough
to make the everyday edits without needing to understand Next.js.

---

## 1. Running it on your computer

You need [Node.js](https://nodejs.org) installed (version 20 or later).
Then, from this folder, in a terminal:

```bash
npm install     # one-time setup
npm run dev     # starts the site at http://localhost:3000
```

Leave that running and open http://localhost:3000. Edits to most files
show up automatically without restarting. Press `Ctrl+C` to stop it.

Run `npm run build` once before deploying to catch any errors early.

---

## 2. Editing your books

Your library lives under `data/library/`, one file per category —
`mathematics.ts`, `fiction.ts`, and so on — matching the sheets in your
original spreadsheet, so a shelf of hundreds of books stays easy to
hand-edit instead of one giant file. `data/books.ts` just combines
them into the one canonical list every page imports; you shouldn't
need to touch it. The shared `Book` type and the category list both
live in `data/book-types.ts`.

`data/books.ts` deliberately stays a single file rather than a
`data/books/` folder — copying a new version of this project over an
existing checkout only adds and overwrites files, it never deletes
ones that are no longer part of the new tree, so a single fixed
filename here means there's never a leftover file at that exact path
for the module resolver to get confused by.

Each book is one entry:

```ts
{
  slug: "flowers-for-algernon",   // unique, lowercase, hyphens instead of spaces
  title: "Flowers for Algernon",
  author: "Daniel Keyes",           // optional
  category: "Fiction",
  status: "read",                    // "read" | "unread" | "reading"
  dateRead: "2026-07-15",              // optional — YYYY-MM-DD
  coverUrl: "https://...",              // optional — see note below
  rating: 9,                              // optional, out of 10
  review: "A short personal take.",         // optional — read books only
  notes: "Anything private you want to keep track of.", // optional
},
```

`coverUrl`, `rating`, `review`, and `notes` are all optional. Leave
`coverUrl` out and the shelf shows a plain title/author card instead —
see "Book covers" below for how those get filled in automatically.

**Ratings and reviews are intentionally blank across the whole shelf** —
nothing was invented. Add a `rating` or `review` line to a book once
you've actually formed one; until then it just shows its status.

A few books were catalogued with a `notes` field already filled in —
these are cataloguing flags from the photo-cataloguing pass (e.g.
"possibly the same as an existing title, worth checking the spine"),
not reviews. They show up on the site labelled "cataloguing note" so
they're never mistaken for your opinion of the book.

---

## 3. Book covers

Covers are resolved lazily, in the browser, **never during the build**
— that distinction matters, because an earlier version of this
resolved all 398 covers during Next.js's static generation step and
it blew past Vercel's 60-second page-generation limit. The current
architecture:

1. `Spine` in `components/reading-shelf.tsx` uses a book's own
   `coverUrl` if set by hand, or a direct Open Library URL if it has
   an `isbn` (pure string formatting — both resolved at build time,
   free, no network call).
2. Otherwise, `lib/use-lazy-cover.ts` waits until that book's card
   actually scrolls into view, then calls our own `/api/cover` route.
3. `app/api/cover/route.ts` — a small server-side proxy — does the
   real title/author lookup against Open Library's Search API and
   returns a cover URL or `null`.

The proxy exists because Open Library's search API doesn't reliably
support cross-origin requests directly from a browser (confirmed via
their own open GitHub issues) — calling our own `/api/cover` is
same-origin, and the route's own server-to-server request to Open
Library isn't subject to that restriction at all.

Caching happens at two layers: the API route sets cache headers so
Vercel's edge caches an identical title+author lookup for 30 days
across every visitor, and the browser caches hits (and confirmed
misses) in `localStorage` so scrolling past the same book again, or a
later visit, doesn't re-request it either.

`/reading` itself has zero dependency on Open Library — it renders all
398 books immediately from static data regardless of whether Open
Library is reachable, slow, or down. Books with no confident match
fall back to the plain title/author card; `Spine` also catches broken
image links and Open Library's occasional tiny placeholder image at
render time and falls back the same way, so a bad match never shows as
an obviously broken image.

**Verification note:** I confirmed the build is fast and has no
external dependency (checked the build output directly: `/reading` is
static with no revalidate window, `/api/cover` is marked dynamic and
excluded from static generation entirely). I have not been able to see
an actual resolved cover render — this sandbox can't reach Open
Library at all, and the lazy/scroll-triggered design means there's no
build step left to exercise that path from here even indirectly.
Scroll through `/reading` after your next deploy to confirm covers
actually appear.

---

## 4. How the Writing page works

It's not manually maintained — `app/writing/page.tsx` fetches your
Substack RSS feed (`https://ergodicantilibrary.substack.com/feed`,
behind "Mandelbrot's Footnotes") on a one-hour cache and lists the most
recent posts, each linking straight out to the Substack article. The
homepage shows the two most recent.

If the feed is ever unreachable, the page shows a quiet fallback message
with a link to your Substack archive instead of breaking — you'll see
that fallback if you run this locally offline, that's expected.

If you ever rename the publication or move it to a different Substack
address, update the one URL near the top of `lib/substack.ts`.

---

## 5. Editing text

- **Homepage** name, tagline, and teaser sections: `app/page.tsx`
- **About page**: `app/about/page.tsx`
- **Nav labels / social links**: `components/nav.tsx`, the `sectionLinks`
  and `socialLinks` arrays near the top

---

## 6. Changing the design

- **Colors**: `app/globals.css`, under `:root` — five named values
  (`--color-bg`, `--color-fg`, `--color-fg-muted`, `--color-hairline`,
  `--color-accent`). Change the hex values and the whole site updates.
  `--color-accent` is deliberately used in very few places (the
  terminal cursor, the machine's pulses, the "currently reading" tag)
  — it's meant to stay a restrained flourish, not a UI color.
- **Fonts**: `app/fonts.ts`. IBM Plex Mono carries everything you read;
  Press Start 2P is used only for the homepage name and page titles.
  Both are self-hosted via npm (`@fontsource/*`).
- **The link hover effect**: `.bracket-link` in `globals.css` handles
  the bracket tighten/brighten; `components/scramble-text.tsx` handles
  the decode/scramble of the label itself. `BracketLink`, `ArrowLink`,
  `HoverLink`, and the `[wander]` button all use the same
  `ScrambleText` piece, so it stays one coherent interaction.

### The four interactive systems

- **Wandering footnote** — `components/wandering-footnote.tsx` (the
  drifting "¹" beside your name on the homepage) and `lib/footnotes.ts`
  (what it resolves into — a few seed examples plus real authors
  pulled from your Mathematics / Physics & Science / Finance &
  Economics shelves).
- **Dynamical system** — `components/dynamical-system.tsx`. Six points
  on the homepage, one per real shelf category, orbiting via the
  Kuramoto model of coupled oscillators — an actual synchronization
  system, not decorative randomness. Hovering a point reveals its
  category.
- **Interactive bookshelf** — `components/reading-shelf.tsx` on
  `/reading`. Category and read/unread filters, a deterministic
  "one book sits slightly askew" touch, hover-forward, click-to-reveal
  detail, and a `?book=slug` deep link that `[wander]` and shareable
  URLs both use.
- **The machine** — `components/machine-diagram.tsx`, living quietly
  in the footer on every page. A handful of nodes, a small fixed
  rotation of which connections between them are "active" (like
  replicas reconfiguring), and a pulse traveling along each one. A nod
  to Code.Storage's *feeling* of being small quiet infrastructure at
  work — not a copy of its (very different, ASCII-table/terminal)
  visual design.

All four freeze to a static frame under `prefers-reduced-motion`.

### Sound

`components/sound-provider.tsx` wraps the whole site (see
`app/layout.tsx`) and exposes a `useSound()` hook. **Off by default,
every visit, no persistence** — the footer's `[SOUND: OFF]` /
`[SOUND: ON]` toggle (`components/site-footer.tsx`) is the only thing
that turns it on, which also happens to be the browser gesture that
unlocks audio playback at all, so sound is structurally incapable of
autoplaying. The four short clips live in `public/sounds/` (`click`,
`reveal`, `toggle-on`, `toggle-off`) — synthesized locally, not
recorded or pulled from any service. `reveal` plays on the footnote,
the dynamical system's points, and the machine's nodes (one language
for "hover to discover"); `click` plays on `[wander]` and selecting a
book.

**Caveat worth knowing:** these were generated programmatically and
tuned by reasoning about frequency/envelope shapes, not by ear — this
environment has no audio output to actually listen with. Have a listen
yourself before trusting the tuning; regenerating or replacing any of
the four `.wav` files in `public/sounds/` is enough to change them,
`sound-provider.tsx` doesn't need to change.

---

## 7. Deploying to Vercel

1. Free account at [vercel.com](https://vercel.com), and a
   [GitHub](https://github.com) account if you don't have one.
2. Push this folder to a new GitHub repository (GitHub's web upload UI
   works fine if you'd rather not use git directly).
3. In Vercel: **Add New → Project**, pick the repo, **Deploy**. Next.js
   is detected automatically.
4. Add a custom domain later under **Settings → Domains**.

Every push to GitHub after that redeploys automatically.

---

## Project structure, briefly

```
app/
  page.tsx                  Homepage
  about/page.tsx              About page
  writing/page.tsx              Writing — live Substack feed
  reading/page.tsx                Reading — the library (was /books; old
                                    links redirect via next.config.ts)
  api/cover/route.ts                Same-origin proxy for on-demand cover
                                     lookups — see "Book covers" above
  layout.tsx                          Wraps every page (nav, footer, fonts,
                                       sound + motion providers)
  globals.css                           Colors, bracket/arrow link styles
  fonts.ts                                Font setup

components/
  nav.tsx                    Site nav — edit labels/social links here
  site-footer.tsx              Footer — sound toggle + the machine
  bracket-link.tsx                The [bracketed] nav/social link
  arrow-link.tsx                     The underlined "more →" content link
  hover-link.tsx                        Plain content links (post titles, etc)
  scramble-text.tsx                        The shared decode-on-hover effect
  reading-shelf.tsx                          The library grid, filters, covers,
                                              detail panel
  wandering-footnote.tsx                        The drifting "¹" on the homepage
  dynamical-system.tsx                             Homepage — orbiting category points
  machine-diagram.tsx                                 Footer — the small computational machine
  wander-button.tsx                                      The [wander] random-discovery button
  sound-provider.tsx                                        Sound context — off by default
  reveal.tsx / hero-text.tsx                                   Scroll and load-in animation wrappers
  motion-provider.tsx                                             Site-wide reduced-motion support

lib/
  substack.ts                Fetches and parses the Substack RSS feed
  open-library.ts               The actual Open Library lookup — called
                                 only by app/api/cover/route.ts
  use-lazy-cover.ts                Client hook: triggers that lookup once a
                                    book's card scrolls into view, and caches
                                    the result in localStorage
  footnotes.ts                       What the wandering footnote can resolve into
  format.ts                            Date formatting
  use-reduced-motion.ts                   Hook for the scramble effect

data/
  book-types.ts               Book type + category list
  books.ts                       THE canonical book list — a single file
                                  on purpose, see "Editing your books" above
  library/<category>.ts            Your library, one file per category

public/sounds/               The four synthesized .wav clips
```
