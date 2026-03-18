# Microservice Architecture

## Services

1. `gateway-api`
- Public REST + SSE interface.
- Auth, validation, orchestration.

2. `ingestion-worker`
- Source adapters (RSS/API/HTML/Reddit/arXiv/YouTube/GitHub).
- Retry, backoff, source rate limits.

3. `ai-enrichment-worker`
- Summarization, topic classification, entity extraction.
- Tag and score assignment.

4. `dedup-worker`
- Embedding generation and similarity clustering.
- Canonical story selection.

5. `trend-analytics-worker`
- Topic heatmap, company radar, model release timeline, industry pulse.

6. `broadcast-service`
- Channel adapters (email/linkedin/whatsapp/blog/newsletter).

## Communication Pattern

- Async tasks through Redis queues.
- Shared Postgres for durable state.
- Optional event bus abstraction for Kafka/NATS in scale-up phase.
