import { StatsCard } from '@/components/stats-card';
import { IntentDistributionChart } from '@/components/intent-distribution-chart';
import { RecentEventsTable } from '@/components/recent-events-table';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Active Users" value="—" />
        <StatsCard label="Events Today" value="—" />
        <StatsCard label="High Purchase Intent" value="—" accent />
        <StatsCard label="Churn Risk Users" value="—" danger />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IntentDistributionChart />
        <RecentEventsTable />
      </div>
    </div>
  );
}
