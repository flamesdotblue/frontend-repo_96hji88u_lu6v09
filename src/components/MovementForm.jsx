import React, { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'Inward', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Transfer', color: 'bg-amber-100 text-amber-700' },
  { value: 'Outward', color: 'bg-rose-100 text-rose-700' },
  { value: 'RTV', color: 'bg-fuchsia-100 text-fuchsia-700' },
  { value: 'Consumption', color: 'bg-sky-100 text-sky-700' },
];

export default function MovementForm({ onAdd }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    type: 'Inward',
    item: '',
    quantity: 1,
    fromLocation: '',
    toLocation: '',
    notes: '',
  });

  const showFrom = useMemo(() => ['Transfer', 'RTV', 'Outward', 'Consumption'].includes(form.type), [form.type]);
  const showTo = useMemo(() => ['Transfer', 'Inward'].includes(form.type), [form.type]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === 'quantity' ? Number(value) : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.item || form.quantity <= 0) return;
    const payload = {
      id: crypto.randomUUID(),
      ...form,
    };
    onAdd(payload);
    setForm((f) => ({ ...f, item: '', quantity: 1, notes: '' }));
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Add Movement</h2>
        <span className={`text-xs px-2 py-1 rounded ${TYPE_OPTIONS.find(t=>t.value===form.type)?.color}`}>{form.type}</span>
      </div>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-6 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500">
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.value}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Item</label>
          <input name="item" value={form.item} onChange={handleChange} placeholder="e.g., SKU-123" className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
          <input type="number" min={1} name="quantity" value={form.quantity} onChange={handleChange} className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        {showFrom && (
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-600 mb-1">From</label>
            <input name="fromLocation" value={form.fromLocation} onChange={handleChange} placeholder="e.g., Main Warehouse" className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        )}
        {showTo && (
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-600 mb-1">To</label>
            <input name="toLocation" value={form.toLocation} onChange={handleChange} placeholder="e.g., Store A" className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        )}

        <div className="md:col-span-6">
          <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
          <input name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" className="w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div className="md:col-span-6 flex justify-end">
          <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
            <Plus className="h-4 w-4" /> Add Movement
          </button>
        </div>
      </form>
    </div>
  );
}
