"use client";

import TrendCharts from "../../components/TrendCharts";

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Ecosystem Analytics</h1>
        <p className="text-zinc-400 mt-2">Deep dive into topic modeling and entity recognition.</p>
      </header>

      <div className="mt-8">
        <TrendCharts />
      </div>
    </div>
  );
}
