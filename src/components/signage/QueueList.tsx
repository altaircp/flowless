import { useEffect, useRef } from 'preact/hooks';
import type { Ticket, Service } from '../../data/types';

interface Props {
  tickets: string;
  services: string;
}

const MAX_VISIBLE = 8;

export default function QueueList({ tickets: ticketsJson, services: servicesJson }: Props) {
  const tickets: Ticket[] = JSON.parse(ticketsJson);
  const services: Service[] = JSON.parse(servicesJson);

  const waitingTickets = tickets
    .filter((t) => t.status === 'waiting')
    .sort((a, b) => a.position - b.position)
    .slice(0, MAX_VISIBLE);

  const serviceMap = new Map(services.map((s) => [s.id, s]));

  const prevIds = useRef<string[]>([]);

  useEffect(() => {
    const ids = waitingTickets.map((t) => t.id);
    prevIds.current = ids;
  }, [ticketsJson]);

  return (
    <div class="flex flex-col h-full">
      <h2 class="text-2xl font-bold tracking-widest text-sky-400 uppercase mb-4 text-center">
        Next in Line
      </h2>

      <div class="flex-1 flex flex-col gap-2 overflow-hidden">
        {waitingTickets.length === 0 && (
          <div class="text-center text-slate-500 text-lg mt-8">Queue is empty</div>
        )}
        {waitingTickets.map((ticket, idx) => {
          const service = serviceMap.get(ticket.serviceId);
          const isNew = !prevIds.current.includes(ticket.id);
          return (
            <div
              key={ticket.id}
              class="flex items-center gap-4 bg-slate-800/60 rounded-xl px-5 py-3 animate-[slideIn_0.4s_ease-out]"
              style={{
                animationDelay: isNew ? `${idx * 80}ms` : '0ms',
              }}
            >
              <span class="text-xs text-slate-500 w-6 text-center font-mono">{idx + 1}</span>
              <span class="text-2xl font-bold text-white flex-1 tracking-wide">
                {ticket.ticketNumber}
              </span>
              <span class="text-sm text-slate-400 truncate max-w-[140px]">
                {service?.name ?? 'Service'}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
