import { Package, BarChart2 } from "lucide-react";

export default function Navbar({ totalSkus, totalQty }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600 text-white">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Inventory Control</h1>
            <p className="text-xs text-gray-500">Inward • Transfers • Outward • RTV • Consumption</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="hidden sm:flex items-center gap-2 text-gray-600">
            <span className="font-medium">SKUs:</span>
            <span className="tabular-nums">{totalSkus}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-gray-600">
            <span className="font-medium">On Hand:</span>
            <span className="tabular-nums">{totalQty}</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-600">
            <BarChart2 size={18} />
            <span className="font-medium">Reports</span>
          </div>
        </div>
      </div>
    </header>
  );
}
