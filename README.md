<div align="center">

# 🧠 ConsultEdge — Backend API

**The engine behind a modern expert consultation platform.**  
Connect clients with verified industry experts through real-time chat, video calls, smart scheduling, and seamless payments.

![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Modules](#-api-modules)
- [Real-Time Events](#-real-time-events)
- [Database Schema](#-database-schema)
- [Scripts](#-scripts)
- [Deployment](#-deployment)

---

## 🌐 Overview

ConsultEdge is a full-featured **expert consultation platform** REST API. Clients can browse verified experts by industry, book consultation sessions, pay via Stripe, and communicate in real-time via chat with emoji reactions, typing indicators, and live presence detection. Experts manage their own availability schedules and get notified of new bookings instantly.

---

## ✨ Features

| Category | Features |
|---|---|
| **Auth** | Email/password, Google OAuth, Email OTP, JWT sessions |
| **Experts** | Profile management, industry tags, verification workflow |
| **Scheduling** | Availability slots, published/draft state, booking conflicts |
| **Consultations** | Full lifecycle: pending → confirmed → active → completed |
| **Real-Time Chat** | Rooms, messages, emoji reactions, typing indicators, user presence |
| **Payments** | Stripe Checkout, webhook processing, session invoicing |
| **Notifications** | User + role-based push notifications |
| **AI Support** | OpenAI-powered assistant widget |
| **File Uploads** | Cloudinary-backed image & attachment uploads |
| **Admin Panel** | User management, expert verification, platform stats |

---

## 🛠️ Tech Stack

### Core
- **Runtime** — Node.js v20+
- **Language** — TypeScript 5.x (strict mode)
- **Framework** — Express 5.x
- **ORM** — Prisma 7.x with `@prisma/adapter-pg`
- **Database** — PostgreSQL (Neon serverless)

### Auth & Security
- **Better Auth** 1.x — email/password, Google OAuth, OTP
- **bcrypt** — password hashing
- **Zod** — runtime schema validation on all inputs

### Real-Time
- **Socket.IO** 4.x — chat messages, reactions, presence, typing
- **ws** — raw WebSocket layer for custom channels

### Payments & Media
- **Stripe** — checkout sessions, webhooks, invoicing
- **Cloudinary** — image & file hosting
- **Multer** — multipart upload handling

### Utilities
- **Nodemailer** — transactional emails via SMTP
- **EJS** — email templates
- **node-cron** — scheduled tasks (session expiry, reminders)
- **date-fns** — date arithmetic
- **OpenAI SDK** — AI support chat

### Dev & Build
- **tsx** — TypeScript execution for dev
- **tsup** — ESM bundle output
- **Prisma Studio** — visual DB explorer

---

## 📁 Project Structure

```
consultedge-backend/
├── prisma/
│   ├── schema/              # Multi-file Prisma schema (one model per file)
│   │   ├── auth.prisma
│   │   ├── expert.prisma
│   │   ├── consultation.prisma
│   │   ├── chatRoom.prisma
│   │   ├── massage.prisma
│   │   ├── messageReaction.prisma
│   │   └── ...
│   └── migrations/          # SQL migration history
│
├── src/
│   ├── config/              # Environment variables, Cloudinary, Multer, Stripe setup
│   ├── errorHelpers/        # AppError, Prisma error handler, Zod error handler
│   ├── generated/           # Auto-generated Prisma client (do not edit)
│   ├── helpers/             # Shared utility functions
│   ├── interfaces/          # TypeScript type definitions
│   ├── lib/                 # auth.ts (Better Auth config), prisma.ts (client + retry)
│   ├── middleware/          # Auth guard, global error handler, 404 handler
│   ├── modules/             # Feature modules (see below)
│   │   ├── admin/
│   │   ├── ai/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── client/
│   │   ├── consultation/
│   │   ├── expert/
│   │   ├── expertSchedules/
│   │   ├── expertVerification/
│   │   ├── industry/
│   │   ├── notification/
│   │   ├── payment/
│   │   ├── schedules/
│   │   ├── stats/
│   │   ├── testimonial/
│   │   └── user/
│   ├── shared/              # Shared services / helpers across modules
│   ├── templates/           # EJS email templates
│   ├── app.ts               # Express app setup
│   ├── index.ts             # Route aggregator
│   └── server.ts            # HTTP server, Socket.IO, graceful shutdown
│
├── api/                     # Production build output (tsup)
├── uploads/                 # Local file upload staging
├── public/                  # Static assets (AI widget demo)
└── package.json
```

Each module follows a consistent structure:
```
modules/feature/
├── feature.service.ts      # Business logic
├── feature.controller.ts   # Request/response handlers
├── feature.routes.ts       # Express router
└── feature.validation.ts   # Zod schemas
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v20+**
- npm **v10+**
- A PostgreSQL database (local or [Neon](https://neon.tech))
- Stripe account (for payments)
- Cloudinary account (for uploads)
- Google OAuth credentials (optional)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/consultedge-backend.git
cd consultedge-backend
npm install
```

> `postinstall` automatically runs `prisma generate` after install.

### 2. Set Up Environment

```bash
cp .env.example .env
# Fill in all required variables (see below)
```

### 3. Run Database Migrations

```bash
npm run migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server starts at `http://localhost:5000` by default.

---

## 🔑 Environment Variables

Create a `.env` file at the project root. **Never commit this file.**

```env
# App
NODE_ENV=development
PORT=5000

# Database (use direct URL, NOT pooler, for long-running servers)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Better Auth
BETTER_AUTH_URL=http://localhost:5000
BETTER_AUTH_SECRET=your-super-secret-key-min-32-chars

# JWT (legacy token layer)
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="ConsultEdge <noreply@consultedge.com>"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback/google

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Admin seed
ADMIN_EMAIL=admin@consultedge.com
ADMIN_PASSWORD=SuperSecurePassword123!

# AI (optional)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
```

---

## 📡 API Modules

Base path: `/api/v1`

| Module | Prefix | Description |
|---|---|---|
| Auth | `/auth` | Sign up, sign in, OTP, Google OAuth, sessions |
| Users | `/users` | Profile read/update, avatar upload |
| Experts | `/experts` | Expert profiles, search, filters |
| Expert Verification | `/expert-verification` | Document submission & admin review |
| Expert Schedules | `/expert-schedules` | Availability slot management |
| Schedules | `/schedules` | Booking slot queries |
| Consultations | `/consultations` | Book, confirm, cancel, complete sessions |
| Chat | `/chat` | Rooms, messages, emoji reactions |
| Payments | `/payments` | Stripe checkout, invoice, history |
| Notifications | `/notifications` | List, mark as read, delete |
| Industry | `/industries` | Industry category CRUD |
| Testimonials | `/testimonials` | Client reviews & ratings |
| Stats | `/stats` | Admin dashboard analytics |
| Admin | `/admin` | Admin user management |
| AI | `/ai` | AI support chat completions |
| Client | `/clients` | Client-specific profile data |

### Example Requests

**Sign In**
```http
POST /api/v1/auth/sign-in
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "password123"
}
```

**Toggle Emoji Reaction**
```http
POST /api/v1/chat/rooms/:roomId/messages/:messageId/reactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "emoji": "👍"
}
```

**Response:**
```json
{
  "messageId": "uuid",
  "emoji": "👍",
  "action": "added",
  "reactions": [
    {
      "emoji": "👍",
      "count": 3,
      "reactedByCurrentUser": true,
      "users": [{ "userId": "...", "name": "Alice", "image": "..." }]
    }
  ]
}
```

---

## ⚡ Real-Time Events

Connect via Socket.IO at the server root with an auth token.

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `join_room` | `{ roomId }` | Join a chat room |
| `send_message` | `{ roomId, content, attachments? }` | Send a message |
| `toggle_reaction` | `{ roomId, messageId, emoji }` | Add or remove an emoji reaction |
| `typing_start` | `{ roomId }` | Broadcast typing indicator |
| `typing_stop` | `{ roomId }` | Stop typing indicator |
| `mark_read` | `{ roomId, messageId }` | Mark messages as read |

### Server → Client

| Event | Description |
|---|---|
| `new_message` | New message received in a room |
| `message_reaction_updated` | Reaction toggled on a message |
| `user_typing` | A user is typing |
| `user_stopped_typing` | A user stopped typing |
| `user_online` | User presence update |
| `message_read` | Read receipt update |

---

## 🗄️ Database Schema

The Prisma schema is split across multiple files in `prisma/schema/` for maintainability.

### Key Models

```
User                — Core auth + profile
Expert              — Expert profile linked to User
Client              — Client profile linked to User
Industry            — Expert industry/category tags
ExpertSchedule      — Availability time slots
Consultation        — Booking session (lifecycle: PENDING → CONFIRMED → ACTIVE → COMPLETED)
ChatRoom            — Conversation thread between client and expert
Message             — Chat message
MessageReaction     — Emoji reaction on a message (unique per user+message+emoji)
Payment             — Stripe payment record
Notification        — System/user notifications
Testimonial         — Client reviews
```

---

## 📜 Scripts

```bash
npm run dev          # Start dev server with hot reload (tsx watch)
npm run build        # Compile to api/ with tsup (ESM, Node 20 target)
npm run start        # Run production build
npm run service:up   # Build + migrate deploy + start PM2 service
npm run service:restart # Restart PM2 service with updated env
npm run service:logs # Tail PM2 logs

npm run migrate      # Run pending Prisma migrations (dev)
npm run generate     # Regenerate Prisma client after schema changes
npm run studio       # Open Prisma Studio (visual DB browser)
npm run push         # Push schema to DB without migration history

npm run stripe:webhook  # Forward Stripe events to localhost (requires Stripe CLI)
```

---

## 🚢 Deployment

### Build

```bash
npm run build
# Output: api/server.js + api/index.js (ESM)
```

### Production Start

```bash
node api/server.js
```

### Important Notes for Production

- **Database URL**: Use the **direct** PostgreSQL connection URL (not a pooler endpoint) for the long-running Express server to avoid dropped idle connections.
- **Stripe Webhooks**: Point your Stripe dashboard webhook to `https://yourdomain.com/webhook`. The endpoint reads raw body before JSON middleware — do not reorder.
- **File Uploads**: Chat attachments and media uploads are Cloudinary-backed for production-safe storage.
- **Prisma**: Always run `npx prisma migrate deploy` (not `migrate dev`) in production.
- **Environment**: Set `NODE_ENV=production` to enable graceful shutdown on unhandled errors.

### Free Deploy (WebSocket-safe)

For a fully free deployment path that supports Socket.IO + Multer + EJS, follow:

`docs/FREE_DEPLOY_ORACLE_VM.md`

---

## 🔒 Security

- All input is validated with **Zod** before reaching service or database layer
- Passwords hashed with **bcrypt** (salt rounds: 12)
- Auth handled by **Better Auth** — no raw JWT rolling logic in routes
- CORS restricted to declared `FRONTEND_URL` and `BETTER_AUTH_URL`
- Stripe webhooks verified with `STRIPE_WEBHOOK_SECRET` signature
- `.env` excluded from version control — rotate credentials if ever exposed

---

<div align="center">
  <sub>Built with ☕ and TypeScript. ConsultEdge Backend — © 2026</sub>
</div>


---

## ?? Deploying to Render (Free Tier) & Keep-Alive

Render's free web service plan suspends your service after **~15 minutes of inactivity**. The first request after sleep will trigger a **cold start (~30�60 seconds)**. Upgrading to any paid Render plan removes this entirely.

### Health endpoint

The backend exposes:

```
GET https://<your-service>.onrender.com/healthz
? 200 OK
{ "status": "ok" }
```

This same path is configured as Render's `healthCheckPath` in [render.yaml](render.yaml).

### External keep-alive (recommended for free tier)

Do **not** self-ping from inside the Node process � it does not prevent Render from sleeping the container and wastes resources. Use an **external** pinger instead:

1. Sign up for a free scheduler such as:
   - [cron-job.org](https://cron-job.org) (recommended, free, HTTPS)
   - [UptimeRobot](https://uptimerobot.com)
   - [BetterStack Uptime](https://betterstack.com/uptime)
2. Create a new cron / monitor with:
   - **URL**: `https://<your-render-service>.onrender.com/healthz`
   - **Method**: `GET`
   - **Interval**: every **10 minutes**
   - **Expected status**: `200`
3. Save. The scheduler will hit `/healthz` around the clock and keep the dyno warm during business hours.

> ?? Be aware that Render's free plan also has a monthly instance-hour quota. Pinging 24/7 is fine for a single service but will count toward that quota. If you only need uptime during business hours, configure the scheduler's active window accordingly.

### HTTPS only

All configured URLs (`BETTER_AUTH_URL`, `FRONTEND_URL`, `GOOGLE_CALLBACK_URL`, Stripe webhook, Ably endpoint) must use `https://`. The backend performs no HTTP?HTTPS redirect itself � Render terminates TLS at its edge and forwards HTTPS traffic to the app. `app.set("trust proxy", 1)` is already enabled so `req.secure` and cookies with `secure: true` work correctly behind the Render proxy.
