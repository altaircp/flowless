import { atom } from 'nanostores';
import type { Ticket } from '../data/types';

/** The ticket currently being viewed on the status page */
export const $viewingTicket = atom<Ticket | null>(null);
