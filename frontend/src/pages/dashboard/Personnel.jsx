// pages/Personnel.jsx
import { Users, UserPlus, Search, Shield, Briefcase, Mail, Phone } from "lucide-react";

export default function Personnel() {
  return (
    <div className="w-full space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestion du Personnel</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Vue d'ensemble et administration du personnel enseignant et administratif.
            </p>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 text-sm"
        >
          <UserPlus size={18} />
          <span>Ajouter un employé</span>
        </button>
      </div>

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Total Personnel</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">--</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Enseignants</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">--</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Briefcase size={22} />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Administratifs</p>
            <h3 className="text-2xl font-extrabold text-purple-400 mt-1">--</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield size={22} />
          </div>
        </div>
      </div>

      {/* SECTION TABLEAU / RECHERCHE */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou fonction..."
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* CONTENEUR VIDE */}
        <div className="border border-dashed border-slate-700/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-slate-950/20">
          <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-400 mb-3">
            <Users size={32} />
          </div>
          <h3 className="text-base font-semibold text-white">Aucun membre du personnel enregistré</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Commencez par ajouter des enseignants ou des collaborateurs pour les voir apparaître dans cette liste.
          </p>
        </div>
      </div>
    </div>
  );
}