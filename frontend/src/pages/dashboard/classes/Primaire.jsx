import { BookMarked, PenTool } from "lucide-react";

export default function Primaire() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-sky-100 p-3 text-sky-600">
            <BookMarked size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Classe de Primaire</h1>
            <p className="text-sm text-slate-500">Gestion des cours, évaluations et devoirs.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <PenTool size={18} className="text-indigo-500" />
          <h2 className="text-lg font-semibold">Suivi des apprentissages</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Tableau de bord des compétences, évaluations mensuelles et suivis individuels.</p>
      </div>
    </div>
  );
}
