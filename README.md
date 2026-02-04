# Project Billing & Time Tracking System

A full-stack application for managing projects, tracking time entries, and calculating billing summaries. Features JWT authentication, role-based access control, and a drag-and-drop Kanban board.

## 🚀 Features

### Authentication

- **JWT-based authentication** with secure password hashing
- **Role-based access control**:
  - **Admin**: Create, update, archive projects; view all data
  - **Employee**: Log time entries; view projects

### Project Management

- Create, update, and archive projects
- Track billing rates per project
- View project details with time logs

### Time Tracking

- Log time entries with hours, notes, and date
- **Drag & Drop Kanban Board** for managing time log status (Todo → In Progress → Done)
- Validation: Hours must be positive, max 12 hours per day

### Billing Summary

- Calculate total hours and amount (hours × billing rate)
- Hours grouped by user
- Hours grouped by date
- **30-second cache** for performance optimization

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Caching**: NodeCache (30-second billing summary cache)

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit
- **State Management**: Zustand
- **HTTP Client**: Axios

## 📁 Project Structure

```
project-billing-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── projectController.ts
│   │   │   └── timeLogController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── projectRoutes.ts
│   │   │   └── timeLogRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── projectService.ts
│   │   │   └── timeLogService.ts
│   │   ├── utils/
│   │   │   ├── cache.ts
│   │   │   └── helpers.ts
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── signup/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── projects/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── kanban/
│   │   │   ├── projects/
│   │   │   ├── timelogs/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   └── types/
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API.md
│   └── ERD.md
└── README.md
```

## 🚦 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project-billing-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/project_billing?schema=public"
# JWT_SECRET="your-super-secret-jwt-key"

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed demo data
npx prisma db seed
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with API URL
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 👤 Demo Accounts

After running the seed script, you can use these accounts:

| Role     | Email             | Password    |
| -------- | ----------------- | ----------- |
| Admin    | admin@demo.com    | admin123    |
| Employee | employee@demo.com | employee123 |

## 📚 API Documentation

See [API.md](docs/API.md) for detailed API endpoint documentation.

## 🗄️ Database Schema

See [ERD.md](docs/ERD.md) for the entity relationship diagram and database schema.

## 🔐 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Tokens**: 24-hour expiration
- **Input Validation**: Server-side validation on all inputs
- **Authorization**: Role-based access control on all routes
- **Protected APIs**: All routes (except auth) require valid JWT token

## ⚡ Performance Optimizations

- **Database Indexes**: Indexes on `projectId`, `userId`, and `logDate` for faster queries
- **Caching**: 30-second cache on billing summary endpoint to reduce database load

## 🎨 UI Features

- Responsive design with Tailwind CSS
- Drag & drop Kanban board for time logs
- Modal dialogs for forms
- Real-time status updates

## 📝 License

MIT License
