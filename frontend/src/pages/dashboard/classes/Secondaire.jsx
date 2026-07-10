import { GraduationCap, Compass } from "lucide-react";

export default function Secondaire() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-violet-100 p-3 text-violet-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Classe de Secondaire</h1>
            <p className="text-sm text-slate-500">Pilotage des parcours scolaires et examens.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Compass size={18} className="text-emerald-500" />
          <h2 className="text-lg font-semibold">Orientation et suivi</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Suivi des performances, conseils d’orientation et préparation aux examens.</p>
      </div>
    </div>
  );
}
