# CodeSync 🚀

A **real-time collaborative code editor** backend built with NestJS — enabling multiple developers to write, edit, and sync code simultaneously in shared sessions, with background job processing and WebSocket-based live communication.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with token-based auth and role-based access control
- 📧 **OTP Password Reset** — Email-based OTP flow via Nodemailer for secure password recovery
- 🔴 **Real-Time Collaboration** — WebSocket gateway (Socket.IO) for live code sync across all users in a session
- 🏠 **Room/Session Management** — Users can create and join isolated coding rooms; changes broadcast only to room members
- ⚙️ **Background Job Processing** — Bull Queue + Redis for async task handling (e.g. notifications, cleanup jobs)
- 💾 **Persistent Storage** — MongoDB via Mongoose for storing users, sessions, and code snapshots
- 🔄 **Redis Integration** — Used for both Bull Queue transport and fast in-memory caching

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Real-Time | Socket.IO + WebSocket Gateway |
| Queue | Bull Queue |
| Cache / Broker | Redis (`@nestjs-modules/ioredis`) |
| Database | MongoDB + Mongoose |
| Auth | JWT + Passport.js |
| Email | Nodemailer |

---

## 📁 Project Structure

```
src/
├── auth/           # JWT auth, guards, OTP reset
├── users/          # User module & schema
├── rooms/          # Session/room management
├── gateway/        # Socket.IO WebSocket gateway
├── queue/          # Bull Queue jobs & processors
└── common/         # Decorators, filters, interceptors
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Redis (local or Docker)

### Installation

```bash
git clone https://github.com/AmrOsama10/codesync.git
cd codesync
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# App
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/codesync

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

### Run the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

---

## 🔌 WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a coding session by room ID |
| `leave-room` | Client → Server | Leave the current session |
| `code-change` | Client → Server | Send a code update |
| `code-update` | Server → Client | Broadcast code change to room members |


---

## 🧠 Architecture Overview

```
Client A ──┐
           ├──► Socket.IO Gateway ──► Room Manager ──► Broadcast to all clients in room
Client B ──┘         │
                      │
                 Bull Queue ──► Redis ──► Background Processors
                      │
                   MongoDB ──► Persistent sessions & user data
```

---

## 📌 Key Technical Decisions

- **NestJS Modules** — Each feature is fully encapsulated (Auth, Rooms, Queue, Gateway) for clean separation of concerns
- **Bull Queue over direct processing** — Offloads heavy/async tasks to background workers, keeping WebSocket responses fast
- **Redis dual role** — Acts as both the Bull Queue transport broker and an in-memory store for active session data
- **Guard-based Auth on WebSocket** — Custom AuthGuard extracts and validates JWT from WebSocket handshake headers

---

## 👨‍💻 Author

**Amr Osama** — Backend Developer  
[GitHub](https://github.com/AmrOsama10) · 
