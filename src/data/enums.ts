export enum TicketStatus {
  Waiting = 'waiting',
  Called = 'called',
  Serving = 'serving',
  Completed = 'completed',
  NoShow = 'no_show',
  Cancelled = 'cancelled',
  Transferred = 'transferred',
}

export enum QueueState {
  Active = 'active',
  Paused = 'paused',
  Closed = 'closed',
}

export enum CounterStatus {
  Open = 'open',
  Serving = 'serving',
  OnBreak = 'on_break',
  Closed = 'closed',
}

export enum AppointmentStatus {
  Confirmed = 'confirmed',
  CheckedIn = 'checked_in',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
}

export enum Priority {
  Normal = 'normal',
  Priority = 'priority',
  VIP = 'vip',
}

export enum NotificationType {
  TicketCreated = 'ticket_created',
  Called = 'called',
  Reminder = 'reminder',
  Delayed = 'delayed',
  Completed = 'completed',
  Feedback = 'feedback',
  NoShow = 'no_show',
}

export enum StaffRole {
  Agent = 'agent',
  Supervisor = 'supervisor',
  Manager = 'manager',
  Admin = 'admin',
}

export enum TicketSource {
  WalkIn = 'walk_in',
  Kiosk = 'kiosk',
  Online = 'online',
  Appointment = 'appointment',
}

export enum SessionOutcome {
  Completed = 'completed',
  Transferred = 'transferred',
  Cancelled = 'cancelled',
}
