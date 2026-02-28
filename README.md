# CareLoop — Healthcare Appointments Dashboard

> Submitted to SPARK Hackathon 2026 · Won Best Case Pitch · MLH Fellowship Code Sample

CareLoop is a full-stack healthcare appointment management system built to support Indigenous communities. It enables clinic staff to track appointments, send SMS reminders, and collect pre-appointment intake questionnaires — while patients can access their own portal to confirm, reschedule, or complete intake forms.

---

## Features

### Staff (EMR) View
- Secure login with JWT-based session authentication
- Dashboard with real-time filtered appointment table (by name, status, date range)
- Per-appointment editor: update status, language, reason, follow-up flag
- Trigger bulk reminder calls (UI demo) for today's appointments
- Send individual SMS reminders via Twilio with a deep-link to the patient portal
- Mass notification modal with prefill templates
- View patient intake answers directly in the editor

### Patient View
- Passwordless login: patients look up their appointment by name + date
- Confirm, cancel, or request reschedule for their appointment
- Complete a pre-appointment mental health intake questionnaire (GAD-7 style)
- Multilingual support: English, French, Ojibwe, Cree, Inuktitut, Mi'kmaq

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript |
| Database | SQLite (dev) / PostgreSQL (prod) via Prisma ORM |
| Auth | NextAuth.js v5 — JWT credentials provider |
| Styling | Tailwind CSS v4 |
| SMS | Twilio |
| Validation | Zod |
| Testing | Vitest + React Testing Library |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

---

## Prerequisites

- Node.js 20+
- npm

---

## Setup

```bash
git clone https://github.com/Neo2108/CareLoop.git
cd CareLoop
npm install
cp .env.example .env
```

Edit `.env` with your values (see [Environment Variables](#environment-variables) below), then:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo Credentials

**Staff login** → `/login`
| Field | Value |
|---|---|
| Email | `staff@careloop.com` |
| Password | `password123` |

**Patient login** → `/patient-login`
Enter any patient's name and appointment date from the dashboard (e.g. *John Doe, 2026-02-15*).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | SQLite: `file:./prisma/dev.db` · Postgres: `postgresql://...` |
| `NEXTAUTH_SECRET` | Yes | Random secret — generate with `openssl rand -base64 32` |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio Account SID for SMS |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | Optional | Your Twilio phone number (E.164) |
| `APP_URL` | Optional | Base URL for SMS deep-links (default: `http://localhost:3000`) |
| `UPSTASH_REDIS_REST_URL` | Optional | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Upstash Redis token for rate limiting |

---

## Project Structure

```
app/
  page.tsx                  # Staff dashboard
  actions.ts                # Server actions (data layer)
  login/                    # Staff auth
  patient-login/            # Patient lookup portal
  patients/appointment/     # Patient appointment + intake form
  appointments/[id]/        # Staff appointment editor
  api/
    auth/                   # NextAuth handler
    send-sms/               # Twilio SMS route
    trigger-reminder-calls/ # Reminder calls endpoint
components/
  AppointmentTable.tsx      # Dashboard table with filters
  AppointmentEditor.tsx     # Staff appointment editor
  PatientAppointmentForm.tsx # Patient-facing form
  TriggerCallsButton.tsx    # Reminder calls button
lib/
  validation.ts             # Zod schemas
  errors.ts                 # Typed error classes
  env.ts                    # Env var validation
  ratelimit.ts              # Upstash rate limiting
prisma/
  schema.prisma             # Database schema
  seed.ts                   # Demo seed data
middleware.ts               # Route protection (NextAuth + Edge-compatible)
auth.ts                     # NextAuth full config (credentials + Prisma)
auth.config.ts              # Edge-compatible auth config (middleware use)
```

---

## Scripts

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm run test       # Run Vitest tests
npm run test:watch # Tests in watch mode
```

---

## Deployment (Vercel)

1. Connect the GitHub repo to a new Vercel project
2. Add a Postgres database (Vercel Postgres or Neon)
3. Set all required environment variables in the Vercel dashboard
4. On first deploy, run migrations: `npx prisma migrate deploy`

---

## License

MIT
