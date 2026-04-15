import type { AnalyticsSnapshot } from '../types';

/**
 * Generates hourly analytics snapshots for the past 7 days per branch.
 * Patterns:
 * - Weekdays busier than weekends
 * - Morning and afternoon peaks
 * - Satisfaction generally 4.0-4.8
 * - Utilization 40-90% depending on time
 */

const BRANCH_IDS = ['branch-01', 'branch-02', 'branch-03'];

const BRANCH_HOURS: Record<string, [number, number]> = {
  'branch-01': [8, 18],
  'branch-02': [9, 19],
  'branch-03': [6, 22],
};

// Base capacity per branch (tickets per peak hour)
const BRANCH_BASE_CAPACITY: Record<string, number> = {
  'branch-01': 14,
  'branch-02': 12,
  'branch-03': 10,
};

function seededValue(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getHourlyLoad(branchId: string, hour: number): number {
  if (branchId === 'branch-01') {
    const p: Record<number, number> = {
      8: 0.35, 9: 0.55, 10: 0.9, 11: 1.0, 12: 0.8,
      13: 0.6, 14: 0.75, 15: 0.9, 16: 0.65, 17: 0.3,
    };
    return p[hour] ?? 0.2;
  }
  if (branchId === 'branch-02') {
    const p: Record<number, number> = {
      9: 0.3, 10: 0.5, 11: 0.8, 12: 1.0, 13: 0.85,
      14: 0.55, 15: 0.75, 16: 0.9, 17: 0.8, 18: 0.35,
    };
    return p[hour] ?? 0.2;
  }
  const p: Record<number, number> = {
    6: 0.25, 7: 0.45, 8: 0.75, 9: 0.85, 10: 0.65,
    11: 0.5, 12: 0.45, 13: 0.4, 14: 0.5, 15: 0.55,
    16: 0.8, 17: 0.85, 18: 0.65, 19: 0.45, 20: 0.3, 21: 0.2,
  };
  return p[hour] ?? 0.15;
}

function getDayFactor(dayOfWeek: number): number {
  return [0.35, 0.8, 0.9, 1.0, 0.95, 0.85, 0.55][dayOfWeek] ?? 0.5;
}

export function generateAnalyticsSnapshots(): AnalyticsSnapshot[] {
  const snapshots: AnalyticsSnapshot[] = [];
  let idCounter = 1;
  const baseDate = new Date('2026-04-15T00:00:00Z');

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const date = new Date(baseDate.getTime() - dayOffset * 86400000);
    const dayOfWeek = date.getUTCDay();
    const dayFactor = getDayFactor(dayOfWeek);
    const dateStr = date.toISOString().slice(0, 10);

    for (const branchId of BRANCH_IDS) {
      const [openHour, closeHour] = BRANCH_HOURS[branchId];
      const baseCap = BRANCH_BASE_CAPACITY[branchId];

      for (let hour = openHour; hour < closeHour; hour++) {
        const load = getHourlyLoad(branchId, hour);
        const intensity = dayFactor * load;
        const seed = idCounter * 11 + dayOffset * 17 + hour * 5;
        const noise = seededValue(seed) * 0.2 - 0.1;
        const adjusted = Math.max(0.1, intensity + noise);

        const totalTicketsIssued = Math.max(1, Math.round(baseCap * adjusted));
        const noShowRate = 0.03 + seededValue(seed + 1) * 0.05;
        const totalNoShows = Math.round(totalTicketsIssued * noShowRate);
        const totalTicketsServed = Math.max(1, totalTicketsIssued - totalNoShows);

        // Wait times scale with load
        const baseWait = branchId === 'branch-03' ? 8 : 12;
        const averageWaitMinutes = Math.round(baseWait * adjusted * 10) / 10;
        const peakWaitMinutes = Math.round(averageWaitMinutes * (1.4 + seededValue(seed + 2) * 0.4));
        const averageServiceMinutes = Math.round((10 + seededValue(seed + 3) * 8) * 10) / 10;

        // Satisfaction: higher when load is moderate, drops at peak
        const satBase = 4.5 - adjusted * 0.6;
        const satNoise = seededValue(seed + 4) * 0.3 - 0.15;
        const customerSatisfaction = Math.round(Math.max(3.0, Math.min(5.0, satBase + satNoise)) * 10) / 10;

        // Utilization scales with load
        const utilBase = adjusted * 85;
        const utilNoise = seededValue(seed + 5) * 10 - 5;
        const staffUtilizationPercent = Math.round(Math.max(20, Math.min(98, utilBase + utilNoise)));

        snapshots.push({
          id: `snap-${String(idCounter).padStart(4, '0')}`,
          branchId,
          date: dateStr,
          hour,
          totalTicketsIssued,
          totalTicketsServed,
          totalNoShows,
          averageWaitMinutes,
          averageServiceMinutes,
          peakWaitMinutes,
          customerSatisfaction,
          staffUtilizationPercent,
        });
        idCounter++;
      }
    }
  }

  return snapshots;
}

export const analyticsSnapshots: AnalyticsSnapshot[] = generateAnalyticsSnapshots();
