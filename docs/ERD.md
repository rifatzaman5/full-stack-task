# Entity Relationship Diagram (ERD)

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users Table                              │
├─────────────────────────────────────────────────────────────────┤
│ PK  id          : UUID                                          │
│     email       : String (Unique)                               │
│     password    : String (Hashed)                              │
│     name        : String                                       │
│     role        : Enum (ADMIN, EMPLOYEE)                       │
│     createdAt   : DateTime                                     │
│     updatedAt   : DateTime                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Projects Table                             │
├─────────────────────────────────────────────────────────────────┤
│ PK  id          : UUID                                          │
│     name        : String                                        │
│     description : String?                                       │
│     billingRate : Decimal(10, 2)                               │
│     status      : Enum (ACTIVE, COMPLETED, ARCHIVED)            │
│ FK  userId      : UUID (References Users.id)                     │
│     createdAt   : DateTime                                      │
│     updatedAt   : DateTime                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Time Logs Table                             │
├─────────────────────────────────────────────────────────────────┤
│ PK  id          : UUID                                          │
│ FK  projectId   : UUID (References Projects.id, Cascade Delete)   │
│ FK  userId      : UUID (References Users.id, Cascade Delete)     │
│     hours       : Decimal(5, 2)                                 │
│     notes       : String?                                        │
│     logDate     : Date                                          │
│     status      : Enum (TODO, IN_PROGRESS, DONE)               │
│     createdAt   : DateTime                                      │
│     updatedAt   : DateTime                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Relationships

| Relationship        | Type        | Description                           |
| ------------------- | ----------- | ------------------------------------- |
| User → Projects     | One-to-Many | A user can create multiple projects   |
| User → Time Logs    | One-to-Many | A user can log multiple time entries  |
| Project → Time Logs | One-to-Many | A project can have multiple time logs |

## Enums

### Role

| Value    | Description                             |
| -------- | --------------------------------------- |
| ADMIN    | Can create projects and manage all data |
| EMPLOYEE | Can only log time entries               |

### ProjectStatus

| Value     | Description                             |
| --------- | --------------------------------------- |
| ACTIVE    | Project is currently active             |
| COMPLETED | Project has been completed              |
| ARCHIVED  | Project has been archived (soft delete) |

### TimeLogStatus

| Value       | Description                 |
| ----------- | --------------------------- |
| TODO        | Time log is pending         |
| IN_PROGRESS | Time log is in progress     |
| DONE        | Time log has been completed |

## Indexes

| Table     | Column    | Purpose                  |
| --------- | --------- | ------------------------ |
| projects  | userId    | Filter projects by owner |
| time_logs | projectId | Filter logs by project   |
| time_logs | userId    | Filter logs by user      |
| time_logs | logDate   | Filter logs by date      |

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(EMPLOYEE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  timeLogs  TimeLog[]
  projects  Project[]

  @@map("users")
}

model Project {
  id            String        @id @default(uuid())
  name          String
  description   String?
  billingRate   Decimal       @db.Decimal(10, 2)
  status        ProjectStatus @default(ACTIVE)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  userId        String
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  timeLogs      TimeLog[]

  @@map("projects")
  @@index([userId])
}

model TimeLog {
  id        String       @id @default(uuid())
  hours     Decimal      @db.Decimal(5, 2)
  notes     String?
  logDate   DateTime     @db.Date
  status    TimeLogStatus @default(TODO)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  projectId String
  project   Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("time_logs")
  @@index([projectId])
  @@index([userId])
  @@index([logDate])
}
```
