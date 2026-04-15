import type { AnalyticsSnapshot } from '../../data/types';
import { calculateKPIs, calculateTrend } from '../../lib/analytics';

interface Props {
  snapshots: string; // JSON serialized AnalyticsSnapshot[]
}

function TrendIndicator({
  direction,
  percent,
  invertColor,
}: {
  direction: 'up' | 'down' | 'flat';
  percent: number;
  invertColor?: boolean;
}) {
  if (direction === 'flat') {
    return (
      <span class="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
        </svg>
        No change
      </span>
    );
  }

  const isPositive = invertColor ? direction === 'down' : direction === 'up';
  const color = isPositive ? 'text-emerald-600' : 'text-red-500';
  const bgColor = isPositive ? 'bg-emerald-50' : 'bg-red-50';

  return (
    <span class={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${color} ${bgColor}`}>
      {direction === 'up' ? (
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {percent}%
    </span>
  );
}

export default function KPICards({ snapshots: snapshotsJson }: Props) {
  const snapshots: AnalyticsSnapshot[] = JSON.parse(snapshotsJson);

  // Split into today and yesterday for trend calculation
  const dates = [...new Set(snapshots.map((s) => s.date))].sort();
  const today = dates[dates.length - 1] ?? '';
  const yesterday = dates[dates.length - 2] ?? '';

  const todaySnaps = snapshots.filter((s) => s.date === today);
  const yesterdaySnaps = snapshots.filter((s) => s.date === yesterday);

  const todayKPIs = calculateKPIs(todaySnaps);
  const yesterdayKPIs = calculateKPIs(yesterdaySnaps);

  const waitTrend = calculateTrend(todayKPIs.avgWait, yesterdayKPIs.avgWait);
  const servedTrend = calculateTrend(todayKPIs.totalServed, yesterdayKPIs.totalServed);
  const satTrend = calculateTrend(todayKPIs.satisfaction, yesterdayKPIs.satisfaction);
  const utilTrend = calculateTrend(todayKPIs.utilization, yesterdayKPIs.utilization);

  const cards = [
    {
      label: 'Average Wait Time',
      value: `${todayKPIs.avgWait} min`,
      trend: waitTrend,
      invertColor: true, // down is good for wait time
      icon: (
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Customers Served Today',
      value: String(todayKPIs.totalServed),
      trend: servedTrend,
      invertColor: false,
      icon: (
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Customer Satisfaction',
      value: `${todayKPIs.satisfaction}/5`,
      trend: satTrend,
      invertColor: false,
      icon: (
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
      iconBg: 'bg-amber-50 text-amber-500',
    },
    {
      label: 'Staff Utilization',
      value: `${todayKPIs.utilization}%`,
      trend: utilTrend,
      invertColor: false,
      icon: (
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
        </svg>
      ),
      iconBg: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div class={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}>
              {card.icon}
            </div>
            <TrendIndicator
              direction={card.trend.direction}
              percent={card.trend.percent}
              invertColor={card.invertColor}
            />
          </div>
          <p class="text-2xl font-bold text-slate-900 mb-1">{card.value}</p>
          <p class="text-sm text-slate-500">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
