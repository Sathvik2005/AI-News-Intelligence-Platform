from app.db.store import _conn

DDL = """
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,
  authority_score NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_items (
  id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES sources(id),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT NOT NULL UNIQUE,
  author TEXT,
  tags TEXT[] DEFAULT '{}',
  entities JSONB DEFAULT '{}'::jsonb,
  score NUMERIC(6,3) DEFAULT 0,
  trend_score NUMERIC(6,3) DEFAULT 0,
  is_duplicate BOOLEAN DEFAULT FALSE,
  canonical_news_id TEXT,
  published_at TIMESTAMPTZ,
  ingested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_embeddings (
  news_id TEXT PRIMARY KEY REFERENCES news_items(id) ON DELETE CASCADE,
  embedding vector(1536),
  model_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  news_id TEXT REFERENCES news_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id)
);

CREATE TABLE IF NOT EXISTS broadcast_logs (
  id TEXT PRIMARY KEY,
  news_id TEXT REFERENCES news_items(id),
  channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_history (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  content_html TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trend_metrics (
  id TEXT PRIMARY KEY,
  metric_date DATE NOT NULL,
  topic_heatmap JSONB NOT NULL,
  company_radar JSONB NOT NULL,
  model_timeline JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_date)
);

CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON news_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_items_tags ON news_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_news_items_entities ON news_items USING GIN(entities);

-- Insert Demo User
INSERT INTO users (id, email, full_name) VALUES ('demo-user', 'demo@example.com', 'Demo User') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, email, full_name) VALUES ('demo-user', 'demo@example.com', 'Demo User') ON CONFLICT (email) DO NOTHING;
"""

def init_db():
    try:
        with _conn() as conn:
            with conn.cursor() as cur:
                cur.execute(DDL)
            conn.commit()
            print("Database initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize database: {e}")
