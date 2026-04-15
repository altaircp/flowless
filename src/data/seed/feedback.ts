import type { Feedback } from '../types';

const TODAY = '2026-04-15';

export const feedback: Feedback[] = [
  // Branch 01 feedback
  { id: 'fb-01', ticketId: 'tkt-c01', customerId: 'cust-02', staffId: 'staff-01', branchId: 'branch-01', serviceId: 'svc-01', rating: 5, comment: 'Robert was very helpful with my account setup!', tags: ['friendly', 'professional', 'fast'], createdAt: `${TODAY}T08:35:00Z` },
  { id: 'fb-02', ticketId: 'tkt-c02', customerId: 'cust-17', staffId: 'staff-01', branchId: 'branch-01', serviceId: 'svc-01', rating: 4, comment: 'Good service, just a bit of a wait.', tags: ['professional'], createdAt: `${TODAY}T08:55:00Z` },
  { id: 'fb-03', ticketId: 'tkt-c03', customerId: 'cust-19', staffId: 'staff-02', branchId: 'branch-01', serviceId: 'svc-02', rating: 5, comment: 'Very fast service!', tags: ['fast', 'efficient'], createdAt: `${TODAY}T08:15:00Z` },
  { id: 'fb-04', ticketId: 'tkt-c04', customerId: 'cust-26', staffId: 'staff-02', branchId: 'branch-01', serviceId: 'svc-02', rating: 4, tags: ['professional'], createdAt: `${TODAY}T08:22:00Z` },
  { id: 'fb-05', ticketId: 'tkt-c05', customerId: 'cust-30', staffId: 'staff-03', branchId: 'branch-01', serviceId: 'svc-02', rating: 5, comment: 'Quick and efficient.', tags: ['fast', 'friendly'], createdAt: `${TODAY}T08:28:00Z` },
  { id: 'fb-06', ticketId: 'tkt-c06', customerId: 'cust-11', staffId: 'staff-04', branchId: 'branch-01', serviceId: 'svc-03', rating: 5, comment: 'Aisha provided excellent loan advice. Very thorough.', tags: ['professional', 'knowledgeable', 'thorough'], createdAt: `${TODAY}T08:50:00Z` },
  { id: 'fb-07', ticketId: 'tkt-c07', customerId: 'cust-39', staffId: 'staff-03', branchId: 'branch-01', serviceId: 'svc-08', rating: 4, comment: 'Good exchange rates, smooth process.', tags: ['professional'], createdAt: `${TODAY}T08:42:00Z` },
  { id: 'fb-08', ticketId: 'tkt-c09', customerId: 'cust-42', staffId: 'staff-01', branchId: 'branch-01', serviceId: 'svc-01', rating: 3, comment: 'Had to wait longer than expected, but the service itself was fine.', tags: ['slow'], createdAt: `${TODAY}T09:28:00Z` },
  { id: 'fb-09', ticketId: 'tkt-c11', customerId: 'cust-23', staffId: 'staff-04', branchId: 'branch-01', serviceId: 'svc-03', rating: 5, comment: 'Excellent consultation. Very detailed explanations.', tags: ['knowledgeable', 'professional', 'thorough'], createdAt: `${TODAY}T09:58:00Z` },
  { id: 'fb-10', ticketId: 'tkt-c13', customerId: 'cust-40', staffId: 'staff-01', branchId: 'branch-01', serviceId: 'svc-01', rating: 4, tags: ['friendly'], createdAt: `${TODAY}T10:08:00Z` },

  // Branch 02 feedback
  { id: 'fb-11', ticketId: 'tkt-c15', customerId: 'cust-33', staffId: 'staff-08', branchId: 'branch-02', serviceId: 'svc-01', rating: 4, comment: 'Smooth account opening experience.', tags: ['professional', 'efficient'], createdAt: `${TODAY}T09:33:00Z` },
  { id: 'fb-12', ticketId: 'tkt-c16', customerId: 'cust-36', staffId: 'staff-09', branchId: 'branch-02', serviceId: 'svc-02', rating: 5, comment: 'Super quick!', tags: ['fast'], createdAt: `${TODAY}T09:13:00Z` },
  { id: 'fb-13', ticketId: 'tkt-c18', customerId: 'cust-44', staffId: 'staff-11', branchId: 'branch-02', serviceId: 'svc-04', rating: 4, comment: 'Good insurance consultation. Carlos explained everything clearly.', tags: ['knowledgeable', 'professional'], createdAt: `${TODAY}T09:38:00Z` },
  { id: 'fb-14', ticketId: 'tkt-c19', customerId: 'cust-25', staffId: 'staff-10', branchId: 'branch-02', serviceId: 'svc-05', rating: 5, comment: 'Got my new card sorted quickly.', tags: ['fast', 'friendly'], createdAt: `${TODAY}T09:30:00Z` },
  { id: 'fb-15', ticketId: 'tkt-c20', customerId: 'cust-20', staffId: 'staff-08', branchId: 'branch-02', serviceId: 'svc-01', rating: 3, comment: 'The wait was too long for a simple account.', tags: ['slow'], createdAt: `${TODAY}T09:58:00Z` },
  { id: 'fb-16', ticketId: 'tkt-c21', customerId: 'cust-43', staffId: 'staff-09', branchId: 'branch-02', serviceId: 'svc-02', rating: 5, tags: ['fast', 'efficient'], createdAt: `${TODAY}T09:43:00Z` },
  { id: 'fb-17', ticketId: 'tkt-c24', customerId: 'cust-22', staffId: 'staff-11', branchId: 'branch-02', serviceId: 'svc-04', rating: 4, comment: 'Helpful and patient.', tags: ['friendly', 'professional'], createdAt: `${TODAY}T10:18:00Z` },
  { id: 'fb-18', ticketId: 'tkt-c26', customerId: 'cust-03', staffId: 'staff-10', branchId: 'branch-02', serviceId: 'svc-05', rating: 5, comment: 'As always, excellent VIP service.', tags: ['professional', 'fast', 'friendly'], createdAt: `${TODAY}T10:20:00Z` },

  // Branch 03 feedback
  { id: 'fb-19', ticketId: 'tkt-c27', customerId: 'cust-27', staffId: 'staff-15', branchId: 'branch-03', serviceId: 'svc-02', rating: 4, comment: 'Quick and easy at the airport.', tags: ['fast', 'convenient'], createdAt: `${TODAY}T08:16:00Z` },
  { id: 'fb-20', ticketId: 'tkt-c28', customerId: 'cust-38', staffId: 'staff-16', branchId: 'branch-03', serviceId: 'svc-08', rating: 5, comment: 'Great exchange rates and friendly staff.', tags: ['friendly', 'fast'], createdAt: `${TODAY}T08:30:00Z` },
  { id: 'fb-21', ticketId: 'tkt-c29', customerId: 'cust-34', staffId: 'staff-17', branchId: 'branch-03', serviceId: 'svc-05', rating: 4, tags: ['professional'], createdAt: `${TODAY}T08:37:00Z` },
  { id: 'fb-22', ticketId: 'tkt-c31', customerId: 'cust-31', staffId: 'staff-15', branchId: 'branch-03', serviceId: 'svc-02', rating: 5, comment: 'Patricia is always so efficient!', tags: ['fast', 'friendly', 'professional'], createdAt: `${TODAY}T08:51:00Z` },
  { id: 'fb-23', ticketId: 'tkt-c33', customerId: 'cust-50', staffId: 'staff-15', branchId: 'branch-03', serviceId: 'svc-02', rating: 3, comment: 'Service was okay but felt rushed.', tags: ['fast'], createdAt: `${TODAY}T09:23:00Z` },
  { id: 'fb-24', ticketId: 'tkt-c34', customerId: 'cust-42', staffId: 'staff-17', branchId: 'branch-03', serviceId: 'svc-05', rating: 4, comment: 'Card replacement was straightforward.', tags: ['efficient', 'professional'], createdAt: `${TODAY}T09:47:00Z` },
  { id: 'fb-25', ticketId: 'tkt-c35', customerId: 'cust-32', staffId: 'staff-16', branchId: 'branch-03', serviceId: 'svc-08', rating: 5, comment: 'Kevin was very knowledgeable about forex. Highly recommend!', tags: ['knowledgeable', 'professional', 'friendly'], createdAt: `${TODAY}T09:50:00Z` },
];
