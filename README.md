# TaskFlow — Kanban Board 📋

[![MERN](https://img.shields.io/badge/Stack-MERN-brightgreen)](#)

A Trello-style project-management board with **drag-and-drop** cards and lists,
multiple boards, labels, and auto-save — built on the MERN stack.

> Built by **Amar Hassen Mohammednur**.

## ✨ Features

- **Drag & drop** cards between lists and reorder them (native HTML5 DnD)
- **Multiple boards** per user, each with a color accent
- **Lists & cards** — add, rename, edit, delete
- **Card details** — description + color labels
- **Auto-save** — every change persists to MongoDB (debounced)
- **JWT auth** — each user sees only their own boards
- Clean, **mobile-responsive** UI

## 🧱 Tech Stack

React 18 · Vite · Tailwind CSS · Node.js · Express · Mongoose · MongoDB · JWT

## 🧩 Data model

Lists and cards are **embedded** in the Board document, so a drag-reorder saves
the whole board atomically in one request — simple and consistent.

## 🚀 Getting Started

### Backend
```bash
cd backend && npm install
cp .env.example .env      # set MONGODB_URI + JWT_SECRET
npm run seed              # 1 user + 2 sample boards
npm run dev               # http://localhost:5005
```

### Frontend
```bash
cd frontend && npm install
npm run dev               # http://localhost:5173
```

**Login:** `amar@taskflow.io` / `demo123`

## ☁️ Deployment
Two Vercel projects: `backend/` (env: `MONGODB_URI`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `VERCEL=1`)
and `frontend/` (env: `VITE_API_URL`). Seed once against Atlas.

## 📄 License
MIT
