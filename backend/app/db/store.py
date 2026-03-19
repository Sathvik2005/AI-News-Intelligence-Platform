import hashlib
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

import psycopg
from psycopg.rows import dict_row

from app.core.config import DATABASE_URL

EMBEDDING_DIM = 1536


def _conn() -> psycopg.Connection:
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)


def db_available() -> bool:
    try:
        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
                cur.fetchone()
        return True
    except Exception:
        return False


def upsert_source(name: str, url: str, source_type: str = "rss") -> str:
    source_id = str(uuid4())
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sources (id, name, url, source_type)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (url) DO UPDATE SET name = EXCLUDED.name, source_type = EXCLUDED.source_type
                RETURNING id
                """,
                (source_id, name, url, source_type),
            )
            row = cur.fetchone()
            conn.commit()
            return str(row["id"])


def list_sources() -> list[dict[str, Any]]:
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, url, source_type, is_active FROM sources ORDER BY name")
            return [dict(r) for r in cur.fetchall()]


def insert_news_item(item: dict[str, Any]) -> str:
    news_id = str(uuid4())
    source_id = upsert_source(item["source"], item["source_url"], item.get("source_type", "rss"))
    
    # Generate embedding first for duplicate check
    embedding = build_embedding(f"{item['title']} {item.get('summary', '')} {' '.join(item.get('tags', []))}")
    vector_literal = to_vector_literal(embedding)
    
    with _conn() as conn:
        with conn.cursor() as cur:
            # Check for duplicates using cosine similarity (1 - distance)
            cur.execute(
                """
                SELECT news_id, 1 - (embedding <=> %s::vector) AS similarity 
                FROM news_embeddings 
                ORDER BY similarity DESC LIMIT 1
                """,
                (vector_literal,)
            )
            dup_row = cur.fetchone()
            is_duplicate = False
            canonical_id = None
            if dup_row and dup_row["similarity"] > 0.85:
                is_duplicate = True
                canonical_id = dup_row["news_id"]
            
            # Use original duplicate flag if provided, else use similarity check
            final_is_duplicate = item.get("is_duplicate", is_duplicate)
            final_canonical_id = item.get("canonical_news_id", canonical_id)

            cur.execute(
                """
                INSERT INTO news_items (
                  id, source_id, title, summary, content, url, author, tags, entities,
                  score, trend_score, is_duplicate, canonical_news_id, published_at, ingested_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (url) DO UPDATE SET
                  title = EXCLUDED.title,
                  summary = EXCLUDED.summary,
                  content = EXCLUDED.content,
                  tags = EXCLUDED.tags,
                  score = EXCLUDED.score,
                  published_at = EXCLUDED.published_at
                RETURNING id
                """,
                (
                    news_id,
                    source_id,
                    item["title"],
                    item.get("summary", ""),
                    item.get("content", ""),
                    item["url"],
                    item.get("author"),
                    item.get("tags", []),
                    item.get("entities", {}),
                    item.get("score", 0),
                    item.get("trend_score", 0),
                    final_is_duplicate,
                    final_canonical_id,
                    item.get("published_at", datetime.now(timezone.utc)),
                    datetime.now(timezone.utc),
                ),
            )
            row = cur.fetchone()
            persisted_news_id = str(row["id"])

            cur.execute(
                """
                INSERT INTO news_embeddings (news_id, embedding, model_name)
                VALUES (%s, %s::vector, %s)
                ON CONFLICT (news_id) DO UPDATE SET
                    embedding = EXCLUDED.embedding,
                    model_name = EXCLUDED.model_name
                """,
                (persisted_news_id, vector_literal, "all-MiniLM-L6-v2"),
            )

            conn.commit()
            return persisted_news_id


def list_news(limit: int = 50, offset: int = 0, q: str | None = None) -> list[dict[str, Any]]:
    query = """
        SELECT n.id, n.title, COALESCE(n.summary, '') AS summary,
               s.name AS source, n.url, n.tags, n.entities, n.score, n.published_at
        FROM news_items n
        JOIN sources s ON n.source_id = s.id
        WHERE n.is_duplicate = FALSE
    """
    params: list[Any] = []
    if q:
        query += " AND (LOWER(n.title) LIKE %s OR LOWER(n.summary) LIKE %s)"
        like = f"%{q.lower()}%"
        params.extend([like, like])
    query += " ORDER BY n.published_at DESC NULLS LAST LIMIT %s OFFSET %s"
    params.extend([limit, offset])

    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params)
            return [dict(r) for r in cur.fetchall()]


def get_news_by_id(news_id: str) -> dict[str, Any] | None:
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT n.id, n.title, COALESCE(n.summary, '') AS summary,
                       s.name AS source, n.url, n.tags, n.entities, n.score, n.published_at
                FROM news_items n
                JOIN sources s ON n.source_id = s.id
                WHERE n.id = %s
                """,
                (news_id,),
            )
            row = cur.fetchone()
            return dict(row) if row else None


def add_favorite(user_id: str, news_id: str) -> dict[str, Any]:
    favorite_id = str(uuid4())
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO favorites (id, user_id, news_id)
                VALUES (%s, %s, %s)
                ON CONFLICT (user_id, news_id) DO UPDATE SET news_id = EXCLUDED.news_id
                RETURNING id, user_id, news_id
                """,
                (favorite_id, user_id, news_id),
            )
            row = cur.fetchone()
            conn.commit()
            return dict(row)


def list_favorites(user_id: str) -> list[dict[str, Any]]:
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, user_id, news_id FROM favorites WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,),
            )
            return [dict(r) for r in cur.fetchall()]


def remove_favorite(favorite_id: str) -> bool:
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM favorites WHERE id = %s", (favorite_id,))
            deleted = cur.rowcount > 0
            conn.commit()
            return deleted


def build_embedding(text: str, dim: int = EMBEDDING_DIM) -> list[float]:
    try:
        from sentence_transformers import SentenceTransformer
        import numpy as np
        
        # Load model globally to avoid reloading, using a singleton pattern
        if not hasattr(build_embedding, "model"):
            build_embedding.model = SentenceTransformer('all-MiniLM-L6-v2')
            
        embeddings = build_embedding.model.encode([text])
        
        # all-MiniLM-L6-v2 outputs 384d, we need to handle dimension mismatch if DB is 1536
        # Let's pad it to 1536 for compatibility with existing schema
        padded = np.zeros(1536)
        padded[:min(384, len(embeddings[0]))] = embeddings[0][:1536]
        
        # Normalize
        norm = np.linalg.norm(padded)
        if norm > 0:
            padded = padded / norm
            
        return padded.tolist()
    except ImportError:
        # Fallback to hash if sentence_transformers isn't installed
        import hashlib
        values = [0.0] * dim
        for token in text.lower().split():
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            idx = int.from_bytes(digest[:2], "big") % dim
            sign = 1.0 if digest[2] % 2 == 0 else -1.0
            values[idx] += sign
        norm = sum(v * v for v in values) ** 0.5
        if norm == 0:
            return values
        return [v / norm for v in values]


def to_vector_literal(values: list[float]) -> str:
    return "[" + ",".join(f"{v:.8f}" for v in values) + "]"


def semantic_search_news(query: str, limit: int = 20) -> list[dict[str, Any]]:

    embedding = build_embedding(query)
    vector = to_vector_literal(embedding)
    with _conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT n.id, n.title, COALESCE(n.summary, '') AS summary,
                       s.name AS source, n.url, n.tags, n.entities, n.score, n.published_at
                FROM news_embeddings e
                JOIN news_items n ON n.id = e.news_id
                JOIN sources s ON s.id = n.source_id
                WHERE n.is_duplicate = FALSE
                ORDER BY e.embedding <=> %s::vector
                LIMIT %s
                """,
                (vector, limit),
            )
            return [dict(r) for r in cur.fetchall()]
