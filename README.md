# AI News Intelligence Platform

This system is designed as a scalable AI intelligence platform, not just a news dashboard.

Production-grade platform to ingest, deduplicate, enrich, analyze, and broadcast AI news and research.

## 1. Product Overview

AI News Intelligence Platform continuously monitors AI company blogs, media, research, and communities, then transforms raw updates into curated intelligence.

Core outcomes:
- Multi-source ingestion (RSS, APIs, scraping, Reddit, arXiv, YouTube metadata)
- AI enrichment (summaries, tags, entity extraction, trend detection)
- Embedding-based semantic search and deduplication
- Favorites, broadcasting, and newsletter generation
- Real-time dashboard updates via SSE/WebSocket-ready pattern

## 2. Architecture

Detailed diagrams and data flows:
- [System Architecture](docs/architecture/system-architecture.md)
- [Data Flow Diagram](docs/architecture/data-flow.md)
- [Microservice Components](docs/architecture/microservices.md)

## 3. Repository Structure

```text
ai-news-intelligence/
  frontend/                 # Next.js dashboard
  backend/                  # FastAPI app and domain services
  workers/                  # Celery ingestion/enrichment/dedup tasks
  database/                 # SQL schema + migrations
  deployment/               # Dockerfiles and deployment templates
  docs/                     # Architecture, API, setup, testing, evaluation
  docker-compose.yml
```

## 4. Quick Start (Docker)

Prerequisites:
- Docker Desktop
- Docker Compose v2

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## 5. Environment Variables

Create `.env` in repository root:

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ai_news
DATABASE_URL=postgresql+psycopg://postgres:postgres@db:5432/ai_news
REDIS_URL=redis://redis:6379/0
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000

OPENAI_API_KEY=replace_me
ANTHROPIC_API_KEY=replace_me
GEMINI_API_KEY=replace_me
GROQ_API_KEY=replace_me

YOUTUBE_API_KEY=replace_me
REDDIT_CLIENT_ID=replace_me
REDDIT_CLIENT_SECRET=replace_me
GITHUB_TOKEN=replace_me
```

Use `.env.example` as the canonical template for local and hosted env setup.

## 6. Backend API (MVP Endpoints)

- `GET /health`
- `GET /api/v1/news`
- `POST /api/v1/news/refresh`
- `GET /api/v1/news/search?q=...`
- `GET /api/v1/trends`
- `GET /api/v1/favorites`
- `POST /api/v1/favorites`
- `DELETE /api/v1/favorites/{favorite_id}`
- `POST /api/v1/broadcast/{channel}`
- `GET /api/v1/stream` (SSE)
- `GET /api/v1/admin/sources`
- `POST /api/v1/admin/sources`
- `POST /api/v1/admin/refresh`
- `GET /api/v1/admin/ingestion-status`

See [API Spec](docs/api/endpoints.md).

## 7. Testing

Run from repo root:

```bash
docker compose exec backend pytest -q
```

Checklist and evaluation rubric:
- [Testing Checklist](docs/testing/testing-checklist.md)
- [Evaluation Prompt](docs/testing/evaluation-prompt.md)

## 8. Frontend Routes

- `/` Dashboard feed + analytics cards
- `/dashboard/analytics` Topic heatmap + company radar charts
- `/dashboard/admin` Admin quick actions to inspect source APIs

## 9. Real Source Connectors

`backend/app/services/connectors.py` includes multi-source feed adapters for:
- OpenAI, Google AI, DeepMind, Meta AI, Microsoft AI, Stability AI
- TechCrunch AI, VentureBeat AI, Wired, The Verge, MIT Technology Review
- Hacker News, Reddit r/MachineLearning, Product Hunt
- Papers With Code, arXiv cs.AI/cs.CL/cs.LG, Anthropic

## 10. One-Click Demo Start (Windows)

From repo root:

```bat
scripts\demo_start.bat
```

This starts backend + frontend and triggers a refresh automatically.

## 11. Hosting

- Render blueprint: [deployment/render.yaml](deployment/render.yaml)
- Hosting runbook: [deployment/hosting.md](deployment/hosting.md)
- Vercel GitHub auto-deploy workflow: [.github/workflows/vercel-deploy.yml](.github/workflows/vercel-deploy.yml)

### Vercel Token Setup (Local + GitHub)

Use a Vercel personal token scoped to your projects.

Windows (persist token to user environment):

```cmd
setx VERCEL_TOKEN "<your_new_token>"
```

Validate in a new terminal:

```cmd
vercel whoami --token %VERCEL_TOKEN%
```

For GitHub Actions, add these repository secrets (used by `.github/workflows/vercel-deploy.yml`):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Security note: if a token is ever exposed in chat, logs, or commits, revoke it immediately and create a new token.

## 12. Submission Deliverables Covered

- Architecture diagram and design docs
- Repo layout and module boundaries
- Database schema and ingestion pipeline design
- Backend API baseline with extensible service layers
- Frontend dashboard shell with analytics/favorites/newsletter modules
- Dockerized local deployment
- Testing and evaluation checklists
- Professional documentation package

## 13. Next Build Targets

1. Plug real source connectors in worker tasks.
2. Enable pgvector extension and semantic nearest-neighbor queries.
3. Add OAuth and multi-tenant user model.
4. Add production observability (OpenTelemetry, Prometheus, Grafana).
# AI-News-Intelligence-Platform 
