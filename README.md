# Code Connect Hub

A developer collaboration platform to publish side projects, find builders by skill, connect, and message — ready to deploy on Vercel.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- React Router + TanStack Query
- LocalStorage-backed demo data (no backend required)

## Features

- Landing page with project highlights
- Explore projects (search, status, tags)
- Developer directory with skill filters
- Auth (sign up / log in) with demo accounts
- Dashboard: edit profile + publish projects
- Project detail pages with likes
- Connection requests + in-app messaging
- Light / dark theme

## Demo accounts

| Email | Password |
|-------|----------|
| aisha@example.com | demo1234 |
| marcus@example.com | demo1234 |
| sofia@example.com | demo1234 |
| jordan@example.com | demo1234 |

## Local development

```bash
npm install
npm run dev
```

App runs at http://localhost:8080

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. If the app lives in a nested folder, set **Root Directory** to `Code-Connect-Hub`.
4. Framework preset: **Vite** (Build: `npm run build`, Output: `dist`).
5. Deploy — `vercel.json` already rewrites SPA routes to `index.html`.

No environment variables are required for the demo.

## Note on data

All users, projects, connections, and messages are stored in the browser (`localStorage`). Use **Reset demo data** on the dashboard to restore seed content.
