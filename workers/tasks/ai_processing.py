from tasks.worker_app import celery_app


@celery_app.task(name="tasks.ai_processing.enrich_news")
def enrich_news(news_id: str) -> dict:
    # Replace with LLM summarization, classification, and entity extraction.
    return {"status": "ok", "news_id": news_id}
