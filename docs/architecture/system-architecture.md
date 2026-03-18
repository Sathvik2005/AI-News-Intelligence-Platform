# System Architecture Diagram

```mermaid
flowchart TD
    A[External Sources\nOpenAI, Google AI, arXiv, Reddit, HN, YouTube, Tech Media] --> B[Ingestion Service]
    B --> C[Normalization Service]
    C --> D[AI Processing Engine\nsummary, tags, entities, scoring]
    D --> E[Embedding Service]
    E --> F[(PostgreSQL + pgvector)]
    D --> F
    F --> G[API Gateway / FastAPI]
    G --> H[Next.js Dashboard]
    G --> I[Broadcast Service\nEmail, LinkedIn, WhatsApp, Blog, Newsletter]
    F --> J[Trend Analytics Engine]
    J --> G
    K[Redis + Celery] --> B
    K --> D
    K --> E
```

## Runtime Components

- API Service: serves news, search, favorites, trends, broadcast endpoints.
- Worker Service: scheduled ingestion, enrichment, deduplication, scoring.
- Database: transactional and analytical storage.
- Redis: queueing and caching.
- Frontend: operator-facing dashboard and controls.
