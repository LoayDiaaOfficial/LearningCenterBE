# Learning Center Backend

REST API backend for a learning center (school-style platform) that serves **students**, **teachers**, **supervisors**, and optionally **parents**. Built with **NestJS**, with authentication and role-based access so each user type can call only the APIs meant for them.

---

## Overview

| Item | Detail |
|------|--------|
| **Purpose** | Backend for managing users, subjects, and role-based access in a learning center |
| **Framework** | NestJS (Node.js / TypeScript) |
| **Database** | PostgreSQL via TypeORM |
| **Auth** | JWT tokens, Passport, bcrypt password hashing |
| **Validation** | `class-validator` + global `ValidationPipe` |

---

## Roles & Access

Users are linked to a **user type** (role). Each role has its own API surface and permissions:

| Role | Typical access |
|------|----------------|
| **Student** | View subjects / own profile; limited write access |
| **Teacher** | Manage assigned subjects and related student data |
| **Supervisor** | Broader admin-style oversight across users and subjects |
| **Parent** *(optional)* | Read-only or limited view of linked student info |

Access is enforced through NestJS security (JWT payload includes user identity and role), so clients only reach endpoints allowed for their role.

---

## Modules

| Module | Responsibility |
|--------|----------------|
| **Auth** | JWT generation, password hashing / validation |
| **User** | CRUD for users + login (`POST /user/login`) |
| **UserType** | Role definitions (student, teacher, supervisor, etc.) |
| **Subject** | Subjects taught / enrolled in the center |

### Core entities

- **User** — name, email, password; linked to a `UserType` and optionally a `Subject`
- **UserType** — role label used for authorization
- **Subject** — course/subject with related users

---

## Tech stack

- NestJS 11
- TypeORM + PostgreSQL
- `@nestjs/jwt` / `@nestjs/passport` / `passport-jwt`
- `bcrypt` for password hashing
- `@nestjs/config` for configuration
- `class-validator` / `class-transformer` for DTO validation

---

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- PostgreSQL database
- npm

### Install

```bash
npm install
```

### Configure

Copy `.env.example` to `.env` and fill in your values. The app reads these via Nest `ConfigModule`.

```bash
cp .env.example .env
```

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=LearningCenterDB
DB_SSL=false
DB_SYNCHRONIZE=true
JWT_SECRET=change-me
JWT_EXPIRES_IN=1h
ADMIN_EMAIL=admin@learningcenter.local
ADMIN_PASSWORD=change-me
```

`.env` is gitignored. Do not commit real credentials. For Neon, set `DB_SSL=true`.

`DB_SYNCHRONIZE=true` creates/updates tables from entities (needed for first run of enrollments/grades). Turn it off after the schema exists if you do not want TypeORM to alter tables on boot.

On startup the app seeds `Admin`, `Teacher`, and `Student` user types, and creates the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if that email is not in the database. User type names must match those strings exactly so JWT roles work.

### Run

```bash
# development (watch mode)
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

API default URL: `http://localhost:3000`

---

## Real flow (happy path)

1. **Login as admin** (seeded from `.env`)

```http
POST /user/login
{ "email": "admin@learningcenter.local", "password": "Admin123!" }
```

Use the returned `accessToken` as `Authorization: Bearer <token>`.

2. **Create a teacher and a student** (`POST /user`) with `userTypeId` from `GET /user-type` (`Teacher` / `Student`).

3. **Create a subject** (`POST /subject`) then **assign the teacher** (`PATCH /subject/:id/teacher` with `{ "teacherId": ... }`).

4. **Enroll the student** (`POST /enrollment` with `{ "studentId", "subjectId" }`). Admin or the assigned teacher can do this. Max 30 students per subject.

5. **Teacher records a grade** (`PUT /grade` with `{ "studentId", "subjectId", "score", "comment" }`).

6. **Student reads their data**
   - `GET /user/me`
   - `GET /enrollment/me`
   - `GET /grade/me`

Teacher/admin can list a class with `GET /enrollment/subject/:subjectId` and `GET /grade/subject/:subjectId`.

---

## Main API areas

| Resource | Base path | Notes |
|----------|-----------|-------|
| Users | `/user` | Admin CRUD; `POST /user/login` public; `GET /user/me` current user |
| User types | `/user-type` | Seeded Admin / Teacher / Student |
| Subjects | `/subject` | Admin create/update; `PATCH /subject/:id/teacher` |
| Enrollments | `/enrollment` | Enroll, my list, class roster, unenroll |
| Grades | `/grade` | Upsert grade, my grades, grades by subject |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run compiled app |
| `npm run test` | Unit tests |
| `npm run test:e2e` | End-to-end tests |
| `npm run lint` | ESLint |

---

## Project status

Done as a NestJS backend foundation for a learning-center platform:

- Modular NestJS structure (users, roles, subjects, auth)
- PostgreSQL persistence with TypeORM
- Login with JWT and role-based access (Admin / Teacher / Student)
- Enrollment + grading flow with a seeded admin user

---

## License

Private / UNLICENSED
