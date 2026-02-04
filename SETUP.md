# Setup Instructions

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Step 1: Configure Database

Edit `backend/.env` and add your PostgreSQL connection:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_billing?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

## Step 2: Install Dependencies

Open TWO terminal windows:

**Terminal 1 - Backend:**

```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm install
```

## Step 3: Setup Database

In **Terminal 1** (backend folder):

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed demo data
npm run db:seed
```

## Step 4: Start Development Servers

**Terminal 1 - Backend:**

```bash
npm run dev
```

Backend runs at: http://localhost:5000

**Terminal 2 - Frontend:**

```bash
npm run dev
```

Frontend runs at: http://localhost:3000

## Step 5: Login with Demo Accounts

| Role     | Email             | Password    |
| -------- | ----------------- | ----------- |
| Admin    | admin@demo.com    | admin123    |
| Employee | employee@demo.com | employee123 |

## Project Structure

```
project-billing-system/
├── backend/          # Node.js + Express + Prisma
│   ├── prisma/      # Database schema & migrations
│   └── src/         # API controllers, services, routes
├── frontend/         # Next.js 14 + Tailwind CSS
│   └── src/         # Pages, components, hooks
└── SETUP.md         # This file
```

## Features

- **Admin**: Create/manage projects, view all projects, log time
- **Employee**: View all projects, log time, drag & drop Kanban board
- **Billing**: Calculate hours × billing rate
- **Caching**: Billing summary cached for 30 seconds
