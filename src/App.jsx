import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import MovementForm from './components/MovementForm';
import MovementsTable from './components/MovementsTable';
import Reports from './components/Reports';

const seed = [
  { id: '1', date: new Date().toISOString().slice(0,10), type: 'Inward', item: 'SKU-1001', quantity: 50, fromLocation: 'Supplier A', toLocation: 'Main WH', notes: 'Initial stock' },
  { id: '2', date: new Date().toISOString().slice(0,10), type: 'Transfer', item: 'SKU-1001', quantity: 20, fromLocation: 'Main WH', toLocation: 'Store 1', notes: 'Display' },
  { id: '3', date: new Date().toISOString().slice(0,10), type: 'Outward', item: 'SKU-1001', quantity: 5, fromLocation: 'Store 1', toLocation: '', notes: 'Customer order' },
  { id: '4', date: new Date().toISOString().slice(0,10), type: 'RTV', item: 'SKU-1002', quantity: 3, fromLocation: 'Main WH', toLocation: 'Vendor B', notes: 'Defective' },
  { id: '5', date: new Date().toISOString().slice(0,10), type: 'Consumption', item: 'SKU-1003', quantity: 2, fromLocation: 'Main WH', toLocation: '', notes: 'Internal use' },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('inward');
  const [movements, setMovements] = useState(seed);

  const tabTitle = useMemo(() => {
    switch (currentTab) {
      case 'inward': return 'Inward';
      case 'transfer': return 'Transfers';
      case 'outward': return 'Outward';
      case 'rtv': return 'RTV';
      case 'consumption': return 'Consumption';
      case 'reports': return 'Reports';
      default: return 'Inventory';
    }
  }, [currentTab]);

  function addMovement(m) {
    setMovements((prev) => [m, ...prev]);
  }
  function deleteMovement(id) {
    setMovements((prev) => prev.filter((m) => m.id !== id));
  }

  const typeForTab = useMemo(() => ({
    inward: 'Inward',
    transfer: 'Transfer',
    outward: 'Outward',
    rtv: 'RTV',
    consumption: 'Consumption',
  }), []);

  const visibleMovements = useMemo(() => {
    if (currentTab === 'reports') return movements;
    const type = typeForTab[currentTab];
    return movements.filter((m) => m.type === type);
  }, [currentTab, movements, typeForTab]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{tabTitle}</h2>
          <p className="text-slate-600">Manage your stock movements and analyze performance.</p>
        </div>

        {currentTab !== 'reports' && (
          <MovementForm onAdd={(m)=> addMovement({ ...m, type: typeForTab[currentTab] })} />
        )}

        {currentTab === 'reports' ? (
          <Reports movements={movements} />
        ) : (
          <MovementsTable movements={visibleMovements} onDelete={deleteMovement} />
        )}
      </main>
    </div>
  );
}
