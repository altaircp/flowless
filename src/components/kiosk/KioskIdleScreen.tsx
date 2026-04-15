interface Props {
  branchName: string;
  onStart: () => void;
}

export default function KioskIdleScreen({ branchName, onStart }: Props) {
  return (
    <button
      type="button"
      onClick={onStart}
      class="w-full h-full flex flex-col items-center justify-center gap-8 cursor-pointer bg-gradient-to-br from-slate-50 via-brand-50 to-sky-50 animate-[gradientShift_8s_ease_infinite] bg-[length:200%_200%] focus:outline-none"
    >
      {/* Logo */}
      <div class="flex items-center gap-4">
        <svg class="w-16 h-16 text-brand-600" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <path d="M8 12h16M8 16h12M8 20h8" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span class="text-5xl font-extrabold text-slate-900 tracking-tight">FlowLess</span>
      </div>

      {/* Touch to begin */}
      <div class="flex flex-col items-center gap-3">
        <span class="text-3xl font-semibold text-slate-700 animate-pulse">
          Touch to Begin
        </span>
        <div class="w-20 h-1 bg-brand-500 rounded-full animate-pulse" />
      </div>

      {/* Branch name */}
      {branchName && (
        <span class="text-xl text-slate-500">{branchName}</span>
      )}

      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </button>
  );
}
