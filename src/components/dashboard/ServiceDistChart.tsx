import { useRef, useEffect } from 'preact/hooks';
import { Chart, registerables } from 'chart.js';
import type { ServiceSession, Service } from '../../data/types';

Chart.register(...registerables);

interface Props {
  sessions: string; // JSON serialized ServiceSession[]
  services: string; // JSON serialized Service[]
}

const COLORS = [
  '#6366f1', // indigo
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#f97316', // orange
];

export default function ServiceDistChart({ sessions: sessionsJson, services: servicesJson }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sessions: ServiceSession[] = JSON.parse(sessionsJson);
    const services: Service[] = JSON.parse(servicesJson);
    const serviceMap = new Map(services.map((s) => [s.id, s.name]));

    // Count sessions by service
    const counts = new Map<string, number>();
    for (const sess of sessions) {
      counts.set(sess.serviceId, (counts.get(sess.serviceId) ?? 0) + 1);
    }

    const entries = [...counts.entries()]
      .map(([id, count]) => ({ name: serviceMap.get(id) ?? id, count }))
      .sort((a, b) => b.count - a.count);

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: entries.map((e) => e.name),
        datasets: [
          {
            data: entries.map((e) => e.count),
            backgroundColor: entries.map((_, i) => COLORS[i % COLORS.length]),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 12,
              font: { size: 11 },
              generateLabels: (chart) => {
                const data = chart.data;
                const dataset = data.datasets[0];
                return (data.labels as string[]).map((label, i) => ({
                  text: `${label} (${dataset.data[i]})`,
                  fillStyle: (dataset.backgroundColor as string[])[i],
                  strokeStyle: '#fff',
                  lineWidth: 0,
                  pointStyle: 'circle',
                  index: i,
                }));
              },
            },
          },
          tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 13 },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 8,
            callbacks: {
              label: (ctx) => {
                const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round(((ctx.parsed as number) / total) * 100) : 0;
                return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
              },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [sessionsJson, servicesJson]);

  return (
    <div class="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
      <h3 class="text-base font-semibold text-slate-900 mb-4">Service Distribution</h3>
      <div class="h-64">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
