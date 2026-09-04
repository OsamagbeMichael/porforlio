# Decisions

Short write-ups of choices worth defending later — framework picks,
hosting, auth strategy. One entry per decision, newest on top. Format:
Context (what problem forced a choice) / Decision (what was picked) /
Consequences (what that costs or unlocks later).

---

## Split the backend into two services (Node API + Python art-service)

**Context:** Needed a generative SVG wallpaper and small text-stats
computation (word counts, streaks). Both are more natural in Python
than in the existing Express/TypeScript API, but the site's data of
record (projects, notes, bookings) already lives behind that API.

**Decision:** Keep one Express + Prisma + Postgres API as the source of
truth, and add a separate FastAPI service that has no database of its
own — it calls back into the Express API (`GET /api/notes`) for the data
it needs and does the generative/analytical work in Python.

**Consequences:** Two runtimes to run locally and, later, deploy
separately (see root README's "Next steps"). In exchange, each language
is doing the work it's actually good at, and the art-service can go
down without taking the core site's data or booking flow with it — the
frontend treats it as an optional enhancement (see
`initWallpaper`/`loadWritingStats` in `apps/web/src/main.ts`, both fail
silently to a fallback).

## No frontend framework — vanilla TypeScript + Vite

**Context:** The desktop-window UI (drag, resize, mobile sheet
transforms) started as a static HTML/CSS mockup before any real data
existed.

**Decision:** Keep it vanilla TS rather than porting to React/Vue —
`windows.ts` owns window state via a `Map` + z-index counter, `api.ts`
is the single fetch boundary, `main.ts` wires one function per feature.

**Consequences:** No virtual-DOM diffing or component reactivity to
lean on — every UI update is an explicit `innerHTML` write, and state
that would be "just a `useState`" in React is a module-level variable
here (e.g. `selectedSlot` in `main.ts`). Fine at this size (a handful of
windows, no deeply nested reactive state); would need reconsidering if
the UI grows much more complex.

## Zod for request validation on the API

**Context:** Every mutating route (`book`, `contact`) needs to reject
malformed input with a useful error, not a generic 500 or a silent bad
write.

**Decision:** Define a Zod schema per route and call `.parse(req.body)`
inside the shared `asyncHandler`; let a thrown `ZodError` flow to the
central `errorHandler`, which turns it into a 400 with per-field
messages.

**Consequences:** No manual `if (!body.email) ...` branching anywhere,
and validation logic is colocated with the route it protects. Adding a
field to a request means updating one schema, not scattered checks.

## Rate limiting on mutating routes only, not globally

**Context:** `POST /api/calendar/book` and `POST /api/contact` are the
only routes a script could abuse to spam bookings or the inbox; the
GET routes serve public, non-sensitive data and cost nothing to over-call.

**Decision:** Mount `express-rate-limit` (5 requests / 15 min / IP) only
on those two routes, not as global middleware in `index.ts`.

**Consequences:** Reads stay fast and unthrottled for legitimate
traffic (or a frontend that re-fetches on window focus, etc.). This is
abuse mitigation, not authentication — see
[authentication.md](authentication.md) for why it can't substitute for
an auth check once a `POST /api/projects` route exists.

## Wipe-and-reseed instead of upsert in `prisma/seed.ts`

**Context:** `Project` and `Note` have no unique field, so
`createMany({ skipDuplicates: true })` silently does nothing to prevent
duplicates — re-running the seed script was quietly duplicating every
row (caught and logged in `DEVLOG.md`, 2026-09-02).

**Decision:** `deleteMany({})` both tables before `createMany` on every
seed run. `AvailabilitySlot`, which does have a unique `date`, uses
`upsert` instead so re-seeding doesn't wipe existing bookings tied to
those slots.

**Consequences:** Safe to re-run `npm run seed` at any time during
development without inspecting the DB first. This would be wrong for a
production seed script (it would delete real content) — it's explicitly
a dev-environment convenience, not something to point at a live
database.

## Authentication deferred, not designed in from the start

**Context:** The only routes that mutate data today (`book`, `contact`)
are meant to be public — any visitor should be able to use them. No
admin-only mutation route (e.g. creating a `Project`) exists yet.

**Decision:** Ship without any auth system rather than building one
speculatively; document the gap and a lightweight recommended approach
(bearer-token middleware) in `authentication.md` for when an admin route
is actually added.

**Consequences:** Zero auth code to maintain today, but content changes
(new projects, notes) require a direct DB write or Prisma Studio in the
meantime — called out as the main open item in the root README.
