import { useEffect, useState } from "react";
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
} from "lucide-react";

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [finance, setFinance] = useState(null);

  useEffect(() => {
    chargerDashboard();
  }, []);

  async function chargerDashboard() {
    try {
      const res = await fetch("/finance/homepage");
      const json = await res.json();

      if (json.success) {
        setFinance(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
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

  const stats = finance.statistiques;

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-6">
      {/* Fond avec éléments décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 lg:w-80 h-64 lg:h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-64 lg:w-80 h-64 lg:h-80 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-4 lg:space-y-6">
        
        {/* En-tête compact */}
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
                Suivi en temps réel des recettes et des paiements
              </p>
            </div>
          </div>
        </div>

        {/* Première ligne - Cartes principales (Tailled de police réduite sur Desktop/Laptop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card
            icon={<Wallet className="w-5 h-5 lg:w-5 lg:h-5" />}
            title="Recettes du jour"
            value={`${stats.recettesJour.toLocaleString()} FC`}
            gradient="from-blue-500 to-cyan-500"
            trend="+12%"
            trendUp={true}
          />

          <Card
            icon={<Banknote className="w-5 h-5 lg:w-5 lg:h-5" />}
            title="Recettes du mois"
            value={`${stats.recettesMois.toLocaleString()} FC`}
            gradient="from-emerald-500 to-teal-500"
            trend="+8%"
            trendUp={true}
          />

          <Card
            icon={<CircleDollarSign className="w-5 h-5 lg:w-5 lg:h-5" />}
            title="Montant encaissé"
            value={`${stats.montantEncaisse.toLocaleString()} FC`}
            gradient="from-purple-500 to-pink-500"
            trend="+5%"
            trendUp={true}
          />

          <Card
            icon={<PiggyBank className="w-5 h-5 lg:w-5 lg:h-5" />}
            title="Reste à recouvrer"
            value={`${stats.montantRestant.toLocaleString()} FC`}
            gradient="from-orange-500 to-red-500"
            trend="-3%"
            trendUp={false}
          />
        </div>

        {/* Deuxième ligne - Cartes secondaires (Formats très compacts) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 lg:gap-3.5">
          <CardSmall
            icon={<Receipt className="w-4 h-4 lg:w-4.5 lg:h-4.5" />}
            title="Prochain reçu"
            value={stats.prochainNumeroRecu}
            gradient="from-indigo-500 to-blue-500"
          />

          <CardSmall
            icon={<CreditCard className="w-4 h-4 lg:w-4.5 lg:h-4.5" />}
            title="Paiements"
            value={stats.nombrePaiements}
            gradient="from-green-500 to-emerald-500"
          />

          <CardSmall
            icon={<Users className="w-4 h-4 lg:w-4.5 lg:h-4.5" />}
            title="Débiteurs"
            value={stats.nombreDebiteurs}
            gradient="from-yellow-500 to-orange-500"
          />

          <CardSmall
            icon={<AlertTriangle className="w-4 h-4 lg:w-4.5 lg:h-4.5" />}
            title="Impayés"
            value={stats.obligationsImpayees}
            gradient="from-red-500 to-pink-500"
          />

          <CardSmall
            icon={<CheckCircle2 className="w-4 h-4 lg:w-4.5 lg:h-4.5" />}
            title="Soldés"
            value={stats.obligationsPayees}
            gradient="from-teal-500 to-cyan-500"
          />
        </div>

        {/* Section Derniers paiements */}
        <div className="rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl shadow-indigo-500/10 overflow-hidden">
          
          {/* En-tête du tableau */}
          <div className="border-b border-white/10 p-3 lg:px-6 lg:py-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md shrink-0">
                <Receipt className="text-white w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm lg:text-base font-bold text-white">
                  Derniers paiements
                </h2>
                <p className="text-[11px] lg:text-xs text-slate-400">
                  Historique des dernières transactions
                </p>
              </div>
            </div>
          </div>

          {/* Version Tableau (Tablettes & Desktop) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                    Reçu
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-5 py-3 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {finance.derniersPaiements.map((p) => (
                  <tr
                    key={p.paiement_id}
                    className="hover:bg-white/5 transition-all duration-200 group"
                  >
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:scale-125 transition-transform"></div>
                        <span className="font-bold text-white font-mono text-xs lg:text-sm">
                          {p.numero_recu}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="inline-block px-2.5 py-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-md border border-emerald-500/30">
                        <span className="font-bold text-emerald-300 text-xs lg:text-sm">
                          {Number(p.montant_total).toLocaleString()} FC
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-slate-200 font-medium text-xs lg:text-sm">
                        {p.eleve}
                      </span>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[11px] font-medium border border-indigo-500/30">
                        {p.mode_paiement}
                      </span>
                    </td>

                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="text-slate-400 font-medium text-xs lg:text-sm">
                        {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Version Cartes Compactes (Mobile uniquement) */}
          <div className="block md:hidden divide-y divide-white/10">
            {finance.derniersPaiements.map((p) => (
              <div key={p.paiement_id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                    <span className="font-bold text-white font-mono text-xs">
                      {p.numero_recu}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-200 font-medium text-xs truncate">
                    {p.eleve}
                  </span>
                  <div className="px-2 py-0.5 bg-emerald-500/20 rounded border border-emerald-500/30 shrink-0">
                    <span className="font-bold text-emerald-300 text-xs">
                      {Number(p.montant_total).toLocaleString()} FC
                    </span>
                  </div>
                </div>

                <div>
                  <span className="inline-block px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-medium border border-indigo-500/30">
                    {p.mode_paiement}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer du tableau */}
          <div className="p-3 lg:px-6 lg:py-3 bg-white/5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-1.5">
            <span className="text-[11px] lg:text-xs text-slate-400">
              Total: {finance.derniersPaiements.length} transactions
            </span>
            <span className="text-[11px] lg:text-xs text-indigo-400 font-medium">
              Mise à jour en temps réel
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * Carte Principale (Font-size réduite pour Laptop/Desktop)
 */
function Card({ icon, title, value, gradient, trend, trendUp }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300`}></div>
      
      <div className="relative rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 p-3.5 lg:p-4.5 shadow-lg hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group-hover:border-white/40 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
        
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
              {title}
            </p>
            {/* Taille de police ajustée à text-xl / lg:text-2xl au lieu de 4xl */}
            <h2 className="mt-1 lg:mt-2 text-lg sm:text-xl lg:text-2xl font-black text-white leading-snug truncate">
              {value}
            </h2>
            
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full ${
                trendUp 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {trendUp ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownLeft className="w-3 h-3" />
                )}
                <span className="text-[10px] font-bold">{trend}</span>
              </div>
              <span className="text-[10px] text-slate-400">vs mois dernier</span>
            </div>
          </div>

          <div className={`rounded-lg lg:rounded-xl bg-gradient-to-br ${gradient} p-2.5 lg:p-3 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0`}>
            {icon}
          </div>
        </div>

        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      </div>
    </div>
  );
}

/**
 * Carte Secondaire (Optimisée pour ordinateurs)
 */
function CardSmall({ icon, title, value, gradient }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-lg opacity-0 group-hover:opacity-15 blur-md transition-opacity duration-300`}></div>
      
      <div className="relative rounded-lg lg:rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-3 lg:p-3.5 shadow-md hover:shadow-lg transition-all duration-300 group-hover:border-white/40">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-lg`}></div>
        
        <div className="relative">
          <div className="flex items-start justify-between mb-1.5 lg:mb-2">
            <div className={`rounded-md bg-gradient-to-br ${gradient} p-1.5 text-white shadow-sm shrink-0`}>
              {icon}
            </div>
          </div>
          
          <p className="text-[10px] lg:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">
            {title}
          </p>
          {/* Taille de police ajustée à text-base / lg:text-xl */}
          <h3 className="mt-1 text-base sm:text-lg lg:text-xl font-black text-white truncate">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}