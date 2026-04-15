import { useState } from 'preact/hooks';
import type { AnalyticsSnapshot } from '../../data/types';

interface Props {
  snapshots: string; // JSON serialized AnalyticsSnapshot[]
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8-18

function getIntensityColor(value: number, max: number): string {
  if (max === 0) return 'bg-slate-50';
  const ratio = value / max;
  if (ratio === 0) return 'bg-slate-50';
  if (ratio < 0.2) return 'bg-emerald-100';
  if (ratio < 0.4) return 'bg-emerald-300';
  if (ratio < 0.6) return 'bg-yellow-300';
  if (ratio < 0.8) return 'bg-orange-400';
  return 'bg-red-500';
}

function getTextColor(value: number, max: number): string {
  if (max === 0) return 'text-slate-300';
  const ratio = value / max;
  if (ratio >= 0.6) return 'text-white';
  if (ratio >= 0.2) return 'text-slate-700';
  return 'text-slate-400';
}

export default function HourlyHeatmap({ snapshots: snapshotsJson }: Props) {
  const snapshots: AnalyticsSnapshot[] = JSON.parse(snapshotsJson);
  const [tooltip, setTooltip] = useState<{ day: string; hour: number; count: number; x: number; y: number } | null>(null);

  // Build grid: day of week x hour -> total tickets
  const grid = new Map<string, number>();
  let maxVal = 0;

  for (const snap of snapshots) {
    const date = new Date(snap.date + 'T00:00:00');
    const dayIndex = (date.getDay() + 6) % 7; // Mon=0, Sun=6
    const day = DAYS[dayIndex];
    const key = `${day}-${snap.hour}`;
    const current = (grid.get(key) ?? 0) + snap.totalTicketsIssued;
    grid.set(key, current);
    if (current > maxVal) maxVal = current;
  }

  const hourLabels = HOURS.map((h) => {
    const suffix = h >= 12 ? 'PM' : 'AM';
    const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${display}${suffix}`;
  });

  return (
    <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5 relative">
      <h3 class="text-base font-semibold text-slate-900 mb-4">Weekly Traffic Heatmap</h3>

      <div class="overflow-x-auto">
        <div class="min-w-[500px]">
          {/* Hour labels */}
          <div class="flex mb-1">
            <div class="w-10 flex-shrink-0" />
            {hourLabels.map((label) => (
              <div key={label} class="flex-1 text-center text-[10px] text-slate-400 font-medium">
                {label}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAYS.map((day) => (
            <div key={day} class="flex items-center gap-0.5 mb-0.5">
              <div class="w-10 flex-shrink-0 text-xs text-slate-500 font-medium text-right pr-2">
                {day}
              </div>
              {HOURS.map((hour) => {
                const count = grid.get(`${day}-${hour}`) ?? 0;
                return (
                  <div
                    key={hour}
                    class={`flex-1 aspect-[2/1] rounded-sm flex items-center justify-center cursor-default transition-transform hover:scale-110 ${getIntensityColor(count, maxVal)}`}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      setTooltip({ day, hour, count, x: rect.left + rect.width / 2, y: rect.top });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <span class={`text-[9px] font-medium ${getTextColor(count, maxVal)}`}>
                      {count > 0 ? count : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div class="flex items-center justify-end gap-1 mt-3">
            <span class="text-[10px] text-slate-400 mr-1">Less</span>
            <div class="w-4 h-3 rounded-sm bg-slate-50 border border-slate-200" />
            <div class="w-4 h-3 rounded-sm bg-emerald-100" />
            <div class="w-4 h-3 rounded-sm bg-emerald-300" />
            <div class="w-4 h-3 rounded-sm bg-yellow-300" />
            <div class="w-4 h-3 rounded-sm bg-orange-400" />
            <div class="w-4 h-3 rounded-sm bg-red-500" />
            <span class="text-[10px] text-slate-400 ml-1">More</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          class="fixed z-50 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-md shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full -mt-2"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.day} {tooltip.hour > 12 ? tooltip.hour - 12 : tooltip.hour}
          {tooltip.hour >= 12 ? 'PM' : 'AM'}: <strong>{tooltip.count}</strong> tickets
        </div>
      )}
    </div>
  );
}
