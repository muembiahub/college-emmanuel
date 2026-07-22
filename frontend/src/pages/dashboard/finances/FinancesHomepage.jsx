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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          <p className="mt-4 text-slate-300 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-red-500/10 rounded-full mb-4">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <p className="text-red-400 font-semibold">Impossible de charger le tableau de bord.</p>
        </div>
      </div>
    );
  }

  const stats = finance.statistiques;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 lg:p-8">
      {/* Fond avec éléments décoratifs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* En-tête avec gradient */}
        <div className="space-y-2 mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
              <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tableau de bord financier
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                Suivi en temps réel des recettes et des paiements
              </p>
            </div>
          </div>
        </div>

        {/* Première ligne - Cartes principales */}
        <div className="grid gap-6 lg:grid-cols-4">
          <Card
            icon={<Wallet size={28} />}
            title="Recettes du jour"
            value={`${stats.recettesJour.toLocaleString()} FC`}
            gradient="from-blue-500 to-cyan-500"
            trend="+12%"
            trendUp={true}
          />

          <Card
            icon={<Banknote size={28} />}
            title="Recettes du mois"
            value={`${stats.recettesMois.toLocaleString()} FC`}
            gradient="from-emerald-500 to-teal-500"
            trend="+8%"
            trendUp={true}
          />

          <Card
            icon={<CircleDollarSign size={28} />}
            title="Montant encaissé"
            value={`${stats.montantEncaisse.toLocaleString()} FC`}
            gradient="from-purple-500 to-pink-500"
            trend="+5%"
            trendUp={true}
          />

          <Card
            icon={<PiggyBank size={28} />}
            title="Reste à recouvrer"
            value={`${stats.montantRestant.toLocaleString()} FC`}
            gradient="from-orange-500 to-red-500"
            trend="-3%"
            trendUp={false}
          />
        </div>

        {/* Deuxième ligne - Cartes secondaires */}
        <div className="grid gap-6 lg:grid-cols-5">
          <CardSmall
            icon={<Receipt size={24} />}
            title="Prochain reçu"
            value={stats.prochainNumeroRecu}
            gradient="from-indigo-500 to-blue-500"
          />

          <CardSmall
            icon={<CreditCard size={24} />}
            title="Paiements"
            value={stats.nombrePaiements}
            gradient="from-green-500 to-emerald-500"
          />

          <CardSmall
            icon={<Users size={24} />}
            title="Débiteurs"
            value={stats.nombreDebiteurs}
            gradient="from-yellow-500 to-orange-500"
          />

          <CardSmall
            icon={<AlertTriangle size={24} />}
            title="Impayés"
            value={stats.obligationsImpayees}
            gradient="from-red-500 to-pink-500"
          />

          <CardSmall
            icon={<CheckCircle2 size={24} />}
            title="Soldés"
            value={stats.obligationsPayees}
            gradient="from-teal-500 to-cyan-500"
          />
        </div>

        {/* Tableau des derniers paiements avec profondeur */}
        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-indigo-500/20 overflow-hidden">
          
          {/* En-tête du tableau */}
          <div className="border-b border-white/10 px-8 py-6 bg-gradient-to-r from-indigo-500/5 to-purple-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Receipt className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Derniers paiements
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Historique des dernières transactions
                </p>
              </div>
            </div>
          </div>

          {/* Contenu du tableau */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Reçu
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Élève
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Mode
                  </th>
                  <th className="px-8 py-4 text-left text-sm font-bold text-indigo-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {finance.derniersPaiements.map((p, idx) => (
                  <tr
                    key={p.paiement_id}
                    className="hover:bg-white/5 transition-all duration-300 group"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:scale-150 transition-transform"></div>
                        <span className="font-bold text-white font-mono">
                          {p.numero_recu}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4">
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">
                        <span className="font-bold text-emerald-300">
                          {Number(p.montant_total).toLocaleString()} FC
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-4">
                      <span className="text-slate-200 font-medium">
                        {p.eleve}
                      </span>
                    </td>

                    <td className="px-8 py-4">
                      <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium border border-indigo-500/30">
                        {p.mode_paiement}
                      </span>
                    </td>

                    <td className="px-8 py-4">
                      <span className="text-slate-400 font-medium">
                        {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer du tableau */}
          <div className="px-8 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Total: {finance.derniersPaiements.length} transactions
            </span>
            <span className="text-sm text-indigo-400 font-medium">
              Mise à jour en temps réel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant Card avec profondeur et gradients
 */
function Card({ icon, title, value, gradient, trend, trendUp }) {
  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
      
      {/* Carte principale */}
      <div className="relative rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 group-hover:border-white/40 overflow-hidden">
        
        {/* Fond dégradé subtil */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
        
        {/* Contenu */}
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              {title}
            </p>
            <h2 className="mt-3 text-3xl lg:text-4xl font-black text-white leading-tight">
              {value}
            </h2>
            
            {/* Trend indicator */}
            <div className="mt-4 flex items-center gap-2">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                trendUp 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {trendUp ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownLeft size={14} />
                )}
                <span className="text-xs font-bold">{trend}</span>
              </div>
              <span className="text-xs text-slate-500">vs mois dernier</span>
            </div>
          </div>

          {/* Icon avec gradient */}
          <div className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
            {icon}
          </div>
        </div>

        {/* Ligne de décoration */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      </div>
    </div>
  );
}

/**
 * Composant CardSmall pour les métriques secondaires
 */
function CardSmall({ icon, title, value, gradient }) {
  return (
    <div className="group relative">
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-300`}></div>
      
      {/* Carte */}
      <div className="relative rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-5 shadow-xl hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group-hover:border-white/40">
        
        {/* Fond dégradé */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity rounded-xl`}></div>
        
        {/* Contenu */}
        <div className="relative">
          <div className="flex items-start justify-between mb-3">
            <div className={`rounded-lg bg-gradient-to-br ${gradient} p-2.5 text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {icon}
            </div>
            <div className="w-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="mt-2 text-2xl lg:text-3xl font-black text-white">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
