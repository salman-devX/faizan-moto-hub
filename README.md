# Faizan Motor Workshop

Full-stack website for a car workshop (mechanical, electrical, denting, painting) — service booking,
live tracking, staff dashboard and admin panel.

**Stack**
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + SQLite (better-sqlite3)
- Auth: JWT (email/password)
- File uploads: Multer (stored on local disk)

## Project Structure

```
faizan-moto-hub/
  backend/     Express API + SQLite database
  frontend/    React + Vite website
```

## Quick Start (One Command)

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

This installs everything and starts **both backend (port 4000) and frontend (port 5173) together**.
Open **http://localhost:5173** in your browser.

---

## Manual Setup (if you prefer separate terminals)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Runs on **http://localhost:4000**. The SQLite database file (`fmw.db`) and `uploads/` folder are created
automatically on first run, along with seed data (services + testimonials).

The **first person who registers becomes an Admin automatically.** Everyone after that is a regular
customer. Use the Admin panel (`/admin`) to assign staff roles (motor / electrical / denter / painter)
to other registered users.

## 2. Frontend Setup (manual, if not using `npm run dev` from root)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on **http://localhost:5173** and proxies `/api` and `/uploads` requests to the backend.

## 3. Production Build

```bash
cd frontend
npm run build
```

This creates `frontend/dist` which can be deployed to Vercel/Netlify (set `VITE_API_URL` to your
deployed backend URL). Deploy the `backend/` folder to any Node host (Render, Railway, etc.) — make
sure the `uploads/` folder is on a persistent disk.

## Roles

| Role        | Access |
|-------------|--------|
| `customer`  | Book requests, track own requests, upload photos/videos |
| `motor`, `electrical`, `denter`, `painter` | See & manage requests for their department (`/staff`) |
| `admin`     | See & manage all requests, assign staff roles (`/admin`) |

## Notes

- Tracking IDs look like `FMW-2026-0001` and can be looked up publicly with the booking phone number
  at `/track` — no login required.
- Environment secrets (`JWT_SECRET`) live in `backend/.env` — never commit this file.
