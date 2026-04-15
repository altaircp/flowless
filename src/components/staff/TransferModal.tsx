import { useState } from 'preact/hooks';

interface CounterData {
  id: string;
  number: number;
  displayName: string;
  status: string;
  staffName: string;
  serviceNames: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  counters: CounterData[];
  onTransfer: (counterId: string) => void;
}

export default function TransferModal({ isOpen, onClose, counters, onTransfer }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const availableCounters = counters.filter((c) => c.status === 'open' || c.status === 'serving');

  function handleTransfer() {
    if (selectedId) {
      onTransfer(selectedId);
      setSelectedId(null);
    }
  }

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">Transfer Ticket</h3>
          <button
            onClick={onClose}
            class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Counter list */}
        <div class="px-6 py-4 max-h-80 overflow-y-auto space-y-2">
          {availableCounters.length === 0 ? (
            <p class="text-sm text-slate-500 text-center py-8">No other counters available for transfer.</p>
          ) : (
            availableCounters.map((counter) => {
              const isSelected = selectedId === counter.id;
              return (
                <button
                  key={counter.id}
                  type="button"
                  onClick={() => setSelectedId(counter.id)}
                  class={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-semibold text-slate-900">{counter.displayName}</p>
                      <p class="text-sm text-slate-500">{counter.staffName}</p>
                    </div>
                    <div class="text-right">
                      <span
                        class={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          counter.status === 'open'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {counter.status === 'open' ? 'Available' : 'Serving'}
                      </span>
                    </div>
                  </div>
                  <div class="mt-1.5 flex flex-wrap gap-1">
                    {counter.serviceNames.map((name) => (
                      <span key={name} class="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                        {name}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTransfer}
            disabled={!selectedId}
            class="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}
