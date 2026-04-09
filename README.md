# Cerivia

Cerivia is a full-stack mental wellness platform focused on daily self-reflection,
emotional tracking, and practical support tools.

Brand line: Understand Your Mind, Elevate Your Life.

## Core Features

- Google-based authentication flow
- Personal dashboard with live wellness insights
- Mood logging and trend visualization
- Guided breathing sessions and grounding routines
- Journal writing with history management
- Task planning with completion tracking
- Support section with emergency and helpline links
- In-app chat support with persisted conversation history
- Analytics page that combines moods, tasks, journals, and chat activity

## Tech Stack

Frontend
- React 18
- Vite 5
- React Router
- Google OAuth client

Backend
- Node.js
- Express 4
- MongoDB + Mongoose
- Google Auth Library

## Repository Structure

```text
cerivia/
	backend/                Express API + MongoDB models/routes
		config/
		models/
		routes/
		server.js
	frontend/               React Vite application
		public/
		src/
			api/
			auth/
			components/
			pages/
	package.json            Root scripts for running both apps together
```

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- MongoDB local instance or hosted MongoDB URI
- Google OAuth Client ID

## Environment Configuration

Create these environment files before running the app.

Backend: backend/.env

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cerevia
GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Frontend: frontend/.env

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Notes
- If `VITE_API_URL` is not set, frontend defaults to `http://localhost:5000/api`.
- Google Client ID should match on frontend and backend.

## Installation

Install dependencies at all levels:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

## Run The Project

Run both backend and frontend together from root:

```bash
npm run dev
```

Default local URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API base: http://localhost:5000/api

Run services individually:

```bash
# Backend only
npm --prefix backend run dev

# Frontend only
npm --prefix frontend run dev -- --host
```

## Build And Preview

Build frontend from root:

```bash
npm run build
```

Preview frontend build:

```bash
npm --prefix frontend run preview
```

Run backend in production mode:

```bash
npm --prefix backend run start
```

## Scripts Reference

Root scripts
- `npm run dev`: starts backend and frontend concurrently
- `npm run build`: builds frontend
- `npm run start`: starts backend in production mode

Backend scripts
- `npm run dev`: starts backend with nodemon
- `npm run start`: starts backend with node

Frontend scripts
- `npm run dev`: starts Vite dev server
- `npm run build`: builds production assets
- `npm run preview`: previews built assets

## API Overview

Authentication
- `POST /api/auth/google`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Mood
- `GET /api/moods`
- `POST /api/moods`

Journals
- `GET /api/journals`
- `POST /api/journals`
- `PATCH /api/journals/:id`
- `DELETE /api/journals/:id`

Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle`
- `DELETE /api/tasks/:id`

Chat
- `GET /api/chat`
- `POST /api/chat`
- `PATCH /api/chat/:id`
- `DELETE /api/chat/:id`
- `DELETE /api/chat`

## Data Scope And Auth Behavior

- Frontend stores the current signed-in user in localStorage.
- API requests include `x-user-id` when a logged-in user exists.
- Backend validates user and object IDs to avoid malformed request failures.
- User-scoped data is isolated per account for moods, journals, tasks, and chat.

## Troubleshooting

Dev server does not start
- Ensure `npm install` has been run in root, backend, and frontend.
- Check for port conflicts on 5000 and 5173.
- Stop stale node processes and retry.

Google login fails
- Verify `GOOGLE_CLIENT_ID` in `backend/.env`.
- Verify `VITE_GOOGLE_CLIENT_ID` in `frontend/.env`.
- Ensure the same client ID is used on both sides.

Frontend cannot reach backend
- Confirm backend is running on port 5000.
- Confirm `VITE_API_URL` points to the correct backend API base.
- Check browser console and network tab for request errors.

MongoDB connection fails
- Confirm MongoDB is running and reachable.
- Verify `MONGO_URI` format and credentials.

## Project Status

The current codebase includes:
- Refined Cerivia branding and typography updates
- Unified button styling system across pages
- Stabilized chat routes and analytics data loading behavior
- Expanded dashboard and analytics UX improvements

## License

No license file is currently defined in this repository.
