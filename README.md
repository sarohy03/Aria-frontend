# Aria — Frontend

> **One chat. Your entire work life.**

React client for **Aria**, an AI Chief of Staff for small business owners. Users sign in with Google, chat in natural language, and manage Gmail and Google Docs without leaving a single interface.

---

## Overview

The frontend is a dark, minimal chat application that:

- Authenticates users via **Firebase Auth** (Google Sign-In)
- Sends messages to the FastAPI backend with a Firebase ID token
- Renders **streaming responses** from Aria token-by-token (SSE)
- Displays chat history and past sessions from the sidebar

### Core user flows

| User action | Frontend behavior |
|---|---|
| Sign in with Google | Firebase OAuth → store session → attach token to API calls |
| Send a chat message | `POST /chat` with SSE stream → render tokens as they arrive |
| View past conversations | `GET /sessions` → sidebar list grouped by date |
| Open a session | `GET /sessions/{id}` → load message history |
| Start fresh | Create new session, clear active chat |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Styling | Tailwind CSS |
| Auth | Firebase Auth (Google Sign-In) |
| API client | Fetch + SSE streaming |
| Deployment | Vercel |

---

## Architecture

```
Browser (React)
    │
    ├── Firebase Auth ──► Google OAuth
    │
    └── REST / SSE ──► FastAPI Backend
            Authorization: Bearer <firebase_id_token>
```

In development, Vite proxies `/api/*` to `http://localhost:8000` so the frontend can call the backend without CORS issues.

---

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Chat.jsx          # Main chat interface
│   │   ├── Message.jsx       # Individual message bubble
│   │   ├── Sidebar.jsx       # Chat history sidebar
│   │   └── Login.jsx         # Google Sign-In screen
│   ├── hooks/
│   │   ├── useChat.js        # Chat state + streaming logic
│   │   └── useAuth.js        # Firebase auth state
│   ├── lib/
│   │   ├── firebase.js       # Firebase config
│   │   └── api.js            # FastAPI client (REST + SSE)
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vite.config.js
└── package.json
```

> **Note:** Component and hook files above reflect the target structure from the project blueprint. Scaffold and wiring are in progress.

---

## Prerequisites

- Node.js 18+
- npm
- A Firebase project with Google Sign-In enabled
- Backend running locally or deployed on Render

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and fill in your Firebase project values:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5173/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
```

For local development, `VITE_API_URL` can be `/api` (Vite proxies to `localhost:8000`). For production, set it to your Render backend URL.

### 3. Run the dev server

```bash
npm run dev
```

App: http://localhost:5173

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## API Integration

All authenticated requests include:

```
Authorization: Bearer <firebase_id_token>
```

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/chat` | Send message, receive streaming SSE response |
| `GET` | `/sessions` | List user's past chat sessions |
| `GET` | `/sessions/{id}` | Load messages for a session |
| `DELETE` | `/sessions/{id}` | Delete a session |
| `GET` | `/health` | Backend health check |

The chat hook reads the SSE stream and appends tokens to the active assistant message in real time.

---

## UI Design

**Aesthetic:** Dark, premium, minimal — Notion meets Linear.

### Screens

**Login**
- Full-screen dark background with subtle gradient
- Aria logo + tagline: *"Your AI Chief of Staff"*
- Single **Continue with Google** button

**Main chat**
- Left sidebar: past sessions grouped by Today / Yesterday / Last week
- Center: message thread with user and Aria bubbles
- Bottom: message input + Send
- Header: logo, New Chat, Logout

---

## Build Checklist

### Day 2 — Frontend + Polish + Deploy

- [x] React + Vite project setup
- [x] Dev proxy to backend (`/api` → FastAPI)
- [ ] Tailwind CSS setup
- [ ] Firebase Auth + Google Sign-In
- [ ] Login screen
- [ ] Chat UI (sidebar + message area)
- [ ] Streaming response rendering (`useChat` + SSE)
- [ ] Session history (load / switch / delete)
- [ ] Connect all endpoints to backend
- [ ] Deploy to Vercel
- [ ] End-to-end test with real Gmail + Google Docs

---

## Deployment (Vercel)

Full guide: [DEPLOY.md](./DEPLOY.md)

1. Import the **frontend** repo in Vercel
2. Framework: **Vite** (auto-detected via `vercel.json`)
3. Set all `VITE_*` env vars in the Vercel dashboard
4. Deploy

**Production `VITE_API_URL`:** your Render backend URL, e.g. `https://aria-api.onrender.com` (no trailing slash, no `/api` suffix).

`vercel.json` handles SPA routing (`/chat`, etc.) and Google sign-in headers.

---

## Related

- [Backend README](../backend/README.md)
- [Project Blueprint](../Scope.md)
