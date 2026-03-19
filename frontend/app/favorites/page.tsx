"use client";

import { useEffect, useState } from "react";
import NewsCard from "../../components/NewsCard";
import { LayoutTemplate } from "lucide-react";
import { listFavorites, listNews, removeFavorite, type FavoriteItem, type NewsItem } from "../../lib/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const favs = await listFavorites();
        const allNews = await listNews();
        
        // Match favorites with full news data
        const favNews = favs.map(f => {
          const matched = allNews.find(n => n.id === f.news_id);
          return matched ? { ...matched, favoriteId: f.id } : null;
        }).filter(Boolean) as NewsItem[];
        
        setFavorites(favNews);
      } catch (e) {
        console.warn('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Saved Intelligence</h1>
        <p className="text-zinc-400 mt-2">Articles you've marked as important.</p>
      </header>

      <section>
        {loading ? (
          <div className="text-zinc-400">Loading your favorites...</div>
        ) : favorites.length === 0 ? (
           <div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-900/30 p-12 text-center flex flex-col items-center">
             <LayoutTemplate className="h-12 w-12 text-zinc-600 mb-4" />
             <h3 className="text-lg font-medium text-white">No saved items</h3>
             <p className="text-zinc-500 mt-2 max-w-sm">Star items in your dashboard to save them here for later reading.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((item) => (
              <NewsCard 
                key={item.id} 
                item={item} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
