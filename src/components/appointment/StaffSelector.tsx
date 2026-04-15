interface StaffOption {
  id: string;
  name: string;
  role: string;
  avatarInitials: string;
}

interface Props {
  staffList: StaffOption[];
  selectedStaffId: string | null;
  onSelect: (staffId: string | null) => void;
}

const AVATAR_COLORS = [
  'bg-brand-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-teal-500',
];

function getColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

export default function StaffSelector({ staffList, selectedStaffId, onSelect }: Props) {
  const isNoPreference = selectedStaffId === null;

  return (
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {/* No Preference option */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        class={[
          'flex flex-col items-center p-4 rounded-xl border-2 transition-all',
          isNoPreference
            ? 'border-brand-600 bg-brand-50 shadow-sm'
            : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50',
        ].join(' ')}
      >
        <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2">
          <svg class="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span class="text-sm font-medium text-slate-700">No Preference</span>
        <span class="text-xs text-slate-500 mt-0.5">Any available</span>
      </button>

      {/* Staff options */}
      {staffList.map((member, index) => {
        const isSelected = selectedStaffId === member.id;
        return (
          <button
            key={member.id}
            type="button"
            onClick={() => onSelect(member.id)}
            class={[
              'flex flex-col items-center p-4 rounded-xl border-2 transition-all',
              isSelected
                ? 'border-brand-600 bg-brand-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-brand-300 hover:bg-slate-50',
            ].join(' ')}
          >
            <div class={`w-12 h-12 rounded-full ${getColor(index)} flex items-center justify-center mb-2`}>
              <span class="text-sm font-bold text-white">{member.avatarInitials}</span>
            </div>
            <span class="text-sm font-medium text-slate-700">{member.name}</span>
            <span class="text-xs text-slate-500 mt-0.5 capitalize">{member.role}</span>
          </button>
        );
      })}
    </div>
  );
}
