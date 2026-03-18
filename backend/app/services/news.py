from datetime import datetime, timezone
from uuid import uuid4

from app.schemas.api import FavoriteCreate, FavoriteResponse, NewsResponse, TrendResponse
from app.services.connectors import fetch_latest_with_status, SOURCE_FEEDS
from app.db import store

_FAKE_FAVORITES: dict[str, FavoriteResponse] = {}
_INGESTED_CACHE: list[NewsResponse] = []
_LAST_INGESTION_STATUS: list[dict] = [
    {"source": s["name"], "url": s["url"], "status": "unknown", "latency_ms": 0, "items": 0, "error": ""}
    for s in SOURCE_FEEDS
]


def get_news(limit: int, offset: int, query: str | None = None) -> list[NewsResponse]:
    sample = [
        NewsResponse(
            id="news-1",
            title="OpenAI introduces new reasoning model",
            summary="A model optimized for multi-step reasoning and agent workflows.",
            source="OpenAI",
            url="https://openai.com",
            tags=["LLMs", "Agents"],
            score=96.2,
            published_at=datetime.now(timezone.utc),
        ),
        NewsResponse(
            id="news-2",
            title="DeepMind shares multimodal research update",
            summary="New benchmark improvements in multimodal understanding.",
            source="DeepMind",
            url="https://deepmind.google",
            tags=["Research", "Multimodal"],
            score=91.5,
            published_at=datetime.now(timezone.utc),
        ),
    ]
    if store.db_available():
        rows = store.list_news(limit=limit, offset=offset, q=query)
        return [NewsResponse(**row) for row in rows]

    if _INGESTED_CACHE:
        rows = _INGESTED_CACHE[offset : offset + limit]
        if query:
            lowered = query.lower()
            rows = [n for n in rows if lowered in n.title.lower() or lowered in n.summary.lower()]
        return rows

    rows = sample[offset : offset + limit]
    if query:
        lowered = query.lower()
        rows = [n for n in rows if lowered in n.title.lower() or lowered in n.summary.lower()]
    return rows


def search_news(query: str) -> list[NewsResponse]:
    if store.db_available():
        try:
            rows = store.semantic_search_news(query=query, limit=20)
            if rows:
                return [NewsResponse(**row) for row in rows]
        except Exception:
            pass

    candidates = get_news(limit=200, offset=0)
    terms = [
        t
        for t in query.lower().replace("-", " ").split()
        if t not in {"the", "a", "an", "latest", "about", "on", "for", "and", "news", "ai"}
    ]
    if not terms:
        return candidates[:20]

    scored: list[tuple[int, NewsResponse]] = []
    for item in candidates:
        text = f"{item.title} {item.summary} {' '.join(item.tags)}".lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, item))

    scored.sort(key=lambda x: (x[0], x[1].score), reverse=True)
    return [item for _, item in scored[:20]]


def get_news_item(news_id: str) -> NewsResponse | None:
    if store.db_available():
        row = store.get_news_by_id(news_id)
        return NewsResponse(**row) if row else None
    for row in get_news(limit=50, offset=0):
        if row.id == news_id:
            return row
    return None


def refresh_news_from_sources(max_items_per_source: int = 4) -> int:
    items, statuses = fetch_latest_with_status(max_items_per_source=max_items_per_source)
    _LAST_INGESTION_STATUS.clear()
    _LAST_INGESTION_STATUS.extend(statuses)
    if store.db_available():
        for item in items:
            store.insert_news_item(item)
    else:
        _INGESTED_CACHE.clear()
        for item in items:
            _INGESTED_CACHE.append(
                NewsResponse(
                    id=str(uuid4()),
                    title=item["title"],
                    summary=item.get("summary", ""),
                    source=item["source"],
                    url=item["url"],
                    tags=item.get("tags", []),
                    score=float(item.get("score", 0)),
                    published_at=item.get("published_at", datetime.now(timezone.utc)),
                )
            )
    return len(items)


def get_ingestion_status() -> list[dict]:
    return list(_LAST_INGESTION_STATUS)


def get_trends() -> TrendResponse:
    return TrendResponse(
        topic_heatmap={"Agents": 18, "LLMs": 24, "Vision": 9, "AI Safety": 6},
        company_radar={"OpenAI": 24, "Google": 19, "Anthropic": 14, "Meta": 10},
        model_release_timeline=[
            {"date": "2026-03-12", "model": "OpenAI oX"},
            {"date": "2026-03-15", "model": "Gemini Next"},
        ],
        industry_pulse="AI labs are accelerating multimodal releases while agent tooling matures in enterprise use cases.",
    )


def add_favorite(payload: FavoriteCreate) -> FavoriteResponse:
    if store.db_available():
        row = store.add_favorite(payload.user_id, payload.news_id)
        return FavoriteResponse(**row)
    favorite = FavoriteResponse(id=str(uuid4()), user_id=payload.user_id, news_id=payload.news_id)
    _FAKE_FAVORITES[favorite.id] = favorite
    return favorite


def remove_favorite(favorite_id: str) -> bool:
    if store.db_available():
        return store.remove_favorite(favorite_id)
    return _FAKE_FAVORITES.pop(favorite_id, None) is not None


def list_favorites(user_id: str) -> list[FavoriteResponse]:
    if store.db_available():
        return [FavoriteResponse(**row) for row in store.list_favorites(user_id)]
    return [f for f in _FAKE_FAVORITES.values() if f.user_id == user_id]
