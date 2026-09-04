# Architecture

## Overview

Three independently-runnable services talking over HTTP, plus Postgres:

```
apps/web (Vite, vanilla TS, no framework)  :5173
   │ fetch()
   ├──────────────► services/api (Express + Prisma)  :4000 ──► Postgres :5432
   │                                                       ▲
   └──────────────► services/art-service (FastAPI)  :8000 ─┘
                        (calls GET /api/notes on the API)
```

Nothing shares code or a process. The frontend calls two base URLs
(`VITE_API_URL`, `VITE_ART_URL`) and doesn't care that one backend is
Node and the other is Python — the only contract is JSON over HTTP with
CORS allowed from the frontend's origin.

## Data layer — `services/api/prisma/schema.prisma`

Five models:

- `Project`, `Note` — read-only content from the frontend's perspective.
- `AvailabilitySlot` — one row per bookable date, `@@unique([date])`, with
  an `available: Boolean` flag rather than deleting the row when booked
  (keeps history).
- `Booking` — foreign key to a slot (`slotId`). The schema allows many
  bookings per slot; it's the *route logic* that enforces one-only.
- `ContactMessage` — a plain inbox table, no relations.

## API layer — `services/api/src`

- **`index.ts`** — `helmet()` → `cors()` (only the web origin) →
  `express.json({limit:"10kb"})` → one router per resource → error
  handler mounted last (Express only invokes 4-arg middleware on
  `next(err)`).
- **`middleware/errorHandler.ts`** — `asyncHandler(fn)` wraps every route
  so a rejected promise flows to `next(err)` instead of crashing the
  process. `errorHandler` special-cases `ZodError` → 400 with
  field-level messages, `HttpError` → its own status code, anything else
  → logged + generic 500.
- **Validation** — every route with a body defines a Zod schema once and
  calls `.parse(req.body)` inside the `asyncHandler`; no manual `if`
  chains.
- **`routes/calendar.ts`** — the one route with real business logic.
  Booking reads the slot, checks `available`, then does
  `prisma.$transaction([booking.create, slot.update])` so both writes
  commit atomically. Rate-limited (5 requests / 15 min / IP), same as
  `routes/contact.ts`.
- **`routes/projects.ts`**, **`routes/notes.ts`** — plain
  `findMany({ orderBy }) → res.json(...)`, no input to validate.
- **`prisma/seed.ts`** — `Project`/`Note` have no unique constraint, so
  `createMany({skipDuplicates:true})` can't dedupe; the script does
  `deleteMany` then `createMany` every run instead.
  `AvailabilitySlot` has a unique `date`, so it uses `upsert`.

## Frontend — `apps/web/src`

- **`api.ts`** — the only module that knows about `fetch`. A single
  generic `request<T>()` wrapper throws an `Error` with the server's
  message on a non-2xx response; every endpoint call
  (`getProjects`, `book`, `sendContact`, ...) is a one-liner on top of it.
- **`windows.ts`** — the desktop-metaphor engine. State is a
  `Map<key, HTMLElement>` built from `.window` elements plus a `zTop`
  counter for stacking. Desktop gets drag (mousedown → mousemove/mouseup
  on `document`) and resize; mobile gets a full-screen sheet with
  swipe-to-dismiss (`touchstart/touchmove/touchend`, closes past a
  110px threshold). Accessibility is built in: focus moves into a window
  on open and back to the trigger on close, Escape closes the topmost
  window, dragging is clamped to the viewport.
- **`main.ts`** — glue code, one function per feature
  (`initClock`, `initCountdown`, `initWallpaper`, `loadProjects`,
  `loadNotes`, `loadWritingStats`, `initCalendar`, `initContactForm`),
  called once at the bottom of the file. All rendering is
  `element.innerHTML = templateString` — no framework, no reactive
  state. User/API data is always passed through `escapeHtml()` before
  interpolation. Non-critical features (wallpaper, writing stats) fail
  silently to a fallback rather than showing an error.

## Art service — `services/art-service`

- **`generative.py`** — `random.Random(seed)` gives a seedable RNG
  instance; the same seed string always produces the same sequence of
  shape draws, so the same visitor sees a stable wallpaper for their
  session (`seed` = a value stored in `sessionStorage`) while a new
  session gets a new one. Output is a hand-built SVG string, returned
  with `media_type="image/svg+xml"` — no image files, no canvas.
- **`stats.py`** — has no database of its own. It calls the Express API
  (`GET /api/notes`) over HTTP and computes total words, note count, and
  the longest streak of consecutive days with a note (dedupe to a
  `set` of dates, sort, walk pairs checking for a 1-day gap).

## Config / wiring

Each service reads only the URL of the thing it depends on from `.env`,
never hardcoded:

| Service      | Reads                          |
|--------------|----------------------------------|
| web          | `VITE_API_URL`, `VITE_ART_URL`  |
| api          | `CORS_ORIGIN`, `DATABASE_URL`    |
| art-service  | `API_URL`, `CORS_ORIGIN`         |

This is what lets each piece be deployed to a different host later
(see "Next steps" in the root README) without touching code.

## Known gaps

- No authentication anywhere — see [authentication.md](authentication.md).
- No `POST /api/projects` route; content changes go through Prisma
  Studio or a direct DB write.
- Calendar only renders the current month (no prev/next control).
