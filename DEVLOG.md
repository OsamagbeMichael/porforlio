# Dev Log

A running journal of decisions, dead ends, and things I learned while
building this — newest entry on top. Unlike `CHANGELOG.md`, this is
personal and unpolished: the *why*, not the *what*. Aim for 5 minutes of
writing after a session, not a essay. If it's not honest and a little
messy, it's not doing its job.

Template for a new entry:

```
## YYYY-MM-DD
**Did:** what I actually built or changed
**Why:** the reasoning, including anything I went back and forth on
**Learned / surprised by:** anything that didn't work the way I expected
**Next:** what I want to pick up next time
```

---

## 2026-09-02
**Did:** Full accessibility + robustness pass on the frontend — real
`<button>` elements instead of clickable `<div>`s, ARIA labels/roles,
focus management on window open/close, viewport-clamped dragging, a
calendar legend, and fixed the mobile countdown hiding the actual day
count.

**Why:** Realized halfway through that the site was completely unusable
by keyboard or screen reader — every interactive element was a `div`
with a click handler. Also caught that the mobile countdown (the exact
thing carrying the "running out of time" theme) was hidden on the
platform most people will actually visit on. Both were "looks done,
isn't done" problems — worth catching before content goes on top of it.

**Learned / surprised by:** How much of "accessible" is just "semantic
HTML in the first place" rather than bolted-on ARIA. Also: `prisma
createMany({ skipDuplicates: true })` does nothing without a unique
constraint — my seed script had been quietly duplicating rows every
run and I hadn't noticed.

**Next:** Decide on auth for the one write route that still has none
(`POST /api/projects` doesn't exist yet — currently editing projects
means a direct DB write or Prisma Studio). Also want a next/prev month
control on the calendar; it only shows the current month right now.

---

## 2026-09-02 (earlier)
**Did:** Scaffolded the full stack — Express/TS/Prisma API, Postgres via
Docker Compose, a Python FastAPI service, and a Vite/TS frontend wired
to both.

**Why:** Wanted Python to have a real job rather than being a stack
line-item, so it generates the desktop wallpaper as seeded SVG and
computes writing stats off the field notes by calling the API — actual
generative/data work, not a token integration.

**Learned / surprised by:** How naturally the desktop-window mockup's
vanilla JS split into typed modules once real data was involved —
`windows.ts` for interaction, `api.ts` as the one place that knows both
services' URLs.

**Next:** Get the mobile mode feeling right — swipe-to-dismiss, tab bar,
springboard.
