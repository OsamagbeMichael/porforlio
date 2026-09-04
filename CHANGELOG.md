# Changelog

All notable changes to this project are logged here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — terse, dated,
grouped by Added / Changed / Fixed. This is the "what shipped," not the
"why" — that lives in `DEVLOG.md`.

## [Unreleased]
### Added
### Changed
### Fixed

---

## [0.2.0] - 2026-09-02
### Added
- Rate limiting on `/api/contact` and `/api/calendar/book`, `helmet()` on the API.
- Inline booking form on mobile (replaces a blocking `prompt()`).
- Calendar legend + tooltips explaining available/booked/unavailable states.
- Full accessibility pass: semantic `<button>` elements, ARIA roles/labels,
  focus management on window open/close, Escape-to-close, `aria-live`
  regions on async content.
### Fixed
- `prisma/seed.ts` was silently duplicating rows on every re-run — now
  resets before reseeding.
- Zod validation errors on the API were swallowed into generic 500s —
  now return 400 with the failing field.
- Mobile countdown was hiding the actual day count — now shows a
  shortened but real number.
- Draggable windows could be dragged fully off-screen with no way back —
  now clamped to viewport on drag release and on resize.

## [0.1.0] - 2026-09-02
### Added
- Initial desktop-metaphor UI mockup: draggable/resizable windows, dock,
  desktop icon scatter.
- Mobile mode: springboard home screen, full-screen sheets with
  swipe-to-dismiss, bottom tab bar.
- Express + TypeScript + Prisma + Postgres API: projects, notes,
  calendar availability/booking, contact messages.
- Python FastAPI service: seeded generative SVG wallpaper, writing
  stats computed from field notes.
- Vite + TypeScript frontend wired to both services.
