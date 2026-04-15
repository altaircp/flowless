import { useState } from 'preact/hooks';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  estimatedDurationMinutes: number;
  icon: string;
  isActive: boolean;
  branchIds: string[];
  maxDailyCapacity?: number;
}

interface Branch {
  id: string;
  name: string;
}

interface Props {
  services: string;
  branches: string;
}

const ICON_OPTIONS = [
  { value: 'banknotes', label: 'Banknotes' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'document', label: 'Document' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'shield', label: 'Shield' },
  { value: 'chart', label: 'Chart' },
  { value: 'users', label: 'Users' },
  { value: 'cog', label: 'Settings' },
  { value: 'globe', label: 'Globe' },
  { value: 'key', label: 'Key' },
];

const ICON_MAP: Record<string, string> = {
  banknotes: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
  'credit-card': 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
  document: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  briefcase: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  users: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  cog: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z',
  globe: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
  key: 'M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z',
};

function ServiceIcon({ icon }: { icon: string }) {
  const path = ICON_MAP[icon];
  if (!path) {
    return (
      <span class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
        ?
      </span>
    );
  }
  return (
    <span class="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width={1.5}>
        <path stroke-linecap="round" stroke-linejoin="round" d={path} />
      </svg>
    </span>
  );
}

const emptyService: Service = {
  id: '',
  name: '',
  description: '',
  category: '',
  estimatedDurationMinutes: 15,
  icon: 'document',
  isActive: true,
  branchIds: [],
};

export default function ServiceManager({ services: servicesJson, branches: branchesJson }: Props) {
  const [items, setItems] = useState<Service[]>(() => JSON.parse(servicesJson));
  const branchList: Branch[] = JSON.parse(branchesJson);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
    );
  }

  function openNew() {
    setEditing({ ...emptyService, id: `svc-new-${Date.now()}`, branchIds: [] });
    setIsNew(true);
  }

  function openEdit(svc: Service) {
    setEditing({ ...svc, branchIds: [...svc.branchIds] });
    setIsNew(false);
  }

  function save() {
    if (!editing) return;
    if (isNew) {
      setItems((prev) => [...prev, editing]);
    } else {
      setItems((prev) => prev.map((s) => (s.id === editing.id ? editing : s)));
    }
    setEditing(null);
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  function updateField(field: keyof Service, value: unknown) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  function toggleBranch(branchId: string) {
    if (!editing) return;
    const ids = editing.branchIds.includes(branchId)
      ? editing.branchIds.filter((id) => id !== branchId)
      : [...editing.branchIds, branchId];
    setEditing({ ...editing, branchIds: ids });
  }

  // --- Modal ---
  if (editing) {
    return (
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-900">
              {isNew ? 'Add Service' : 'Edit Service'}
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
              <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                rows={3}
                value={editing.description}
                onInput={(e) => updateField('description', (e.target as HTMLTextAreaElement).value)}
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.category}
                  onInput={(e) => updateField('category', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  min="1"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.estimatedDurationMinutes}
                  onInput={(e) =>
                    updateField('estimatedDurationMinutes', parseInt((e.target as HTMLInputElement).value) || 1)
                  }
                />
              </div>
            </div>

            {/* Icon selector */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Icon</label>
              <div class="flex flex-wrap gap-2">
                {ICON_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateField('icon', opt.value)}
                    class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      editing.icon === opt.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ServiceIcon icon={opt.value} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Branch assignment */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Available at Branches</label>
              <div class="space-y-2">
                {branchList.map((b) => (
                  <label key={b.id} class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      class="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      checked={editing.branchIds.includes(b.id)}
                      onChange={() => toggleBranch(b.id)}
                    />
                    {b.name}
                  </label>
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
              {isNew ? 'Add Service' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Table ---
  return (
    <div>
      <div class="flex items-center justify-between mb-4">
        <p class="text-sm text-slate-500">{items.length} services configured</p>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
          onClick={openNew}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-slate-50 text-slate-600">
              <th class="px-4 py-3 font-medium">Icon</th>
              <th class="px-4 py-3 font-medium">Name</th>
              <th class="px-4 py-3 font-medium">Category</th>
              <th class="px-4 py-3 font-medium text-center">Duration</th>
              <th class="px-4 py-3 font-medium text-center">Status</th>
              <th class="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {items.map((s, idx) => (
              <tr key={s.id} class={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                <td class="px-4 py-3">
                  <ServiceIcon icon={s.icon} />
                </td>
                <td class="px-4 py-3">
                  <div class="font-medium text-slate-900">{s.name}</div>
                  <div class="text-xs text-slate-400 mt-0.5">{s.description.slice(0, 60)}{s.description.length > 60 ? '...' : ''}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {s.category}
                  </span>
                </td>
                <td class="px-4 py-3 text-center text-slate-600">{s.estimatedDurationMinutes} min</td>
                <td class="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(s.id)}
                    class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      s.isActive ? 'bg-brand-600' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={s.isActive}
                  >
                    <span
                      class={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        s.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={() => openEdit(s)}
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
