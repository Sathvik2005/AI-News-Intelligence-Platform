"use client";

import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import TrendCharts from "../components/TrendCharts";
import { Card, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { RefreshCw, LayoutTemplate } from "lucide-react";
import {
  addFavorite,
  broadcastNews,
  listNews,
  listFavorites,
  refreshNews,
  removeFavorite,
  type FavoriteItem,
  type NewsItem,
} from "../lib/api";

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadNews() {
    try {
      const items = await listNews();
      setNews(items);
    } catch {
      console.warn("Could not load news");
    } finally {
      setLoading(false);
    }
  }

  async function loadFavorites() {
    try {
      const favs = await listFavorites();
      setFavorites(favs);
    } catch {
      console.warn("Could not load favorites");
    }
  }

  useEffect(() => {
    void loadNews();
    void loadFavorites();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await refreshNews();
      await loadNews();
      await loadFavorites();
    } catch {
      console.warn("Refresh failed");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleFavorite(newsId: string) {
    try {
      const existing = favorites.find(f => f.news_id === newsId);
      if (existing) {
        await removeFavorite(existing.id);
      } else {
        await addFavorite(newsId);
      }
      await loadFavorites();
    } catch {
      console.warn("Favorite toggle failed");
    }
  }

  const loadDemoData = () => {
    setNews([
      {
        id: "demo-1", title: "OpenAI announces new o1 preview model", 
        summary: "The newly released o1 model introduces chain of thought reasoning.",
        source: "OpenAI", url: "https://openai.com", tags: ["LLMs", "Research"],
        entities: { model: "o1", company: "OpenAI" }, score: 98, published_at: new Date().toISOString()
      },
      {
        id: "demo-2", title: "Running Llama-3 locally just got easier", 
        summary: "New tools are allowing optimized local execution of Meta's Llama-3.",
        source: "Hacker News", url: "https://news.ycombinator.com", tags: ["Local AI", "LLMs"],
        entities: { model: "Llama-3", company: "Meta" }, score: 85, published_at: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Today's Briefing</h1>
          <p className="text-zinc-400 mt-2">Curated AI intelligence, deduplicated and ranked.</p>
        </div>
        <Button onClick={onRefresh} disabled={refreshing} variant="secondary">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Sources
        </Button>
      </header>
      
      {/* Top Cards for Pulse */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/40 to-zinc-900 border-blue-500/20">
          <CardTitle>AI Industry Pulse</CardTitle>
          <p className="mt-3 text-sm leading-relaxed text-blue-200/70">
            OpenAI API pricing drops accelerate adoption. Local LLMs seeing huge improvements with Llama 3 architectures.
          </p>
        </Card>
        <Card>
          <CardTitle>Top Topic</CardTitle>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">Agents</span>
            <span className="text-emerald-400 text-sm font-medium">+24%</span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">Mentions in last 24h</p>
        </Card>
        <Card>
          <CardTitle>Sources Active</CardTitle>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">12</span>
            <span className="text-emerald-400 text-sm font-medium">Healthy</span>
          </div>
          <p className="mt-1 text-sm text-zinc-500">All APIs responding</p>
        </Card>
      </section>

      {/* Main Feed */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Ranked Feed</h2>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="mt-auto flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-900/30 p-12 text-center flex flex-col items-center">
             <LayoutTemplate className="h-12 w-12 text-zinc-600 mb-4" />
             <h3 className="text-lg font-medium text-white">No active feeds</h3>
             <p className="text-zinc-500 mt-2 max-w-sm mb-6">Your feed is empty. This might mean the DB is fresh or APIs failed.</p>
             <div className="flex gap-4">
               <Button onClick={onRefresh} variant="outline">Fetch Live Now</Button>
               <Button onClick={loadDemoData} className="bg-blue-600 hover:bg-blue-500 text-white">Load Demo Data</Button>
             </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => {
              const obj = item as NewsItem & { isFavorited?: boolean };
              obj.isFavorited = favorites.some(f => f.news_id === item.id);
              return (
                <NewsCard 
                  key={item.id} 
                  item={obj} 
                  onFavorite={handleFavorite} 
                />
              );
            })}
          </div>
        )}
      </section>
      
      <section className="pt-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-4">Trend Analysis</h2>
        <TrendCharts />
      </section>
    </div>
  );
}
