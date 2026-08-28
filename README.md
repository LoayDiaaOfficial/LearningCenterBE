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

Set database and JWT settings via environment variables (e.g. `.env`):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=LearningCenterDB
JWT_SECRET=your-secret-key
```

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

## Main API areas

| Resource | Base path | Notes |
|----------|-----------|-------|
| Users | `/user` | Create, list, get, update, delete |
| Login | `/user/login` | Returns `accessToken` + safe user payload |
| User types | `/user-type` | Manage roles |
| Subjects | `/subject` | Manage subjects |

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
- Login with JWT and hashed passwords
- Role model ready for role-based API access (students / teachers / supervisors / parents)

---

## License

Private / UNLICENSED
