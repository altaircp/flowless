import { useState } from 'preact/hooks';
import DatePicker from './DatePicker';
import TimeSlotGrid from './TimeSlotGrid';
import StaffSelector from './StaffSelector';
import { generateTimeSlots, isSlotAvailable } from '../../lib/time-slots';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  isActive: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  estimatedDurationMinutes: number;
  icon: string;
  isActive: boolean;
  branchIds: string[];
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  branchId: string;
  serviceIds: string[];
  avatarInitials: string;
  isOnDuty: boolean;
}

interface Appointment {
  id: string;
  branchId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  status: string;
}

interface Props {
  branches: Branch[];
  services: Service[];
  staff: StaffMember[];
  appointments: Appointment[];
}

const STEPS = [
  'Branch',
  'Service',
  'Date & Time',
  'Staff',
  'Confirm',
  'Success',
];

export default function BookingWizard({ branches, services, staff, appointments }: Props) {
  const [step, setStep] = useState(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const activeBranches = branches.filter((b) => b.isActive);
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  const branchServices = selectedBranchId
    ? services.filter((s) => s.isActive && s.branchIds.includes(selectedBranchId))
    : [];
  const selectedService = services.find((s) => s.id === selectedServiceId);

  const branchStaff = selectedBranchId && selectedServiceId
    ? staff.filter(
        (s) =>
          s.branchId === selectedBranchId &&
          s.serviceIds.includes(selectedServiceId) &&
          s.isOnDuty
      )
    : [];

  // Time slot calculations
  const allSlots = generateTimeSlots(8, 17, 30);
  const bookedSlots = selectedDate && selectedBranchId && selectedServiceId
    ? allSlots.filter(
        (slot) =>
          !isSlotAvailable(
            selectedDate,
            slot,
            appointments.filter(
              (a) => a.branchId === selectedBranchId && a.serviceId === selectedServiceId
            ) as any
          )
      )
    : [];

  function goNext() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleBookAppointment() {
    const ref = `FL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    setReferenceNumber(ref);
    goNext();
  }

  // Format time for display
  function formatSlotDisplay(slot: string): string {
    const [h, m] = slot.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:${String(m).padStart(2, '0')} ${ampm}`;
  }

  function formatDateDisplay(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div class="w-full">
      {/* Progress bar */}
      {step < 5 && (
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            {STEPS.slice(0, 5).map((label, i) => (
              <div key={label} class="flex items-center">
                <div
                  class={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                    i < step
                      ? 'bg-brand-600 text-white'
                      : i === step
                        ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                        : 'bg-slate-200 text-slate-500',
                  ].join(' ')}
                >
                  {i < step ? (
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 4 && (
                  <div class={[
                    'hidden sm:block w-12 md:w-20 h-0.5 mx-1',
                    i < step ? 'bg-brand-600' : 'bg-slate-200',
                  ].join(' ')} />
                )}
              </div>
            ))}
          </div>
          <div class="hidden sm:flex justify-between">
            {STEPS.slice(0, 5).map((label, i) => (
              <span
                key={label}
                class={[
                  'text-xs font-medium',
                  i <= step ? 'text-brand-600' : 'text-slate-400',
                ].join(' ')}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Select Branch */}
      {step === 0 && (
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Select a Branch</h3>
          <p class="text-sm text-slate-500 mb-6">Choose the location most convenient for you.</p>
          <div class="grid gap-3">
            {activeBranches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                onClick={() => {
                  setSelectedBranchId(branch.id);
                  setSelectedServiceId(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedStaffId(null);
                  goNext();
                }}
                class={[
                  'flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                  selectedBranchId === branch.id
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50',
                ].join(' ')}
              >
                <div class="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-800">{branch.name}</h4>
                  <p class="text-sm text-slate-500 mt-0.5">{branch.address}, {branch.city}</p>
                </div>
                <svg class="w-5 h-5 text-slate-400 ml-auto mt-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Service */}
      {step === 1 && (
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Select a Service</h3>
          <p class="text-sm text-slate-500 mb-6">
            Available services at <span class="font-medium text-slate-700">{selectedBranch?.name}</span>
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branchServices.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedStaffId(null);
                  goNext();
                }}
                class={[
                  'flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                  selectedServiceId === service.id
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50',
                ].join(' ')}
              >
                <span class="text-2xl" role="img">{service.icon}</span>
                <div class="min-w-0">
                  <h4 class="font-semibold text-slate-800">{service.name}</h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    ~{service.estimatedDurationMinutes} min
                  </p>
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={goBack}
            class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      )}

      {/* Step 3: Date & Time */}
      {step === 2 && (
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Pick a Date & Time</h3>
          <p class="text-sm text-slate-500 mb-6">
            <span class="font-medium text-slate-700">{selectedService?.name}</span> at{' '}
            <span class="font-medium text-slate-700">{selectedBranch?.name}</span>
          </p>

          <div class="mb-6">
            <label class="text-sm font-medium text-slate-700 mb-3 block">Select Date</label>
            <DatePicker
              selectedDate={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            />
          </div>

          {selectedDate && (
            <div>
              <label class="text-sm font-medium text-slate-700 mb-3 block">Select Time</label>
              <TimeSlotGrid
                slots={allSlots}
                bookedSlots={bookedSlots}
                selectedSlot={selectedTime}
                onSelect={(time) => {
                  setSelectedTime(time);
                }}
              />
            </div>
          )}

          <div class="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={goBack}
              class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            {selectedDate && selectedTime && (
              <button
                type="button"
                onClick={goNext}
                class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Continue
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 4: Staff Preference */}
      {step === 3 && (
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Staff Preference</h3>
          <p class="text-sm text-slate-500 mb-6">
            Optionally choose a staff member, or let us assign the best available.
          </p>

          <StaffSelector
            staffList={branchStaff.map((s) => ({
              id: s.id,
              name: s.name,
              role: s.role,
              avatarInitials: s.avatarInitials,
            }))}
            selectedStaffId={selectedStaffId}
            onSelect={setSelectedStaffId}
          />

          <div class="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={goBack}
              class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Continue
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Confirm */}
      {step === 4 && (
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-1">Confirm Your Appointment</h3>
          <p class="text-sm text-slate-500 mb-6">Review the details and provide your contact information.</p>

          {/* Summary */}
          <div class="bg-slate-50 rounded-xl p-5 mb-6 space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-slate-500">Branch</span>
              <span class="text-sm font-medium text-slate-800">{selectedBranch?.name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-500">Service</span>
              <span class="text-sm font-medium text-slate-800">
                {selectedService?.icon} {selectedService?.name}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-500">Date</span>
              <span class="text-sm font-medium text-slate-800">
                {selectedDate ? formatDateDisplay(selectedDate) : ''}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-500">Time</span>
              <span class="text-sm font-medium text-slate-800">
                {selectedTime ? formatSlotDisplay(selectedTime) : ''}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-500">Staff</span>
              <span class="text-sm font-medium text-slate-800">
                {selectedStaffId
                  ? staff.find((s) => s.id === selectedStaffId)?.name
                  : 'No Preference'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-500">Duration</span>
              <span class="text-sm font-medium text-slate-800">
                ~{selectedService?.estimatedDurationMinutes} min
              </span>
            </div>
          </div>

          {/* Contact info */}
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={customerName}
                onInput={(e) => setCustomerName((e.target as HTMLInputElement).value)}
                placeholder="Enter your full name"
                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={customerPhone}
                onInput={(e) => setCustomerPhone((e.target as HTMLInputElement).value)}
                placeholder="Enter your phone number"
                class="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder-slate-400"
              />
            </div>
          </div>

          <div class="flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              type="button"
              onClick={handleBookAppointment}
              disabled={!customerName.trim() || !customerPhone.trim()}
              class="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Book Appointment
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Success */}
      {step === 5 && (
        <div class="text-center py-6">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Appointment Booked!</h3>
          <p class="text-slate-500 mb-6">Your appointment has been confirmed.</p>

          <div class="bg-slate-50 rounded-xl p-5 text-left max-w-sm mx-auto mb-6 space-y-3">
            <div class="text-center mb-4">
              <span class="text-xs font-medium text-slate-500 uppercase tracking-wide">Reference Number</span>
              <p class="text-2xl font-bold text-brand-600 font-mono mt-1">{referenceNumber}</p>
            </div>
            <div class="border-t border-slate-200 pt-3 space-y-2">
              <div class="flex justify-between">
                <span class="text-sm text-slate-500">Branch</span>
                <span class="text-sm font-medium text-slate-800">{selectedBranch?.name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500">Service</span>
                <span class="text-sm font-medium text-slate-800">
                  {selectedService?.icon} {selectedService?.name}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500">Date</span>
                <span class="text-sm font-medium text-slate-800">
                  {selectedDate ? formatDateDisplay(selectedDate) : ''}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500">Time</span>
                <span class="text-sm font-medium text-slate-800">
                  {selectedTime ? formatSlotDisplay(selectedTime) : ''}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-slate-500">Name</span>
                <span class="text-sm font-medium text-slate-800">{customerName}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              class="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 bg-white text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add to Calendar
            </a>
            <a
              href="/"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
