import { ClipboardList, Sparkles } from "lucide-react";

export default function Notes() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-100 p-3 text-orange-600">
            <ClipboardList size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Notes de classe</h1>
            <p className="text-sm text-slate-500">Consulter et gérer les notes et évaluations.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Sparkles size={18} className="text-orange-500" />
          <h2 className="text-lg font-semibold">Tableau de bord des notes</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Visualisez les notes par matière, classe et trimestre.</p>
      </div>
    </div>
  );
}
