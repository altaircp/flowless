import { useRef, useEffect } from 'preact/hooks';
import { Chart, registerables } from 'chart.js';
import type { WaitTimeEvent } from '../../data/types';

Chart.register(...registerables);

interface Props {
  waitTimeEvents: string; // JSON serialized WaitTimeEvent[]
}

export default function WaitTimeChart({ waitTimeEvents: eventsJson }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const events: WaitTimeEvent[] = JSON.parse(eventsJson);

    // Group by date, then by hour
    const byDate = new Map<string, Map<number, { total: number; count: number }>>();
    for (const evt of events) {
      const date = evt.timestamp.slice(0, 10);
      const hour = new Date(evt.timestamp).getHours();
      if (!byDate.has(date)) byDate.set(date, new Map());
      const hourMap = byDate.get(date)!;
      const entry = hourMap.get(hour) ?? { total: 0, count: 0 };
      entry.total += evt.averageWaitMinutes;
      entry.count += 1;
      hourMap.set(hour, entry);
    }

    const dates = [...byDate.keys()].sort();
    const today = dates[dates.length - 1] ?? '';
    const yesterday = dates[dates.length - 2] ?? '';

    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8AM to 6PM
    const labels = hours.map((h) => {
      const suffix = h >= 12 ? 'PM' : 'AM';
      const display = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${display}${suffix}`;
    });

    function getHourlyData(date: string) {
      const hourMap = byDate.get(date);
      return hours.map((h) => {
        const entry = hourMap?.get(h);
        if (!entry || entry.count === 0) return null;
        return Math.round((entry.total / entry.count) * 10) / 10;
      });
    }

    const todayData = getHourlyData(today);
    const yesterdayData = getHourlyData(yesterday);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Today',
            data: todayData,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#6366f1',
            spanGaps: true,
          },
          {
            label: 'Yesterday',
            data: yesterdayData,
            borderColor: '#cbd5e1',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 3],
            fill: false,
            tension: 0.4,
            pointRadius: 2,
            pointHoverRadius: 5,
            pointBackgroundColor: '#cbd5e1',
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
              font: { size: 12 },
            },
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} min`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 11 },
              color: '#94a3b8',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Wait Time (min)',
              font: { size: 12 },
              color: '#64748b',
            },
            grid: {
              color: '#f1f5f9',
            },
            ticks: {
              font: { size: 11 },
              color: '#94a3b8',
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [eventsJson]);

  return (
    <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
      <h3 class="text-base font-semibold text-slate-900 mb-4">Wait Time Trends</h3>
      <div class="h-64">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
