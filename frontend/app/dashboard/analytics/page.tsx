import TrendCharts from "../../../components/TrendCharts";

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="mt-3 text-sm text-slate-700">Topic heatmap and company radar from trend engine outputs.</p>
      <div className="mt-6">
        <TrendCharts />
      </div>
    </main>
  );
}
