# Authentication

## Current state: none

There is no authentication or authorization anywhere in this codebase
today. Every route on `services/api` and `services/art-service` is
public:

| Route                              | Exposure today                                   |
|-------------------------------------|---------------------------------------------------|
| `GET /api/projects`                 | public read — fine, it's meant to be public       |
| `GET /api/notes`                    | public read — fine, it's meant to be public       |
| `GET /api/calendar/availability`    | public read — fine                                 |
| `POST /api/calendar/book`           | public write, rate-limited (5 / 15 min / IP)      |
| `POST /api/contact`                 | public write, rate-limited (5 / 15 min / IP)      |
| `GET /wallpaper.svg`, `/stats/writing` | public read, no sensitive data                 |

The rate limits on the two write routes (`middleware` in
`routes/calendar.ts` and `routes/contact.ts`) are a spam mitigation, not
authentication — they don't identify a caller, they just cap how often
one IP can hit the route.

**There is currently no way to create, edit, or delete a `Project` or
`Note` over HTTP at all** — no route exists for it. The only way to
change that content today is a direct database write (`psql`) or a
Prisma Studio session (`npx prisma studio` from `services/api`). This is
called out as the main open gap in the root README.

## Why this hasn't been built yet

The public-facing routes (projects, notes, calendar, contact) are
correctly public by design — a portfolio site's visitors shouldn't need
an account to view projects or book a slot. The gap is specifically an
**admin surface**: some way for the site owner to add/edit a project or
note without a raw DB session. That surface doesn't exist yet, so
there's been nothing to authenticate.

## Recommended approach when it's built

Given the stack (Express + Prisma, single owner/admin, no multi-user
requirement), the lightest option that's still honest security is
enough — this doesn't need a full user system:

1. **Single static admin token**, checked by middleware:
   - Store a long random value as `ADMIN_TOKEN` in `services/api/.env`.
   - New middleware, e.g. `middleware/requireAdmin.ts`:
     ```ts
     export function requireAdmin(req: Request, res: Response, next: NextFunction) {
       const token = req.header("Authorization")?.replace("Bearer ", "");
       if (token !== process.env.ADMIN_TOKEN) {
         throw new HttpError(401, "Unauthorized");
       }
       next();
     }
     ```
   - Mount it only on the new mutating routes:
     `projectsRouter.post("/", requireAdmin, asyncHandler(...))`.
   - The admin UI (or just `curl`/Postman) sends
     `Authorization: Bearer <token>`.
   - This is the same shape as the existing `asyncHandler`/`errorHandler`
     pattern already in the codebase — it slots in without restructuring
     anything.

2. **If a real login screen is wanted later** (multiple admins, a
   proper session instead of a bearer token pasted into a tool): add a
   `User` model to `schema.prisma`, hash passwords with `bcrypt`, and
   issue a signed JWT or session cookie on login. This is meaningfully
   more code and infrastructure (a login route, password reset,
   session storage) — not worth it unless there's more than one person
   who needs access.

3. **Do not** reuse the existing rate limiters as a substitute for
   auth — they throttle abuse, they don't verify identity. A `POST
   /api/projects` route must never ship without an auth check in front
   of it, rate-limited or not.

## What to update when this lands

- This file — replace "Current state: none" with what was actually built.
- `docs/decisions.md` — log the choice (token vs. full auth) and why.
- Root `README.md` — remove the "Auth-protect a `POST /api/projects`
  route" line from "Next steps worth doing" and document the new route
  + how to set `ADMIN_TOKEN`.
