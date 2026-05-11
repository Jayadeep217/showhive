# ShowHive

A full-stack movie ticket booking application built on the MERN stack. Users can browse movies, select shows by date and theater, pick seats interactively, and receive booking confirmation emails. The platform supports three user roles — **admin**, **partner** (theater owner), and **user** — each with their own dashboard and access controls.

---

## Features

- **Movie browsing** — grid of movies with poster, genre, language, duration, and rating
- **Interactive seat selection** — real-time grid showing available and booked seats
- **Booking flow** — 7-day date strip → show selection → seat picker → confirmation
- **My Bookings** — chronological history of all past bookings with seat tags
- **Role-based dashboards**
  - Admin: manage movies (CRUD), approve/block theater partners
  - Partner: register theaters, schedule shows, manage seat inventory
- **Email notifications** — booking confirmation and OTP password-change emails via Resend SMTP
- **Secure authentication** — JWT in HTTP-only cookies, bcrypt password hashing, OTP-verified password change

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Ant Design 6, Redux Toolkit, React Router 7 |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose 9 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Email | Nodemailer + Resend SMTP |
| HTTP client | Axios (withCredentials) |

---

## Project Structure

```
showhive/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # Axios API modules per resource
│       ├── components/  # Navbar, MovieCard, ProtectedRoute
│       ├── config/      # API URL constants
│       ├── hooks/       # useLogout custom hook
│       ├── pages/       # Home, Movie, Booking, Bookings, Profile, Admin, Partner
│       └── redux/       # store + userSlice
└── server/          # Express REST API
    ├── controllers/ # Business logic
    ├── middlewares/ # authorize, requireRole
    ├── models/      # Mongoose schemas
    ├── routes/      # Express routers
    └── utils/       # email.utils.js, date.utils.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 1. Clone the repository

```bash
git clone https://github.com/jayadeep217/showhive.git
cd showhive
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env   # or create .env manually
```

Required variables in `server/.env`:

```env
SERVER_PORT=54325
MONGODB_CONNECTION_URI=mongodb://localhost:27017/showhive
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=1d

# Resend API key — get one free at resend.com/api-keys
EMAIL_PASS=re_xxxxxxxxxxxxxxxxxxxx

# Dev only: redirect all emails to this address (remove in production)
EMAIL_TO_OVERRIDE=you@example.com
```

### 3. Install dependencies and start the backend

```bash
cd server
npm install
node index.js          # or: npx nodemon index.js
```

### 4. Install dependencies and start the frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## User Roles

| Role | How to set | Access |
|---|---|---|
| `user` | Default on registration | Browse movies, book tickets, view bookings, change password |
| `partner` | Set in MongoDB | Register theaters, add/edit shows (requires admin approval) |
| `admin` | Set in MongoDB | Manage movies, approve/block partners |

To make a user an admin, update their `role` field directly in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, sets JWT cookie |
| GET | `/api/auth/user` | user | Get current user |
| POST | `/api/auth/logout` | user | Clear JWT cookie |
| POST | `/api/auth/otp/request` | user | Send OTP to email |
| POST | `/api/auth/otp/verify` | user | Change password with OTP |
| GET | `/api/movies` | — | List all movies |
| POST | `/api/movies/create` | admin | Add a movie |
| GET | `/api/theaters` | — | List approved theaters |
| POST | `/api/theaters/create` | partner | Register a theater |
| GET | `/api/shows/movie/:movieId` | — | Shows for a movie |
| POST | `/api/shows/create` | partner | Create a show |
| POST | `/api/bookings/create` | user | Book seats |
| GET | `/api/bookings/user` | user | User's booking history |

---

## Environment — Production

When deploying, set the following on your hosting platform (e.g. Render for the backend, Netlify for the frontend):

- **Backend (Render):** `MONGODB_CONNECTION_URI`, `JWT_SECRET`, `CLIENT_URL` (Netlify URL), `EMAIL_PASS`
- **Frontend (Netlify):** `VITE_API_URL` (Render URL); add `_redirects` file with `/* /index.html 200`
- Remove `EMAIL_TO_OVERRIDE` from production so emails reach real users

---

## License

ISC
