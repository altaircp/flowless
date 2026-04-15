import type { Notification } from '../types';
import { NotificationType } from '../enums';

const TODAY = '2026-04-15';

export const notifications: Notification[] = [
  // Ticket created notifications
  { id: 'notif-01', ticketId: 'tkt-w01', customerId: 'cust-06', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket A-013 has been created. Estimated wait: 20 minutes.', isRead: true, createdAt: `${TODAY}T10:30:00Z` },
  { id: 'notif-02', ticketId: 'tkt-w02', customerId: 'cust-15', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket A-014 has been created. Estimated wait: 40 minutes.', isRead: false, createdAt: `${TODAY}T10:35:00Z` },
  { id: 'notif-03', ticketId: 'tkt-w04', customerId: 'cust-29', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket B-025 has been created. Estimated wait: 5 minutes.', isRead: true, createdAt: `${TODAY}T10:40:00Z` },
  { id: 'notif-04', ticketId: 'tkt-w12', customerId: 'cust-12', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket E-010 has been created. Estimated wait: 20 minutes.', isRead: false, createdAt: `${TODAY}T10:25:00Z` },
  { id: 'notif-05', ticketId: 'tkt-w24', customerId: 'cust-27', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket J-016 has been created. Estimated wait: 5 minutes.', isRead: true, createdAt: `${TODAY}T10:37:00Z` },
  { id: 'notif-06', ticketId: 'tkt-w29', customerId: 'cust-38', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket L-014 has been created. Estimated wait: 12 minutes.', isRead: false, createdAt: `${TODAY}T10:32:00Z` },
  { id: 'notif-07', ticketId: 'tkt-w21', customerId: 'cust-25', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket H-012 has been created. Estimated wait: 15 minutes.', isRead: false, createdAt: `${TODAY}T10:36:00Z` },
  { id: 'notif-08', ticketId: 'tkt-w08', customerId: 'cust-09', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket C-007 has been created for your appointment. Estimated wait: 30 minutes.', isRead: true, createdAt: `${TODAY}T10:20:00Z` },

  // Called notifications
  { id: 'notif-09', ticketId: 'tkt-s01', customerId: 'cust-01', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 1.", isRead: true, createdAt: `${TODAY}T10:20:00Z` },
  { id: 'notif-10', ticketId: 'tkt-s02', customerId: 'cust-04', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 2.", isRead: true, createdAt: `${TODAY}T10:35:00Z` },
  { id: 'notif-11', ticketId: 'tkt-s03', customerId: 'cust-07', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 3.", isRead: true, createdAt: `${TODAY}T10:30:00Z` },
  { id: 'notif-12', ticketId: 'tkt-s04', customerId: 'cust-10', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 1.", isRead: true, createdAt: `${TODAY}T10:18:00Z` },
  { id: 'notif-13', ticketId: 'tkt-s07', customerId: 'cust-16', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 1.", isRead: true, createdAt: `${TODAY}T10:33:00Z` },
  { id: 'notif-14', ticketId: 'tkt-s09', customerId: 'cust-28', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 3.", isRead: true, createdAt: `${TODAY}T10:25:00Z` },

  // Reminder notifications (approaching turn)
  { id: 'notif-15', ticketId: 'tkt-w04', customerId: 'cust-29', type: NotificationType.Reminder, title: 'Almost Your Turn', message: "You're next in line! Please stay nearby — Counter 2 will call you shortly.", isRead: false, createdAt: `${TODAY}T10:42:00Z` },
  { id: 'notif-16', ticketId: 'tkt-w24', customerId: 'cust-27', type: NotificationType.Reminder, title: 'Almost Your Turn', message: "You're next in line! Please stay nearby — Counter 1 will call you shortly.", isRead: false, createdAt: `${TODAY}T10:45:00Z` },
  { id: 'notif-17', ticketId: 'tkt-w10', customerId: 'cust-35', type: NotificationType.Reminder, title: 'Almost Your Turn', message: 'Only 1 person ahead of you. Estimated wait: 12 minutes.', isRead: false, createdAt: `${TODAY}T10:40:00Z` },

  // Delay notifications
  { id: 'notif-18', ticketId: 'tkt-w09', customerId: 'cust-14', type: NotificationType.Delayed, title: 'Wait Time Updated', message: 'Your estimated wait has been updated to 55 minutes. We apologize for the delay.', isRead: false, createdAt: `${TODAY}T10:40:00Z` },
  { id: 'notif-19', ticketId: 'tkt-w20', customerId: 'cust-44', type: NotificationType.Delayed, title: 'Wait Time Updated', message: 'Your estimated wait has been updated to 50 minutes. We apologize for the delay.', isRead: false, createdAt: `${TODAY}T10:35:00Z` },

  // Completed notifications
  { id: 'notif-20', ticketId: 'tkt-c01', customerId: 'cust-02', type: NotificationType.Completed, title: 'Service Completed', message: 'Your account opening service is complete. Thank you for visiting!', isRead: true, createdAt: `${TODAY}T08:30:00Z` },
  { id: 'notif-21', ticketId: 'tkt-c03', customerId: 'cust-19', type: NotificationType.Completed, title: 'Service Completed', message: 'Your cash withdrawal is complete. Thank you for visiting!', isRead: true, createdAt: `${TODAY}T08:12:00Z` },
  { id: 'notif-22', ticketId: 'tkt-c06', customerId: 'cust-11', type: NotificationType.Completed, title: 'Service Completed', message: 'Your loan consultation is complete. Thank you for visiting!', isRead: true, createdAt: `${TODAY}T08:45:00Z` },
  { id: 'notif-23', ticketId: 'tkt-c15', customerId: 'cust-33', type: NotificationType.Completed, title: 'Service Completed', message: 'Your account opening is complete. Thank you for visiting Northside Mall!', isRead: true, createdAt: `${TODAY}T09:30:00Z` },
  { id: 'notif-24', ticketId: 'tkt-c27', customerId: 'cust-27', type: NotificationType.Completed, title: 'Service Completed', message: 'Your cash withdrawal is complete. Thank you for visiting!', isRead: true, createdAt: `${TODAY}T08:14:00Z` },
  { id: 'notif-25', ticketId: 'tkt-c28', customerId: 'cust-38', type: NotificationType.Completed, title: 'Service Completed', message: 'Your foreign exchange transaction is complete. Thank you!', isRead: true, createdAt: `${TODAY}T08:28:00Z` },

  // Feedback request notifications
  { id: 'notif-26', ticketId: 'tkt-c01', customerId: 'cust-02', type: NotificationType.Feedback, title: 'Rate Your Experience', message: 'How was your account opening experience? Tap to leave feedback.', isRead: true, createdAt: `${TODAY}T08:31:00Z` },
  { id: 'notif-27', ticketId: 'tkt-c03', customerId: 'cust-19', type: NotificationType.Feedback, title: 'Rate Your Experience', message: 'How was your cash withdrawal experience? Tap to leave feedback.', isRead: false, createdAt: `${TODAY}T08:13:00Z` },
  { id: 'notif-28', ticketId: 'tkt-c06', customerId: 'cust-11', type: NotificationType.Feedback, title: 'Rate Your Experience', message: 'How was your loan consultation? Tap to leave feedback.', isRead: true, createdAt: `${TODAY}T08:46:00Z` },
  { id: 'notif-29', ticketId: 'tkt-c15', customerId: 'cust-33', type: NotificationType.Feedback, title: 'Rate Your Experience', message: 'How was your experience at Northside Mall? Tap to leave feedback.', isRead: false, createdAt: `${TODAY}T09:31:00Z` },
  { id: 'notif-30', ticketId: 'tkt-c27', customerId: 'cust-27', type: NotificationType.Feedback, title: 'Rate Your Experience', message: 'How was your visit to the Airport Terminal? Tap to leave feedback.', isRead: false, createdAt: `${TODAY}T08:15:00Z` },

  // No-show notifications
  { id: 'notif-31', ticketId: 'tkt-n01', customerId: 'cust-29', type: NotificationType.NoShow, title: 'Ticket Expired', message: 'Your ticket A-004 has been marked as no-show. Please take a new ticket if needed.', isRead: false, createdAt: `${TODAY}T09:00:00Z` },
  { id: 'notif-32', ticketId: 'tkt-n02', customerId: 'cust-37', type: NotificationType.NoShow, title: 'Ticket Expired', message: 'Your ticket B-010 has been marked as no-show. Please take a new ticket if needed.', isRead: false, createdAt: `${TODAY}T09:25:00Z` },
  { id: 'notif-33', ticketId: 'tkt-n03', customerId: 'cust-46', type: NotificationType.NoShow, title: 'Ticket Expired', message: 'Your ticket F-010 has been marked as no-show. Please take a new ticket if needed.', isRead: false, createdAt: `${TODAY}T09:55:00Z` },

  // More ticket-created for variety
  { id: 'notif-34', ticketId: 'tkt-w03', customerId: 'cust-21', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket A-015 has been created. Estimated wait: 60 minutes.', isRead: false, createdAt: `${TODAY}T10:42:00Z` },
  { id: 'notif-35', ticketId: 'tkt-w15', customerId: 'cust-36', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket F-019 has been created. Estimated wait: 5 minutes.', isRead: true, createdAt: `${TODAY}T10:39:00Z` },
  { id: 'notif-36', ticketId: 'tkt-w19', customerId: 'cust-22', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket G-005 has been created for your appointment. Estimated wait: 25 minutes.', isRead: true, createdAt: `${TODAY}T10:15:00Z` },
  { id: 'notif-37', ticketId: 'tkt-w27', customerId: 'cust-34', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket K-009 has been created. Estimated wait: 15 minutes.', isRead: false, createdAt: `${TODAY}T10:34:00Z` },
  { id: 'notif-38', ticketId: 'tkt-w32', customerId: 'cust-45', type: NotificationType.TicketCreated, title: 'Ticket Created', message: 'Your ticket M-012 has been created. Estimated wait: 10 minutes.', isRead: false, createdAt: `${TODAY}T10:50:00Z` },

  // Called for completed tickets (historical)
  { id: 'notif-39', ticketId: 'tkt-c09', customerId: 'cust-42', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 1.", isRead: true, createdAt: `${TODAY}T09:05:00Z` },
  { id: 'notif-40', ticketId: 'tkt-c11', customerId: 'cust-23', type: NotificationType.Called, title: 'Your Turn!', message: "You're next! Please proceed to Counter 4.", isRead: true, createdAt: `${TODAY}T09:20:00Z` },
];
