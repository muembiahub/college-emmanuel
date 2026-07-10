import { DoorOpen, ListChecks } from "lucide-react";

export default function SallesClasse() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
            <DoorOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Salles de classe</h1>
            <p className="text-sm text-slate-500">Gestion des salles, capacités et affectations.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <ListChecks size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold">Disponibilité des salles</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Planification des salles par niveau, groupe et horaire.</p>
      </div>
    </div>
  );
}
