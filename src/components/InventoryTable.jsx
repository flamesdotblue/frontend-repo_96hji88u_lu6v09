import { useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";

export default function InventoryTable({ transactions }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("sku");

  const stock = useMemo(() => aggregateStock(transactions), [transactions]);

  const rows = useMemo(() => {
    const all = Object.values(stock);
    const filtered = all.filter((r) =>
      [r.sku, r.name, r.location].some((v) => v?.toLowerCase().includes(query.toLowerCase()))
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "qty") return b.qty - a.qty;
      return String(a[sortKey] || "").localeCompare(String(b[sortKey] || ""));
    });
    return sorted;
  }, [stock, query, sortKey]);

  const totalQty = rows.reduce((s, r) => s + r.qty, 0);

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 gap-4">
          <h2 className="font-semibold">On-hand Inventory</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search SKU, name, location"
                className="pl-8 input w-64"
              />
            </div>
            <button className="btn-ghost" onClick={() => setSortKey(sortKey === "qty" ? "sku" : "qty")}>
              <ArrowUpDown size={16} />
              <span className="ml-1">Sort by {sortKey === "qty" ? "SKU" : "Qty"}</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <Th>SKU</Th>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th align="right">Qty</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.sku}-${r.location}`} className="border-t">
                  <Td>{r.sku}</Td>
                  <Td className="text-gray-600">{r.name || "—"}</Td>
                  <Td>{r.location}</Td>
                  <Td align="right" className={`tabular-nums font-medium ${r.qty < 0 ? "text-rose-600" : ""}`}>{r.qty}</Td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-gray-50 font-medium">
                <Td colSpan={3}>Total</Td>
                <Td align="right" className="tabular-nums">{totalQty}</Td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
}

function Th({ children, align = "left" }) {
  return <th className={`px-4 py-2 text-${align}`}>{children}</th>;
}
function Td({ children, align = "left", colSpan }) {
  return (
    <td className={`px-4 py-2 text-${align}`} colSpan={colSpan}>
      {children}
    </td>
  );
}

function aggregateStock(transactions) {
  const map = new Map();
  for (const t of transactions) {
    if (!t.sku || !t.location) continue;

    // Determine effect on qty based on type
    const effect = (() => {
      switch (t.type) {
        case "inward":
          return t.qty;
        case "outward":
        case "consumption":
        case "rtv":
          return -t.qty;
        case "transfer":
          return 0; // handled as out at source, in at destination
        default:
          return 0;
      }
    })();

    const key = `${t.sku}__${t.location}`;
    const cur = map.get(key) || { sku: t.sku, name: t.name, location: t.location, qty: 0 };
    cur.qty += effect;
    map.set(key, cur);

    // For transfers, add incoming at destination
    if (t.type === "transfer" && t.toLocation) {
      const destKey = `${t.sku}__${t.toLocation}`;
      const curDest = map.get(destKey) || { sku: t.sku, name: t.name, location: t.toLocation, qty: 0 };
      cur.qty -= t.qty; // source loses stock
      curDest.qty += t.qty; // destination gains
      map.set(key, cur);
      map.set(destKey, curDest);
    }
  }
  const obj = {};
  for (const [k, v] of map.entries()) obj[k] = v;
  return obj;
}
