import os
from celery import Celery

redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery("ai_news_workers", broker=redis_url, backend=redis_url)
celery_app.conf.task_routes = {
    "tasks.ingestion.fetch_sources": {"queue": "ingestion"},
    "tasks.ai_processing.enrich_news": {"queue": "ai"},
    "tasks.dedup.mark_duplicates": {"queue": "dedup"},
}
