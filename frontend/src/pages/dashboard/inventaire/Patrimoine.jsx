import { Building2, Landmark } from "lucide-react";

export default function Patrimoine() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-100 p-3 text-violet-600">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Patrimoine</h1>
            <p className="text-sm text-slate-500">Inventaire des biens et équipements de l’établissement.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Landmark size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold">Équipements institutionnels</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Gestion des immobilisations, état de conservation et suivi des investissements.</p>
      </div>
    </div>
  );
}
