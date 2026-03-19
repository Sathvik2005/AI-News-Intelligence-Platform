"use client";

import { useEffect, useState } from "react";
import NewsCard from "../../components/NewsCard";
import { LayoutTemplate, Search } from "lucide-react";
import { listNews, type NewsItem } from "../../lib/api";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";

export default function ResearchPage() {
  const [researchNews, setResearchNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allNews = await listNews();
        
        // Filter for research papers (arXiv, DeepMind research, PapersWithCode, etc.)
        const papers = allNews.filter(n => n.tags.includes('Research') || n.source.toLowerCase().includes('arxiv') || n.source.toLowerCase().includes('papers'));
        
        setResearchNews(papers);
      } catch (e) {
        console.warn('Failed to load research papers');
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Research Lab</h1>
          <p className="text-zinc-400 mt-2">Latest cutting-edge AI papers from arXiv and labs.</p>
        </div>
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
           <input 
             type="text" 
             placeholder="Search papers..." 
             className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
           />
        </div>
      </header>

      <section>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col gap-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        ) : researchNews.length === 0 ? (
           <div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-900/30 p-12 text-center flex flex-col items-center">
             <LayoutTemplate className="h-12 w-12 text-zinc-600 mb-4" />
             <h3 className="text-lg font-medium text-white">No papers found</h3>
             <p className="text-zinc-500 mt-2 max-w-sm">Wait for the ingestion engine to fetch latest papers from arXiv.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {researchNews.map((item) => (
              <div key={item.id} className="relative">
                <NewsCard item={item} />
                <div className="absolute top-4 left-4 pointer-events-none">
                  <span className="bg-purple-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded shadow-lg ring-1 ring-white/10">Paper</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
