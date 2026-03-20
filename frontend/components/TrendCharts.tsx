"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, YAxis } from "recharts";

const topicData = [
  { topic: "LLMs", value: 34 },
  { topic: "Agents", value: 28 },
  { topic: "Vision", value: 19 },
  { topic: "Safety", value: 12 },
];

const companyData = [
  { name: "OpenAI", value: 45 },
  { name: "Google", value: 32 },
  { name: "Anthropic", value: 24 },
  { name: "Meta", value: 18 },
];

const timelineData = [
  { day: "Mon", mentions: 12 },
  { day: "Tue", mentions: 18 },
  { day: "Wed", mentions: 15 },
  { day: "Thu", mentions: 25 },
  { day: "Fri", mentions: 34 },
  { day: "Sat", mentions: 28 },
  { day: "Sun", mentions: 42 },
];

const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6"];

export default function TrendCharts() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shrink-0 flex items-center justify-between shadow-sm">
         <span className="text-sm text-zinc-400">Key Insight</span>
         <p className="text-sm font-medium text-emerald-400">✨ LLMs dominate today's AI coverage</p>
      </div>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm flex flex-col transition-all hover:border-zinc-700">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-200">Trending Topics</h3>
          <p className="text-xs text-zinc-500 mb-6">Topic mentions over 24h</p>
          <div className="h-48 grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="topic" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm flex flex-col transition-all hover:border-zinc-700">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-200">Top Companies</h3>
          <p className="text-xs text-zinc-500 mb-6">Share of voice estimation</p>
          <div className="h-48 grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={companyData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                  {companyData.map((entry, idx) => (
                    <Cell key={entry.name} fill={colors[idx % colors.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm flex flex-col transition-all hover:border-zinc-700">
          <h3 className="mb-2 text-sm font-semibold tracking-wide text-zinc-200">News Timeline</h3>
          <p className="text-xs text-zinc-500 mb-6">Aggregated event volume</p>
          <div className="h-48 grow">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5' }} />
                <Line type="monotone" dataKey="mentions" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}
