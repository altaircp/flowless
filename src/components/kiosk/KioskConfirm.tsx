import { useState, useEffect } from 'preact/hooks';

interface Props {
  ticketNumber: string;
  serviceName: string;
  estimatedWait: number;
  position: number;
  onReset: () => void;
}

const COUNTDOWN_SECONDS = 30;

export default function KioskConfirm({ ticketNumber, serviceName, estimatedWait, position, onReset }: Props) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    if (countdown <= 0) {
      onReset();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onReset]);

  return (
    <div class="w-full h-full flex flex-col items-center justify-center gap-8 px-8">
      {/* Success icon */}
      <div class="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg class="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2.5}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-2xl font-bold text-slate-800">Your ticket has been issued</h1>

      {/* Ticket number */}
      <div class="bg-slate-900 rounded-3xl px-12 py-8 text-center">
        <div class="text-sm uppercase tracking-wider text-slate-400 mb-2">Your Ticket</div>
        <div class="text-7xl font-black text-white tracking-wider">{ticketNumber}</div>
      </div>

      {/* Details */}
      <div class="flex gap-12 text-center">
        <div>
          <div class="text-sm text-slate-500 uppercase tracking-wide">Service</div>
          <div class="text-lg font-semibold text-slate-800">{serviceName}</div>
        </div>
        <div>
          <div class="text-sm text-slate-500 uppercase tracking-wide">Position</div>
          <div class="text-lg font-semibold text-slate-800">#{position}</div>
        </div>
        <div>
          <div class="text-sm text-slate-500 uppercase tracking-wide">Est. Wait</div>
          <div class="text-lg font-semibold text-slate-800">~{estimatedWait} min</div>
        </div>
      </div>

      {/* Print button */}
      <button
        type="button"
        onClick={() => window.print()}
        class="flex items-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-700 active:scale-95 transition-all cursor-pointer"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width={2}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Ticket
      </button>

      {/* Countdown */}
      <div class="text-sm text-slate-400">
        Returning to home screen in <span class="font-bold text-slate-600">{countdown}</span> seconds
      </div>
    </div>
  );
}
