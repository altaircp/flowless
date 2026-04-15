import { useState } from 'preact/hooks';

interface Queue {
  id: string;
  branchId: string;
  serviceId: string;
  state: string;
  prefix: string;
  currentNumber: number;
  activeTicketIds: string[];
  averageWaitMinutes: number;
  averageServiceMinutes: number;
  maxCapacity?: number;
}

interface Props {
  queues: string;
}

interface QueueRules {
  priorityEnabled: boolean;
  priorityWeight: number;
  onTimeThreshold: number;
  delayedThreshold: number;
  criticalThreshold: number;
  smartRouting: boolean;
  maxTicketsPerQueue: number;
  notifySms: boolean;
  notifyEmail: boolean;
  notifyInApp: boolean;
  notifyOnCreated: boolean;
  notifyOnCalled: boolean;
  notifyOnDelayed: boolean;
  notifyOnCompleted: boolean;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-brand-600' : 'bg-slate-300'
      }`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
    >
      <span
        class={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function QueueRulesEditor({ queues: queuesJson }: Props) {
  const queueList: Queue[] = JSON.parse(queuesJson);

  const [rules, setRules] = useState<QueueRules>({
    priorityEnabled: true,
    priorityWeight: 2,
    onTimeThreshold: 10,
    delayedThreshold: 20,
    criticalThreshold: 35,
    smartRouting: true,
    maxTicketsPerQueue: queueList[0]?.maxCapacity ?? 50,
    notifySms: true,
    notifyEmail: true,
    notifyInApp: true,
    notifyOnCreated: true,
    notifyOnCalled: true,
    notifyOnDelayed: true,
    notifyOnCompleted: true,
  });

  const [saved, setSaved] = useState(false);

  function update<K extends keyof QueueRules>(field: K, value: QueueRules[K]) {
    setRules((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    // In-memory only; would persist to backend in real app
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div class="space-y-6">
      {/* Priority settings */}
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h4 class="text-base font-semibold text-slate-900 mb-1">Priority Queue</h4>
        <p class="text-sm text-slate-500 mb-4">
          Enable VIP and priority handling so high-value customers are served first.
        </p>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-700">Enable Priority Queue</p>
              <p class="text-xs text-slate-400">VIP and Priority tickets skip ahead in the queue</p>
            </div>
            <Toggle
              checked={rules.priorityEnabled}
              onChange={() => update('priorityEnabled', !rules.priorityEnabled)}
              label="Enable priority queue"
            />
          </div>
          {rules.priorityEnabled && (
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Priority Weight Multiplier
              </label>
              <p class="text-xs text-slate-400 mb-2">
                How much faster priority tickets move up (e.g. 2x means twice as fast).
              </p>
              <input
                type="number"
                min="1"
                max="10"
                step="0.5"
                class="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={rules.priorityWeight}
                onInput={(e) =>
                  update('priorityWeight', parseFloat((e.target as HTMLInputElement).value) || 1)
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Wait time thresholds */}
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h4 class="text-base font-semibold text-slate-900 mb-1">Wait Time Thresholds</h4>
        <p class="text-sm text-slate-500 mb-4">
          Define when a wait time is considered on-time, delayed, or critical. Used for alerts and color-coding.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-emerald-700 mb-1">On-Time (minutes)</label>
            <input
              type="number"
              min="1"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              value={rules.onTimeThreshold}
              onInput={(e) =>
                update('onTimeThreshold', parseInt((e.target as HTMLInputElement).value) || 1)
              }
            />
            <p class="text-xs text-slate-400 mt-1">Below this = on time</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-amber-700 mb-1">Delayed (minutes)</label>
            <input
              type="number"
              min="1"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              value={rules.delayedThreshold}
              onInput={(e) =>
                update('delayedThreshold', parseInt((e.target as HTMLInputElement).value) || 1)
              }
            />
            <p class="text-xs text-slate-400 mt-1">Between on-time and this = delayed</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-red-700 mb-1">Critical (minutes)</label>
            <input
              type="number"
              min="1"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              value={rules.criticalThreshold}
              onInput={(e) =>
                update('criticalThreshold', parseInt((e.target as HTMLInputElement).value) || 1)
              }
            />
            <p class="text-xs text-slate-400 mt-1">Above this = critical</p>
          </div>
        </div>
      </div>

      {/* Auto-routing */}
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h4 class="text-base font-semibold text-slate-900 mb-1">Smart Routing</h4>
        <p class="text-sm text-slate-500 mb-4">
          Automatically assign tickets to the best available counter based on staff skills and queue length.
        </p>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-slate-700">Enable Smart Routing</p>
            <p class="text-xs text-slate-400">When disabled, tickets are manually assigned by supervisors</p>
          </div>
          <Toggle
            checked={rules.smartRouting}
            onChange={() => update('smartRouting', !rules.smartRouting)}
            label="Enable smart routing"
          />
        </div>
      </div>

      {/* Capacity */}
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h4 class="text-base font-semibold text-slate-900 mb-1">Queue Capacity</h4>
        <p class="text-sm text-slate-500 mb-4">
          Maximum number of active tickets allowed per queue. New tickets are rejected when the limit is reached.
        </p>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Max Tickets per Queue</label>
          <input
            type="number"
            min="1"
            class="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            value={rules.maxTicketsPerQueue}
            onInput={(e) =>
              update('maxTicketsPerQueue', parseInt((e.target as HTMLInputElement).value) || 1)
            }
          />
        </div>
      </div>

      {/* Notifications */}
      <div class="bg-white rounded-xl border border-slate-200 p-6">
        <h4 class="text-base font-semibold text-slate-900 mb-1">Notifications</h4>
        <p class="text-sm text-slate-500 mb-4">
          Configure how customers are notified about their queue status.
        </p>

        {/* Channels */}
        <div class="mb-5">
          <p class="text-sm font-medium text-slate-700 mb-3">Notification Channels</p>
          <div class="flex flex-wrap gap-4">
            <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <Toggle
                checked={rules.notifySms}
                onChange={() => update('notifySms', !rules.notifySms)}
                label="SMS notifications"
              />
              SMS
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <Toggle
                checked={rules.notifyEmail}
                onChange={() => update('notifyEmail', !rules.notifyEmail)}
                label="Email notifications"
              />
              Email
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <Toggle
                checked={rules.notifyInApp}
                onChange={() => update('notifyInApp', !rules.notifyInApp)}
                label="In-app notifications"
              />
              In-App
            </label>
          </div>
        </div>

        {/* Events */}
        <div>
          <p class="text-sm font-medium text-slate-700 mb-3">Event Types</p>
          <div class="space-y-3">
            {[
              { key: 'notifyOnCreated' as const, label: 'Ticket Created', desc: 'When a new ticket is issued' },
              { key: 'notifyOnCalled' as const, label: 'Called to Counter', desc: 'When it is the customer\'s turn' },
              { key: 'notifyOnDelayed' as const, label: 'Wait Time Delayed', desc: 'When wait exceeds delayed threshold' },
              { key: 'notifyOnCompleted' as const, label: 'Service Completed', desc: 'When service is finished' },
            ].map((evt) => (
              <div key={evt.key} class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-slate-700">{evt.label}</p>
                  <p class="text-xs text-slate-400">{evt.desc}</p>
                </div>
                <Toggle
                  checked={rules[evt.key]}
                  onChange={() => update(evt.key, !rules[evt.key])}
                  label={evt.label}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save */}
      <div class="flex items-center gap-4">
        <button
          class="px-6 py-2.5 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
          onClick={handleSave}
        >
          Save Queue Rules
        </button>
        {saved && (
          <span class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Settings saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
