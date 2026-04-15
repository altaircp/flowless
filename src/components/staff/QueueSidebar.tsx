interface TicketData {
  id: string;
  ticketNumber: string;
  customerId: string;
  serviceId: string;
  priority: string;
  position: number;
  createdAt: string;
}

interface ServiceData {
  id: string;
  name: string;
  icon: string;
}

interface CustomerData {
  id: string;
  name: string;
}

interface Props {
  tickets: string;   // JSON serialized TicketData[]
  services: string;  // JSON serialized ServiceData[]
  customers: string; // JSON serialized CustomerData[]
}

const PRIORITY_BADGE: Record<string, { label: string; className: string }> = {
  vip: { label: 'VIP', className: 'bg-purple-100 text-purple-700' },
  priority: { label: 'Priority', className: 'bg-amber-100 text-amber-700' },
  normal: { label: 'Normal', className: 'bg-slate-100 text-slate-600' },
};

function getWaitMinutes(createdAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}

function getWaitColor(minutes: number): string {
  if (minutes < 10) return 'text-emerald-600';
  if (minutes < 20) return 'text-amber-600';
  return 'text-red-600';
}

export default function QueueSidebar({ tickets: ticketsJson, services: servicesJson, customers: customersJson }: Props) {
  const ticketsList: TicketData[] = JSON.parse(ticketsJson);
  const servicesList: ServiceData[] = JSON.parse(servicesJson);
  const customersList: CustomerData[] = JSON.parse(customersJson);

  const serviceMap = new Map(servicesList.map((s) => [s.id, s]));
  const customerMap = new Map(customersList.map((c) => [c.id, c]));

  // Sort by priority (VIP=0, Priority=1, Normal=2), then position
  const priorityWeight: Record<string, number> = { vip: 0, priority: 1, normal: 2 };
  const sorted = [...ticketsList].sort((a, b) => {
    const pa = priorityWeight[a.priority] ?? 2;
    const pb = priorityWeight[b.priority] ?? 2;
    if (pa !== pb) return pa - pb;
    return a.position - b.position;
  });

  return (
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
        <h2 class="text-base font-semibold text-slate-900">Upcoming Queue</h2>
        <span class="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {sorted.length}
        </span>
      </div>

      {/* List */}
      <div class="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {sorted.length === 0 ? (
          <div class="flex flex-col items-center justify-center py-12 text-center">
            <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p class="text-sm font-medium text-slate-700">No customers waiting</p>
            <p class="text-xs text-slate-400 mt-1">The queue is clear</p>
          </div>
        ) : (
          sorted.map((ticket) => {
            const service = serviceMap.get(ticket.serviceId);
            const customer = customerMap.get(ticket.customerId);
            const waitMin = getWaitMinutes(ticket.createdAt);
            const waitColor = getWaitColor(waitMin);
            const badge = PRIORITY_BADGE[ticket.priority] ?? PRIORITY_BADGE.normal;

            return (
              <div
                key={ticket.id}
                class="px-3 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-sm font-bold text-slate-900 tracking-wide">
                    {ticket.ticketNumber}
                  </span>
                  <span class={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="min-w-0">
                    <p class="text-sm text-slate-700 truncate">{customer?.name ?? 'Unknown'}</p>
                    <p class="text-xs text-slate-400 truncate">
                      {service?.icon} {service?.name ?? 'Service'}
                    </p>
                  </div>
                  <div class={`text-xs font-semibold ${waitColor} flex-shrink-0 ml-2`}>
                    {waitMin < 60 ? `${waitMin}m` : `${Math.floor(waitMin / 60)}h ${waitMin % 60}m`}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
