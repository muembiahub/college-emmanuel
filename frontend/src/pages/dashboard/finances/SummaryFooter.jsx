import React from "react";

export default function SummaryFooter({ stats }) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center md:grid-cols-4 lg:px-6">
      <div>
        <span className="text-xs text-slate-400">Mouvements</span>
        <p className="font-bold text-white">{stats.nbMouvements}</p>
      </div>
      <div>
        <span className="text-xs text-slate-400">Recettes</span>
        <p className="font-bold text-emerald-400">{stats.totalRecettes.toLocaleString()} FC</p>
      </div>
      <div>
        <span className="text-xs text-slate-400">Dépenses</span>
        <p className="font-bold text-rose-400">{stats.totalDepenses.toLocaleString()} FC</p>
      </div>
      <div>
        <span className="text-xs text-slate-400">Solde</span>
        <p className={`font-bold ${stats.solde >= 0 ? "text-white" : "text-red-400"}`}>{stats.solde.toLocaleString()} FC</p>
      </div>
    </div>
  );
}
