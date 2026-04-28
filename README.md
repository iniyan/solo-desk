# SOLO DESK

A personal productivity dashboard for freelancers. Manage daily tasks, track time, organize by client/organization, and review your week — all in one place.

## Features

- **Daily Dashboard** — Focus on today's top 3 priorities and tasks
- **Task Management** — Create, organize, and track tasks by organization, priority, and revenue type
- **Inbox** — Quick capture ideas and promote them to tasks later
- **Time Planner** — Plan your day with time blocks
- **Organizations** — Group work by client or project with color coding
- **Templates** — Save and reuse task sets for recurring workflows
- **Recurring Tasks** — Auto-generate daily/weekly tasks
- **Carry Forward** — Incomplete tasks automatically carry to the next day with alerts
- **Weekly Review** — Summary of completed work, revenue breakdown, and org stats
- **Authentication** — Email/password login to protect your data

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** Upstash Redis (via `@upstash/redis`)
- **Auth:** Custom JWT sessions with bcrypt password hashing
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- An [Upstash Redis](https://upstash.com/) database
- npm (or yarn/pnpm/bun)

### 1. Clone the repository

```bash
git clone https://github.com/iniyan/solo-desk.git
cd solo-desk
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# Upstash Redis (get these from your Upstash dashboard)
KV_REST_API_URL=https://your-redis-url.upstash.io
KV_REST_API_TOKEN=your-redis-token

# Auth (generate a random secret, e.g. `openssl rand -base64 32`)
AUTH_SECRET=your-secret-key-here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to the registration page on first visit.

### 5. Create your account

Register with your email and password at `/register`. You'll be automatically logged in.

## Deployment on Vercel

### 1. Push to GitHub

```bash
git push origin main
```

### 2. Import to Vercel

- Go to [vercel.com/new](https://vercel.com/new) and import your repository

### 3. Add Upstash Redis

- In your Vercel project, go to **Storage** > search for **Upstash** > **Connect Database**
- This automatically sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### 4. Add AUTH_SECRET

- Go to **Settings** > **Environment Variables**
- Add `AUTH_SECRET` with a random value (generate with `openssl rand -base64 32`)

### 5. Deploy

Vercel will auto-deploy on every push to `main`.

## Project Structure

```
solo-desk/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── auth/           # Auth endpoints (login, register, logout, me)
│   │   ├── daily/          # Daily data CRUD
│   │   ├── tasks/          # Task CRUD + comments
│   │   ├── inbox/          # Inbox CRUD
│   │   ├── planner/        # Time block CRUD
│   │   ├── organizations/  # Organization CRUD
│   │   ├── templates/      # Template CRUD
│   │   ├── recurring/      # Recurring task definitions
│   │   ├── carry-forward/  # Carry forward analysis
│   │   └── summary/        # Daily/weekly summaries
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── tasks/              # Tasks page
│   ├── inbox/              # Inbox page
│   ├── planner/            # Planner page
│   ├── organizations/      # Organizations page
│   ├── templates/          # Templates page
│   ├── review/             # Weekly review page
│   ├── settings/           # Settings page
│   └── page.tsx            # Dashboard (home)
├── components/
│   ├── layout/             # AppShell, Sidebar, TopBar
│   ├── ui/                 # Reusable UI components (Button, Input, Dialog, etc.)
│   ├── dashboard/          # Dashboard widgets
│   ├── tasks/              # Task-related components
│   ├── inbox/              # Inbox components
│   ├── planner/            # Planner components
│   └── organizations/      # Organization components
├── lib/
│   ├── kv.ts               # Upstash Redis client
│   ├── auth.ts             # Auth utilities (JWT, password hashing)
│   ├── types.ts            # TypeScript type definitions
│   ├── markdown/           # Data parsers (KV-backed)
│   ├── recurring.ts        # Recurring task logic
│   ├── carry-forward.ts    # Carry forward logic
│   ├── summary.ts          # Summary generation
│   └── dates.ts            # Date utilities
├── hooks/                  # Custom React hooks
├── middleware.ts            # Route protection (auth)
└── package.json
```

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `KV_REST_API_URL` | Upstash Redis REST URL | Yes |
| `KV_REST_API_TOKEN` | Upstash Redis REST token | Yes |
| `AUTH_SECRET` | JWT signing secret for sessions | Yes |

## License

MIT License — feel free to modify and share.
