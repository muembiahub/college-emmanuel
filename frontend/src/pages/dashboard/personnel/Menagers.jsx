import { Hammer, Wrench } from "lucide-react";

export default function Menagers() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-lime-100 p-3 text-lime-600">
            <Hammer size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Ménagers</h1>
            <p className="text-sm text-slate-500">Suivi des tâches de maintenance et d’entretien.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Wrench size={18} className="text-lime-600" />
          <h2 className="text-lg font-semibold">Maintenance courante</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Planification des interventions, besoin de réparations et supervision des espaces.</p>
      </div>
    </div>
  );
}
