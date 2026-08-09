import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  Banknote,
  Receipt,
  CreditCard,
  CircleDollarSign,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Settings,
  DollarSign,
  FileBarChart2,
  History,
} from "lucide-react";

export default function FinancesHomepage() {
  const [loading, setLoading] = useState(true);
  const [finance, setFinance] = useState(null);

  useEffect(() => {
    chargerDashboard();
  }, []);

  async function chargerDashboard() {
    try {
      setLoading(true);
      const res = await fetch("/finance/homepage", { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setFinance(json.data);
      }
    } catch (err) {
      console.error("❌ Erreur dashboard :", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-3 text-slate-300 font-medium text-xs sm:text-sm">
            Chargement du tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block p-3 bg-red-500/10 rounded-full mb-3">
            <AlertTriangle className="text-red-500" size={28} />
          </div>
          <p className="text-red-400 font-semibold text-xs sm:text-sm">
            Impossible de charger le tableau de bord.
          </p>
        </div>
      </div>
    );
  }

  const stats = finance.statistiques || {};
  const derniersPaiements = finance.derniersPaiements || [];
  const recettesJour = Number(stats.recettesJour || 0);
  const recettesMois = Number(stats.recettesMois || 0);
  const montantEncaisse = Number(stats.montantEncaisse || 0);
  const montantRestant = Number(stats.montantRestant || 0);

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-6 text-slate-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 lg:w-80 h-64 lg:h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-64 lg:w-80 h-64 lg:h-80 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-4 lg:space-y-6">
        
        <div className="mb-4 lg:mb-6">
          <div className="flex items-center gap-2.5 lg:gap-3">
            <div className="p-2 lg:p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20 shrink-0">
              <TrendingUp className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tableau de bord financier
              </h1>
              <p className="text-[11px] sm:text-xs lg:text-sm text-slate-400 font-medium mt-0.5">
                Suivi opérationnel des recettes et indicateurs clés.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card icon={<Wallet className="w-5 h-5" />} title="Recettes du jour" value={`${recettesJour.toLocaleString()} FC`} gradient="from-blue-500 to-cyan-500" />
          <Card icon={<Banknote className="w-5 h-5" />} title="Recettes du mois" value={`${recettesMois.toLocaleString()} FC`} gradient="from-emerald-500 to-teal-500" />
          <Card icon={<CircleDollarSign className="w-5 h-5" />} title="Total Encaissé" value={`${montantEncaisse.toLocaleString()} FC`} gradient="from-purple-500 to-pink-500" />
          <Card icon={<PiggyBank className="w-5 h-5" />} title="Reste à Recouvrer" value={`${montantRestant.toLocaleString()} FC`} gradient="from-orange-500 to-red-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 lg:gap-3.5">
          <CardSmall icon={<Receipt className="w-4 h-4" />} title="Prochain reçu" value={stats.prochainNumeroRecu || "N/A"} gradient="from-indigo-500 to-blue-500" />
          <CardSmall icon={<CreditCard className="w-4 h-4" />} title="Paiements" value={stats.nombrePaiements ?? 0} gradient="from-green-500 to-emerald-500" />
          <CardSmall icon={<Users className="w-4 h-4" />} title="Débiteurs" value={stats.nombreDebiteurs ?? 0} gradient="from-yellow-500 to-orange-500" />
          <CardSmall icon={<AlertTriangle className="w-4 h-4" />} title="Impayés" value={stats.obligationsImpayees ?? 0} gradient="from-red-500 to-pink-500" />
          <CardSmall icon={<CheckCircle2 className="w-4 h-4" />} title="Soldés" value={stats.obligationsPayees ?? 0} gradient="from-teal-500 to-cyan-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Colonne de gauche : Raccourcis et Actions */}
            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
                <div className="rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4 lg:p-5">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                        <Settings size={16} className="text-indigo-400"/>
                        <span>Actions rapides</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2.5">
                        <Shortcut to="/dashboard/finances/paiements-eleves" icon={<DollarSign size={18}/>} label="Paiement Eleves"/>
                        <Shortcut to="/dashboard/finances/depenses" icon={<ArrowUpRight size={18}/>} label="Nouvelle Dépense"/>
                        <Shortcut to="/dashboard/finances/configurationfrais" icon={<Settings size={18}/>} label="Configurer Frais"/>
                        <Shortcut to="/dashboard/finances/rapports" icon={<FileBarChart2 size={18}/>} label="Rapports Détaillés"/>
                    </div>
                </div>
            </div>

            {/* Colonne de droite : Derniers paiements */}
            <div className="lg:col-span-2 rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-4 lg:p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
                    <History size={16} className="text-indigo-400"/>
                    <span>Derniers Paiements Encaissés</span>
                </h3>
                <div className="flow-root">
                    {derniersPaiements.length > 0 ? (
                        <ul role="list" className="divide-y divide-white/10">
                            {derniersPaiements.map((p) => (
                                <li key={p.paiement_id || p.id} className="py-2.5 sm:py-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/20">
                                                <FileText className="h-4 w-4 text-emerald-400" />
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-white truncate">
                                                {p.eleve || "Élève non spécifié"}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate">
                                                Reçu: <span className="font-mono">{p.numero_recu}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-emerald-400">
                                                + {Number(p.montant_total || p.montant || 0).toLocaleString()} FC
                                            </span>
                                             <p className="text-[11px] text-slate-400">
                                                {new Date(p.date_paiement || p.created_at).toLocaleDateString('fr-FR')}
                                             </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
                            Aucun paiement enregistré aujourd'hui.
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

function Card({ icon, title, value, gradient }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300`}></div>
      <div className="relative rounded-xl bg-white/15 backdrop-blur-xl border border-white/25 p-3.5 lg:p-4 shadow-lg overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
            <h2 className="mt-1 text-lg sm:text-xl lg:text-2xl font-black text-white leading-snug truncate">{value}</h2>
          </div>
          <div className={`rounded-lg lg:rounded-xl bg-gradient-to-br ${gradient} p-2.5 text-white shadow-md shrink-0`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

function CardSmall({ icon, title, value, gradient }) {
  return (
    <div className="group relative">
      <div className="relative rounded-lg lg:rounded-xl bg-white/15 backdrop-blur-lg border border-white/25 p-3 lg:p-3.5 shadow-md">
        <div className="flex items-start justify-between mb-1.5 lg:mb-2">
          <div className={`rounded-md bg-gradient-to-br ${gradient} p-1.5 text-white shadow-sm shrink-0`}>
            {icon}
          </div>
        </div>
        <p className="text-[10px] lg:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
        <h3 className="mt-1 text-base sm:text-lg lg:text-xl font-black text-white truncate">{value}</h3>
      </div>
    </div>
  );
}

function Shortcut({ to, icon, label }) {
    return (
        <Link to={to} className="group flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-center transition-all duration-200">
            <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full mb-1.5">
                {icon}
            </div>
            <span className="text-[11px] font-bold text-slate-300 group-hover:text-white">{label}</span>
        </Link>
    )
}
