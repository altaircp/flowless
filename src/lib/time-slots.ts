import { addDays, getDay, format as fmtDate } from 'date-fns';
import type { Appointment, Branch } from '../data/types';
import { AppointmentStatus } from '../data/enums';

/**
 * Generate an array of time-slot strings between `startHour` and `endHour`
 * at the given interval. Example: generateTimeSlots(8, 12, 30) => ["08:00", "08:30", "09:00", …, "11:30"]
 */
export function generateTimeSlots(
  startHour: number,
  endHour: number,
  intervalMinutes: number,
): string[] {
  const slots: string[] = [];
  let totalMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  while (totalMinutes < endMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    totalMinutes += intervalMinutes;
  }

  return slots;
}

/**
 * Check whether a given time slot on a given date is still available,
 * i.e. no existing confirmed or checked-in appointment occupies it.
 */
export function isSlotAvailable(
  date: string,
  time: string,
  appointments: Appointment[],
): boolean {
  return !appointments.some(
    (a) =>
      a.date === date &&
      a.timeSlot === time &&
      (a.status === AppointmentStatus.Confirmed ||
        a.status === AppointmentStatus.CheckedIn),
  );
}

/**
 * Return the subset of generated time slots that are still bookable for a
 * specific branch + service on a given date.
 */
export function getAvailableSlots(
  date: string,
  branchId: string,
  serviceId: string,
  existingAppointments: Appointment[],
): string[] {
  // Filter appointments relevant to this branch, service, and date
  const relevant = existingAppointments.filter(
    (a) =>
      a.branchId === branchId && a.serviceId === serviceId && a.date === date,
  );

  // Generate all possible slots for a standard operating window (8–18) at 30-min intervals.
  // Callers can pre-filter further if the branch hours differ.
  const allSlots = generateTimeSlots(8, 18, 30);

  return allSlots.filter((slot) => isSlotAvailable(date, slot, relevant));
}

/**
 * Starting from tomorrow, find the first date on which the branch is open
 * according to its `operatingHours` schedule. Returns an ISO date string (yyyy-MM-dd).
 */
export function getNextAvailableDate(
  branchOperatingHours: Branch['operatingHours'],
): string {
  const openDays = new Set(branchOperatingHours.map((oh) => oh.day));
  let candidate = addDays(new Date(), 1);

  // Look up to 14 days ahead to avoid an infinite loop
  for (let i = 0; i < 14; i++) {
    if (openDays.has(getDay(candidate))) {
      return fmtDate(candidate, 'yyyy-MM-dd');
    }
    candidate = addDays(candidate, 1);
  }

  // Fallback: return tomorrow if no open day found within 14 days
  return fmtDate(addDays(new Date(), 1), 'yyyy-MM-dd');
}
