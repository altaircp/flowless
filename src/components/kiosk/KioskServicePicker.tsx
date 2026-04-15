import type { Service, Queue } from '../../data/types';

interface Props {
  services: Service[];
  queues: Queue[];
  onSelect: (serviceId: string) => void;
}

export default function KioskServicePicker({ services, queues, onSelect }: Props) {
  const queueMap = new Map(queues.map((q) => [q.serviceId, q]));

  return (
    <div class="w-full h-full flex flex-col px-8 py-6">
      <h1 class="text-3xl font-bold text-slate-900 text-center mb-8">Select Your Service</h1>

      <div class="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min content-center max-w-5xl mx-auto w-full">
        {services.map((service) => {
          const queue = queueMap.get(service.id);
          const waitMin = queue?.averageWaitMinutes ?? service.estimatedDurationMinutes;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              class="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white border-2 border-slate-200 px-4 py-6 min-h-[120px] shadow-sm transition-all duration-150 hover:border-brand-400 hover:shadow-lg hover:scale-[1.02] active:scale-95 active:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-200 cursor-pointer"
            >
              <span class="text-4xl" role="img" aria-label={service.name}>
                {service.icon}
              </span>
              <span class="text-lg font-semibold text-slate-800 text-center leading-tight">
                {service.name}
              </span>
              <span class="text-sm text-slate-500">
                ~{waitMin} min wait
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
