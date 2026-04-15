import { useState } from 'preact/hooks';

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
  icon: string;
  estimatedDurationMinutes: number;
  isActive: boolean;
  branchIds: string[];
}

interface Queue {
  id: string;
  branchId: string;
  serviceId: string;
  state: string;
  prefix: string;
  currentNumber: number;
  activeTicketIds: string[];
  averageWaitMinutes: number;
  averageServiceMinutes: number;
}

interface CreatedTicket {
  id: string;
  ticketNumber: string;
  position: number;
  estimatedWaitMinutes: number;
  branchId: string;
  serviceId: string;
}

interface Props {
  branches: Branch[];
  services: Service[];
  queues: Queue[];
}

type Priority = 'normal' | 'priority' | 'vip';

const STEPS = ['Branch', 'Service', 'Details', 'Confirmation'];

export default function JoinQueueForm({ branches, services, queues }: Props) {
  const [step, setStep] = useState(0);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [createdTicket, setCreatedTicket] = useState<CreatedTicket | null>(null);

  const activeBranches = branches.filter((b) => b.isActive);

  const branchServices = selectedBranchId
    ? services.filter((s) => s.isActive && s.branchIds.includes(selectedBranchId))
    : [];

  function getQueueForService(branchId: string, serviceId: string) {
    return queues.find(
      (q) => q.branchId === branchId && q.serviceId === serviceId && q.state === 'active',
    );
  }

  function getAvgWaitForBranch(branchId: string): number {
    const branchQueues = queues.filter((q) => q.branchId === branchId && q.state === 'active');
    if (branchQueues.length === 0) return 0;
    return Math.round(
      branchQueues.reduce((sum, q) => sum + q.averageWaitMinutes, 0) / branchQueues.length,
    );
  }

  function handleSelectBranch(id: string) {
    setSelectedBranchId(id);
    setSelectedServiceId(null);
    setStep(1);
  }

  function handleSelectService(id: string) {
    setSelectedServiceId(id);
    setStep(2);
  }

  function handleSubmitDetails(e: Event) {
    e.preventDefault();
    if (!name.trim() || !selectedBranchId || !selectedServiceId) return;

    const queue = getQueueForService(selectedBranchId, selectedServiceId);
    if (!queue) return;

    const nextNumber = queue.currentNumber + 1;
    const ticketNumber = `${queue.prefix}-${String(nextNumber).padStart(3, '0')}`;
    const position = queue.activeTicketIds.length + 1;
    const estimatedWait = position * queue.averageServiceMinutes;

    const ticket: CreatedTicket = {
      id: `tkt-gen-${Date.now()}`,
      ticketNumber,
      position,
      estimatedWaitMinutes: estimatedWait,
      branchId: selectedBranchId,
      serviceId: selectedServiceId,
    };

    setCreatedTicket(ticket);
    setStep(3);
  }

  function selectedBranch() {
    return branches.find((b) => b.id === selectedBranchId);
  }

  function selectedService() {
    return services.find((s) => s.id === selectedServiceId);
  }

  // ---- Progress Indicator ----
  function ProgressBar() {
    return (
      <div class="flex items-center justify-center gap-1 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} class="flex items-center">
            <div class="flex flex-col items-center">
              <div
                class={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  transition-colors duration-200
                  ${i < step ? 'bg-indigo-600 text-white' : ''}
                  ${i === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : ''}
                  ${i > step ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {i < step ? (
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={3}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span class={`text-xs mt-1 hidden sm:block ${i <= step ? 'text-indigo-700 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div class={`w-8 sm:w-16 h-0.5 mx-1 ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // ---- Step 1: Branch Selection ----
  function StepBranch() {
    return (
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-1">Select a Branch</h2>
        <p class="text-gray-500 mb-6 text-sm">Choose the location nearest to you</p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeBranches.map((branch) => {
            const avgWait = getAvgWaitForBranch(branch.id);
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => handleSelectBranch(branch.id)}
                class={`
                  text-left p-5 rounded-xl border-2 transition-all duration-150
                  hover:border-indigo-400 hover:shadow-md
                  ${selectedBranchId === branch.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}
                `}
              >
                <h3 class="font-semibold text-gray-900 mb-1">{branch.name}</h3>
                <p class="text-sm text-gray-500 mb-3">{branch.address}, {branch.city}</p>
                <div class="flex items-center gap-2">
                  <span class={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    avgWait < 10 ? 'bg-emerald-100 text-emerald-700' :
                    avgWait < 20 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ~{avgWait} min avg wait
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Step 2: Service Selection ----
  function StepService() {
    return (
      <div>
        <button
          type="button"
          onClick={() => setStep(0)}
          class="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to branches
        </button>
        <h2 class="text-xl font-semibold text-gray-900 mb-1">Select a Service</h2>
        <p class="text-gray-500 mb-6 text-sm">
          Services available at <span class="font-medium text-gray-700">{selectedBranch()?.name}</span>
        </p>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {branchServices.map((svc) => {
            const queue = getQueueForService(selectedBranchId!, svc.id);
            const wait = queue ? queue.averageWaitMinutes : svc.estimatedDurationMinutes;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => handleSelectService(svc.id)}
                class={`
                  text-left p-5 rounded-xl border-2 transition-all duration-150
                  hover:border-indigo-400 hover:shadow-md
                  ${selectedServiceId === svc.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}
                `}
              >
                <div class="text-3xl mb-2">{svc.icon}</div>
                <h3 class="font-semibold text-gray-900 mb-1">{svc.name}</h3>
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">{svc.description}</p>
                <span class={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                  wait < 10 ? 'bg-emerald-100 text-emerald-700' :
                  wait < 20 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~{wait} min wait
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- Step 3: Customer Details ----
  function StepDetails() {
    return (
      <div>
        <button
          type="button"
          onClick={() => setStep(1)}
          class="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to services
        </button>
        <h2 class="text-xl font-semibold text-gray-900 mb-1">Your Details</h2>
        <p class="text-gray-500 mb-6 text-sm">Enter your information to join the queue</p>

        <form onSubmit={handleSubmitDetails} class="max-w-md space-y-5">
          {/* Name */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" htmlFor="cust-name">
              Full Name <span class="text-red-500">*</span>
            </label>
            <input
              id="cust-name"
              type="text"
              required
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              placeholder="e.g. Maria Santos"
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1" htmlFor="cust-phone">
              Phone Number <span class="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="cust-phone"
              type="tel"
              value={phone}
              onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
              placeholder="+1-555-000-0000"
              class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          </div>

          {/* Priority */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <div class="flex gap-3">
              {([
                { value: 'normal' as Priority, label: 'Normal', color: 'gray' },
                { value: 'priority' as Priority, label: 'Priority', color: 'amber' },
                { value: 'vip' as Priority, label: 'VIP', color: 'purple' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  class={`
                    flex-1 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all
                    ${priority === opt.value
                      ? opt.color === 'gray' ? 'border-gray-600 bg-gray-100 text-gray-800'
                        : opt.color === 'amber' ? 'border-amber-500 bg-amber-50 text-amber-800'
                        : 'border-purple-500 bg-purple-50 text-purple-800'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div class="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <p><span class="text-gray-500">Branch:</span> <span class="font-medium text-gray-800">{selectedBranch()?.name}</span></p>
            <p><span class="text-gray-500">Service:</span> <span class="font-medium text-gray-800">{selectedService()?.icon} {selectedService()?.name}</span></p>
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Join Queue
          </button>
        </form>
      </div>
    );
  }

  // ---- Step 4: Confirmation ----
  function StepConfirmation() {
    if (!createdTicket) return null;
    const branch = selectedBranch();
    const service = selectedService();

    return (
      <div class="text-center max-w-md mx-auto">
        {/* Success icon */}
        <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 class="text-xl font-semibold text-gray-900 mb-1">You're in the Queue!</h2>
        <p class="text-gray-500 mb-6 text-sm">Your ticket has been created successfully</p>

        {/* Ticket number */}
        <div class="bg-indigo-600 text-white rounded-2xl p-8 mb-6">
          <p class="text-sm font-medium text-indigo-200 uppercase tracking-wide mb-1">Your Ticket</p>
          <p class="text-5xl font-bold tracking-wider">{createdTicket.ticketNumber}</p>
        </div>

        {/* Info cards */}
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">Position</p>
            <p class="text-2xl font-bold text-gray-900">#{createdTicket.position}</p>
          </div>
          <div class="bg-gray-50 rounded-xl p-4">
            <p class="text-xs text-gray-500 mb-1">Est. Wait</p>
            <p class="text-2xl font-bold text-gray-900">
              {createdTicket.estimatedWaitMinutes < 60
                ? `${createdTicket.estimatedWaitMinutes}m`
                : `${Math.floor(createdTicket.estimatedWaitMinutes / 60)}h ${createdTicket.estimatedWaitMinutes % 60}m`
              }
            </p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
          <p><span class="text-gray-500">Branch:</span> <span class="font-medium text-gray-800">{branch?.name}</span></p>
          <p><span class="text-gray-500">Service:</span> <span class="font-medium text-gray-800">{service?.icon} {service?.name}</span></p>
          <p><span class="text-gray-500">Name:</span> <span class="font-medium text-gray-800">{name}</span></p>
          {priority !== 'normal' && (
            <p>
              <span class="text-gray-500">Priority:</span>{' '}
              <span class={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                priority === 'vip' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {priority.toUpperCase()}
              </span>
            </p>
          )}
        </div>

        <a
          href={`/ticket/${createdTicket.id}`}
          class="block w-full py-3 px-4 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-center"
        >
          Track Your Ticket
        </a>

        <button
          type="button"
          onClick={() => {
            setStep(0);
            setSelectedBranchId(null);
            setSelectedServiceId(null);
            setName('');
            setPhone('');
            setPriority('normal');
            setCreatedTicket(null);
          }}
          class="mt-3 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Join Another Queue
        </button>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar />
      {step === 0 && <StepBranch />}
      {step === 1 && <StepService />}
      {step === 2 && <StepDetails />}
      {step === 3 && <StepConfirmation />}
    </div>
  );
}
