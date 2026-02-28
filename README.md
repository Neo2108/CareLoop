# Careloop - Appointments Dashboard

A healthcare appointment management system designed to support Indigenous communities with multi-language reminder calls, SMS notifications, and patient intake questionnaires.

## Purpose

Careloop helps healthcare staff manage appointments by:

- Tracking appointment status (booked, confirmed, cancelled, etc.)
- Sending SMS reminders with links to patient intake forms
- Triggering AI-powered outbound reminder calls (ElevenLabs)
- Supporting multiple languages (English, French, Ojibwe, Cree, Inuktitut, Mi'kmaq)
- Collecting pre-appointment intake questionnaires (GAD-7 style)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite with Prisma ORM
- **Auth:** NextAuth.js v5 (credentials)
- **Styling:** Tailwind CSS 4
- **SMS:** Twilio
- **AI Calls:** ElevenLabs Conversational AI

## Prerequisites

- Node.js 20+
- npm or pnpm

## Setup

1. **Clone and install:**

   ```bash
   git clone <repo-url>
   cd WDSSpark2026-main
   npm install
   ```

2. **Configure environment:**

   Copy `.env.example` to `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

   | Variable           | Required | Description                          |
   | ------------------ | -------- | ------------------------------------ |
   | `DATABASE_URL`     | Yes      | SQLite path, e.g. `file:./prisma/dev.db` |
   | `NEXTAUTH_SECRET`  | Yes      | Generate with `openssl rand -base64 32`   |
   | `TWILIO_ACCOUNT_SID` | No    | For SMS reminders                    |
   | `TWILIO_AUTH_TOKEN`  | No    | For SMS reminders                    |
   | `TWILIO_PHONE_NUMBER` | No   | Sender phone number                  |
   | `ELEVENLABS_API_KEY` | No    | For AI reminder calls                |
   | `ELEVENLABS_AGENT_ID` | No   | ElevenLabs agent ID (required for calls) |
   | `ELEVENLABS_PHONE_NUMBER_ID` | No | ElevenLabs phone number ID (required for calls) |
   | `APP_URL`          | No       | Base URL for links (default: http://localhost:3000) |
   | `UPSTASH_REDIS_REST_URL` | No | For API rate limiting (Upstash Redis) |
   | `UPSTASH_REDIS_REST_TOKEN` | No | For API rate limiting (Upstash Redis) |

3. **Initialize database:**

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Run development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials

- **Email:** staff@careloop.com  
- **Password:** password123

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `npm run dev`  | Start development server       |
| `npm run build`| Production build               |
| `npm run start`| Start production server        |
| `npm run lint` | Run ESLint                     |
| `npm run test` | Run Vitest tests               |

## Deployment (Vercel)

1. **Connect your repo** to [Vercel](https://vercel.com) and import this project.
2. **Database:** For production, use **Vercel Postgres** or **Neon** instead of SQLite (SQLite is not suitable for serverless). Set `DATABASE_URL` to your Postgres connection string.
3. **Environment variables:** Add all required vars in Vercel Project Settings → Environment Variables:
   - `DATABASE_URL` (Postgres)
   - `NEXTAUTH_SECRET`
   - `AUTH_URL` (your deployment URL, e.g. `https://your-app.vercel.app`) — required for NextAuth in production
   - `APP_URL` (same as `AUTH_URL` for patient links)
   - Optional: Twilio, ElevenLabs, Upstash Redis
4. **Post-deploy:** Run `npx prisma db push` against your production DB, then `npx prisma db seed` to create the default staff user.

**Demo:** [Add your live demo URL here after deployment]

## Project Structure

```
├── app/
│   ├── api/           # API routes (send-sms, initiate-call, trigger-reminder-calls)
│   ├── appointments/  # Staff appointment editor
│   ├── patients/      # Patient-facing intake and confirmation
│   └── actions.ts     # Server actions
├── components/        # React components
├── lib/               # Validation, errors, utilities
├── prisma/            # Schema, migrations, seed
└── auth.ts            # NextAuth configuration
```

## License

MIT
