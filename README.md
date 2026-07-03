# TaskFlow

A Trello-style kanban board for personal and team project management — drag-and-drop cards, multiple boards, labels, and automatic persistence, built on the MERN stack.

**Live demo:** [taskflow-kanban.vercel.app](https://taskflow-kanban.vercel.app)

## Overview

- **Drag & drop** — move and reorder cards across lists with native HTML5 drag events
- **Multiple boards** — each user manages any number of color-coded boards
- **Lists & cards** — create, rename, edit, and delete freely
- **Card details** — descriptions and color labels
- **Auto-save** — every change is debounced and persisted; no save button
- **Private by design** — JWT authentication scopes all data to its owner

## Architecture

```
kanban-board/
├── backend/          Express REST API
│   ├── models/       User, Board (lists and cards embedded for
│   │                 atomic drag-reorder persistence)
│   └── routes/       /api/boards · /api/auth
└── frontend/         React app (Vite)
    └── src/
        └── pages/    Boards overview, Board (drag-and-drop surface)
```

Lists and cards are embedded documents within a board, so a drag operation commits the entire board state in a single atomic write — no cross-collection ordering bugs.

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Frontend   | React 18, Vite, Tailwind CSS                     |
| Backend    | Node.js, Express, Mongoose                       |
| Database   | MongoDB Atlas                                    |
| Security   | Helmet, rate limiting, input sanitization, JWT   |

## Getting Started

**Prerequisites:** Node.js 18+ and a MongoDB connection string.

```bash
# API
cd backend
npm install
cp .env.example .env   # configure environment
npm run seed           # optional: create sample boards
npm run dev

# App
cd frontend
npm install
npm run dev
```

Environment variables are documented in [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example).

## Author

**Amar Hassen Mohammednur** — [github.com/Min-joona](https://github.com/Min-joona)

## License

MIT
