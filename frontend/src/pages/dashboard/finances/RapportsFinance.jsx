import { Wallet, TrendingUp } from "lucide-react";

export default function RapportsFinance() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
            <Wallet size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Rapports financiers</h1>
            <p className="text-sm text-slate-500">Vue d’ensemble des dépenses, entrées et bilans.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <TrendingUp size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold">Résultats du mois</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Analyse des paiements reçus, des soldes et des écarts mensuels.</p>
      </div>
    </div>
  );
}
