import { Baby, Sparkles } from "lucide-react";

export default function Maternelle() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-pink-100 p-3 text-pink-600">
            <Baby size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Classe de Maternelle</h1>
            <p className="text-sm text-slate-500">Suivi pédagogique pour les jeunes élèves.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Sparkles size={18} className="text-amber-500" />
          <h2 className="text-lg font-semibold">Prochaines activités</h2>
        </div>
        <p className="mt-3 text-sm text-slate-500">Ateliers de langage, activités artistiques et suivi des apprentissages.</p>
      </div>
    </div>
  );
}
