# Data Flow

```mermaid
sequenceDiagram
    participant S as Source Connectors
    participant Q as Queue (Redis/Celery)
    participant W as Worker Pipeline
    participant V as Vector Store (pgvector)
    participant DB as PostgreSQL
    participant API as FastAPI
    participant UI as Next.js

    S->>Q: push raw stories
    Q->>W: fetch + parse + normalize
    W->>W: summarize + classify + extract entities
    W->>V: upsert embedding
    W->>V: semantic similarity lookup
    V-->>W: nearest candidates
    W->>DB: insert/update item + duplicate flag + score
    UI->>API: get feed/search/trends/favorites
    API->>DB: query + aggregate
    API-->>UI: structured JSON/SSE updates
```

## Dedup Logic

- Candidate generation via embedding nearest neighbors.
- Duplicate threshold: cosine similarity >= 0.90.
- Tie-breaker priority: source authority > recency > content depth.
