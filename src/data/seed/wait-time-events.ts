import type { WaitTimeEvent } from '../types';

/**
 * Generates hourly wait time event data for the past 7 days.
 * Patterns vary by branch:
 * - Downtown (branch-01): peaks at 10-12 (lunch rush) and 14-16
 * - Northside Mall (branch-02): peaks at 11-13 and 15-17 (shopping hours)
 * - Airport (branch-03): more spread throughout the day, peaks at 8-10 and 16-18
 */

const BRANCH_IDS = ['branch-01', 'branch-02', 'branch-03'];

// Service IDs offered per branch (primary services for wait time tracking)
const BRANCH_SERVICES: Record<string, string[]> = {
  'branch-01': ['svc-01', 'svc-02', 'svc-03', 'svc-08'],
  'branch-02': ['svc-01', 'svc-02', 'svc-04', 'svc-05'],
  'branch-03': ['svc-02', 'svc-05', 'svc-08', 'svc-06'],
};

// Operating hours per branch [open, close]
const BRANCH_HOURS: Record<string, [number, number]> = {
  'branch-01': [8, 18],
  'branch-02': [9, 19],
  'branch-03': [6, 22],
};

// Deterministic pseudo-random using a simple hash
function seededValue(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Wait time multiplier by hour for each branch pattern
function getHourlyMultiplier(branchId: string, hour: number): number {
  if (branchId === 'branch-01') {
    // Downtown: peaks at 10-12 and 14-16
    const pattern: Record<number, number> = {
      8: 0.3, 9: 0.5, 10: 0.9, 11: 1.0, 12: 0.85,
      13: 0.6, 14: 0.8, 15: 0.95, 16: 0.7, 17: 0.3,
    };
    return pattern[hour] ?? 0.2;
  }
  if (branchId === 'branch-02') {
    // Mall: peaks at 11-13 and 15-17
    const pattern: Record<number, number> = {
      9: 0.3, 10: 0.5, 11: 0.85, 12: 1.0, 13: 0.9,
      14: 0.6, 15: 0.8, 16: 0.95, 17: 0.85, 18: 0.4,
    };
    return pattern[hour] ?? 0.2;
  }
  // Airport: spread, peaks at 8-10 and 16-18
  const pattern: Record<number, number> = {
    6: 0.3, 7: 0.5, 8: 0.8, 9: 0.9, 10: 0.7,
    11: 0.5, 12: 0.5, 13: 0.4, 14: 0.5, 15: 0.6,
    16: 0.85, 17: 0.9, 18: 0.7, 19: 0.5, 20: 0.3, 21: 0.2,
  };
  return pattern[hour] ?? 0.2;
}

// Day-of-week multiplier (0=Sun)
function getDayMultiplier(dayOfWeek: number): number {
  const multipliers = [0.4, 0.8, 0.9, 1.0, 0.95, 0.85, 0.6];
  return multipliers[dayOfWeek] ?? 0.5;
}

export function generateWaitTimeEvents(): WaitTimeEvent[] {
  const events: WaitTimeEvent[] = [];
  let idCounter = 1;
  const baseDate = new Date('2026-04-15T00:00:00Z');

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(baseDate.getTime() - dayOffset * 86400000);
    const dayOfWeek = date.getUTCDay();
    const dayMultiplier = getDayMultiplier(dayOfWeek);
    const dateStr = date.toISOString().slice(0, 10);

    for (const branchId of BRANCH_IDS) {
      const [openHour, closeHour] = BRANCH_HOURS[branchId];
      const serviceIds = BRANCH_SERVICES[branchId];

      for (let hour = openHour; hour < closeHour; hour++) {
        const hourMultiplier = getHourlyMultiplier(branchId, hour);
        const intensity = dayMultiplier * hourMultiplier;

        for (const serviceId of serviceIds) {
          const seed = idCounter * 7 + dayOffset * 13 + hour * 3;
          const noise = seededValue(seed) * 0.3 - 0.15; // -15% to +15%
          const adjustedIntensity = Math.max(0.1, intensity + noise);

          const baseWait = serviceId === 'svc-02' ? 8 : serviceId === 'svc-03' ? 25 : serviceId === 'svc-08' ? 12 : 15;
          const averageWaitMinutes = Math.round(baseWait * adjustedIntensity * 10) / 10;
          const ticketsWaiting = Math.round(adjustedIntensity * 6);
          const ticketsServing = Math.max(1, Math.round(adjustedIntensity * 2));

          events.push({
            id: `wte-${String(idCounter).padStart(4, '0')}`,
            branchId,
            serviceId,
            timestamp: `${dateStr}T${String(hour).padStart(2, '0')}:00:00Z`,
            averageWaitMinutes,
            ticketsWaiting,
            ticketsServing,
          });
          idCounter++;
        }
      }
    }
  }

  return events;
}

export const waitTimeEvents: WaitTimeEvent[] = generateWaitTimeEvents();
