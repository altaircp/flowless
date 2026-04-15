import type { Appointment } from '../types';
import { AppointmentStatus } from '../enums';

export const appointments: Appointment[] = [
  // --- Today (2026-04-15) — checked_in / completed / no-show ---
  { id: 'appt-01', customerId: 'cust-09', branchId: 'branch-01', serviceId: 'svc-03', date: '2026-04-15', timeSlot: '10:30', status: AppointmentStatus.CheckedIn, ticketId: 'tkt-w08', createdAt: '2026-04-13T14:00:00Z' },
  { id: 'appt-02', customerId: 'cust-01', branchId: 'branch-01', serviceId: 'svc-01', date: '2026-04-15', timeSlot: '10:00', status: AppointmentStatus.CheckedIn, ticketId: 'tkt-s01', createdAt: '2026-04-14T09:00:00Z' },
  { id: 'appt-03', customerId: 'cust-02', branchId: 'branch-01', serviceId: 'svc-01', date: '2026-04-15', timeSlot: '08:00', status: AppointmentStatus.Completed, ticketId: 'tkt-c01', createdAt: '2026-04-12T16:00:00Z' },
  { id: 'appt-04', customerId: 'cust-11', branchId: 'branch-01', serviceId: 'svc-03', date: '2026-04-15', timeSlot: '08:15', status: AppointmentStatus.Completed, ticketId: 'tkt-c06', createdAt: '2026-04-10T10:00:00Z' },
  { id: 'appt-05', customerId: 'cust-22', branchId: 'branch-02', serviceId: 'svc-04', date: '2026-04-15', timeSlot: '10:30', status: AppointmentStatus.CheckedIn, ticketId: 'tkt-w19', createdAt: '2026-04-13T11:00:00Z' },
  { id: 'appt-06', customerId: 'cust-18', branchId: 'branch-02', serviceId: 'svc-04', date: '2026-04-15', timeSlot: '10:00', status: AppointmentStatus.CheckedIn, ticketId: 'tkt-s06', createdAt: '2026-04-14T08:00:00Z' },
  { id: 'appt-07', customerId: 'cust-44', branchId: 'branch-02', serviceId: 'svc-04', date: '2026-04-15', timeSlot: '09:00', status: AppointmentStatus.Completed, ticketId: 'tkt-c18', createdAt: '2026-04-11T15:00:00Z' },
  { id: 'appt-08', customerId: 'cust-39', branchId: 'branch-01', serviceId: 'svc-07', date: '2026-04-15', timeSlot: '14:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T10:00:00Z' },
  { id: 'appt-09', customerId: 'cust-28', branchId: 'branch-01', serviceId: 'svc-07', date: '2026-04-15', timeSlot: '15:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-13T09:00:00Z' },
  { id: 'appt-10', customerId: 'cust-11', branchId: 'branch-01', serviceId: 'svc-07', date: '2026-04-15', timeSlot: '16:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-12T14:00:00Z' },

  // --- Tomorrow (2026-04-16) ---
  { id: 'appt-11', customerId: 'cust-03', branchId: 'branch-01', serviceId: 'svc-07', date: '2026-04-16', timeSlot: '09:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T11:00:00Z' },
  { id: 'appt-12', customerId: 'cust-14', branchId: 'branch-01', serviceId: 'svc-03', date: '2026-04-16', timeSlot: '10:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T13:00:00Z' },
  { id: 'appt-13', customerId: 'cust-05', branchId: 'branch-02', serviceId: 'svc-01', date: '2026-04-16', timeSlot: '11:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T08:00:00Z' },
  { id: 'appt-14', customerId: 'cust-23', branchId: 'branch-02', serviceId: 'svc-04', date: '2026-04-16', timeSlot: '14:30', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T16:00:00Z' },

  // --- 2026-04-17 ---
  { id: 'appt-15', customerId: 'cust-07', branchId: 'branch-01', serviceId: 'svc-01', date: '2026-04-17', timeSlot: '09:30', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T09:00:00Z' },
  { id: 'appt-16', customerId: 'cust-30', branchId: 'branch-03', serviceId: 'svc-08', date: '2026-04-17', timeSlot: '10:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T12:00:00Z' },
  { id: 'appt-17', customerId: 'cust-38', branchId: 'branch-03', serviceId: 'svc-05', date: '2026-04-17', timeSlot: '13:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T07:00:00Z' },

  // --- 2026-04-18 ---
  { id: 'appt-18', customerId: 'cust-10', branchId: 'branch-02', serviceId: 'svc-01', date: '2026-04-18', timeSlot: '08:30', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T10:00:00Z' },
  { id: 'appt-19', customerId: 'cust-42', branchId: 'branch-01', serviceId: 'svc-03', date: '2026-04-18', timeSlot: '11:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T15:00:00Z' },
  { id: 'appt-20', customerId: 'cust-17', branchId: 'branch-01', serviceId: 'svc-08', date: '2026-04-18', timeSlot: '14:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-13T10:00:00Z' },

  // --- 2026-04-19 (Saturday) ---
  { id: 'appt-21', customerId: 'cust-04', branchId: 'branch-01', serviceId: 'svc-01', date: '2026-04-19', timeSlot: '09:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T08:30:00Z' },
  { id: 'appt-22', customerId: 'cust-24', branchId: 'branch-03', serviceId: 'svc-08', date: '2026-04-19', timeSlot: '10:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T14:00:00Z' },

  // --- 2026-04-20 (Sunday — only airport open) ---
  { id: 'appt-23', customerId: 'cust-47', branchId: 'branch-03', serviceId: 'svc-02', date: '2026-04-20', timeSlot: '11:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T09:30:00Z' },

  // --- 2026-04-21 ---
  { id: 'appt-24', customerId: 'cust-08', branchId: 'branch-01', serviceId: 'svc-03', date: '2026-04-21', timeSlot: '09:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-14T11:30:00Z' },
  { id: 'appt-25', customerId: 'cust-32', branchId: 'branch-03', serviceId: 'svc-08', date: '2026-04-21', timeSlot: '08:30', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T07:30:00Z' },
  { id: 'appt-26', customerId: 'cust-19', branchId: 'branch-02', serviceId: 'svc-05', date: '2026-04-21', timeSlot: '15:00', status: AppointmentStatus.Confirmed, createdAt: '2026-04-13T16:00:00Z' },
  { id: 'appt-27', customerId: 'cust-45', branchId: 'branch-02', serviceId: 'svc-06', date: '2026-04-21', timeSlot: '11:30', status: AppointmentStatus.Confirmed, createdAt: '2026-04-15T10:30:00Z' },

  // --- Cancelled ---
  { id: 'appt-28', customerId: 'cust-26', branchId: 'branch-01', serviceId: 'svc-01', date: '2026-04-16', timeSlot: '15:00', status: AppointmentStatus.Cancelled, createdAt: '2026-04-12T09:00:00Z', notes: 'Customer requested cancellation' },
  { id: 'appt-29', customerId: 'cust-35', branchId: 'branch-02', serviceId: 'svc-04', date: '2026-04-17', timeSlot: '10:30', status: AppointmentStatus.Cancelled, createdAt: '2026-04-13T14:30:00Z', notes: 'Schedule conflict' },
  { id: 'appt-30', customerId: 'cust-16', branchId: 'branch-03', serviceId: 'svc-08', date: '2026-04-15', timeSlot: '09:00', status: AppointmentStatus.NoShow, createdAt: '2026-04-12T11:00:00Z' },
];
