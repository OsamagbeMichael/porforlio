# desktop-portfolio

A portfolio site styled as an interactive desktop. Windows, a dock, a
generative wallpaper, and a real booking calendar — themed around
"running out of time," "many interests," and "leaving people in suspense."

## Stack

- **apps/web** — TypeScript + Vite frontend (the desktop UI from the mockup, wired to real data)
- **services/api** — Express + TypeScript + Prisma, talks to Postgres
- **services/art-service** — Python (FastAPI). Generates the desktop wallpaper as SVG on the fly (seeded per visitor) and computes writing stats from your field notes by calling the API. This is where Python earns its place — generative art + light data analysis — rather than being bolted on.
- **Postgres** — via Docker Compose

## Project layout

```
portfolio/
  apps/web/            # frontend, http://localhost:5173
  services/api/         # Express API, http://localhost:4000
  services/art-service/ # FastAPI, http://localhost:8000
  docker-compose.yml     # Postgres only
```

## Getting started

### 1. Database

```bash
docker compose up -d
```

Starts Postgres on `localhost:5432` (user/pass/db: `portfolio`).

### 2. API

```bash
cd services/api
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate    # creates tables
npm run seed               # sample projects, notes, availability slots
npm run dev                 # http://localhost:4000
```

### 3. Art service (Python)

```bash
cd services/art-service
cp .env.example .env
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Web

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Open http://localhost:5173 — the wallpaper, project list, calendar, and
field notes are all pulled live from the API; the wallpaper SVG and the
writing stats badge come from the Python service.

## API reference (services/api)

| Method | Route                          | Purpose                        |
|--------|---------------------------------|---------------------------------|
| GET    | /api/projects                  | list projects                  |
| GET    | /api/notes                      | list field notes               |
| GET    | /api/calendar/availability?month=YYYY-MM | slots for a month     |
| POST   | /api/calendar/book              | book a slot                    |
| POST   | /api/contact                    | send a contact message         |
| GET    | /health                         | health check                    |

## Art service reference (services/art-service)

| Method | Route              | Purpose                                          |
|--------|--------------------|---------------------------------------------------|
| GET    | /wallpaper.svg?seed=X | generative SVG wallpaper, deterministic per seed |
| GET    | /stats/writing      | word counts + longest streak, computed from notes |
| GET    | /health             | health check                                       |

## Where each theme lives

- **Running out of time** — menu bar countdown (client-side, cosmetic today; wire to a real deadline column later), calendar scarcity (limited available slots).
- **Many interests** — desktop icon scatter, "Interests" window, generative wallpaper (different every session).
- **Suspense** — noted as underbuilt intentionally; see the mockup conversation for ideas (locked/blurred project cards, teased titles) to add once content is real.

## Next steps worth doing before this ships

- Auth-protect a `POST /api/projects` route (or a tiny admin UI) so you're not editing the DB by hand. This is the main open gap — there's currently no way to add a project without a direct DB write or a Prisma Studio session.
- Swap the Prisma `cuid()` ids for something you're happy exposing in URLs, or add slugs.
- Add a next/previous month control to the calendar window — it only shows the current month right now.
- Decide on hosting: API + Postgres can live together (Railway/Render/Fly), art-service as a separate small container, web as a static build (Vercel/Netlify/Cloudflare Pages) pointed at the API's public URL.

## Already handled

- `/api/contact` and `/api/calendar/book` are rate-limited (5 requests / 15 min / IP) and return field-level validation errors instead of a bare 500.
- `helmet()` is applied globally on the API for baseline security headers.
- `prisma/seed.ts` resets projects and notes before reinserting, so it's safe to re-run instead of quietly duplicating rows.
- Booking on mobile uses a proper inline form, not a blocking browser `prompt()`.
