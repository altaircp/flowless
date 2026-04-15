import type { Queue, Counter, Ticket } from '../../data/types';

interface Props {
  queues: string; // JSON serialized Queue[]
  counters: string; // JSON serialized Counter[]
  tickets: string; // JSON serialized Ticket[]
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
}

function generateAlerts(queues: Queue[], counters: Counter[], tickets: Ticket[]): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date().toISOString();

  // Long wait alert: any queue with avg wait > 15min
  for (const q of queues) {
    if (q.state === 'active' && q.averageWaitMinutes > 15) {
      alerts.push({
        id: `longwait-${q.id}`,
        severity: q.averageWaitMinutes > 25 ? 'critical' : 'warning',
        title: 'Long Wait Time',
        description: `Queue ${q.prefix} has an average wait of ${q.averageWaitMinutes} min. Consider opening additional counters.`,
        timestamp: now,
      });
    }
  }

  // Understaffed alert: closed counters while queues have >5 waiting
  for (const q of queues) {
    if (q.state !== 'active') continue;
    const waitingCount = q.activeTicketIds.length;
    if (waitingCount > 5) {
      const branchCounters = counters.filter(
        (c) => c.branchId === q.branchId && c.serviceIds.includes(q.serviceId),
      );
      const closedCounters = branchCounters.filter((c) => c.status === 'closed' || c.status === 'on_break');
      if (closedCounters.length > 0) {
        alerts.push({
          id: `understaffed-${q.id}`,
          severity: 'critical',
          title: 'Understaffed Queue',
          description: `${waitingCount} customers waiting in ${q.prefix} queue but ${closedCounters.length} counter(s) are closed or on break.`,
          timestamp: now,
        });
      }
    }
  }

  // No-show alert: count no-show tickets today
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayNoShows = tickets.filter(
    (t) => t.status === 'no_show' && t.createdAt.startsWith(todayStr),
  );
  if (todayNoShows.length >= 5) {
    alerts.push({
      id: 'noshow-high',
      severity: 'warning',
      title: 'High No-Show Rate',
      description: `${todayNoShows.length} no-shows recorded today. Consider implementing SMS reminders.`,
      timestamp: now,
    });
  }

  // SLA breach: any waiting ticket with estimated wait > 30min
  const breachTickets = tickets.filter(
    (t) => t.status === 'waiting' && t.estimatedWaitMinutes > 30,
  );
  if (breachTickets.length > 0) {
    alerts.push({
      id: 'sla-breach',
      severity: 'critical',
      title: 'SLA Breach Risk',
      description: `${breachTickets.length} customer(s) have estimated wait times exceeding 30 minutes.`,
      timestamp: now,
    });
  }

  // If no alerts, add an info message
  if (alerts.length === 0) {
    alerts.push({
      id: 'all-clear',
      severity: 'info',
      title: 'All Clear',
      description: 'No active alerts. All queues are operating within normal parameters.',
      timestamp: now,
    });
  }

  return alerts.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });
}

const SEVERITY_STYLES: Record<string, { badge: string; icon: string; border: string }> = {
  critical: {
    badge: 'bg-red-100 text-red-700',
    icon: 'text-red-500',
    border: 'border-l-red-500',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-700',
    icon: 'text-amber-500',
    border: 'border-l-amber-400',
  },
  info: {
    badge: 'bg-blue-100 text-blue-700',
    icon: 'text-blue-500',
    border: 'border-l-blue-400',
  },
};

function AlertIcon({ severity }: { severity: string }) {
  const color = SEVERITY_STYLES[severity]?.icon ?? 'text-slate-400';
  if (severity === 'critical') {
    return (
      <svg class={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    );
  }
  if (severity === 'warning') {
    return (
      <svg class={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    );
  }
  return (
    <svg class={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

export default function AlertPanel({ queues: queuesJson, counters: countersJson, tickets: ticketsJson }: Props) {
  const queues: Queue[] = JSON.parse(queuesJson);
  const counters: Counter[] = JSON.parse(countersJson);
  const tickets: Ticket[] = JSON.parse(ticketsJson);

  const alerts = generateAlerts(queues, counters, tickets);

  return (
    <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-slate-900">Active Alerts</h3>
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          {alerts.length}
        </span>
      </div>

      <div class="space-y-2.5 max-h-80 overflow-y-auto">
        {alerts.map((alert) => {
          const styles = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;
          return (
            <div
              key={alert.id}
              class={`flex items-start gap-3 p-3 rounded-lg border-l-4 bg-slate-50/50 ${styles.border}`}
            >
              <div class="flex-shrink-0 mt-0.5">
                <AlertIcon severity={alert.severity} />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="text-sm font-semibold text-slate-800">{alert.title}</span>
                  <span class={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${styles.badge}`}>
                    {alert.severity}
                  </span>
                </div>
                <p class="text-xs text-slate-500 leading-relaxed">{alert.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
