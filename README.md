# ToDo App

React + React Query | Express + Prisma + PostgreSQL + JWT

## Requirements

- Node.js 22.18+
- Docker

## Setup

```bash
# 1. Start the database
docker compose up -d

# 2. Create env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# 3. Install dependencies
npm run install:all

# 4. Apply migrations
npm run migrate

# 5. Run the app
npm run dev
```

Open http://localhost:5173

The API runs on http://localhost:4000/api
