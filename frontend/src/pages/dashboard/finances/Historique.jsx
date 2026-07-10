import { Clock } from "lucide-react";

export default function HistoriqueFinance() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-amber-100 p-3 text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Historique financier</h1>
            <p className="text-sm text-slate-500">Historique des paiements et mouvements financiers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
