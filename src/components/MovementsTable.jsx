import React, { useMemo, useState } from 'react';
import { Trash2, Filter } from 'lucide-react';

export default function MovementsTable({ movements, onDelete }) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return movements.filter((m) => {
      const matchType = typeFilter === 'All' || m.type === typeFilter;
      const q = query.trim().toLowerCase();
      const matchQuery = !q || m.item.toLowerCase().includes(q) || (m.notes || '').toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [movements, typeFilter, query]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">Recent Movements</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-slate-200">
            <Filter className="h-4 w-4 text-slate-500" />
            <select value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)} className="bg-transparent text-sm focus:outline-none">
              {['All','Inward','Transfer','Outward','RTV','Consumption'].map((t)=> (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <input
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search item or notes"
            className="rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">From</th>
              <th className="px-3 py-2">To</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-slate-500">No movements yet</td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 whitespace-nowrap">{m.date}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    m.type === 'Inward' ? 'bg-emerald-100 text-emerald-700' :
                    m.type === 'Transfer' ? 'bg-amber-100 text-amber-700' :
                    m.type === 'Outward' ? 'bg-rose-100 text-rose-700' :
                    m.type === 'RTV' ? 'bg-fuchsia-100 text-fuchsia-700' :
                    'bg-sky-100 text-sky-700'
                  }`}>{m.type}</span>
                </td>
                <td className="px-3 py-2 font-medium">{m.item}</td>
                <td className="px-3 py-2">{m.quantity}</td>
                <td className="px-3 py-2">{m.fromLocation || '-'}</td>
                <td className="px-3 py-2">{m.toLocation || '-'}</td>
                <td className="px-3 py-2 max-w-xs truncate" title={m.notes}>{m.notes || '-'}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={()=>onDelete(m.id)} className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700">
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
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
