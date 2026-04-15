import type { ServiceSession, Staff } from '../../data/types';
import { getStaffPerformance } from '../../lib/analytics';

interface Props {
  sessions: string; // JSON serialized ServiceSession[]
  staff: string; // JSON serialized Staff[]
}

function UtilizationBar({ value }: { value: number }) {
  const color =
    value >= 80 ? 'bg-emerald-500' : value >= 50 ? 'bg-amber-400' : 'bg-red-400';
  const bgColor =
    value >= 80 ? 'bg-emerald-100' : value >= 50 ? 'bg-amber-100' : 'bg-red-100';

  return (
    <div class="flex items-center gap-2">
      <div class={`flex-1 h-2 rounded-full ${bgColor}`}>
        <div
          class={`h-2 rounded-full ${color} transition-all`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span class="text-xs font-semibold text-slate-600 w-10 text-right">
        {value}%
      </span>
    </div>
  );
}

export default function StaffUtilTable({ sessions: sessionsJson, staff: staffJson }: Props) {
  const sessions: ServiceSession[] = JSON.parse(sessionsJson);
  const staffList: Staff[] = JSON.parse(staffJson);

  const performance = getStaffPerformance(sessions, staffList).sort(
    (a, b) => b.utilization - a.utilization,
  );

  // Map staff ID to role
  const roleMap = new Map(staffList.map((s) => [s.id, s.role]));

  const roleLabels: Record<string, string> = {
    agent: 'Agent',
    supervisor: 'Supervisor',
    manager: 'Manager',
    admin: 'Admin',
  };

  return (
    <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
      <h3 class="text-base font-semibold text-slate-900 mb-4">Staff Performance</h3>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Staff
              </th>
              <th class="text-left py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">
                Role
              </th>
              <th class="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tickets
              </th>
              <th class="text-right py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                Avg Time
              </th>
              <th class="py-2.5 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-36">
                Utilization
              </th>
            </tr>
          </thead>
          <tbody>
            {performance.map((perf) => {
              const role = roleMap.get(perf.staffId) ?? 'agent';
              return (
                <tr key={perf.staffId} class="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td class="py-3 px-3">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {perf.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span class="font-medium text-slate-800">{perf.name}</span>
                    </div>
                  </td>
                  <td class="py-3 px-3 hidden sm:table-cell">
                    <span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                      {roleLabels[role] ?? role}
                    </span>
                  </td>
                  <td class="py-3 px-3 text-right font-semibold text-slate-700">
                    {perf.ticketsServed}
                  </td>
                  <td class="py-3 px-3 text-right text-slate-600 hidden md:table-cell">
                    {perf.avgDuration} min
                  </td>
                  <td class="py-3 px-3">
                    <UtilizationBar value={perf.utilization} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {performance.length === 0 && (
        <p class="text-center text-slate-400 py-8 text-sm">No session data available</p>
      )}
    </div>
  );
}
