# AGENTS.md

## Setup

```bash
npm install
npx prisma generate    # Required after installing deps or changing schema
npx prisma db push    # Sync schema to SQLite dev DB
npm run dev
```

## Commands

- `npm run dev` - Dev server with Turbopack
- `npm run build` - Production build with Turbopack
- `npm run lint` - ESLint (next/core-web-vitals + typescript)
- `npm run test:e2e` - Playwright E2E tests (requires `npm run dev` running)
- `npm run test:e2e:ui` - Playwright with UI mode

## Architecture

- **App Router**: Next.js 15.5 with App Router (`app/` dir)
- **Database**: Prisma + SQLite (dev), PostgreSQL (prod) - schema in `prisma/schema.prisma`
- **Auth**: next-auth v5 beta with Google OAuth (`app/api/auth/[...nextauth]/route.ts`)
- **Models**: User, Site, Lead (`prisma/schema.prisma`)

## Key Dependencies

- `framer-motion`, `gsap`, `lenis` - Animations and smooth scroll
- `@react-pdf/renderer` - PDF generation
- `stripe`, `twilio`, `resend` - External integrations (mock in dev)

## Gotchas

- Prisma Client must be regenerated after schema changes (`npx prisma generate`)
- SQLite dev DB at `prisma/dev/db` - commit to git for persistence
- `.env` uses placeholder values - update before running auth/payments
- No test framework currently configured