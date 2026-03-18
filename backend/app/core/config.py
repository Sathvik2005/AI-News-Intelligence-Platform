import os


def _normalize_database_url(raw: str) -> str:
    if raw.startswith("postgresql+psycopg://"):
        return raw.replace("postgresql+psycopg://", "postgresql://", 1)
    return raw


DATABASE_URL = _normalize_database_url(
    os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/ai_news")
)
