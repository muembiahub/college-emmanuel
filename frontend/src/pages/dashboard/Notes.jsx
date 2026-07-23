// pages/Notes.jsx
import { ClipboardList, Sparkles, Filter, Search, Award, BookOpen } from "lucide-react";

export default function Notes() {
  return (
    <div className="w-full space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Notes & Évaluations</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Consultez et gérez les notes, bulletins et performances scolaires.
            </p>
          </div>
        </div>

        {/* FILTRES RAPIDES */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <select className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer appearance-none">
              <option value="">Trimestre 1</option>
              <option value="">Trimestre 2</option>
              <option value="">Trimestre 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLEAU DE BORD DES NOTES & FILTRAGE */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Sparkles size={18} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">Tableau de bord des notes</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Par matière, classe et trimestre</span>
        </div>

        {/* BARRE DE RECHERCHE ET ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une classe ou un élève..."
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all duration-200">
            <Filter size={15} />
            <span>Filtres avancés</span>
          </button>
        </div>

        {/* CONTENEUR / TABLEAU VIDE */}
        <div className="border border-dashed border-slate-700/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-slate-950/20">
          <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-400 mb-3">
            <BookOpen size={32} />
          </div>
          <h3 className="text-base font-semibold text-white">Aucune évaluation enregistrée</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Sélectionnez une classe et une matière ci-dessus pour commencer à saisir ou consulter les notes des élèves.
          </p>
        </div>
      </div>
    </div>
  );
}