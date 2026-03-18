from datetime import datetime
from pydantic import BaseModel, Field


class NewsResponse(BaseModel):
    id: str
    title: str
    summary: str
    source: str
    url: str
    tags: list[str] = Field(default_factory=list)
    score: float = 0
    published_at: datetime


class FavoriteCreate(BaseModel):
    user_id: str
    news_id: str


class FavoriteResponse(BaseModel):
    id: str
    user_id: str
    news_id: str


class BroadcastRequest(BaseModel):
    user_id: str
    news_id: str
    title: str
    summary: str
    url: str
    tags: list[str] = Field(default_factory=list)


class RefreshResponse(BaseModel):
    status: str
    message: str


class TrendResponse(BaseModel):
    topic_heatmap: dict[str, int]
    company_radar: dict[str, int]
    model_release_timeline: list[dict[str, str]]
    industry_pulse: str
