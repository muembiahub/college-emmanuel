import { UserPlus, ClipboardCheck, ArrowRight } from "lucide-react";

export default function Inscription() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Gestion des inscriptions</h1>
            <p className="text-sm text-slate-500">Suivi des élèves, dossiers et validations.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Nouvelles inscriptions", value: "42", detail: "À traiter cette semaine" },
          { title: "Dossiers complets", value: "28", detail: "Prêts pour validation" },
          { title: "Inscriptions confirmées", value: "156", detail: "Déjà affectés aux classes" }
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-700">{item.title}</h2>
              <ClipboardCheck className="text-emerald-500" size={18} />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Actions rapides</h2>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Voir le détail <ArrowRight size={16} />
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Préparez les dossiers, gérez les classes et suivez l’état des élèves.</p>
      </div>
    </div>
  );
}
