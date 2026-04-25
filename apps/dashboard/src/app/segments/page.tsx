export default function SegmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Segments</h1>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors">
          + New Segment
        </button>
      </div>

      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
        {[
          { name: 'High Purchase Intent', users: 124, rules: 'score ≥ 70 AND intent = buying' },
          { name: 'Churn Risk', users: 38, rules: 'remove_from_cart ≥ 1 OR pricing_page_views ≥ 1' },
          { name: 'Active Researchers', users: 211, rules: 'search_count ≥ 3 AND add_to_cart = 0' },
        ].map(s => (
          <div key={s.name} className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-[var(--muted)] mt-0.5 font-mono">{s.rules}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{s.users}</p>
              <p className="text-xs text-[var(--muted)]">users</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
