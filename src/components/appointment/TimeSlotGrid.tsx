interface Props {
  slots: string[];
  bookedSlots: string[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export default function TimeSlotGrid({ slots, bookedSlots, selectedSlot, onSelect }: Props) {
  const morningSlots = slots.filter((s) => {
    const hour = parseInt(s.split(':')[0], 10);
    return hour < 12;
  });
  const afternoonSlots = slots.filter((s) => {
    const hour = parseInt(s.split(':')[0], 10);
    return hour >= 12;
  });

  const bookedSet = new Set(bookedSlots);

  function renderSlot(slot: string) {
    const isBooked = bookedSet.has(slot);
    const isSelected = selectedSlot === slot;

    // Format for display: "08:00" -> "8:00 AM"
    const [h, m] = slot.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const display = `${displayHour}:${String(m).padStart(2, '0')} ${ampm}`;

    return (
      <button
        key={slot}
        type="button"
        disabled={isBooked}
        onClick={() => onSelect(slot)}
        class={[
          'px-3 py-2.5 rounded-lg text-sm font-medium transition-all border',
          isBooked
            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
            : isSelected
              ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:bg-brand-50',
        ].join(' ')}
      >
        {display}
      </button>
    );
  }

  return (
    <div class="space-y-6">
      {morningSlots.length > 0 && (
        <div>
          <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Morning
          </h4>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {morningSlots.map(renderSlot)}
          </div>
        </div>
      )}
      {afternoonSlots.length > 0 && (
        <div>
          <h4 class="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Afternoon
          </h4>
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {afternoonSlots.map(renderSlot)}
          </div>
        </div>
      )}
      {slots.length === 0 && (
        <p class="text-center text-slate-500 py-8">
          No time slots available for this date. Please select another date.
        </p>
      )}
    </div>
  );
}
