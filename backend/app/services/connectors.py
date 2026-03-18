from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from time import perf_counter

import feedparser
from bs4 import BeautifulSoup

SOURCE_FEEDS: list[dict[str, str]] = [
    {"name": "OpenAI", "url": "https://openai.com/news/rss.xml"},
    {"name": "Google AI", "url": "https://blog.google/technology/ai/rss/"},
    {"name": "DeepMind", "url": "https://deepmind.google/discover/blog/rss.xml"},
    {"name": "Meta AI", "url": "https://ai.facebook.com/blog/rss/"},
    {"name": "Microsoft AI", "url": "https://blogs.microsoft.com/ai/feed/"},
    {"name": "Stability AI", "url": "https://stability.ai/news/rss.xml"},
    {"name": "TechCrunch AI", "url": "https://techcrunch.com/category/artificial-intelligence/feed/"},
    {"name": "VentureBeat AI", "url": "https://venturebeat.com/category/ai/feed/"},
    {"name": "Wired", "url": "https://www.wired.com/feed/tag/ai/latest/rss"},
    {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml"},
    {"name": "MIT Tech Review", "url": "https://www.technologyreview.com/topic/artificial-intelligence/feed/"},
    {"name": "Hacker News", "url": "https://hnrss.org/frontpage"},
    {"name": "Reddit ML", "url": "https://www.reddit.com/r/MachineLearning/.rss"},
    {"name": "Product Hunt", "url": "https://www.producthunt.com/feed"},
    {"name": "Papers With Code", "url": "https://paperswithcode.com/rss/latest"},
    {"name": "arXiv cs.AI", "url": "https://export.arxiv.org/rss/cs.AI"},
    {"name": "arXiv cs.CL", "url": "https://export.arxiv.org/rss/cs.CL"},
    {"name": "arXiv cs.LG", "url": "https://export.arxiv.org/rss/cs.LG"},
    {"name": "GitHub Trending AI", "url": "https://github.com/trending/python?since=daily&spoken_language_code=en"},
    {"name": "Anthropic", "url": "https://www.anthropic.com/news/rss.xml"},
]


def _strip_html(text: str | None) -> str:
    if not text:
        return ""
    soup = BeautifulSoup(text, "html.parser")
    return " ".join(soup.get_text(" ").split())


def _parse_published(raw: str | None) -> datetime:
    if not raw:
        return datetime.now(timezone.utc)
    try:
        dt = parsedate_to_datetime(raw)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def _infer_tags(text: str) -> list[str]:
    lowered = text.lower()
    taxonomy = {
        "LLMs": ["llm", "language model", "gpt", "gemini", "claude"],
        "Agents": ["agent", "autonomous"],
        "Computer Vision": ["vision", "image", "multimodal"],
        "AI Safety": ["safety", "alignment", "risk"],
        "AI Policy": ["policy", "regulation", "governance"],
        "Research": ["arxiv", "paper", "benchmark"],
    }
    tags: list[str] = []
    for tag, terms in taxonomy.items():
        if any(term in lowered for term in terms):
            tags.append(tag)
    return tags or ["AI News"]


def fetch_latest(max_items_per_source: int = 5) -> list[dict]:
    items, _ = fetch_latest_with_status(max_items_per_source=max_items_per_source)
    return items


def fetch_latest_with_status(max_items_per_source: int = 5) -> tuple[list[dict], list[dict]]:
    normalized: list[dict] = []
    status_rows: list[dict] = []
    for source in SOURCE_FEEDS:
        started = perf_counter()
        try:
            parsed = feedparser.parse(source["url"], request_timeout=2)
        except Exception:
            status_rows.append(
                {
                    "source": source["name"],
                    "url": source["url"],
                    "status": "fail",
                    "latency_ms": int((perf_counter() - started) * 1000),
                    "items": 0,
                    "error": "fetch_error",
                }
            )
            continue

        entries = getattr(parsed, "entries", [])[:max_items_per_source]
        for entry in entries:
            title = (entry.get("title") or "Untitled").strip()
            summary = _strip_html(entry.get("summary", ""))[:700]
            content = _strip_html(entry.get("description", ""))[:2000]
            link = (entry.get("link") or "").strip()
            text = f"{title} {summary}"
            normalized.append(
                {
                    "title": title,
                    "summary": summary,
                    "content": content,
                    "url": link,
                    "author": entry.get("author"),
                    "source": source["name"],
                    "source_url": source["url"],
                    "source_type": "rss",
                    "tags": _infer_tags(text),
                    "entities": {},
                    "score": 60 + len(summary) / 60,
                    "trend_score": 0,
                    "published_at": _parse_published(entry.get("published") or entry.get("updated")),
                }
            )

        status_rows.append(
            {
                "source": source["name"],
                "url": source["url"],
                "status": "success" if len(entries) > 0 else "fail",
                "latency_ms": int((perf_counter() - started) * 1000),
                "items": len(entries),
                "error": "" if len(entries) > 0 else "no_entries",
            }
        )

    return [item for item in normalized if item.get("url")], status_rows
