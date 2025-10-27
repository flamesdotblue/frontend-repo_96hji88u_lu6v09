import React, { useMemo } from 'react';

function Bar({ label, value, max, color }) {
  const width = max ? Math.max((value / max) * 100, 2) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-600">
        <span>{label}</span>
        <span className="font-medium text-slate-800">{value}</span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 rounded">
        <div className={`h-full rounded ${color}`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function LineChart({ points }) {
  const width = 500;
  const height = 160;
  const maxY = Math.max(1, ...points.map((p) => p.y));
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * (width - 20) + 10;
      const y = height - 20 - (p.y / maxY) * (height - 40);
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  const areaPath = `${path} L ${width - 10},${height - 20} L 10,${height - 20} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#grad)" />
      <path d={path} stroke="#6366f1" strokeWidth="2.5" fill="none" />
      {points.map((p, i) => {
        const x = (i / (points.length - 1)) * (width - 20) + 10;
        const y = height - 20 - (p.y / maxY) * (height - 40);
        return <circle key={i} cx={x} cy={y} r="3" fill="#6366f1" />;
      })}
    </svg>
  );
}

export default function Reports({ movements }) {
  const totalsByType = useMemo(() => {
    const t = { Inward: 0, Transfer: 0, Outward: 0, RTV: 0, Consumption: 0 };
    movements.forEach((m) => { t[m.type] = (t[m.type] || 0) + m.quantity; });
    return t;
  }, [movements]);

  const stockByItem = useMemo(() => {
    const map = new Map();
    for (const m of movements) {
      const key = m.item;
      const current = map.get(key) || 0;
      let delta = 0;
      if (m.type === 'Inward') delta = m.quantity;
      else if (m.type === 'Outward' || m.type === 'Consumption' || m.type === 'RTV') delta = -m.quantity;
      else if (m.type === 'Transfer') delta = 0; // stock total unchanged
      map.set(key, current + delta);
    }
    return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]);
  }, [movements]);

  const last7 = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const counts = days.map((d) => ({ x: d, y: 0 }));
    for (const m of movements) {
      const idx = days.indexOf(m.date);
      if (idx >= 0) counts[idx].y += m.quantity;
    }
    return counts;
  }, [movements]);

  const maxTotal = Math.max(...Object.values(totalsByType));

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-semibold mb-4">Totals by Movement Type</h3>
        <div className="space-y-3">
          <Bar label="Inward" value={totalsByType.Inward} max={maxTotal} color="bg-emerald-500" />
          <Bar label="Transfer" value={totalsByType.Transfer} max={maxTotal} color="bg-amber-500" />
          <Bar label="Outward" value={totalsByType.Outward} max={maxTotal} color="bg-rose-500" />
          <Bar label="RTV" value={totalsByType.RTV} max={maxTotal} color="bg-fuchsia-500" />
          <Bar label="Consumption" value={totalsByType.Consumption} max={maxTotal} color="bg-sky-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h3 className="font-semibold mb-4">Movement Volume (Last 7 days)</h3>
        <LineChart points={last7} />
        <div className="mt-2 grid grid-cols-7 text-xs text-slate-600">
          {last7.map((p) => (
            <div key={p.x} className="text-center">{p.x.slice(5)}</div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm lg:col-span-2">
        <h3 className="font-semibold mb-4">Current Stock by Item</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stockByItem.length === 0 && (
            <p className="text-slate-500">No stock yet</p>
          )}
          {stockByItem.map(([item, qty]) => (
            <div key={item} className="rounded-lg border border-slate-200 p-3 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600">{item}</div>
                <div className="text-xs text-slate-500">On hand</div>
              </div>
              <div className={`text-lg font-semibold ${qty < 0 ? 'text-rose-600' : 'text-slate-900'}`}>{qty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
