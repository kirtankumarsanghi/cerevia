# Cerevia

Cerevia is a mental wellness web app with a calm, dashboard-style interface and
multi-page flow for:

- Home
- Mood tracking
- AI chat support
- Daily journaling
- Ritual tasks
- Support resources
- Breathing exercises

## Project Structure

- frontend: React + Vite UI
- backend: Express + MongoDB API

## Run Frontend

1. Open terminal in frontend
2. Install dependencies:
	npm install
3. Start:
	npm run dev

## Run Backend

1. Open terminal in backend
2. Install dependencies:
	npm install
3. Create a .env file:
	PORT=5000
	MONGO_URI=mongodb://127.0.0.1:27017/cerevia
4. Start:
	npm run dev

Frontend expects backend at http://localhost:5000/api by default.
