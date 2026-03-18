from tasks.worker_app import celery_app


@celery_app.task(name="tasks.dedup.mark_duplicates")
def mark_duplicates(news_id: str) -> dict:
    # Replace with embedding-based duplicate detection.
    return {"status": "ok", "news_id": news_id, "is_duplicate": False}
