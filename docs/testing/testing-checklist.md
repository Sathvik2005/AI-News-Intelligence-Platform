# Evaluation + Testing Checklist

## Functional

- [ ] Ingests from at least 20 configured sources.
- [ ] Normalizes source data into unified schema.
- [ ] Deduplicates near-identical stories using embeddings.
- [ ] News feed supports search, filters, sort-by-score.
- [ ] Favorites persist in database.
- [ ] Broadcast actions produce valid payloads/content.
- [ ] Newsletter builder exports Markdown and HTML digest.
- [ ] Trend widgets render topic/company/paper/model metrics.

## API Quality

- [ ] Endpoints return stable contracts with schema validation.
- [ ] Pagination and filtering behave consistently.
- [ ] Error payloads include code, message, correlation ID.
- [ ] OpenAPI docs match implementation.

## AI/ML Quality

- [ ] Summaries are concise, factual, non-hallucinated.
- [ ] Topic tags match article intent.
- [ ] Entity extraction catches companies/models/papers.
- [ ] Dedup precision >= 0.90 on labeled sample.

## Reliability

- [ ] Worker retries with exponential backoff.
- [ ] Dead-letter handling exists for failed jobs.
- [ ] Idempotency protects reprocessing duplicates.
- [ ] Refresh pipeline is schedulable and observable.

## Security

- [ ] Secrets managed through env vars/secrets manager.
- [ ] Input validation and URL sanitization in scrapers.
- [ ] Authentication + authorization for admin endpoints.
- [ ] Rate limiting enabled for external-facing APIs.

## Performance

- [ ] Feed endpoint p95 under 500 ms (cached).
- [ ] Search endpoint p95 under 800 ms.
- [ ] Dashboard first meaningful paint under 1.5 s.
- [ ] Ingestion-to-visibility latency under 15 min.

## Deployment

- [ ] `docker compose up --build` succeeds on clean machine.
- [ ] Health checks pass for all services.
- [ ] Data volumes persist across restarts.
- [ ] Logs and metrics are accessible.
