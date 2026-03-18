export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  tags: string[];
  score: number;
  published_at: string;
};

export type FavoriteItem = {
  id: string;
  user_id: string;
  news_id: string;
};

export type IngestionStatusRow = {
  source: string;
  url: string;
  status: "success" | "fail" | "unknown";
  latency_ms: number;
  items: number;
  error: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
const DEMO_USER = "demo-user";

export async function refreshNews() {
  const res = await fetch(`${API_BASE}/api/v1/news/refresh`, { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error("refresh failed");
  return res.json();
}

export async function listNews(query = ""): Promise<NewsItem[]> {
  const q = query ? `&q=${encodeURIComponent(query)}` : "";
  const res = await fetch(`${API_BASE}/api/v1/news?limit=50${q}`, { cache: "no-store" });
  if (!res.ok) throw new Error("news fetch failed");
  return res.json();
}

export async function promptSearch(prompt: string): Promise<NewsItem[]> {
  if (!prompt.trim()) return listNews();
  const res = await fetch(`${API_BASE}/api/v1/news/prompt-search?prompt=${encodeURIComponent(prompt)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("prompt search failed");
  return res.json();
}

export async function addFavorite(newsId: string): Promise<FavoriteItem> {
  const res = await fetch(`${API_BASE}/api/v1/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: DEMO_USER, news_id: newsId }),
  });
  if (!res.ok) throw new Error("favorite add failed");
  return res.json();
}

export async function listFavorites(): Promise<FavoriteItem[]> {
  const res = await fetch(`${API_BASE}/api/v1/favorites?user_id=${DEMO_USER}`, { cache: "no-store" });
  if (!res.ok) throw new Error("favorites fetch failed");
  return res.json();
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/favorites/${favoriteId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("favorite delete failed");
}

export async function broadcastNews(channel: "email" | "linkedin" | "whatsapp" | "newsletter" | "blog", item: NewsItem) {
  const res = await fetch(`${API_BASE}/api/v1/broadcast/${channel}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: DEMO_USER,
      news_id: item.id,
      title: item.title,
      summary: item.summary,
      url: item.url,
      tags: item.tags,
    }),
  });
  if (!res.ok) throw new Error("broadcast failed");
  return res.json();
}

export async function listSourcesCount(): Promise<number> {
  const res = await fetch(`${API_BASE}/api/v1/admin/sources`, { cache: "no-store" });
  if (!res.ok) return 0;
  const data = (await res.json()) as Array<unknown>;
  return data.length;
}

export async function getIngestionStatus(): Promise<IngestionStatusRow[]> {
  const res = await fetch(`${API_BASE}/api/v1/admin/ingestion-status`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
