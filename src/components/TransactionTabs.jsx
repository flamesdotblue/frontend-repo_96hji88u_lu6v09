import { useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Repeat, RotateCcw, Utensils } from "lucide-react";

const TABS = [
  { key: "inward", label: "Inward", icon: ArrowDownCircle, color: "text-emerald-600" },
  { key: "transfer", label: "Transfer", icon: Repeat, color: "text-indigo-600" },
  { key: "outward", label: "Outward", icon: ArrowUpCircle, color: "text-rose-600" },
  { key: "rtv", label: "RTV", icon: RotateCcw, color: "text-amber-600" },
  { key: "consumption", label: "Consumption", icon: Utensils, color: "text-sky-600" },
];

export default function TransactionTabs({ onAddTransaction }) {
  const [active, setActive] = useState("inward");

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 whitespace-nowrap ${
                active === t.key ? "border-black text-black" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <t.icon size={18} className={t.color} />
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          {active === "inward" && <InwardForm onAdd={onAddTransaction} />}
          {active === "transfer" && <TransferForm onAdd={onAddTransaction} />}
          {active === "outward" && <OutwardForm onAdd={onAddTransaction} />}
          {active === "rtv" && <RTVForm onAdd={onAddTransaction} />}
          {active === "consumption" && <ConsumptionForm onAdd={onAddTransaction} />}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      {children}
    </label>
  );
}

function Row({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{children}</div>;
}

function BaseForm({ type, onAdd, extraFields = null }) {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    location: "",
    qty: 1,
    notes: "",
    date: new Date().toISOString().slice(0, 10),
  });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.sku || !form.location || !form.qty) return;
    const tx = {
      ...form,
      qty: Number(form.qty),
      type,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    onAdd(tx);
    setForm((f) => ({ ...f, qty: 1, notes: "" }));
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Row>
        <Field label="SKU">
          <input value={form.sku} onChange={(e) => update("sku", e.target.value)} className="input" placeholder="e.g., ABC-001" />
        </Field>
        <Field label="Name">
          <input value={form.name} onChange={(e) => update("name", e.target.value)} className="input" placeholder="Item name" />
        </Field>
        <Field label="Location">
          <input value={form.location} onChange={(e) => update("location", e.target.value)} className="input" placeholder="e.g., Main WH" />
        </Field>
      </Row>
      {extraFields}
      <Row>
        <Field label="Quantity">
          <input type="number" min={1} value={form.qty} onChange={(e) => update("qty", e.target.value)} className="input" />
        </Field>
        <Field label="Date">
          <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input" />
        </Field>
        <Field label="Notes">
          <input value={form.notes} onChange={(e) => update("notes", e.target.value)} className="input" placeholder="Optional" />
        </Field>
      </Row>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary">Add {type}</button>
      </div>
    </form>
  );
}

function InwardForm({ onAdd }) {
  return <BaseForm type="inward" onAdd={onAdd} />;
}

function OutwardForm({ onAdd }) {
  return <BaseForm type="outward" onAdd={onAdd} />;
}

function ConsumptionForm({ onAdd }) {
  return (
    <BaseForm
      type="consumption"
      onAdd={onAdd}
      extraFields={
        <Row>
          <Field label="Department/Job">
            <input className="input" placeholder="e.g., Line A" />
          </Field>
        </Row>
      }
    />
  );
}

function RTVForm({ onAdd }) {
  return (
    <BaseForm
      type="rtv"
      onAdd={onAdd}
      extraFields={
        <Row>
          <Field label="Reason">
            <input className="input" placeholder="Damaged / Excess / QA" />
          </Field>
        </Row>
      }
    />
  );
}

function TransferForm({ onAdd }) {
  const [extra, setExtra] = useState({ toLocation: "" });
  return (
    <BaseForm
      type="transfer"
      onAdd={(tx) => onAdd({ ...tx, toLocation: extra.toLocation })}
      extraFields={
        <Row>
          <Field label="To Location">
            <input
              value={extra.toLocation}
              onChange={(e) => setExtra({ toLocation: e.target.value })}
              className="input"
              placeholder="e.g., Storefront"
            />
          </Field>
        </Row>
      }
    />
  );
}
