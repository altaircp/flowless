export const APP_NAME = 'FlowLess';
export const APP_VERSION = '1.0.0';

/** Polling intervals in milliseconds */
export const POLLING_INTERVALS = {
  queueRefresh: 5_000,
  signage: 10_000,
} as const;

/** Wait-time thresholds in minutes */
export const WAIT_TIME_THRESHOLDS = {
  /** Under 10 min is considered on time */
  onTime: 10,
  /** 10–20 min is considered delayed */
  delayed: 20,
  /** Above 20 min is considered critical */
} as const;

/** Default maximum capacity per queue */
export const DEFAULT_MAX_QUEUE_CAPACITY = 100;

/** Service categories used across the app */
export const SERVICE_CATEGORIES = [
  'General',
  'Accounts',
  'Loans',
  'Payments',
  'Customer Support',
  'Insurance',
  'Investments',
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
