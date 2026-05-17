# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ShowHive is a MERN stack movie ticket booking application with three user roles: **admin** (manages movies), **partner** (manages theaters and shows), and **user** (browses and books tickets). The repo has two top-level directories: `client/` (React frontend) and `server/` (Express backend).

## Development Commands

### Backend (`server/`)
```bash
npm install
node index.js           # start server (port 54325)
npx nodemon index.js    # start with auto-reload
```

### Frontend (`client/`)
```bash
npm install
npm run dev             # Vite dev server on http://localhost:5173
npm run build           # production build to dist/
npm run lint            # ESLint
```

No test suite exists — test scripts are placeholders.

## Environment Setup

The backend requires `server/.env` with these variables:
```
SERVER_PORT=54325
MONGODB_CONNECTION_URI=mongodb://localhost:27017/showhive
CLIENT_URL=http://localhost:5173
JWT_SECRET=<secret>
JWT_EXPIRES_IN=1d
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
EMAIL_PASS=re_...           # Resend API key
EMAIL_TO_OVERRIDE=<your email>  # redirects all outgoing emails in dev
```

The frontend's API base URL is hardcoded in `client/src/config/api.config.js` pointing to `http://localhost:54325/api`.

## Architecture

### Backend (`server/`)

**Entry:** `index.js` — Express app, CORS (credentials: true, origin from `CLIENT_URL`), cookie-parser, mounts 5 route modules, connects to MongoDB via `config/db.js`.

**Auth flow:** JWT stored in HTTP-only cookies. `authorize` middleware in `middlewares/auth.middleware.js` decodes the token and attaches `req.userId` / `req.userRole`. `requireRole(...roles)` is a HOF used on protected routes.

**Atomic seat booking:** `booking.controller.js` uses `findOneAndUpdate` with `$not: { $elemMatch: { $in: seats } }` to atomically claim seats and prevent double-booking race conditions.

**Email:** `utils/email.utils.js` uses Nodemailer with Resend SMTP. Set `EMAIL_TO_OVERRIDE` in `.env` to redirect all emails to a single address during development.

**Payment:** Razorpay integration in `payment.controller.js` (test mode). The booking flow creates a Razorpay order, verifies the signature on the callback, then confirms the booking.

### Frontend (`client/src/`)

**State:** Redux Toolkit with a single `userSlice` storing `{ name, email, role }`. Hydrated on app load by calling `GET /api/auth/user`.

**Routing:** `App.jsx` uses four route guard components — `ProtectedRoute`, `PublicRoute`, `AdminRoute`, `PartnerRoute` — to enforce auth and role access. Route guards redirect rather than render 403s.

**API layer:** `api/` directory has one module per resource (auth, movie, show, theater, booking). All use axios with `withCredentials: true`. Errors are caught and logged per call; no global error interceptor.

**Key components:**
- `TicketModal.jsx` — Interactive seat grid showing available/booked/selected seats; used in the Booking page.
- `Navbar.jsx` — Conditionally shows admin/partner panel links based on Redux role.
- Route: `/movie/:id` → date strip → shows by theater → `/booking/:movieId` with seat picker.

### Data Models

| Model | Key fields |
|---|---|
| User | `name`, `email`, `password` (bcrypt), `role` (user/admin/partner), `otp`, `otpExpiry` |
| Movie | `title`, `description`, `language`, `genre`, `posterPath`, `releaseDate`, `duration`, `ratings` |
| Theater | `name`, `address`, `email`, `phone`, `isActive`, `owner` (→ User) |
| Show | `name`, `date`, `time`, `totalSeats`, `bookedSeats[]`, `ticketPrice`, `movie` (→ Movie), `theater` (→ Theater) |
| Booking | `user`, `show`, `seats[]`, `totalAmount`, `status` (confirmed/cancelled), `paymentId`, `orderId` |

## UI Framework

The frontend uses **Ant Design** (not Tailwind). Custom styles live in `client/src/App.css`. The user has a strict preference for neutral gray/white color schemes — avoid rose, green, and amber accents.
