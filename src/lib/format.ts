import { format, formatDistanceToNow, differenceInMinutes } from 'date-fns';

/**
 * Format a number of minutes into a human-readable wait time.
 * Examples: "5 min", "1h 20min"
 */
export function formatWaitTime(minutes: number): string {
  if (minutes < 0) return '0 min';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}min`;
}

/**
 * Format an ISO string to a time string like "2:30 PM".
 */
export function formatTime(isoString: string): string {
  return format(new Date(isoString), 'h:mm a');
}

/**
 * Format an ISO string to a date string like "Apr 15, 2026".
 */
export function formatDate(isoString: string): string {
  return format(new Date(isoString), 'MMM d, yyyy');
}

/**
 * Format an ISO string to a date+time string like "Apr 15, 2:30 PM".
 */
export function formatDateTime(isoString: string): string {
  return format(new Date(isoString), 'MMM d, h:mm a');
}

/**
 * Return the ticket number styled for display (pass-through; already formatted as "A-043").
 */
export function formatTicketNumber(num: string): string {
  return num.toUpperCase();
}

/**
 * Calculate the duration between two ISO timestamps and return as "12 min".
 */
export function formatDuration(startIso: string, endIso: string): string {
  const mins = differenceInMinutes(new Date(endIso), new Date(startIso));
  return formatWaitTime(mins);
}

/**
 * Format a 0-1 decimal or 0-100 value as a percentage string like "85%".
 * Values > 1 are treated as already being in percent form.
 */
export function formatPercent(value: number): string {
  const pct = value > 1 ? value : value * 100;
  return `${Math.round(pct)}%`;
}

/**
 * Return a human-friendly relative time string like "2 minutes ago".
 */
export function getRelativeTime(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true });
}
