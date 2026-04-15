import { useState, useEffect } from 'preact/hooks';

interface TicketData {
  id: string;
  ticketNumber: string;
  status: string;
  position: number;
  estimatedWaitMinutes: number;
  createdAt: string;
  calledAt?: string;
  servingStartedAt?: string;
  completedAt?: string;
  branchName: string;
  serviceName: string;
  serviceIcon: string;
  counterName?: string;
}

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface Props {
  ticket: string; // JSON serialized TicketData
  notifications: string; // JSON serialized NotificationData[]
}

const STATUS_LABELS: Record<string, string> = {
  waiting: 'Waiting',
  called: 'Called',
  serving: 'Serving',
  completed: 'Completed',
  no_show: 'No Show',
  cancelled: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  waiting: 'bg-blue-100 text-blue-700',
  called: 'bg-amber-100 text-amber-700',
  serving: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  no_show: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const PROGRESS_STEPS = ['Joined', 'Called', 'Serving', 'Done'];

function getStepIndex(status: string): number {
  switch (status) {
    case 'waiting': return 0;
    case 'called': return 1;
    case 'serving': return 2;
    case 'completed': return 3;
    default: return 0;
  }
}

function getWaitStatus(minutes: number): 'on_time' | 'delayed' | 'critical' {
  if (minutes < 10) return 'on_time';
  if (minutes < 20) return 'delayed';
  return 'critical';
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m ago`;
}

export default function TicketCard({ ticket: ticketJson, notifications: notificationsJson }: Props) {
  const ticketData: TicketData = JSON.parse(ticketJson);
  const notificationsData: NotificationData[] = JSON.parse(notificationsJson);

  const [waitMinutes, setWaitMinutes] = useState(ticketData.estimatedWaitMinutes);
  const [position, setPosition] = useState(ticketData.position);
  const [status, setStatus] = useState(ticketData.status);
  const [cancelled, setCancelled] = useState(false);

  // Mock countdown: decrement wait time every 15 seconds
  useEffect(() => {
    if (status !== 'waiting' && status !== 'called') return;

    const interval = setInterval(() => {
      setWaitMinutes((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          return 0;
        }
        return next;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [status]);

  // Mock position change: decrement position every 30 seconds
  useEffect(() => {
    if (status !== 'waiting') return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev <= 1) return 1;
        return prev - 1;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [status]);

  const waitStatus = getWaitStatus(waitMinutes);
  const stepIndex = getStepIndex(status);

  const ticketBgColor = {
    on_time: 'bg-emerald-600',
    delayed: 'bg-amber-500',
    critical: 'bg-red-600',
  }[waitStatus];

  const waitTextColor = {
    on_time: 'text-emerald-600',
    delayed: 'text-amber-600',
    critical: 'text-red-600',
  }[waitStatus];

  const ringColor = {
    on_time: 'ring-emerald-200',
    delayed: 'ring-amber-200',
    critical: 'ring-red-200',
  }[waitStatus];

  if (cancelled) {
    return (
      <div class="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">Ticket Cancelled</h2>
        <p class="text-gray-500 mb-6">Your ticket {ticketData.ticketNumber} has been cancelled.</p>
        <a href="/join" class="inline-block py-3 px-6 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
          Join Another Queue
        </a>
      </div>
    );
  }

  return (
    <div class="max-w-md mx-auto space-y-6">
      {/* Ticket Number Card */}
      <div class={`${ticketBgColor} text-white rounded-2xl p-8 text-center shadow-lg`}>
        <p class="text-sm font-medium uppercase tracking-wide opacity-80 mb-1">Your Ticket</p>
        <p class="text-5xl font-bold tracking-wider mb-3">{ticketData.ticketNumber}</p>
        <span class={`inline-block px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[status]} bg-white/90`}>
          {STATUS_LABELS[status] ?? status}
        </span>
      </div>

      {/* Position & Wait Time */}
      {(status === 'waiting' || status === 'called') && (
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Position</p>
            <div class={`inline-flex items-center justify-center w-16 h-16 rounded-full ring-4 ${ringColor} ${ticketBgColor} text-white text-2xl font-bold mb-1`}>
              #{position}
            </div>
            <p class="text-sm text-gray-600 mt-2">
              {position === 1 ? "You're next!" : `${position - 1} ahead of you`}
            </p>
          </div>
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Est. Wait</p>
            <p class={`text-3xl font-bold ${waitTextColor}`}>
              {waitMinutes < 60
                ? `${waitMinutes}m`
                : `${Math.floor(waitMinutes / 60)}h ${waitMinutes % 60}m`
              }
            </p>
            <p class="text-sm text-gray-600 mt-2">
              {waitStatus === 'on_time' && 'On track'}
              {waitStatus === 'delayed' && 'Slightly delayed'}
              {waitStatus === 'critical' && 'Longer than usual'}
            </p>
          </div>
        </div>
      )}

      {/* Called / Serving message */}
      {status === 'called' && ticketData.counterName && (
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p class="text-amber-800 font-semibold text-lg">It's your turn!</p>
          <p class="text-amber-700 text-sm">Please proceed to <span class="font-bold">{ticketData.counterName}</span></p>
        </div>
      )}

      {status === 'serving' && (
        <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p class="text-emerald-800 font-semibold text-lg">Being Served</p>
          <p class="text-emerald-700 text-sm">Your service is currently in progress</p>
        </div>
      )}

      {status === 'completed' && (
        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p class="text-gray-800 font-semibold text-lg">Service Completed</p>
          <p class="text-gray-600 text-sm">Thank you for visiting! We hope to see you again.</p>
        </div>
      )}

      {/* Progress Stepper */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-4">Progress</p>
        <div class="flex items-center justify-between">
          {PROGRESS_STEPS.map((label, i) => (
            <div key={label} class="flex items-center flex-1 last:flex-none">
              <div class="flex flex-col items-center">
                <div
                  class={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                    ${i <= stepIndex ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}
                  `}
                >
                  {i < stepIndex ? (
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span class={`text-xs mt-1 ${i <= stepIndex ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < PROGRESS_STEPS.length - 1 && (
                <div class={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Service & Branch Info */}
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <p class="text-xs text-gray-500 uppercase tracking-wide mb-3">Details</p>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">Service</span>
            <span class="font-medium text-gray-800">{ticketData.serviceIcon} {ticketData.serviceName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Branch</span>
            <span class="font-medium text-gray-800">{ticketData.branchName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Joined</span>
            <span class="font-medium text-gray-800">{formatRelativeTime(ticketData.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Notification area */}
      {status === 'waiting' && (
        <div class="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-indigo-800">Notifications enabled</p>
            <p class="text-xs text-indigo-600">You'll be notified when it's your turn</p>
          </div>
        </div>
      )}

      {/* Notification Timeline */}
      {notificationsData.length > 0 && (
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p class="text-xs text-gray-500 uppercase tracking-wide mb-3">Activity</p>
          <div class="space-y-3">
            {notificationsData.map((notif) => (
              <div key={notif.id} class="flex gap-3 text-sm">
                <div class="w-2 h-2 mt-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800">{notif.title}</p>
                  <p class="text-gray-500 text-xs">{notif.message}</p>
                  <p class="text-gray-400 text-xs mt-0.5">{formatRelativeTime(notif.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel button */}
      {(status === 'waiting' || status === 'called') && (
        <button
          type="button"
          onClick={() => setCancelled(true)}
          class="w-full py-3 px-4 rounded-lg border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
        >
          Cancel Ticket
        </button>
      )}
    </div>
  );
}
