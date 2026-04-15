import type { Ticket, Counter } from '../data/types';
import { TicketStatus, CounterStatus, Priority } from '../data/enums';
import { WAIT_TIME_THRESHOLDS } from './constants';

/**
 * Estimate how many minutes a customer at `position` will wait,
 * given the average service time and how many counters are actively serving.
 */
export function calculateEstimatedWait(
  position: number,
  avgServiceMinutes: number,
  activeCounters: number,
): number {
  if (activeCounters <= 0) return position * avgServiceMinutes;
  return Math.ceil((position * avgServiceMinutes) / activeCounters);
}

/**
 * Classify a queue's health based on its average wait time.
 */
export function getQueueStatus(
  avgWaitMinutes: number,
): 'on_time' | 'delayed' | 'critical' {
  if (avgWaitMinutes < WAIT_TIME_THRESHOLDS.onTime) return 'on_time';
  if (avgWaitMinutes < WAIT_TIME_THRESHOLDS.delayed) return 'delayed';
  return 'critical';
}

/**
 * Generate the next ticket number string, e.g. "A-043".
 */
export function getNextTicketNumber(
  prefix: string,
  currentNumber: number,
): string {
  const next = currentNumber + 1;
  return `${prefix}-${String(next).padStart(3, '0')}`;
}

/** Priority sort weight — lower number = higher priority */
const PRIORITY_WEIGHT: Record<Priority, number> = {
  [Priority.VIP]: 0,
  [Priority.Priority]: 1,
  [Priority.Normal]: 2,
};

/**
 * Sort tickets by priority (VIP > Priority > Normal), then by position within
 * the same priority tier.
 */
export function sortTicketsByPriority(tickets: Ticket[]): Ticket[] {
  return [...tickets].sort((a, b) => {
    const pw = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (pw !== 0) return pw;
    return a.position - b.position;
  });
}

/**
 * Calculate the average wait time in minutes from completed tickets.
 * Only tickets with both `createdAt` and `servingStartedAt` are considered.
 */
export function calculateAverageWait(tickets: Ticket[]): number {
  const completed = tickets.filter(
    (t) =>
      t.status === TicketStatus.Completed &&
      t.createdAt &&
      t.servingStartedAt,
  );
  if (completed.length === 0) return 0;

  const totalMinutes = completed.reduce((sum, t) => {
    const wait =
      (new Date(t.servingStartedAt!).getTime() -
        new Date(t.createdAt).getTime()) /
      60_000;
    return sum + wait;
  }, 0);

  return Math.round(totalMinutes / completed.length);
}

/**
 * Count how many counters are currently open or actively serving.
 */
export function getActiveCounterCount(counters: Counter[]): number {
  return counters.filter(
    (c) => c.status === CounterStatus.Open || c.status === CounterStatus.Serving,
  ).length;
}
