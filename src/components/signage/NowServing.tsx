import { useState, useEffect } from 'preact/hooks';
import type { Counter, Ticket } from '../../data/types';

interface Props {
  counters: string;
  tickets: string;
}

interface ServingEntry {
  counterNumber: number;
  counterName: string;
  ticketNumber: string;
  ticketId: string;
}

const PAGE_SIZE = 4;

export default function NowServing({ counters: countersJson, tickets: ticketsJson }: Props) {
  const counters: Counter[] = JSON.parse(countersJson);
  const tickets: Ticket[] = JSON.parse(ticketsJson);

  const servingEntries: ServingEntry[] = counters
    .filter((c) => c.currentTicketId)
    .map((c) => {
      const ticket = tickets.find((t) => t.id === c.currentTicketId);
      return {
        counterNumber: c.number,
        counterName: c.displayName,
        ticketNumber: ticket?.ticketNumber ?? '---',
        ticketId: ticket?.id ?? '',
      };
    })
    .sort((a, b) => a.counterNumber - b.counterNumber);

  const totalPages = Math.max(1, Math.ceil(servingEntries.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setPage((p) => (p + 1) % totalPages);
        setVisible(true);
      }, 500);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentEntries = servingEntries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Determine the most recently called ticket (latest calledAt)
  const servingTickets = tickets.filter((t) => t.status === 'serving' && t.calledAt);
  const latestTicket = servingTickets.length > 0
    ? servingTickets.reduce((a, b) => (a.calledAt! > b.calledAt! ? a : b))
    : null;

  return (
    <div class="flex flex-col h-full">
      <h2 class="text-3xl font-bold tracking-widest text-emerald-400 uppercase mb-6 text-center">
        Now Serving
      </h2>

      <div
        class="flex-1 flex flex-col justify-center gap-4 transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
        }}
      >
        {currentEntries.length === 0 && (
          <div class="text-center text-slate-500 text-2xl">No tickets being served</div>
        )}
        {currentEntries.map((entry) => {
          const isLatest = latestTicket && entry.ticketId === latestTicket.id;
          return (
            <div
              key={entry.counterNumber}
              class={`flex items-center justify-between rounded-2xl px-8 py-5 ${
                isLatest
                  ? 'bg-emerald-900/50 ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                  : 'bg-slate-800/80'
              }`}
            >
              <div class="flex flex-col">
                <span class="text-sm uppercase tracking-wider text-slate-400">Counter</span>
                <span class="text-5xl font-extrabold text-white">{entry.counterNumber}</span>
                <span class="text-xs text-slate-500 mt-1">{entry.counterName}</span>
              </div>
              <div class="text-right">
                <span
                  class={`text-7xl font-black tracking-wider ${
                    isLatest ? 'text-emerald-300' : 'text-white'
                  }`}
                >
                  {entry.ticketNumber}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div class="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              class={`w-2 h-2 rounded-full ${i === page ? 'bg-emerald-400' : 'bg-slate-600'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
