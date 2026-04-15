import { useState } from 'preact/hooks';

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  branchId: string;
  serviceIds: string[];
  avatarInitials: string;
  isOnDuty: boolean;
  counterIds: string[];
}

interface Branch {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
}

interface Props {
  staff: string;
  branches: string;
  services: string;
}

const ROLES = ['agent', 'supervisor', 'manager', 'admin'];

const emptyStaff: Staff = {
  id: '',
  name: '',
  email: '',
  role: 'agent',
  branchId: '',
  serviceIds: [],
  avatarInitials: '',
  isOnDuty: false,
  counterIds: [],
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700',
    manager: 'bg-blue-100 text-blue-700',
    supervisor: 'bg-amber-100 text-amber-700',
    agent: 'bg-slate-100 text-slate-700',
  };
  return (
    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors[role] ?? colors.agent}`}>
      {role}
    </span>
  );
}

export default function StaffManager({ staff: staffJson, branches: branchesJson, services: servicesJson }: Props) {
  const [items, setItems] = useState<Staff[]>(() => JSON.parse(staffJson));
  const branchList: Branch[] = JSON.parse(branchesJson);
  const serviceList: Service[] = JSON.parse(servicesJson);
  const [editing, setEditing] = useState<Staff | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterBranch, setFilterBranch] = useState('all');

  const filtered = filterBranch === 'all' ? items : items.filter((s) => s.branchId === filterBranch);

  function toggleOnDuty(id: string) {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isOnDuty: !s.isOnDuty } : s)),
    );
  }

  function openNew() {
    setEditing({
      ...emptyStaff,
      id: `staff-new-${Date.now()}`,
      branchId: branchList[0]?.id ?? '',
    });
    setIsNew(true);
  }

  function openEdit(member: Staff) {
    setEditing({ ...member, serviceIds: [...member.serviceIds] });
    setIsNew(false);
  }

  function save() {
    if (!editing) return;
    const final = { ...editing, avatarInitials: editing.avatarInitials || getInitials(editing.name) };
    if (isNew) {
      setItems((prev) => [...prev, final]);
    } else {
      setItems((prev) => prev.map((s) => (s.id === final.id ? final : s)));
    }
    setEditing(null);
    setIsNew(false);
  }

  function cancel() {
    setEditing(null);
    setIsNew(false);
  }

  function updateField(field: keyof Staff, value: unknown) {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  }

  function toggleService(serviceId: string) {
    if (!editing) return;
    const ids = editing.serviceIds.includes(serviceId)
      ? editing.serviceIds.filter((id) => id !== serviceId)
      : [...editing.serviceIds, serviceId];
    setEditing({ ...editing, serviceIds: ids });
  }

  function branchName(id: string): string {
    return branchList.find((b) => b.id === id)?.name ?? id;
  }

  // --- Modal ---
  if (editing) {
    return (
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-slate-200">
            <h3 class="text-lg font-semibold text-slate-900">
              {isNew ? 'Add Staff Member' : 'Edit Staff Member'}
            </h3>
          </div>

          <div class="px-6 py-5 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.name}
                  onInput={(e) => updateField('name', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.email}
                  onInput={(e) => updateField('email', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.role}
                  onChange={(e) => updateField('role', (e.target as HTMLSelectElement).value)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                <select
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={editing.branchId}
                  onChange={(e) => updateField('branchId', (e.target as HTMLSelectElement).value)}
                >
                  {branchList.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Service qualifications */}
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Service Qualifications</label>
              <div class="grid grid-cols-2 gap-2">
                {serviceList.map((svc) => (
                  <label key={svc.id} class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      class="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      checked={editing.serviceIds.includes(svc.id)}
                      onChange={() => toggleService(svc.id)}
                    />
                    {svc.name}
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
              {isNew ? 'Add Staff' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Table ---
  return (
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3">
          <p class="text-sm text-slate-500">{filtered.length} staff members</p>
          <select
            class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            value={filterBranch}
            onChange={(e) => setFilterBranch((e.target as HTMLSelectElement).value)}
          >
            <option value="all">All Branches</option>
            {branchList.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors"
          onClick={openNew}
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Staff
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="bg-slate-50 text-slate-600">
              <th class="px-4 py-3 font-medium">Staff</th>
              <th class="px-4 py-3 font-medium">Email</th>
              <th class="px-4 py-3 font-medium">Role</th>
              <th class="px-4 py-3 font-medium">Branch</th>
              <th class="px-4 py-3 font-medium text-center">On Duty</th>
              <th class="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            {filtered.map((m, idx) => (
              <tr key={m.id} class={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
                      {m.avatarInitials}
                    </div>
                    <span class="font-medium text-slate-900">{m.name}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-slate-600">{m.email}</td>
                <td class="px-4 py-3">
                  <RoleBadge role={m.role} />
                </td>
                <td class="px-4 py-3 text-slate-600">{branchName(m.branchId)}</td>
                <td class="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleOnDuty(m.id)}
                    class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      m.isOnDuty ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                    role="switch"
                    aria-checked={m.isOnDuty}
                  >
                    <span
                      class={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        m.isOnDuty ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    onClick={() => openEdit(m)}
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
