// pages/Settings.jsx
import { Settings as SettingsIcon, Building, Shield, Bell, Save, Sliders } from "lucide-react";

export default function Settings() {
  return (
    <div className="w-full space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            <SettingsIcon size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Paramètres du Système</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Configuration du tableau de bord et des informations générales de l'établissement.
            </p>
          </div>
        </div>

        <button
          onClick={() => {}}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 text-sm"
        >
          <Save size={18} />
          <span>Enregistrer les modifications</span>
        </button>
      </div>

      {/* SECTION FORMULAIRES DE CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE PRINCIPALE - INFORMATIONS DE L'ÉTABLISSEMENT */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-4">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Building size={18} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">Informations de l'Établissement</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Nom de l'école</label>
              <input
                type="text"
                defaultValue="Collège Emmanuel"
                className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Année scolaire en cours</label>
              <input
                type="text"
                defaultValue="2025-2026"
                className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Adresse physique</label>
            <input
              type="text"
              defaultValue="Kinshasa, RDC"
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 border-b border-slate-800 pt-4 pb-4">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sliders size={18} />
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">Préférences Générales</h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:bg-slate-950/70 cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Activer les notifications automatiques</p>
                <p className="text-xs text-slate-400">Envoyer des alertes lors de l'enregistrement de nouveaux paiements ou inscriptions.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:bg-slate-950/70 cursor-pointer transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900" />
              <div>
                <p className="text-sm font-semibold text-slate-200">Mode de validation stricte des notes</p>
                <p className="text-xs text-slate-400">Empêcher la modification des notes après validation du trimestre.</p>
              </div>
            </label>
          </div>
        </div>

        {/* COLONNE SECONDAIRE - SÉCURITÉ & ACTIONS RAPIDES */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Shield size={18} />
              </div>
              <h3 className="font-bold text-base text-white">Sécurité & Accès</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gérez les rôles des utilisateurs connectés et les autorisations d'accès aux modules financiers et académiques.
            </p>
            <button className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors">
              Gérer les permissions
            </button>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Bell size={18} />
              </div>
              <h3 className="font-bold text-base text-white">Alertes & Rappels</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Configurez la fréquence des rapports automatiques envoyés aux administrateurs.
            </p>
            <button className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors">
              Configurer les alertes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}