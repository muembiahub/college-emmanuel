import { CreditCard, CheckCircle2 } from "lucide-react";

export default function Paiements() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Paiements</h1>
            <p className="text-sm text-slate-500">Gestion des règlements et suivis des factures.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">État des paiements</h2>
        <ul className="mt-4 space-y-3">
          {[
            "Paiement en attente : 8",
            "Paiements validés : 54",
            "Paiements échoués : 2"
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 size={16} className="text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
