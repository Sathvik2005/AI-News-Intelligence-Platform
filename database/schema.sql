CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL,
  authority_score NUMERIC(5,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_items (
  id UUID PRIMARY KEY,
  source_id UUID REFERENCES sources(id),
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
  canonical_news_id UUID,
  published_at TIMESTAMPTZ,
  ingested_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news_embeddings (
  news_id UUID PRIMARY KEY REFERENCES news_items(id) ON DELETE CASCADE,
  embedding vector(1536),
  model_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  news_id UUID REFERENCES news_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, news_id)
);

CREATE TABLE IF NOT EXISTS broadcast_logs (
  id UUID PRIMARY KEY,
  news_id UUID REFERENCES news_items(id),
  channel TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_history (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  content_html TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trend_metrics (
  id UUID PRIMARY KEY,
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
