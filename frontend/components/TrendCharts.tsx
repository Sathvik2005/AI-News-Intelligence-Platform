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
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">AI Topic Heatmap</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData}>
              <XAxis dataKey="topic" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">AI Company Radar</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={companyData} dataKey="value" nameKey="name" outerRadius={85}>
                {companyData.map((entry, idx) => (
                  <Cell key={entry.name} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
