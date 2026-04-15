import type { Queue } from '../types';
import { QueueState } from '../enums';

export const queues: Queue[] = [
  // --- Branch 01: Downtown Financial Center ---
  {
    id: 'queue-A',
    branchId: 'branch-01',
    serviceId: 'svc-01', // Account Opening
    state: QueueState.Active,
    prefix: 'A',
    currentNumber: 15,
    activeTicketIds: ['tkt-w01', 'tkt-w02', 'tkt-w03'],
    averageWaitMinutes: 18,
    averageServiceMinutes: 22,
    maxCapacity: 30,
  },
  {
    id: 'queue-B',
    branchId: 'branch-01',
    serviceId: 'svc-02', // Cash Withdrawal
    state: QueueState.Active,
    prefix: 'B',
    currentNumber: 28,
    activeTicketIds: ['tkt-w04', 'tkt-w05', 'tkt-w06', 'tkt-w07'],
    averageWaitMinutes: 8,
    averageServiceMinutes: 6,
  },
  {
    id: 'queue-C',
    branchId: 'branch-01',
    serviceId: 'svc-03', // Loan Consultation
    state: QueueState.Active,
    prefix: 'C',
    currentNumber: 8,
    activeTicketIds: ['tkt-w08', 'tkt-w09'],
    averageWaitMinutes: 25,
    averageServiceMinutes: 32,
    maxCapacity: 15,
  },
  {
    id: 'queue-D',
    branchId: 'branch-01',
    serviceId: 'svc-08', // Foreign Exchange
    state: QueueState.Active,
    prefix: 'D',
    currentNumber: 10,
    activeTicketIds: ['tkt-w10', 'tkt-w11'],
    averageWaitMinutes: 12,
    averageServiceMinutes: 14,
    maxCapacity: 20,
  },
  // --- Branch 02: Northside Mall ---
  {
    id: 'queue-E',
    branchId: 'branch-02',
    serviceId: 'svc-01', // Account Opening
    state: QueueState.Active,
    prefix: 'E',
    currentNumber: 12,
    activeTicketIds: ['tkt-w12', 'tkt-w13', 'tkt-w14'],
    averageWaitMinutes: 20,
    averageServiceMinutes: 21,
    maxCapacity: 30,
  },
  {
    id: 'queue-F',
    branchId: 'branch-02',
    serviceId: 'svc-02', // Cash Withdrawal
    state: QueueState.Active,
    prefix: 'F',
    currentNumber: 22,
    activeTicketIds: ['tkt-w15', 'tkt-w16', 'tkt-w17', 'tkt-w18'],
    averageWaitMinutes: 10,
    averageServiceMinutes: 5,
  },
  {
    id: 'queue-G',
    branchId: 'branch-02',
    serviceId: 'svc-04', // Insurance Services
    state: QueueState.Active,
    prefix: 'G',
    currentNumber: 6,
    activeTicketIds: ['tkt-w19', 'tkt-w20'],
    averageWaitMinutes: 22,
    averageServiceMinutes: 27,
    maxCapacity: 12,
  },
  {
    id: 'queue-H',
    branchId: 'branch-02',
    serviceId: 'svc-05', // Card Services
    state: QueueState.Active,
    prefix: 'H',
    currentNumber: 14,
    activeTicketIds: ['tkt-w21', 'tkt-w22', 'tkt-w23'],
    averageWaitMinutes: 14,
    averageServiceMinutes: 16,
  },
  // --- Branch 03: Airport Terminal ---
  {
    id: 'queue-J',
    branchId: 'branch-03',
    serviceId: 'svc-02', // Cash Withdrawal
    state: QueueState.Active,
    prefix: 'J',
    currentNumber: 18,
    activeTicketIds: ['tkt-w24', 'tkt-w25', 'tkt-w26'],
    averageWaitMinutes: 7,
    averageServiceMinutes: 5,
  },
  {
    id: 'queue-K',
    branchId: 'branch-03',
    serviceId: 'svc-05', // Card Services
    state: QueueState.Active,
    prefix: 'K',
    currentNumber: 10,
    activeTicketIds: ['tkt-w27', 'tkt-w28'],
    averageWaitMinutes: 13,
    averageServiceMinutes: 15,
  },
  {
    id: 'queue-L',
    branchId: 'branch-03',
    serviceId: 'svc-08', // Foreign Exchange
    state: QueueState.Active,
    prefix: 'L',
    currentNumber: 16,
    activeTicketIds: ['tkt-w29', 'tkt-w30', 'tkt-w31'],
    averageWaitMinutes: 10,
    averageServiceMinutes: 13,
    maxCapacity: 20,
  },
  {
    id: 'queue-M',
    branchId: 'branch-03',
    serviceId: 'svc-06', // General Inquiry
    state: QueueState.Active,
    prefix: 'M',
    currentNumber: 12,
    activeTicketIds: ['tkt-w32'],
    averageWaitMinutes: 9,
    averageServiceMinutes: 11,
  },
];
