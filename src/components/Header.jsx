import React from 'react';
import { Package, ArrowLeftRight, Upload, Download, RotateCcw, BarChart2 } from 'lucide-react';

const tabs = [
  { key: 'inward', label: 'Inward', icon: Upload },
  { key: 'transfer', label: 'Transfers', icon: ArrowLeftRight },
  { key: 'outward', label: 'Outward', icon: Download },
  { key: 'rtv', label: 'RTV', icon: RotateCcw },
  { key: 'consumption', label: 'Consumption', icon: Package },
  { key: 'reports', label: 'Reports', icon: BarChart2 },
];

export default function Header({ currentTab, setCurrentTab }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-semibold tracking-tight">Inventory Manager</h1>
        </div>
        <nav className="flex gap-1 flex-wrap">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCurrentTab(key)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentTab === key
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
