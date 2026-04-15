import type {
  Branch, Service, Staff, Customer, Ticket, Appointment,
  Queue, Counter, Notification, Feedback, WaitTimeEvent,
  ServiceSession, AnalyticsSnapshot,
} from './types';
import {
  TicketStatus, CounterStatus, QueueState, AppointmentStatus,
  NotificationType, SessionOutcome,
} from './enums';

import { branches } from './seed/branches';
import { services } from './seed/services';
import { staff } from './seed/staff';
import { customers } from './seed/customers';
import { tickets } from './seed/tickets';
import { appointments } from './seed/appointments';
import { queues } from './seed/queues';
import { counters } from './seed/counters';
import { notifications } from './seed/notifications';
import { feedback } from './seed/feedback';
import { waitTimeEvents } from './seed/wait-time-events';
import { serviceSessions } from './seed/service-sessions';
import { analyticsSnapshots } from './seed/analytics-snapshots';

export class MockDataStore {
  branches: Branch[];
  services: Service[];
  staff: Staff[];
  customers: Customer[];
  tickets: Ticket[];
  appointments: Appointment[];
  queues: Queue[];
  counters: Counter[];
  notifications: Notification[];
  feedback: Feedback[];
  waitTimeEvents: WaitTimeEvent[];
  serviceSessions: ServiceSession[];
  analyticsSnapshots: AnalyticsSnapshot[];

  constructor() {
    this.branches = structuredClone(branches);
    this.services = structuredClone(services);
    this.staff = structuredClone(staff);
    this.customers = structuredClone(customers);
    this.tickets = structuredClone(tickets);
    this.appointments = structuredClone(appointments);
    this.queues = structuredClone(queues);
    this.counters = structuredClone(counters);
    this.notifications = structuredClone(notifications);
    this.feedback = structuredClone(feedback);
    this.waitTimeEvents = [...waitTimeEvents];
    this.serviceSessions = structuredClone(serviceSessions);
    this.analyticsSnapshots = [...analyticsSnapshots];
  }

  // ----------------------------------------------------------------
  // Query helpers
  // ----------------------------------------------------------------

  getBranch(id: string): Branch | undefined {
    return this.branches.find((b) => b.id === id);
  }

  getService(id: string): Service | undefined {
    return this.services.find((s) => s.id === id);
  }

  getServicesByBranch(branchId: string): Service[] {
    return this.services.filter((s) => s.branchIds.includes(branchId));
  }

  getStaffMember(id: string): Staff | undefined {
    return this.staff.find((s) => s.id === id);
  }

  getStaffByBranch(branchId: string): Staff[] {
    return this.staff.filter((s) => s.branchId === branchId);
  }

  getStaffOnDuty(branchId: string): Staff[] {
    return this.staff.filter((s) => s.branchId === branchId && s.isOnDuty);
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }

  getTicket(id: string): Ticket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  getTicketByNumber(ticketNumber: string): Ticket | undefined {
    return this.tickets.find((t) => t.ticketNumber === ticketNumber);
  }

  getTicketsByQueue(queueId: string): Ticket[] {
    return this.tickets
      .filter((t) => t.queueId === queueId && t.status === TicketStatus.Waiting)
      .sort((a, b) => a.position - b.position);
  }

  getTicketsByBranch(branchId: string): Ticket[] {
    return this.tickets.filter((t) => t.branchId === branchId);
  }

  getTicketsByCustomer(customerId: string): Ticket[] {
    return this.tickets.filter((t) => t.customerId === customerId);
  }

  getActiveTicketsByBranch(branchId: string): Ticket[] {
    return this.tickets.filter(
      (t) => t.branchId === branchId && (t.status === TicketStatus.Waiting || t.status === TicketStatus.Serving || t.status === TicketStatus.Called),
    );
  }

  getServingTickets(branchId: string): Ticket[] {
    return this.tickets.filter((t) => t.branchId === branchId && t.status === TicketStatus.Serving);
  }

  getCompletedTicketsToday(branchId: string): Ticket[] {
    const today = new Date().toISOString().slice(0, 10);
    return this.tickets.filter(
      (t) => t.branchId === branchId && t.status === TicketStatus.Completed && t.completedAt?.startsWith(today),
    );
  }

  getQueue(id: string): Queue | undefined {
    return this.queues.find((q) => q.id === id);
  }

  getQueuesByBranch(branchId: string): Queue[] {
    return this.queues.filter((q) => q.branchId === branchId);
  }

  getActiveQueues(branchId?: string): Queue[] {
    return this.queues.filter(
      (q) => q.state === QueueState.Active && (!branchId || q.branchId === branchId),
    );
  }

  getCounter(id: string): Counter | undefined {
    return this.counters.find((c) => c.id === id);
  }

  getCountersByBranch(branchId: string): Counter[] {
    return this.counters.filter((c) => c.branchId === branchId);
  }

  getAvailableCounters(branchId: string): Counter[] {
    return this.counters.filter(
      (c) => c.branchId === branchId && c.status === CounterStatus.Open,
    );
  }

  getAppointment(id: string): Appointment | undefined {
    return this.appointments.find((a) => a.id === id);
  }

  getAppointmentsByDate(date: string, branchId?: string): Appointment[] {
    return this.appointments.filter(
      (a) => a.date === date && (!branchId || a.branchId === branchId),
    );
  }

  getAppointmentsByCustomer(customerId: string): Appointment[] {
    return this.appointments.filter((a) => a.customerId === customerId);
  }

  getNotificationsByCustomer(customerId: string): Notification[] {
    return this.notifications
      .filter((n) => n.customerId === customerId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  getUnreadNotifications(customerId: string): Notification[] {
    return this.getNotificationsByCustomer(customerId).filter((n) => !n.isRead);
  }

  getFeedbackByBranch(branchId: string): Feedback[] {
    return this.feedback.filter((f) => f.branchId === branchId);
  }

  getFeedbackByStaff(staffId: string): Feedback[] {
    return this.feedback.filter((f) => f.staffId === staffId);
  }

  getAverageRating(branchId: string): number {
    const fb = this.getFeedbackByBranch(branchId);
    if (fb.length === 0) return 0;
    return Math.round((fb.reduce((sum, f) => sum + f.rating, 0) / fb.length) * 10) / 10;
  }

  getWaitTimeEvents(branchId: string, serviceId?: string): WaitTimeEvent[] {
    return this.waitTimeEvents.filter(
      (e) => e.branchId === branchId && (!serviceId || e.serviceId === serviceId),
    );
  }

  getServiceSessionsByBranch(branchId: string): ServiceSession[] {
    return this.serviceSessions.filter((s) => s.branchId === branchId);
  }

  getAnalyticsSnapshots(branchId: string, date?: string): AnalyticsSnapshot[] {
    return this.analyticsSnapshots.filter(
      (s) => s.branchId === branchId && (!date || s.date === date),
    );
  }

  // ----------------------------------------------------------------
  // Mutation helpers
  // ----------------------------------------------------------------

  joinQueue(params: {
    customerId: string;
    branchId: string;
    serviceId: string;
    source: Ticket['source'];
    appointmentId?: string;
  }): Ticket {
    const queue = this.queues.find(
      (q) => q.branchId === params.branchId && q.serviceId === params.serviceId && q.state === QueueState.Active,
    );
    if (!queue) throw new Error(`No active queue for service ${params.serviceId} at branch ${params.branchId}`);

    queue.currentNumber++;
    const ticketNumber = `${queue.prefix}-${String(queue.currentNumber).padStart(3, '0')}`;
    const waitingTickets = this.getTicketsByQueue(queue.id);
    const position = waitingTickets.length + 1;
    const estimatedWaitMinutes = position * queue.averageServiceMinutes;

    const ticket: Ticket = {
      id: `tkt-gen-${Date.now()}`,
      ticketNumber,
      customerId: params.customerId,
      branchId: params.branchId,
      serviceId: params.serviceId,
      queueId: queue.id,
      status: TicketStatus.Waiting,
      priority: this.getCustomer(params.customerId)?.priority ?? 'normal' as Ticket['priority'],
      position,
      estimatedWaitMinutes,
      createdAt: new Date().toISOString(),
      source: params.source,
      appointmentId: params.appointmentId,
    };

    this.tickets.push(ticket);
    queue.activeTicketIds.push(ticket.id);

    // Create notification
    this.notifications.push({
      id: `notif-gen-${Date.now()}`,
      ticketId: ticket.id,
      customerId: params.customerId,
      type: NotificationType.TicketCreated,
      title: 'Ticket Created',
      message: `Your ticket ${ticketNumber} has been created. Estimated wait: ${estimatedWaitMinutes} minutes.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return ticket;
  }

  callNextTicket(queueId: string, counterId: string): Ticket | null {
    const queue = this.getQueue(queueId);
    const counter = this.getCounter(counterId);
    if (!queue || !counter || !counter.staffId) return null;

    const waitingTickets = this.getTicketsByQueue(queueId);
    if (waitingTickets.length === 0) return null;

    // Pick highest priority first, then earliest position
    const sorted = [...waitingTickets].sort((a, b) => {
      const priorityOrder = { vip: 0, priority: 1, normal: 2 };
      const pa = priorityOrder[a.priority] ?? 2;
      const pb = priorityOrder[b.priority] ?? 2;
      if (pa !== pb) return pa - pb;
      return a.position - b.position;
    });

    const ticket = sorted[0];
    const now = new Date().toISOString();

    ticket.status = TicketStatus.Serving;
    ticket.calledAt = now;
    ticket.servingStartedAt = now;
    ticket.counterId = counterId;
    ticket.staffId = counter.staffId;
    ticket.position = 0;

    // Update counter
    counter.status = CounterStatus.Serving;
    counter.currentTicketId = ticket.id;

    // Remove from queue active list
    queue.activeTicketIds = queue.activeTicketIds.filter((id) => id !== ticket.id);

    // Reposition remaining tickets
    const remaining = this.getTicketsByQueue(queueId);
    remaining.forEach((t, i) => {
      t.position = i + 1;
      t.estimatedWaitMinutes = t.position * queue.averageServiceMinutes;
    });

    // Notification
    this.notifications.push({
      id: `notif-gen-${Date.now()}`,
      ticketId: ticket.id,
      customerId: ticket.customerId,
      type: NotificationType.Called,
      title: 'Your Turn!',
      message: `You're next! Please proceed to ${counter.displayName}.`,
      isRead: false,
      createdAt: now,
    });

    return ticket;
  }

  completeService(ticketId: string): Ticket | null {
    const ticket = this.getTicket(ticketId);
    if (!ticket || ticket.status !== TicketStatus.Serving) return null;

    const now = new Date().toISOString();
    ticket.status = TicketStatus.Completed;
    ticket.completedAt = now;

    // Free up counter
    if (ticket.counterId) {
      const counter = this.getCounter(ticket.counterId);
      if (counter) {
        counter.status = CounterStatus.Open;
        counter.currentTicketId = undefined;
      }
    }

    // Create service session
    if (ticket.servingStartedAt && ticket.staffId && ticket.counterId) {
      const start = new Date(ticket.servingStartedAt).getTime();
      const end = new Date(now).getTime();
      const durationMinutes = Math.round((end - start) / 60000);

      this.serviceSessions.push({
        id: `sess-gen-${Date.now()}`,
        ticketId: ticket.id,
        staffId: ticket.staffId,
        counterId: ticket.counterId,
        branchId: ticket.branchId,
        serviceId: ticket.serviceId,
        startedAt: ticket.servingStartedAt,
        completedAt: now,
        durationMinutes,
        outcome: SessionOutcome.Completed,
      });
    }

    // Update appointment if linked
    if (ticket.appointmentId) {
      const appt = this.getAppointment(ticket.appointmentId);
      if (appt) {
        appt.status = AppointmentStatus.Completed;
      }
    }

    // Completed notification
    const service = this.getService(ticket.serviceId);
    this.notifications.push({
      id: `notif-gen-${Date.now()}-c`,
      ticketId: ticket.id,
      customerId: ticket.customerId,
      type: NotificationType.Completed,
      title: 'Service Completed',
      message: `Your ${service?.name ?? 'service'} is complete. Thank you for visiting!`,
      isRead: false,
      createdAt: now,
    });

    // Feedback request notification
    this.notifications.push({
      id: `notif-gen-${Date.now()}-f`,
      ticketId: ticket.id,
      customerId: ticket.customerId,
      type: NotificationType.Feedback,
      title: 'Rate Your Experience',
      message: `How was your ${service?.name ?? 'service'} experience? Tap to leave feedback.`,
      isRead: false,
      createdAt: now,
    });

    return ticket;
  }

  markNoShow(ticketId: string): Ticket | null {
    const ticket = this.getTicket(ticketId);
    if (!ticket || (ticket.status !== TicketStatus.Waiting && ticket.status !== TicketStatus.Called)) return null;

    ticket.status = TicketStatus.NoShow;
    ticket.position = 0;

    // Remove from queue
    const queue = this.getQueue(ticket.queueId);
    if (queue) {
      queue.activeTicketIds = queue.activeTicketIds.filter((id) => id !== ticket.id);
      // Reposition
      const remaining = this.getTicketsByQueue(queue.id);
      remaining.forEach((t, i) => {
        t.position = i + 1;
        t.estimatedWaitMinutes = t.position * queue.averageServiceMinutes;
      });
    }

    this.notifications.push({
      id: `notif-gen-${Date.now()}-ns`,
      ticketId: ticket.id,
      customerId: ticket.customerId,
      type: NotificationType.NoShow,
      title: 'Ticket Expired',
      message: `Your ticket ${ticket.ticketNumber} has been marked as no-show. Please take a new ticket if needed.`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return ticket;
  }

  submitFeedback(params: {
    ticketId: string;
    rating: number;
    comment?: string;
    tags?: string[];
  }): Feedback | null {
    const ticket = this.getTicket(params.ticketId);
    if (!ticket || !ticket.staffId) return null;

    const fb: Feedback = {
      id: `fb-gen-${Date.now()}`,
      ticketId: params.ticketId,
      customerId: ticket.customerId,
      staffId: ticket.staffId,
      branchId: ticket.branchId,
      serviceId: ticket.serviceId,
      rating: params.rating,
      comment: params.comment,
      tags: params.tags,
      createdAt: new Date().toISOString(),
    };

    this.feedback.push(fb);
    return fb;
  }

  // ----------------------------------------------------------------
  // Aggregate helpers
  // ----------------------------------------------------------------

  getBranchStats(branchId: string) {
    const activeTickets = this.getActiveTicketsByBranch(branchId);
    const waiting = activeTickets.filter((t) => t.status === TicketStatus.Waiting);
    const serving = activeTickets.filter((t) => t.status === TicketStatus.Serving);
    const completed = this.getCompletedTicketsToday(branchId);
    const branchCounters = this.getCountersByBranch(branchId);
    const activeCounters = branchCounters.filter((c) => c.status === CounterStatus.Serving || c.status === CounterStatus.Open);

    return {
      waitingCount: waiting.length,
      servingCount: serving.length,
      completedTodayCount: completed.length,
      activeCounterCount: activeCounters.length,
      totalCounterCount: branchCounters.length,
      averageWait: waiting.length > 0
        ? Math.round(waiting.reduce((sum, t) => sum + t.estimatedWaitMinutes, 0) / waiting.length)
        : 0,
      averageRating: this.getAverageRating(branchId),
    };
  }
}

export const dataStore = new MockDataStore();
