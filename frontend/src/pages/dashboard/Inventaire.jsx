import { Package } from "lucide-react";

export default function Inventaire() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-slate-100 p-3 text-slate-700">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Inventaire</h1>
            <p className="text-sm text-slate-500">Tableau de bord de l'inventaire et du patrimoine.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
