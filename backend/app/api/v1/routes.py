from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.api import (
    BroadcastRequest,
    FavoriteCreate,
    FavoriteResponse,
    NewsResponse,
    RefreshResponse,
    TrendResponse,
)
from app.services.broadcast import build_broadcast_payload
from app.services.news import (
    add_favorite,
    get_news_item,
    get_ingestion_status,
    get_news,
    get_trends,
    list_favorites as get_favorites,
    refresh_news_from_sources,
    remove_favorite,
    search_news,
)
from app.services.connectors import SOURCE_FEEDS
from app.db.store import list_sources, upsert_source

router = APIRouter()


@router.get("/news", response_model=list[NewsResponse])
def list_news(limit: int = 50, offset: int = 0, q: str | None = None) -> list[NewsResponse]:
    return get_news(limit=limit, offset=offset, query=q)


@router.get("/news/search", response_model=list[NewsResponse])
def semantic_search(q: str) -> list[NewsResponse]:
    return search_news(query=q)


@router.get("/news/prompt-search", response_model=list[NewsResponse])
def prompt_search(prompt: str) -> list[NewsResponse]:
    return search_news(query=prompt)


@router.post("/news/refresh", response_model=RefreshResponse)
def refresh_news() -> RefreshResponse:
    fetched = refresh_news_from_sources(max_items_per_source=2)
    return RefreshResponse(status="ok", message=f"Fetched {fetched} items")


@router.get("/news/{news_id}", response_model=NewsResponse)
def get_single_news(news_id: str) -> NewsResponse:
    item = get_news_item(news_id)
    if not item:
        raise HTTPException(status_code=404, detail="news item not found")
    return item


@router.get("/trends", response_model=TrendResponse)
def trends() -> TrendResponse:
    return get_trends()


@router.post("/ai/pulse")
def generate_ai_pulse() -> dict:
    # Use LLM (Mocked) to summarize top 10 ranked news
    return {
        "status": "ok",
        "pulse": "Top AI Developments Today\n\n- OpenAI drops API pricing by 50%\n- Local Llama models achieve GPT-4 level tasks\n- New agent framework released on GitHub"
    }
    
@router.post("/newsletter/generate")
def generate_newsletter() -> dict:
    # Use LLM (Mocked) to summarize weekly news
    return {
        "status": "ok",
        "content": "# Weekly AI Newsletter\n\n## Top News\n- Agent tooling has seen a 24% increase in mentions.\n\n## Research Highlights\n- Transformers vs Diffusion in the latest multimodal benchmarks.\n\n## Startup Funding\n- Stealth AI agent startup raised $15M.\n\n## Model Releases\n- Llama-Edge and OpenAI oX reported early specs."
    }


@router.get("/trends/industry-pulse")
def industry_pulse() -> dict:
    return {"industry_pulse": get_trends().industry_pulse}


@router.get("/favorites", response_model=list[FavoriteResponse])
def list_favorites_route(user_id: str = "demo-user") -> list[FavoriteResponse]:
    return get_favorites(user_id)


@router.post("/favorites", response_model=FavoriteResponse)
def create_favorite(payload: FavoriteCreate) -> FavoriteResponse:
    return add_favorite(payload)


@router.delete("/favorites/{favorite_id}")
def delete_favorite(favorite_id: str) -> dict:
    removed = remove_favorite(favorite_id)
    if not removed:
        raise HTTPException(status_code=404, detail="favorite not found")
    return {"status": "deleted", "id": favorite_id}


@router.post("/broadcast/{channel}")
def broadcast(channel: str, payload: BroadcastRequest) -> dict:
    if channel not in {"email", "linkedin", "whatsapp", "newsletter", "blog"}:
        raise HTTPException(status_code=400, detail="unsupported channel")
    generated = build_broadcast_payload(channel=channel, payload=payload)
    return {"status": "ok", "channel": channel, "content": generated}


@router.get("/stream")
def stream_updates() -> StreamingResponse:
    def event_stream():
        yield "data: {\"event\":\"connected\"}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.get("/admin/sources")
def admin_list_sources() -> list[dict]:
    try:
        return list_sources()
    except Exception:
        return [
            {
                "id": f"static-{idx}",
                "name": src["name"],
                "url": src["url"],
                "source_type": "rss",
                "is_active": True,
            }
            for idx, src in enumerate(SOURCE_FEEDS)
        ]


@router.post("/admin/sources")
def admin_add_source(name: str, url: str, source_type: str = "rss") -> dict:
    try:
        source_id = upsert_source(name=name, url=url, source_type=source_type)
    except Exception:
        source_id = "in-memory-only"
    return {"id": source_id, "name": name, "url": url, "source_type": source_type}


@router.post("/admin/refresh")
def admin_refresh(max_items_per_source: int = 4) -> dict:
    fetched = refresh_news_from_sources(max_items_per_source=max_items_per_source)
    return {"status": "ok", "fetched": fetched}


@router.get("/admin/ingestion-status")
def admin_ingestion_status() -> list[dict]:
    return get_ingestion_status()
