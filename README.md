<<<<<<< HEAD
# BloodBond Full Stack Project

React + Vite frontend, Node + Express backend, MongoDB database.

## Quick Start (Local)

### Backend
```powershell
cd backend
npm install
node server.js
```

### Frontend
```powershell
cd ..
npm install
npm run dev
```

### Environment
`backend/.env`
```env
MONGO_URI=mongodb://127.0.0.1:27017/bloodDonationDB
JWT_SECRET=your_secret_key
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Root `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## Docker Setup

Run all services (frontend + backend + MongoDB):
```powershell
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## API Docs (Swagger)

Interactive API docs available at:
`http://localhost:5000/api-docs`

## Tests

Backend tests:
```powershell
cd backend
npm test
```

Includes:
- API validation tests
- Middleware unit test (rate limit)
=======
# bloodbond-platform
Full-stack blood donation platform with real-time donor matching, OAuth-secured backend, Redis caching, and scalable system design.
>>>>>>> 6e4095cd8da23372aa774faaffab38ff6be817de
