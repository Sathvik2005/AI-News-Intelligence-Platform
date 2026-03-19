"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const topicData = [
  { topic: "LLMs", value: 24 },
  { topic: "Agents", value: 18 },
  { topic: "Vision", value: 9 },
  { topic: "Safety", value: 6 },
];

const companyData = [
  { name: "OpenAI", value: 24 },
  { name: "Google", value: 19 },
  { name: "Anthropic", value: 14 },
  { name: "Meta", value: 10 },
];

const colors = ["#0284c7", "#f97316", "#0ea5e9", "#334155"];

export default function TrendCharts() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-semibold tracking-wide text-zinc-300">AI Topic Heatmap</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="topic" tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-semibold tracking-wide text-zinc-300">AI Company Radar</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={companyData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={85} paddingAngle={5}>
                {companyData.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} stroke="rgba(0,0,0,0)" />
                ))}
              </Pie>
              <Tooltip cursor={{ fill: '#27272a' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#f4f4f5' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
