import { addDays, format, isToday, isBefore, startOfDay } from 'date-fns';

interface Props {
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export default function DatePicker({ selectedDate, onSelect }: Props) {
  const today = startOfDay(new Date());
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  return (
    <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
      {dates.map((date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const isSelected = selectedDate === dateStr;
        const isPast = isBefore(date, today);
        const isTodayDate = isToday(date);

        return (
          <button
            key={dateStr}
            type="button"
            disabled={isPast}
            onClick={() => onSelect(dateStr)}
            class={[
              'flex flex-col items-center min-w-[72px] px-3 py-3 rounded-xl border-2 transition-all text-center shrink-0',
              isPast
                ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                : isSelected
                  ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                  : isTodayDate
                    ? 'border-brand-300 bg-white text-slate-700 hover:border-brand-400 hover:bg-brand-50'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-slate-50',
            ].join(' ')}
          >
            <span class="text-xs font-medium uppercase tracking-wide">
              {format(date, 'EEE')}
            </span>
            <span class={[
              'text-xl font-bold mt-0.5',
              isSelected ? 'text-brand-700' : '',
            ].join(' ')}>
              {format(date, 'd')}
            </span>
            <span class="text-xs text-slate-500">
              {format(date, 'MMM')}
            </span>
            {isTodayDate && (
              <span class="text-[10px] font-semibold text-brand-600 mt-0.5">
                Today
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
