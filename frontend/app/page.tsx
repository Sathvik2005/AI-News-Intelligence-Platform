"use client";

import { useEffect, useMemo, useState } from "react";
import NewsCard from "../components/NewsCard";
import TrendCharts from "../components/TrendCharts";
import { Card, CardTitle } from "../components/ui/card";
import {
  addFavorite,
  broadcastNews,
  getIngestionStatus,
  listFavorites,
  listNews,
  listSourcesCount,
  promptSearch,
  refreshNews,
  removeFavorite,
  type FavoriteItem,
  type IngestionStatusRow,
  type NewsItem,
} from "../lib/api";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sourceCount, setSourceCount] = useState(0);
  const [ingestionStatus, setIngestionStatus] = useState<IngestionStatusRow[]>([]);
  const [message, setMessage] = useState("");

  const favoriteMap = useMemo(() => new Map(favorites.map((f) => [f.news_id, f.id])), [favorites]);

  async function loadNews(query = "") {
    setLoading(true);
    try {
      const items = query ? await promptSearch(query) : await listNews();
      setNews(items);
      setMessage(`Loaded ${items.length} news items`);
    } catch {
      setMessage("Failed to load news. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      setFavorites(await listFavorites());
    } catch {
      setFavorites([]);
    }
  }

  useEffect(() => {
    void loadNews();
    void loadFavorites();
    void listSourcesCount().then(setSourceCount).catch(() => setSourceCount(0));
    void getIngestionStatus().then(setIngestionStatus).catch(() => setIngestionStatus([]));
  }, []);

  async function onRefresh() {
    setLoading(true);
    try {
      const result = await refreshNews();
      setMessage(result.message || "Refresh complete");
      await loadNews(prompt);
      await loadFavorites();
      setIngestionStatus(await getIngestionStatus());
    } catch {
      setMessage("Refresh failed");
    } finally {
      setLoading(false);
    }
  }

  async function onFavorite(newsId: string) {
    const existing = favoriteMap.get(newsId);
    try {
      if (existing) {
        await removeFavorite(existing);
        setMessage("Removed from favorites");
      } else {
        await addFavorite(newsId);
        setMessage("Added to favorites");
      }
      await loadFavorites();
    } catch {
      setMessage("Favorite action failed");
    }
  }

  async function onBroadcast(channel: "email" | "linkedin" | "whatsapp", item: NewsItem) {
    try {
      const result = await broadcastNews(channel, item);
      setMessage(`Broadcasted to ${channel}. Preview: ${String(result.content).slice(0, 80)}...`);
    } catch {
      setMessage("Broadcast failed");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-wider text-slate-600">AI News Intelligence Platform</p>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-700">Sources configured: {sourceCount}</p>
      </header>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Prompt search: latest multimodal models, ai agents, top research papers"
          />
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            onClick={() => void loadNews(prompt)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Prompt Search"}
          </button>
          <button
            className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-medium text-white"
            onClick={() => void onRefresh()}
            disabled={loading}
          >
            Refresh Sources
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-600">{message}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {news.map((item) => (
          <NewsCard key={item.id} item={item} onFavorite={onFavorite} onBroadcast={onBroadcast} />
        ))}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>AI Industry Pulse</CardTitle>
          <p className="mt-2 text-sm text-slate-700">Model releases are accelerating while agent tooling matures.</p>
        </Card>
        <Card>
          <CardTitle>Model Release Timeline</CardTitle>
          <p className="mt-2 text-sm text-slate-700">OpenAI oX, Gemini Next, Claude Runtime, Llama Edge</p>
        </Card>
        <Card>
          <CardTitle>Research Paper Tracker</CardTitle>
          <p className="mt-2 text-sm text-slate-700">Top papers from arXiv cs.AI and cs.CL are auto-ranked daily.</p>
        </Card>
      </section>

      <section className="mt-8">
        <TrendCharts />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Admin Panel</CardTitle>
          <p className="mt-2 text-sm text-slate-700">Manage sources, trigger refresh, and inspect ingestion status.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-medium text-white" href="http://localhost:8000/api/v1/admin/sources" target="_blank">View Sources API</a>
            <a className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-medium text-white" href="http://localhost:8000/docs" target="_blank">Open API Docs</a>
          </div>
        </Card>
        <Card>
          <CardTitle>Favorites</CardTitle>
          <p className="mt-2 text-sm text-slate-700">Saved favorites: {favorites.length}</p>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardTitle>Ingestion Status (per source)</CardTitle>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="px-2 py-2">Source</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Items</th>
                  <th className="px-2 py-2">Latency</th>
                  <th className="px-2 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {ingestionStatus.map((row) => (
                  <tr key={row.source} className="border-b border-slate-100">
                    <td className="px-2 py-2 font-medium">{row.source}</td>
                    <td className="px-2 py-2">
                      <span
                        className={
                          row.status === "success"
                            ? "rounded-full bg-emerald-100 px-2 py-1 text-emerald-700"
                            : row.status === "fail"
                              ? "rounded-full bg-rose-100 px-2 py-1 text-rose-700"
                              : "rounded-full bg-slate-100 px-2 py-1 text-slate-700"
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-2 py-2">{row.items}</td>
                    <td className="px-2 py-2">{row.latency_ms} ms</td>
                    <td className="px-2 py-2 text-slate-600">{row.error || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </main>
  );
}
