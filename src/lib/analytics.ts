import type {
  AnalyticsSnapshot,
  ServiceSession,
  Service,
  Staff,
} from '../data/types';

/**
 * Aggregate key performance indicators from a set of analytics snapshots.
 */
export function calculateKPIs(snapshots: AnalyticsSnapshot[]): {
  avgWait: number;
  totalServed: number;
  satisfaction: number;
  utilization: number;
  noShowRate: number;
  peakHour: number;
} {
  if (snapshots.length === 0) {
    return {
      avgWait: 0,
      totalServed: 0,
      satisfaction: 0,
      utilization: 0,
      noShowRate: 0,
      peakHour: 0,
    };
  }

  const totalServed = snapshots.reduce(
    (sum, s) => sum + s.totalTicketsServed,
    0,
  );
  const totalIssued = snapshots.reduce(
    (sum, s) => sum + s.totalTicketsIssued,
    0,
  );
  const totalNoShows = snapshots.reduce((sum, s) => sum + s.totalNoShows, 0);

  const avgWait =
    snapshots.reduce((sum, s) => sum + s.averageWaitMinutes, 0) /
    snapshots.length;

  const satisfaction =
    snapshots.reduce((sum, s) => sum + s.customerSatisfaction, 0) /
    snapshots.length;

  const utilization =
    snapshots.reduce((sum, s) => sum + s.staffUtilizationPercent, 0) /
    snapshots.length;

  const noShowRate = totalIssued > 0 ? (totalNoShows / totalIssued) * 100 : 0;

  // Peak hour: the hour with the most tickets issued
  const hourlyTotals = new Map<number, number>();
  for (const s of snapshots) {
    hourlyTotals.set(
      s.hour,
      (hourlyTotals.get(s.hour) ?? 0) + s.totalTicketsIssued,
    );
  }
  let peakHour = 0;
  let peakCount = 0;
  for (const [hour, count] of hourlyTotals) {
    if (count > peakCount) {
      peakHour = hour;
      peakCount = count;
    }
  }

  return {
    avgWait: Math.round(avgWait * 10) / 10,
    totalServed,
    satisfaction: Math.round(satisfaction * 10) / 10,
    utilization: Math.round(utilization * 10) / 10,
    noShowRate: Math.round(noShowRate * 10) / 10,
    peakHour,
  };
}

/**
 * Build an hourly distribution of average tickets issued and average wait time.
 */
export function getHourlyDistribution(
  snapshots: AnalyticsSnapshot[],
): { hour: number; avgTickets: number; avgWait: number }[] {
  const grouped = new Map<
    number,
    { totalTickets: number; totalWait: number; count: number }
  >();

  for (const s of snapshots) {
    const entry = grouped.get(s.hour) ?? {
      totalTickets: 0,
      totalWait: 0,
      count: 0,
    };
    entry.totalTickets += s.totalTicketsIssued;
    entry.totalWait += s.averageWaitMinutes;
    entry.count += 1;
    grouped.set(s.hour, entry);
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) => a - b)
    .map(([hour, data]) => ({
      hour,
      avgTickets: Math.round((data.totalTickets / data.count) * 10) / 10,
      avgWait: Math.round((data.totalWait / data.count) * 10) / 10,
    }));
}

/**
 * Calculate a trend direction and percentage change between two values.
 */
export function calculateTrend(
  current: number,
  previous: number,
): { direction: 'up' | 'down' | 'flat'; percent: number } {
  if (previous === 0) {
    return { direction: current > 0 ? 'up' : 'flat', percent: 0 };
  }
  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(Math.abs(change) * 10) / 10;

  if (Math.abs(change) < 0.5) return { direction: 'flat', percent: 0 };
  return { direction: change > 0 ? 'up' : 'down', percent: rounded };
}

/**
 * Rank services by how many sessions they had, including average duration.
 */
export function getTopServices(
  sessions: ServiceSession[],
  services: Service[],
): { serviceId: string; name: string; count: number; avgDuration: number }[] {
  const serviceMap = new Map(services.map((s) => [s.id, s.name]));
  const grouped = new Map<
    string,
    { count: number; totalDuration: number }
  >();

  for (const sess of sessions) {
    const entry = grouped.get(sess.serviceId) ?? {
      count: 0,
      totalDuration: 0,
    };
    entry.count += 1;
    entry.totalDuration += sess.durationMinutes;
    grouped.set(sess.serviceId, entry);
  }

  return Array.from(grouped.entries())
    .map(([serviceId, data]) => ({
      serviceId,
      name: serviceMap.get(serviceId) ?? serviceId,
      count: data.count,
      avgDuration: Math.round((data.totalDuration / data.count) * 10) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculate per-staff performance metrics from service sessions.
 * Utilization is expressed as a percentage (0-100) based on total session
 * minutes out of an 8-hour workday.
 */
export function getStaffPerformance(
  sessions: ServiceSession[],
  staff: Staff[],
): {
  staffId: string;
  name: string;
  ticketsServed: number;
  avgDuration: number;
  utilization: number;
}[] {
  const staffMap = new Map(staff.map((s) => [s.id, s.name]));
  const WORKDAY_MINUTES = 8 * 60;

  const grouped = new Map<
    string,
    { count: number; totalDuration: number }
  >();

  for (const sess of sessions) {
    const entry = grouped.get(sess.staffId) ?? {
      count: 0,
      totalDuration: 0,
    };
    entry.count += 1;
    entry.totalDuration += sess.durationMinutes;
    grouped.set(sess.staffId, entry);
  }

  return Array.from(grouped.entries())
    .map(([staffId, data]) => ({
      staffId,
      name: staffMap.get(staffId) ?? staffId,
      ticketsServed: data.count,
      avgDuration: Math.round((data.totalDuration / data.count) * 10) / 10,
      utilization:
        Math.round(
          Math.min((data.totalDuration / WORKDAY_MINUTES) * 100, 100) * 10,
        ) / 10,
    }))
    .sort((a, b) => b.ticketsServed - a.ticketsServed);
}
