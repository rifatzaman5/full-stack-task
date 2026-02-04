# Project Billing & Time Tracking System

A full-stack application for managing projects, tracking time entries, and calculating billing summaries with a drag-and-drop Kanban board.

## 🚀 Tech Stack

### Backend

- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM** with PostgreSQL
- **JWT** Authentication
- **bcrypt** for password hashing

### Frontend

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **@dnd-kit** for drag-and-drop
- **Zustand** for state management

## ✨ Features

### Authentication

- JWT-based authentication
- Role-based access control:
  - **Admin**: Full access to all projects and time logs
  - **Employee**: Can only manage their own time entries

### Project Management

- Create, update, and archive projects
- Track billing rates per project
- Project status: Active / Completed / Archived

### Time Tracking

- Log time entries with notes
- Drag & drop Kanban board (Todo / In Progress / Done)
- Validation rules:
  - Hours must be positive (minimum 0.5)
  - Maximum 12 hours per entry
  - Maximum 12 hours per day

### Billing Summary

- Total hours and amount calculation
- Hours grouped by user
- Hours grouped by date
- 30-second caching for performance

## 📁 Project Structure

```
project-billing-system/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login, signup
│   │   │   ├── (dashboard)/projects
│   │   │   ├── layout.tsx
│   │   │   └── providers.tsx
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
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/rifatzaman5/full-stack-task.git
cd full-stack-task
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your database connection string and JWT secret

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file from example
cp .env.example .env.local

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Environment Variables

#### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_billing?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register new user       |
| POST   | `/api/auth/login`    | Login and get JWT token |
| GET    | `/api/auth/me`       | Get current user        |

### Projects

| Method | Endpoint                            | Description         |
| ------ | ----------------------------------- | ------------------- |
| GET    | `/api/projects`                     | List all projects   |
| POST   | `/api/projects`                     | Create new project  |
| GET    | `/api/projects/:id`                 | Get project details |
| PUT    | `/api/projects/:id`                 | Update project      |
| DELETE | `/api/projects/:id`                 | Archive project     |
| GET    | `/api/projects/:id/billing-summary` | Get billing summary |

### Time Logs

| Method | Endpoint             | Description     |
| ------ | -------------------- | --------------- |
| GET    | `/api/time-logs`     | List time logs  |
| POST   | `/api/time-logs`     | Create time log |
| PUT    | `/api/time-logs/:id` | Update time log |
| DELETE | `/api/time-logs/:id` | Delete time log |

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Input validation on all endpoints
- Protected API routes

## 🎨 UI Components

- **Login/Signup Pages**: Authentication forms
- **Projects List**: Grid view of all projects
- **Project Detail**: Project info with Kanban board
- **Kanban Board**: Drag & drop time logs (Todo/In Progress/Done)
- **Billing Summary**: Total hours, amount, and breakdowns
- **Time Log Form**: Add/edit time entries

## 📄 License

This project is open source and available under the MIT License.
