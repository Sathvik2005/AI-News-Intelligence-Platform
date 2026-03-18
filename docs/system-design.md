# AI News Intelligence Platform - Startup-Grade System Design

## 1. Product Overview

AI News Intelligence Platform is a multi-tenant intelligence product that discovers, enriches, and distributes high-impact AI developments from blogs, media, communities, research hubs, and code ecosystems.

Primary user outcomes:
- detect high-signal AI updates quickly
- filter noise through relevance ranking and deduplication
- convert insights into broadcasts and newsletters
- track trends by topic, company, model, and research velocity

## 2. Architecture

Architecture style:
- event-driven microservices with asynchronous workers
- API gateway for frontend and external integrations
- shared operational datastore with vector extension for semantic capabilities

Core components:
- ingestion service
- normalization service
- AI enrichment service
- embeddings + semantic index service
- deduplication and clustering service
- trend analytics service
- broadcast service
- newsletter service
- dashboard frontend
- admin/control panel

Reference diagrams:
- docs/architecture/system-architecture.md
- docs/architecture/data-flow.md
- docs/architecture/microservices.md

## 3. System Design

### Ingestion Engine
- Connectors: RSS, REST APIs, HTML parser, Reddit API, arXiv API, YouTube data API, GitHub trending.
- Scheduling: Celery beat/cron cadence per source tier.
- Reliability: source-specific retry policy, circuit breaker, exponential backoff.
- Compliance: robots.txt and source-specific scraping constraints.

### AI Processing Engine
- Summarization: LLM-generated concise summaries with guardrails.
- Classification: hierarchical topic taxonomy and confidence scores.
- Extraction: entities (companies, models, papers, people), sentiment, intent tags.
- Scoring: weighted relevance score from authority, recency, novelty, engagement proxies.

### Deduplication + Clustering
- Embeddings generated per normalized article.
- ANN candidate retrieval from pgvector index.
- cosine similarity threshold-based duplicate marking.
- canonical story chosen by authority + completeness + recency.

### Trend Analytics Engine
- Topic heatmap over sliding windows.
- Company mention radar.
- Model release timeline.
- AI Industry Pulse: LLM-generated daily executive brief.

### Real-Time Delivery
- SSE for feed/trend refresh.
- WebSocket optional for high-frequency collaboration events.

### Admin Panel
- Source lifecycle management.
- API key vault references.
- pipeline controls and replay jobs.
- analytics and queue health.

## 4. Database Schema

Implemented in database/schema.sql.

Tables:
- sources
- users
- news_items
- news_embeddings
- favorites
- broadcast_logs
- newsletter_history
- trend_metrics

Key design choices:
- UUID primary keys for distributed operations.
- JSONB for extensible entities/metrics payloads.
- vector(1536) for embedding similarity.
- GIN indexes for tags/entities queries.

## 5. Backend APIs

Framework: FastAPI.

Current endpoint groups:
- health: /health
- news: list, search, refresh
- favorites: create, list, delete
- trends: metrics and pulse output
- broadcast: channel-targeted payload generation
- stream: SSE endpoint for live updates

API docs:
- docs/api/endpoints.md

## 6. Frontend Design

Framework: Next.js App Router + React + Tailwind.

Core UX modules:
- News Feed cards with score, source, tags, actions.
- Trend widgets (topic heatmap, company radar, pulse).
- Favorites and newsletter sections (expandable in next iteration).
- responsive card/grid system with mobile support.

Implemented baseline:
- frontend/app/page.tsx
- frontend/components/NewsCard.tsx

## 7. AI Features

Implemented baseline + extension points:
- AI summarization interface in enrichment worker
- semantic search endpoint placeholder wired to service layer
- dedup worker skeleton for embedding similarity flow
- trend response model for heatmap/radar/timeline/pulse outputs

Planned advanced features:
- paper-to-news linking graph
- model release tracker with source confidence
- funding event detector
- knowledge graph (company-paper-model relationships)

## 8. Deployment

Containerized architecture in docker-compose.yml:
- frontend
- backend
- worker
- postgres
- redis

Ready for cloud evolution:
- Render/Fly.io: service split deployment
- AWS: ECS Fargate or EKS, RDS Postgres, ElastiCache Redis

## 9. Testing

Current baseline:
- backend unit/API tests in backend/tests

Recommended full testing matrix:
- unit tests: source parsers, scoring, dedup threshold behavior
- API tests: contract and validation coverage
- integration tests: end-to-end ingest -> enrich -> query -> broadcast
- load tests: feed/search p95 latencies

Checklist:
- docs/testing/testing-checklist.md

## 10. Documentation

Delivery artifacts:
- README.md
- architecture docs
- API endpoint doc
- testing checklist
- evaluation prompt for assessors

Submission quality goals:
- reproducible setup
- clear modular design
- measurable quality gates
- production-oriented extension points
