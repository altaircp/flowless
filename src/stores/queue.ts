import { atom, computed } from 'nanostores';
import type { Ticket } from '../data/types';

/** Selected branch ID in the join-queue flow */
export const $selectedBranchId = atom<string | null>(null);

/** Selected service ID in the join-queue flow */
export const $selectedServiceId = atom<string | null>(null);

/** The ticket that was just created after joining a queue */
export const $currentTicket = atom<Ticket | null>(null);

/** Queue health status derived from current ticket's estimated wait */
export const $queueStatus = computed($currentTicket, (ticket) => {
  if (!ticket) return 'on_time' as const;
  const wait = ticket.estimatedWaitMinutes;
  if (wait < 10) return 'on_time' as const;
  if (wait < 20) return 'delayed' as const;
  return 'critical' as const;
});
