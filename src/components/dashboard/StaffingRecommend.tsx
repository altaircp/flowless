import type { Queue, Counter, Ticket, Staff, Service } from '../../data/types';

interface Props {
  queues: string;
  counters: string;
  tickets: string;
  staff: string;
  services: string;
}

interface Recommendation {
  id: string;
  text: string;
  impact: string;
  type: 'open' | 'redirect' | 'close' | 'break';
}

function generateRecommendations(
  queues: Queue[],
  counters: Counter[],
  tickets: Ticket[],
  staff: Staff[],
  services: Service[],
): Recommendation[] {
  const serviceMap = new Map(services.map((s) => [s.id, s]));
  const recs: Recommendation[] = [];

  // 1. Suggest opening closed counters when queue is long
  for (const q of queues) {
    if (q.state !== 'active') continue;
    const waitingCount = q.activeTicketIds.length;
    if (waitingCount < 4) continue;

    const service = serviceMap.get(q.serviceId);
    const serviceName = service?.name ?? q.prefix;

    // Find closed counters that could serve this queue
    const closedCounters = counters.filter(
      (c) =>
        c.branchId === q.branchId &&
        (c.status === 'closed' || c.status === 'on_break') &&
        c.serviceIds.includes(q.serviceId),
    );

    if (closedCounters.length > 0) {
      recs.push({
        id: `open-${closedCounters[0].id}`,
        text: `Open ${closedCounters[0].displayName} — ${waitingCount} customers waiting for ${serviceName}`,
        impact: `Could reduce wait time by ~${Math.round(waitingCount * (q.averageServiceMinutes / 2))} min`,
        type: 'open',
      });
    }
  }

  // 2. Redirect customers from overloaded counters
  const activeQueues = queues.filter((q) => q.state === 'active');
  const sortedByLoad = [...activeQueues].sort(
    (a, b) => b.activeTicketIds.length - a.activeTicketIds.length,
  );

  if (sortedByLoad.length >= 2) {
    const busiest = sortedByLoad[0];
    const quietest = sortedByLoad[sortedByLoad.length - 1];
    if (
      busiest.activeTicketIds.length > 5 &&
      quietest.activeTicketIds.length < 2 &&
      busiest.branchId === quietest.branchId
    ) {
      const busiestService = serviceMap.get(busiest.serviceId)?.name ?? busiest.prefix;
      const quietestCounters = counters.filter(
        (c) => c.branchId === quietest.branchId && c.serviceIds.includes(quietest.serviceId) && c.status === 'open',
      );
      if (quietestCounters.length > 0) {
        recs.push({
          id: `redirect-${busiest.id}`,
          text: `Redirect ${busiestService} customers to ${quietestCounters[0].displayName} — overloaded queue`,
          impact: `${busiest.activeTicketIds.length} customers waiting vs ${quietest.activeTicketIds.length} at alternative`,
          type: 'redirect',
        });
      }
    }
  }

  // 3. Suggest closing empty queues/counters
  for (const q of queues) {
    if (q.state !== 'active') continue;
    if (q.activeTicketIds.length > 0) continue;

    const servingCounters = counters.filter(
      (c) =>
        c.branchId === q.branchId &&
        c.serviceIds.includes(q.serviceId) &&
        (c.status === 'open' || c.status === 'serving'),
    );

    if (servingCounters.length > 1) {
      const openCounter = servingCounters.find((c) => c.status === 'open');
      if (openCounter) {
        const serviceName = serviceMap.get(q.serviceId)?.name ?? q.prefix;
        recs.push({
          id: `close-${openCounter.id}`,
          text: `Consider closing ${openCounter.displayName} — no customers in ${serviceName} queue`,
          impact: 'Staff can be reassigned to busier queues',
          type: 'close',
        });
      }
    }
  }

  // 4. Suggest break for staff who have served many customers
  const staffSessions = new Map<string, number>();
  const todayStr = new Date().toISOString().slice(0, 10);
  for (const t of tickets) {
    if (t.status === 'completed' && t.staffId && t.completedAt?.startsWith(todayStr)) {
      staffSessions.set(t.staffId, (staffSessions.get(t.staffId) ?? 0) + 1);
    }
  }
  for (const [staffId, count] of staffSessions) {
    if (count >= 15) {
      const member = staff.find((s) => s.id === staffId);
      if (member) {
        recs.push({
          id: `break-${staffId}`,
          text: `Schedule a break for ${member.name} — ${count} tickets served today`,
          impact: 'Helps maintain service quality and staff wellbeing',
          type: 'break',
        });
      }
    }
  }

  return recs.slice(0, 5);
}

const TYPE_ICONS: Record<string, { bg: string; color: string }> = {
  open: { bg: 'bg-emerald-100', color: 'text-emerald-600' },
  redirect: { bg: 'bg-blue-100', color: 'text-blue-600' },
  close: { bg: 'bg-slate-100', color: 'text-slate-600' },
  break: { bg: 'bg-amber-100', color: 'text-amber-600' },
};

function RecIcon({ type }: { type: string }) {
  const styles = TYPE_ICONS[type] ?? TYPE_ICONS.open;
  if (type === 'open') {
    return (
      <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.bg}`}>
        <svg class={`w-4 h-4 ${styles.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
    );
  }
  if (type === 'redirect') {
    return (
      <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.bg}`}>
        <svg class={`w-4 h-4 ${styles.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      </div>
    );
  }
  if (type === 'close') {
    return (
      <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.bg}`}>
        <svg class={`w-4 h-4 ${styles.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  }
  return (
    <div class={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.bg}`}>
      <svg class={`w-4 h-4 ${styles.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  );
}

export default function StaffingRecommend({
  queues: queuesJson,
  counters: countersJson,
  tickets: ticketsJson,
  staff: staffJson,
  services: servicesJson,
}: Props) {
  const queues: Queue[] = JSON.parse(queuesJson);
  const counters: Counter[] = JSON.parse(countersJson);
  const tickets: Ticket[] = JSON.parse(ticketsJson);
  const staffList: Staff[] = JSON.parse(staffJson);
  const services: Service[] = JSON.parse(servicesJson);

  const recs = generateRecommendations(queues, counters, tickets, staffList, services);

  return (
    <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-slate-900">Staffing Recommendations</h3>
        <span class="text-xs text-slate-400 font-medium">AI-powered</span>
      </div>

      {recs.length === 0 ? (
        <div class="text-center py-8">
          <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg class="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-sm text-slate-500">Staffing levels are optimal</p>
        </div>
      ) : (
        <div class="space-y-3">
          {recs.map((rec) => (
            <div key={rec.id} class="flex items-start gap-3 p-3 rounded-lg bg-slate-50/70 hover:bg-slate-50 transition-colors">
              <RecIcon type={rec.type} />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-800 leading-snug">{rec.text}</p>
                <p class="text-xs text-slate-400 mt-1">{rec.impact}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
