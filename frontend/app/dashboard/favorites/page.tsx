"use client";

import { useEffect, useState } from "react";
import { listFavorites, listNews, removeFavorite, type FavoriteItem, type NewsItem } from "../../../lib/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    void (async () => {
      const [favData, newsData] = await Promise.all([listFavorites(), listNews()]);
      setFavorites(favData);
      setNews(newsData);
    })();
  }, []);

  async function onRemove(favoriteId: string) {
    await removeFavorite(favoriteId);
    setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-3xl font-bold">Favorites</h1>
      <p className="mt-2 text-sm text-slate-600">Saved stories for quick broadcasting.</p>
      <div className="mt-6 space-y-3">
        {favorites.map((fav) => {
          const item = news.find((n) => n.id === fav.news_id);
          return (
            <div key={fav.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{item?.title || fav.news_id}</h2>
              <p className="mt-1 text-sm text-slate-700">{item?.summary || "No summary available."}</p>
              <div className="mt-3 flex items-center gap-3">
                {item?.url ? (
                  <a href={item.url} target="_blank" className="text-sm font-medium text-sky-700">
                    Open
                  </a>
                ) : null}
                <button className="rounded-md bg-slate-900 px-3 py-1 text-xs text-white" onClick={() => onRemove(fav.id)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
