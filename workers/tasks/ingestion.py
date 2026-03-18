from tasks.worker_app import celery_app
import feedparser


SOURCE_FEEDS = [
    "https://openai.com/news/rss.xml",
    "https://blog.google/technology/ai/rss/",
    "https://deepmind.google/discover/blog/rss.xml",
    "https://techcrunch.com/category/artificial-intelligence/feed/",
    "https://export.arxiv.org/rss/cs.AI",
    "https://www.reddit.com/r/MachineLearning/.rss",
]


@celery_app.task(name="tasks.ingestion.fetch_sources")
def fetch_sources() -> dict:
    fetched = 0
    for feed_url in SOURCE_FEEDS:
        parsed = feedparser.parse(feed_url)
        fetched += len(getattr(parsed, "entries", [])[:5])
    return {"status": "ok", "fetched": fetched}
