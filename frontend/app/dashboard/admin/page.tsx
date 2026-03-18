export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <p className="mt-3 text-sm text-slate-700">Manage ingestion sources, run manual refresh, and audit pipeline health.</p>
      <div className="mt-6 grid gap-3">
        <a className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm" href="http://localhost:8000/api/v1/admin/sources" target="_blank">GET /api/v1/admin/sources</a>
        <a className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm" href="http://localhost:8000/docs" target="_blank">OpenAPI Docs</a>
      </div>
    </main>
  );
}
