import { atom } from 'nanostores';

/** Currently selected counter ID in the staff workspace */
export const $activeCounterId = atom<string | null>(null);

/** Currently logged-in staff member ID */
export const $activeStaffId = atom<string | null>(null);
