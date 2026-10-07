# 🩸 BloodBond - Full Stack Blood Donation Platform

A full-stack blood donation management system connecting **donors**, **blood banks**, and **patients** with transparency, speed, and trust. Built with React + Vite frontend, Node.js + Express backend, and MongoDB.

---

## Features

### Public Features
- **Find Blood** — Search blood availability by blood group, state, and district
- **Community Stories** — Testimonials from donors, recipients, and blood banks
- **AI Assistant** — Floating chat widget on every page answering questions about donation eligibility, requests, stock, events and rewards (`POST /api/ai/assistant`)
- **Rewards & Recognition** — Bronze, Silver, Gold donor tiers
- **Public Events** — Browse upcoming blood donation drives

### Role-Based Dashboards

| Role | Capabilities |
|------|-------------|
| **Admin** | Dashboard with stats (users, donors, requests, stock), manage users, manage donors, manage blood requests (approve/reject), manage events (CRUD), view reports, manage benefits |
| **Blood Bank** | Complete profile management, update blood stock levels, view approved requests, fulfill requests (with stock deduction) |
| **User** | Raise blood requests, register as a donor |

### Technical Features
- **JWT Authentication** with role-based authorization (`admin`, `bloodbank`, `user`)
- **Rate Limiting** — In-memory rate limiter on auth endpoints (10 requests per 15 min)
- **In-Memory Request Throttling** for sensitive routes
- **MongoDB Aggregation** for public blood stock search with geospatial-like filtering
- **Mongoose Transactions** for atomic stock fulfillment operations
- **Swagger/OpenAPI** documentation at `/api-docs`
- **Docker** Compose setup with 3 services (frontend, backend, MongoDB)
- **Seed Script** for demo users

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, React Router v7, Tailwind CSS v4, Vite 7, Axios |
| **Backend** | Node.js, Express 5, Mongoose 9, JSON Web Token, bcryptjs |
| **Database** | MongoDB 7 |
| **Documentation** | Swagger UI Express, OpenAPI 3.0 |
| **Containerization** | Docker, Docker Compose |
| **Testing** | Node.js built-in test runner |

---

## Project Structure

```
bloodbond-platform/
├── backend/
│   ├── controllers/
│   │   └── authController.js       # Register & login logic
│   ├── docs/
│   │   └── openapi.js              # OpenAPI 3.0 spec
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT + role verification
│   │   └── rateLimit.js            # In-memory rate limiter
│   ├── models/
│   │   ├── BloodBank.js            # Blood bank profile
│   │   ├── BloodRequest.js         # Blood request (pending/approved/rejected/fulfilled)
│   │   ├── BloodStock.js           # Per-bank blood group stock
│   │   ├── Donor.js                # Donor registration
│   │   ├── Event.js                # Community events
│   │   └── User.js                 # User auth (admin/bloodbank/user)
│   ├── routes/
│   │   ├── adminRoutes.js          # Admin: users, stats, donors, approve/reject
│   │   ├── authRoutes.js           # POST /register, POST /login
│   │   ├── bloodbankRoutes.js      # Profile, stock CRUD, fulfill requests
│   │   ├── eventsRoutes.js         # Public GET + admin CRUD
│   │   ├── publicRoutes.js         # Public blood stock search
│   │   └── userRoutes.js           # Request blood, donate (register as donor)
│   ├── tests/
│   │   ├── api.validation.test.js  # API validation test suite
│   │   └── rateLimit.test.js       # Rate limiter unit test
│   ├── app.js                      # Express app factory
│   ├── server.js                   # MongoDB connect + server start
│   ├── seed.js                     # Demo user seeder
│   ├── Dockerfile
│   └── package.json
├── src/
│   ├── components/
│   │   ├── AdminNavbar.jsx         # Admin dashboard navigation
│   │   ├── Footer.jsx              # Site-wide footer
│   │   ├── Navbar.jsx              # Public & authenticated navigation
│   │   └── ProtectedRoute.jsx      # Role-based route guard
│   ├── pages/
│   │   ├── Home.jsx                # Landing page with stats & features
│   │   ├── Login.jsx               # Login with demo credentials
│   │   ├── Register.jsx            # User registration
│   │   ├── FindBlood.jsx           # Public blood stock search
│   │   ├── Community.jsx           # Community stories
│   │   ├── Rewards.jsx             # Donor rewards
│   │   ├── PublicEvents.jsx        # Public event listing
│   │   ├── PublicEventDetails.jsx  # Single event details
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx  # Stats overview
│   │   │   ├── AdminUsers.jsx      # User management
│   │   │   ├── ManageDonors.jsx    # Donors list
│   │   │   ├── ManageRequests.jsx  # Approve/reject requests
│   │   │   ├── ManageEvents.jsx    # CRUD events
│   │   │   ├── EventDetails.jsx    # Event detail/edit
│   │   │   ├── Reports.jsx         # Reports view
│   │   │   └── AdminBenefit.jsx    # Benefits management
│   │   ├── bloodbank/
│   │   │   └── BloodbankDashboard.jsx  # Profile, stock, fulfill
│   │   └── user/
│   │       ├── UserDashboard.jsx       # Choose request/donate
│   │       ├── RequestBlood.jsx        # Raise blood request
│   │       └── DonateBlood.jsx         # Register as donor
│   ├── services/
│   │   ├── api.js                  # Axios instance with JWT interceptor
│   │   └── auth.js                 # Login, register, logout helpers
│   └── data/
│       ├── indiaStates.js          # State-district mapping
│       └── mockBloodBanks.js       # Mock data (fallback)
├── docker-compose.yml              # 3-service orchestration
├── Dockerfile                      # Frontend container
├── vite.config.js
└── package.json
```

## Architecture Overview

### Three-Role Access Control

```
                    ┌─────────────┐
                    │   /login    │
                    │   /register │
                    └──────┬──────┘
                           │ JWT token
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        ┌─────────┐  ┌──────────┐  ┌────────┐
        │  Admin  │  │Blood Bank│  │  User  │
        └────┬────┘  └─────┬────┘  └───┬────┘
             │             │           │
    ┌────────┴────────┐    │    ┌──────┴──────┐
    │ • Manage users  │    │    │ • Request   │
    │ • View donors   │    │    │   blood     │
    │ • Approve/reject│    │    │ • Register  │
    │   requests      │    │    │   as donor  │
    │ • CRUD events   │    │    │             │
    │ • Reports       │    │    │             │
    └─────────────────┘    │    └─────────────┘
                           │
                  ┌────────┴────────┐
                  │ • Profile mgmt  │
                  │ • Update stock  │
                  │ • Fulfill reqs  │
                  └─────────────────┘
```

### Blood Request Lifecycle

```
User raises request → Admin approves → Blood bank fulfills (stock deducted)
    [pending]           [approved]              [fulfilled]
```

---

## Quick Start

### Prerequisites

- **Node.js** >= 20
- **npm** >= 9
- **MongoDB** >= 7 (local or Docker)
- **Docker** & **Docker Compose** (optional, for containerized setup)

### Option 1: Local Development

#### 1. Backend Setup

```powershell
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/bloodDonationDB
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Start the backend server:

```powershell
node server.js
```

#### 2. Seed Demo Users (Optional)

```powershell
cd backend
node seed.js
```

Creates 3 users:
- **Admin** — `admin@demo.com` / `admin123`
- **Blood Bank** — `bank@demo.com` / `bank123`
- **User** — `user@demo.com` / `user123`

#### 3. Frontend Setup

In the project root:

```powershell
npm install
```

Create root `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```powershell
npm run dev
```

Open http://localhost:5173 in your browser.

### Option 2: Docker (3 Services)

Run all services (frontend + backend + MongoDB) with a single command:

```powershell
docker compose up --build
```

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend**  | http://localhost:5000 |
| **MongoDB**  | mongodb://localhost:27017 |

---

## Demo Credentials

After seeding or deploying with Docker, use these credentials on the login page:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@demo.com` | `admin123` |
| **Blood Bank** | `bank@demo.com` | `bank123` |
| **User** | `user@demo.com` | `user123` |

The login page has a **"Demo Credentials"** section with auto-fill buttons for quick access.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/bloodDonationDB` | MongoDB connection string |
| `JWT_SECRET` | `your_secret_key` | Secret for signing JWT tokens |
| `PORT` | `5000` | Backend server port |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated allowed origins |
| `AI_API_KEY` | _(unset)_ | API key for the AI assistant. Any OpenAI-compatible provider (OpenAI, Groq, OpenRouter, Ollama). Unset = built-in local answers |
| `AI_BASE_URL` | `https://api.openai.com/v1` | OpenAI-compatible endpoint base URL |
| `AI_MODEL` | `gpt-4o-mini` | Model used by the assistant |

### Frontend (root `.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |

### Docker Compose Variables

The `docker-compose.yml` sets these automatically for the backend service:

- `MONGO_URI`: `mongodb://mongo:27017/bloodDonationDB`
- `JWT_SECRET`: `docker_jwt_secret_change_me`
- `CORS_ORIGINS`: `http://localhost:5173,http://127.0.0.1:5173`
- `VITE_API_URL`: `http://localhost:5000/api`
- `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`: forwarded from the host shell so the assistant works in Docker too

---

## API Documentation

Interactive Swagger UI docs are available when the backend is running:

```
http://localhost:5000/api-docs
```

### Key API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT token |
| GET | `/api/public/blood-stock` | No | Search blood availability |
| GET | `/api/events` | No | List all events |
| GET | `/api/events/:id` | No | Get event details |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/users` | Admin | List all users |
| GET | `/api/admin/donors` | Admin | List all donors |
| GET | `/api/admin/requests` | Admin | Pending requests |
| POST | `/api/admin/approve/:id` | Admin | Approve blood request |
| POST | `/api/admin/reject/:id` | Admin | Reject blood request |
| POST | `/api/events` | Admin | Create event |
| PUT | `/api/events/:id` | Admin | Update event |
| DELETE | `/api/events/:id` | Admin | Delete event |
| GET | `/api/bloodbank/profile` | Blood Bank | Get blood bank profile |
| PUT | `/api/bloodbank/profile` | Blood Bank | Update blood bank profile |
| POST | `/api/bloodbank/stock` | Blood Bank | Add blood stock |
| GET | `/api/bloodbank/stock` | Blood Bank | View own stock |
| GET | `/api/bloodbank/requests` | Blood Bank | View approved requests |
| POST | `/api/bloodbank/fulfill/:id` | Blood Bank | Fulfill request (deducts stock) |
| POST | `/api/user/request` | User | Create blood request |
| GET | `/api/user/requests` | User | View own requests |
| POST | `/api/user/donate` | User | Register as donor |

---

## Testing

Backend tests use Node.js built-in test runner:

```powershell
cd backend
npm test
```

Test suites:
- **`api.validation.test.js`** — Validates register/login request validation (missing fields, invalid email, duplicate email, short password)
- **`rateLimit.test.js`** — Verifies the in-memory rate limiter blocks requests after exceeding the limit

---

## License

This project is licensed under the ISC License.

