import { useState } from 'preact/hooks';
import ServiceTimer from './ServiceTimer';
import TransferModal from './TransferModal';

// ---------- Serialized data types ----------
interface CounterData {
  id: string;
  number: number;
  displayName: string;
  status: string;
  currentTicketId?: string;
  staffId?: string;
  serviceIds: string[];
}

interface StaffData {
  id: string;
  name: string;
  avatarInitials: string;
  role: string;
}

interface TicketData {
  id: string;
  ticketNumber: string;
  customerId: string;
  serviceId: string;
  priority: string;
  source: string;
  position: number;
  createdAt: string;
  servingStartedAt?: string;
  notes?: string;
}

interface ServiceData {
  id: string;
  name: string;
  icon: string;
  estimatedDurationMinutes: number;
}

interface CustomerData {
  id: string;
  name: string;
  priority: string;
  visitCount: number;
}

interface TransferCounterData {
  id: string;
  number: number;
  displayName: string;
  status: string;
  staffName: string;
  serviceNames: string[];
}

interface Props {
  counter: string;
  staff: string;
  currentTicket: string;   // JSON or "null"
  waitingTickets: string;
  services: string;
  customers: string;
  allCounters: string;
  allStaff: string;
}

// ---------- Helpers ----------
const PRIORITY_BADGE: Record<string, { label: string; class: string }> = {
  vip: { label: 'VIP', class: 'bg-purple-100 text-purple-700 ring-1 ring-purple-300' },
  priority: { label: 'Priority', class: 'bg-amber-100 text-amber-700 ring-1 ring-amber-300' },
  normal: { label: 'Normal', class: 'bg-slate-100 text-slate-600' },
};

const SOURCE_BADGE: Record<string, { label: string; class: string }> = {
  walk_in: { label: 'Walk-in', class: 'bg-slate-100 text-slate-600' },
  kiosk: { label: 'Kiosk', class: 'bg-sky-100 text-sky-700' },
  online: { label: 'Online', class: 'bg-indigo-100 text-indigo-700' },
  appointment: { label: 'Appointment', class: 'bg-emerald-100 text-emerald-700' },
};

const STATUS_COLOR: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-700',
  serving: 'bg-blue-100 text-blue-700',
  on_break: 'bg-amber-100 text-amber-700',
  closed: 'bg-slate-100 text-slate-500',
};

const STATUS_LABEL: Record<string, string> = {
  open: 'Available',
  serving: 'Serving',
  on_break: 'On Break',
  closed: 'Closed',
};

export default function CounterPanel({
  counter: counterJson,
  staff: staffJson,
  currentTicket: currentTicketJson,
  waitingTickets: waitingTicketsJson,
  services: servicesJson,
  customers: customersJson,
  allCounters: allCountersJson,
  allStaff: allStaffJson,
}: Props) {
  const counter: CounterData = JSON.parse(counterJson);
  const staffMember: StaffData = JSON.parse(staffJson);
  const initialTicket: TicketData | null = currentTicketJson === 'null' ? null : JSON.parse(currentTicketJson);
  const waitingList: TicketData[] = JSON.parse(waitingTicketsJson);
  const servicesList: ServiceData[] = JSON.parse(servicesJson);
  const customersList: CustomerData[] = JSON.parse(customersJson);
  const allCountersList: CounterData[] = JSON.parse(allCountersJson);
  const allStaffList: StaffData[] = JSON.parse(allStaffJson);

  const serviceMap = new Map(servicesList.map((s) => [s.id, s]));
  const customerMap = new Map(customersList.map((c) => [c.id, c]));
  const staffMap = new Map(allStaffList.map((s) => [s.id, s]));

  // --- State ---
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(initialTicket);
  const [remaining, setRemaining] = useState<TicketData[]>(waitingList);
  const [counterStatus, setCounterStatus] = useState(counter.status);
  const [servedCount, setServedCount] = useState(0);
  const [notes, setNotes] = useState(activeTicket?.notes ?? '');
  const [showTransfer, setShowTransfer] = useState(false);

  // --- Actions ---
  function callNext() {
    if (remaining.length === 0) return;

    const priorityWeight: Record<string, number> = { vip: 0, priority: 1, normal: 2 };
    const sorted = [...remaining].sort((a, b) => {
      const pa = priorityWeight[a.priority] ?? 2;
      const pb = priorityWeight[b.priority] ?? 2;
      if (pa !== pb) return pa - pb;
      return a.position - b.position;
    });

    const next = sorted[0];
    const now = new Date().toISOString();
    next.servingStartedAt = now;

    setActiveTicket(next);
    setRemaining(sorted.slice(1));
    setCounterStatus('serving');
    setNotes('');
  }

  function completeService() {
    if (!activeTicket) return;
    setActiveTicket(null);
    setCounterStatus('open');
    setServedCount((c) => c + 1);
    setNotes('');
  }

  function markNoShow() {
    if (!activeTicket) return;
    setActiveTicket(null);
    setCounterStatus('open');
    setNotes('');
    // Auto-call next
    setTimeout(callNext, 300);
  }

  function handleTransfer(_targetCounterId: string) {
    // In a real app, this would transfer the ticket to the target counter
    setActiveTicket(null);
    setCounterStatus('open');
    setShowTransfer(false);
    setNotes('');
  }

  // --- Derived ---
  const customer = activeTicket ? customerMap.get(activeTicket.customerId) : null;
  const service = activeTicket ? serviceMap.get(activeTicket.serviceId) : null;
  const priorityBadge = activeTicket ? PRIORITY_BADGE[activeTicket.priority] ?? PRIORITY_BADGE.normal : null;
  const sourceBadge = activeTicket ? SOURCE_BADGE[activeTicket.source] ?? SOURCE_BADGE.walk_in : null;
  const statusColor = STATUS_COLOR[counterStatus] ?? STATUS_COLOR.closed;
  const statusLabel = STATUS_LABEL[counterStatus] ?? counterStatus;

  // Build transfer counters (exclude current)
  const transferCounters: TransferCounterData[] = allCountersList
    .filter((c) => c.id !== counter.id)
    .map((c) => {
      const s = c.staffId ? staffMap.get(c.staffId) : null;
      return {
        id: c.id,
        number: c.number,
        displayName: c.displayName,
        status: c.status,
        staffName: s?.name ?? 'Unassigned',
        serviceNames: c.serviceIds.map((sid) => serviceMap.get(sid)?.name ?? sid),
      };
    });

  // Quick stats
  const avgServiceTime = servicesList.length > 0
    ? Math.round(servicesList.reduce((sum, s) => sum + s.estimatedDurationMinutes, 0) / servicesList.length)
    : 0;

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-5">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white text-lg font-bold">
              {counter.number}
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900">{counter.displayName}</h1>
              <p class="text-sm text-slate-500">{staffMember.name} &middot; {staffMember.role}</p>
            </div>
          </div>
          <span class={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Main content */}
      {!activeTicket ? (
        /* --- No active ticket --- */
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 px-6 py-10 text-center">
          <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={1.5}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 class="text-lg font-semibold text-slate-700 mb-1">No active ticket</h2>
          <p class="text-sm text-slate-400 mb-6">
            {remaining.length > 0
              ? `${remaining.length} customer${remaining.length !== 1 ? 's' : ''} waiting in queue`
              : 'Queue is empty'}
          </p>

          <button
            type="button"
            onClick={callNext}
            disabled={remaining.length === 0}
            class="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Call Next
          </button>

          {/* Quick stats */}
          <div class="mt-8 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-2xl font-bold text-slate-900">{servedCount}</p>
              <p class="text-xs text-slate-500 mt-0.5">Served today</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-4">
              <p class="text-2xl font-bold text-slate-900">{avgServiceTime}m</p>
              <p class="text-xs text-slate-500 mt-0.5">Avg service</p>
            </div>
          </div>
        </div>
      ) : (
        /* --- Currently serving --- */
        <div class="space-y-4">
          {/* Ticket card */}
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Ticket header strip */}
            <div class="bg-brand-600 px-6 py-4 flex items-center justify-between">
              <div>
                <p class="text-brand-200 text-xs font-medium uppercase tracking-wide">Now Serving</p>
                <p class="text-white text-3xl font-bold tracking-wider mt-0.5">{activeTicket.ticketNumber}</p>
              </div>
              {activeTicket.servingStartedAt && (
                <ServiceTimer startTime={activeTicket.servingStartedAt} />
              )}
            </div>

            {/* Customer info */}
            <div class="px-6 py-5">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-slate-900">{customer?.name ?? 'Unknown Customer'}</h3>
                  <p class="text-sm text-slate-500 mt-0.5">
                    {service?.icon} {service?.name ?? 'Service'} &middot; Visit #{customer?.visitCount ?? 1}
                  </p>
                </div>
                <div class="flex gap-2">
                  {priorityBadge && activeTicket.priority !== 'normal' && (
                    <span class={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityBadge.class}`}>
                      {priorityBadge.label}
                    </span>
                  )}
                  {sourceBadge && (
                    <span class={`text-xs font-medium px-2.5 py-1 rounded-full ${sourceBadge.class}`}>
                      {sourceBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Estimated time for this service */}
              {service && (
                <div class="text-xs text-slate-400 mb-4">
                  Estimated avg for {service.name}: {service.estimatedDurationMinutes} min
                </div>
              )}

              {/* Notes */}
              <div class="mb-4">
                <label class="block text-xs font-medium text-slate-500 mb-1.5">Customer Notes</label>
                <textarea
                  value={notes}
                  onInput={(e) => setNotes((e.target as HTMLTextAreaElement).value)}
                  placeholder="Add notes about this service..."
                  rows={2}
                  class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action buttons */}
              <div class="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={completeService}
                  class="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Complete Service
                </button>
                <button
                  type="button"
                  onClick={markNoShow}
                  class="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  No Show
                </button>
                <button
                  type="button"
                  onClick={() => setShowTransfer(true)}
                  class="flex-1 min-w-[110px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer modal */}
      <TransferModal
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        counters={transferCounters}
        onTransfer={handleTransfer}
      />
    </div>
  );
}
