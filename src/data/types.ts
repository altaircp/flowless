import type {
  TicketStatus,
  QueueState,
  CounterStatus,
  AppointmentStatus,
  Priority,
  NotificationType,
  StaffRole,
  TicketSource,
  SessionOutcome,
} from './enums';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  operatingHours: { day: number; open: string; close: string }[];
  isActive: boolean;
  coordinates: { lat: number; lng: number };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDurationMinutes: number;
  icon: string;
  isActive: boolean;
  branchIds: string[];
  maxDailyCapacity?: number;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  branchId: string;
  serviceIds: string[];
  avatarInitials: string;
  isOnDuty: boolean;
  counterIds: string[];
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  priority: Priority;
  visitCount: number;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerId: string;
  branchId: string;
  serviceId: string;
  queueId: string;
  status: TicketStatus;
  priority: Priority;
  position: number;
  estimatedWaitMinutes: number;
  createdAt: string;
  calledAt?: string;
  servingStartedAt?: string;
  completedAt?: string;
  counterId?: string;
  staffId?: string;
  source: TicketSource;
  appointmentId?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  branchId: string;
  serviceId: string;
  staffId?: string;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  ticketId?: string;
  createdAt: string;
  notes?: string;
}

export interface Queue {
  id: string;
  branchId: string;
  serviceId: string;
  state: QueueState;
  prefix: string;
  currentNumber: number;
  activeTicketIds: string[];
  averageWaitMinutes: number;
  averageServiceMinutes: number;
  maxCapacity?: number;
}

export interface Counter {
  id: string;
  number: number;
  branchId: string;
  status: CounterStatus;
  currentTicketId?: string;
  staffId?: string;
  serviceIds: string[];
  displayName: string;
}

export interface Notification {
  id: string;
  ticketId: string;
  customerId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  ticketId: string;
  customerId: string;
  staffId: string;
  branchId: string;
  serviceId: string;
  rating: number;
  comment?: string;
  tags?: string[];
  createdAt: string;
}

export interface WaitTimeEvent {
  id: string;
  branchId: string;
  serviceId: string;
  timestamp: string;
  averageWaitMinutes: number;
  ticketsWaiting: number;
  ticketsServing: number;
}

export interface ServiceSession {
  id: string;
  ticketId: string;
  staffId: string;
  counterId: string;
  branchId: string;
  serviceId: string;
  startedAt: string;
  completedAt: string;
  durationMinutes: number;
  outcome: SessionOutcome;
}

export interface AnalyticsSnapshot {
  id: string;
  branchId: string;
  date: string;
  hour: number;
  totalTicketsIssued: number;
  totalTicketsServed: number;
  totalNoShows: number;
  averageWaitMinutes: number;
  averageServiceMinutes: number;
  peakWaitMinutes: number;
  customerSatisfaction: number;
  staffUtilizationPercent: number;
}
