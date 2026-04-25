const MOCK_EVENTS = [
  { id: '1', userId: 'user-abc', eventType: 'add_to_cart', timestamp: '2 sec ago' },
  { id: '2', userId: 'user-def', eventType: 'page_view', timestamp: '5 sec ago' },
  { id: '3', userId: 'user-ghi', eventType: 'search', timestamp: '12 sec ago' },
  { id: '4', userId: 'user-jkl', eventType: 'purchase', timestamp: '18 sec ago' },
  { id: '5', userId: 'user-mno', eventType: 'session_end', timestamp: '30 sec ago' },
];

const EVENT_COLORS: Record<string, string> = {
  purchase: 'text-green-400',
  add_to_cart: 'text-emerald-400',
  search: 'text-blue-400',
  page_view: 'text-slate-400',
  session_end: 'text-slate-500',
};

export function RecentEventsTable() {
  return (
    <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-5">
      <h2 className="text-sm font-medium text-[var(--muted)] mb-4">Recent Events</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--muted)] text-xs border-b border-[var(--border)]">
            <th className="pb-2 text-left">User</th>
            <th className="pb-2 text-left">Event</th>
            <th className="pb-2 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {MOCK_EVENTS.map(e => (
            <tr key={e.id}>
              <td className="py-2 text-[var(--muted)] truncate max-w-[120px]">
                {e.userId}
              </td>
              <td className={`py-2 font-mono ${EVENT_COLORS[e.eventType] ?? ''}`}>
                {e.eventType}
              </td>
              <td className="py-2 text-right text-[var(--muted)]">{e.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
