# Setup Guide

## Local Docker Setup

1. Copy `.env.example` to `.env`.
2. Set API keys for your chosen LLM provider.
3. Run:

```bash
docker compose up --build
```

4. Validate services:
- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/health
- OpenAPI: http://localhost:8000/docs

## Local Dev Without Docker

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Worker

```bash
cd workers
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
celery -A tasks.worker_app:celery_app worker --loglevel=info
```
