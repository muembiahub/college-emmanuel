import { PieChart } from "lucide-react";

export default function ReportsStatistics() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-sky-100 p-3 text-sky-600">
            <PieChart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Statistiques</h1>
            <p className="text-sm text-slate-500">Indicateurs et métriques de l'établissement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
