import { useState } from 'preact/hooks';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  timezone: string;
  operatingHours: { day: number; open: string; close: string }[];
  isActive: boolean;
  coordinates: { lat: number; lng: number };
}

interface Props {
  branches: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptyBranch: Branch = {
  id: '',
  name: '',
  address: '',
  city: '',
  phone: '',
  timezone: 'America/New_York',
  operatingHours: [
    { day: 1, open: '08:00', close: '18:00' },
    { day: 2, open: '08:00', close: '18:00' },
    { day: 3, open: '08:00', close: '18:00' },
    { day: 4, open: '08:00', close: '18:00' },
    { day: 5, open: '08:00', close: '18:00' },
  ],
  isActive: true,
  coordinates: { lat: 0, lng: 0 },
};

export default function BranchManager({ branches: branchesJson }: Props) {
  const [items, setItems] = useState<Branch[]>(() => JSON.parse(branchesJson));
  const [editing, setEditing] = useState<Branch | null>(null);
  const [isNew, setIsNew] = useState(false);

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)),
    );
  }

  function openNew() {
    setEditing({ ...emptyBranch, id: `branch-new-${Date.now()}` });
    setIsNew(true);
  }

  function openEdit(branch: Branch) {
    setEditing({ ...branch, operatingHours: branch.operatingHours.map((h) => ({ ...h })) });
    setIsNew(false);
  }

  function save() {
    if (!editing) return;
    if (isNew) {
      setItems((prev) => [...prev, editing]);
    } else {
      setItems((prev) => prev.map((b) => (b.id === editing.id ? editing : b)));
    }
    setEditing(null);
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  function updateField(field: keyof Branch, value: string | boolean) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  function updateHour(idx: number, field: 'open' | 'close', value: string) {
    if (!editing) return;
    const hours = editing.operatingHours.map((h, i) =>
      i === idx ? { ...h, [field]: value } : h,
    );
    setEditing({ ...editing, operatingHours: hours });
  }

  // --- Modal overlay ---
  if (editing) {
    return (
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-900">
              {isNew ? 'Add Branch' : 'Edit Branch'}
            </h3>
          </div>

          <div class="px-6 py-5 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={editing.name}
                onInput={(e) => updateField('name', (e.target as HTMLInputElement).value)}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                type="text"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                value={editing.address}
                onInput={(e) => updateField('address', (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.city}
                  onInput={(e) => updateField('city', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.phone}
                  onInput={(e) => updateField('phone', (e.target as HTMLInputElement).value)}
                />
              </div>
            </div>

            {/* Operating hours */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Operating Hours</label>
              <div class="space-y-2">
                {editing.operatingHours.map((h, i) => (
                  <div key={h.day} class="flex items-center gap-3">
                    <span class="text-sm text-slate-600 w-24">{DAY_NAMES[h.day]}</span>
                    <input
                      type="time"
                      class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={h.open}
                      onInput={(e) => updateHour(i, 'open', (e.target as HTMLInputElement).value)}
                    />
                    <span class="text-slate-400 text-sm">to</span>
                    <input
                      type="time"
                      class="rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      value={h.close}
                      onInput={(e) => updateHour(i, 'close', (e.target as HTMLInputElement).value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={cancel}
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
              onClick={save}
            >
              {isNew ? 'Add Branch' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Table view ---
  return (
    <div>
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-slate-500">{items.length} branches configured</p>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
          onClick={openNew}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Branch
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-slate-50 text-slate-600">
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Address</th>
              <th class="px-4 py-3 font-medium">City</th>
              <th class="px-4 py-3 font-medium">Phone</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
              <th class="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {items.map((b, idx) => (
              <tr key={b.id} class={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                <td class="px-4 py-3 font-medium text-slate-900">{b.name}</td>
                <td class="px-4 py-3 text-slate-600">{b.address}</td>
                <td class="px-4 py-3 text-slate-600">{b.city}</td>
                <td class="px-4 py-3 text-slate-600">{b.phone}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(b.id)}
                    class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      b.isActive ? 'bg-brand-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={b.isActive}
                  >
                    <span
                      class={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        b.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={() => openEdit(b)}
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
