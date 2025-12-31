# Sales Trainer

Sales Trainer is a full-stack web app to practice sales calls and chats. Admins create training scenarios with branching dialogs, rubrics, and hints. Trainees run simulations, get auto-scoring and feedback. Integrates with VAPI for AI-driven simulated clients, transcripts, and metrics.

## Stack

- Web: React + Vite + TypeScript + Tailwind CSS
- Server: Node.js + Express + TypeScript
- Database: Prisma + SQLite (dev) – can swap to Postgres in production
- Auth: Role-based (admin, trainee); swap-in your preferred provider

## Monorepo Layout

```
sales-trainer/
  server/
  web/
  .env.example
```

## Quickstart

1) Install dependencies

```
cd server && npm install
cd ../web && npm install
```

2) Environment

Copy `.env.example` to `server/.env` and fill values.

3) Database

```
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

4) Start dev

In two terminals:

```
cd server && npm run dev
cd web && npm run dev
```

Web runs at http://localhost:5173, server at http://localhost:4000.

## VAPI Integration

- Outbound: server starts a VAPI session for a simulation run
- Inbound: VAPI posts transcripts and metrics to `POST /webhooks/vapi`

Set the webhook URL in VAPI to your server public URL plus `/webhooks/vapi`.

## Scripts

- Server
  - `npm run dev`: Start Express with ts-node-dev
  - `npm run build`: Type-check and build
  - `npm run start`: Run built server
  - `npm run prisma:*`: Prisma helpers

- Web
  - `npm run dev`: Start Vite dev server
  - `npm run build`: Production build
  - `npm run preview`: Preview build

## Notes

- SQLite is used for convenience; configure Postgres by updating `schema.prisma` and `DATABASE_URL`.
- Auth is scaffolded for roles; integrate your provider (NextAuth, Clerk, Auth0) or JWT.





