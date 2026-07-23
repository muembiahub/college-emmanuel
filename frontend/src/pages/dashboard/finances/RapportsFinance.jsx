import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  RefreshCw,
  FileText,
  AlertTriangle,
  Loader2,
  Search,
  SlidersHorizontal,
  Layers,
  ArrowUpDown,
  Download,
} from "lucide-react";
import DashboardSkeleton from "../../../components/DashboardSkeleton";

export default function RapportsFinance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [statsHomepage, setStatsHomepage] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [depenses, setDepenses] = useState([]);
  
  // États de filtrage avancés
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("TOUT"); // TOUT | ENTREE | SORTIE
  const [triOrdre, setTriOrdre] = useState("recent"); // recent | ancien | montant-desc | montant-asc

  /* Helper pour parser le JSON en sécurité */
  const parseJSON = async (res) => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }
    throw new Error("Réponse non JSON");
  };

  /* Chargement des données synchronisées */
  const chargerDonneesRapport = async () => {
    try {
      setLoading(true);
      setError(false);

      const [resHomepage, resDepenses] = await Promise.all([
        fetch("/finance/homepage", { credentials: "include" }),
        fetch("/finance/depenses", { credentials: "include" }),
      ]);

      if (resHomepage.ok) {
        const jsonHomepage = await parseJSON(resHomepage);
        if (jsonHomepage.success) {
          setStatsHomepage(jsonHomepage.data.statistiques || null);
          setPaiements(jsonHomepage.data.derniersPaiements || []);
        }
      }

      if (resDepenses.ok) {
        const dataDepenses = await parseJSON(resDepenses);
        setDepenses(Array.isArray(dataDepenses) ? dataDepenses : []);
      }
    } catch (err) {
      console.error("Erreur lors de la génération du rapport :", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonneesRapport();
  }, []);

  /* CALCULS FINANCIERS DE PROFONDEUR */
  const totalRecettes = statsHomepage?.montantEncaisse 
    ?? paiements.reduce((acc, p) => acc + Number(p.montant_total || p.montant || 0), 0);

  const totalDepenses = depenses.reduce((acc, d) => acc + Number(d.montant || 0), 0);
  const soldeNet = totalRecettes - totalDepenses;

  // Calculs additionnels de structure (Profondeur visuelle)
  const tauxMarge = totalRecettes > 0 ? ((soldeNet / totalRecettes) * 100).toFixed(1) : 0;

  /* CONSOLIDATION DES FLUX BRUTS */
  const fluxBruts = [
    ...paiements.map((p) => ({
      id: `p-${p.paiement_id || p.id}`,
      type: "ENTREE",
      libelle: p.eleve || p.motif || "Paiement élève",
      reference: p.numero_recu || "REC-000",
      categorie: p.mode_paiement || "Encaissement",
      date: p.date_paiement || p.created_at,
      montant: Number(p.montant_total || p.montant || 0),
    })),
    ...depenses.map((d) => ({
      id: `d-${d.depense_id || d.id}`,
      type: "SORTIE",
      libelle: d.motif || d.titre || "Dépense divers",
      reference: d.description || d.categorie || "SORTIE",
      categorie: d.categorie || "Dépense",
      date: d.date_depense || d.created_at,
      montant: Number(d.montant || 0),
    })),
  ];

  /* FILTRAGE MULTI-CRITÈRES & TRI PRO */
  const fluxFiltres = fluxBruts
    .filter((item) => {
      const matchRecherche =
        item.libelle.toLowerCase().includes(recherche.toLowerCase()) ||
        item.reference.toLowerCase().includes(recherche.toLowerCase()) ||
        item.categorie.toLowerCase().includes(recherche.toLowerCase());

      const matchType =
        filtreType === "TOUT" || item.type === filtreType;

      return matchRecherche && matchType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      if (triOrdre === "recent") return dateB - dateA;
      if (triOrdre === "ancien") return dateA - dateB;
      if (triOrdre === "montant-desc") return b.montant - a.montant;
      if (triOrdre === "montant-asc") return a.montant - b.montant;
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="relative inline-flex">
            <div className="absolute inset-0  rounded-full blur-xl opacity-30 animate-pulse"></div>
            <Loader2 className="animate-spin text-indigo-400 w-10 h-10 mx-auto relative z-10" />
          </div>
          <DashboardSkeleton/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl">
          <div className="inline-flex p-3.5 bg-red-500/10 rounded-2xl mb-3 shadow-inner border border-red-500/20">
            <AlertTriangle className="text-red-400" size={26} />
          </div>
          <p className="text-red-300 font-semibold text-xs sm:text-sm">
            Impossible d'établir le rapport financier sécurisé.
          </p>
          <button
            onClick={chargerDonneesRapport}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-bold rounded-xl border border-red-500/30 transition-all active:scale-95"
          >
            Réessayer la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-5 lg:p-8  text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Éléments décoratifs d'arrière-plan avec effet profondeur (Depth & Ambient Light) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2"></div>
        <div className="absolute top-[40%] left-[-5%] w-[350px] h-[350px] bg-emerald-600/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-5 lg:space-y-6">
        
        {/* EN-TÊTE PRINCIPAL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 lg:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 rounded-2xl shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 shrink-0">
              <Wallet className="text-white w-6 h-6 lg:w-7 lg:h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
                Rapports Financiers & Trésorerie
              </h1>
              <p className="text-xs lg:text-sm text-slate-400 font-medium mt-0.5">
                Tableau de bord multicritère et analyse approfondie des mouvements de fonds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={chargerDonneesRapport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold rounded-xl border border-white/10 backdrop-blur-md shadow-lg shadow-black/20 transition-all active:scale-95 group"
            >
              <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500 text-indigo-400" />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* CARTES DE PROFONDEUR (DESIGN LEVEL 3: RECETTES vs DÉPENSES vs SOLDE) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          
          {/* CARTE 1 : RECETTES (PROPRE & DÉDIÉE) */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>
            
            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 lg:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] lg:text-xs font-bold tracking-wider uppercase text-emerald-400/90">
                    Entrées Globales
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                    {totalRecettes.toLocaleString()} <span className="text-sm font-bold text-slate-400">FC</span>
                  </h2>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/20 ring-1 ring-white/20 shrink-0">
                  <ArrowDownLeft className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Volume validé</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  {paiements.length} reçus émis
                </span>
              </div>
            </div>
          </div>

          {/* CARTE 2 : DÉPENSES (PROPRE & DÉDIÉE) */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-pink-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"></div>

            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 lg:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-rose-500/40 transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] lg:text-xs font-bold tracking-wider uppercase text-rose-400/90">
                    Sorties Globales
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                    {totalDepenses.toLocaleString()} <span className="text-sm font-bold text-slate-400">FC</span>
                  </h2>
                </div>
                <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl shadow-lg shadow-rose-500/20 ring-1 ring-white/20 shrink-0">
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Décaissements</span>
                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                  {depenses.length} opérations
                </span>
              </div>
            </div>
          </div>

          {/* CARTE 3 : SOLDE NET / MARGE */}
          <div className="group relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${soldeNet >= 0 ? 'from-indigo-500/20' : 'from-red-500/20'} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl`}></div>

            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 lg:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-indigo-500/40 transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] lg:text-xs font-bold tracking-wider uppercase text-indigo-400/90">
                    Résultat Net (Trésorerie)
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
                    {soldeNet >= 0 ? "+" : ""}{soldeNet.toLocaleString()} <span className="text-sm font-bold text-slate-400">FC</span>
                  </h2>
                </div>
                <div className={`p-3 bg-gradient-to-br ${soldeNet >= 0 ? 'from-indigo-500 to-purple-600' : 'from-red-600 to-pink-600'} rounded-2xl shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 shrink-0`}>
                  <Scale className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Marge nette</span>
                <span className={`px-2.5 py-1 rounded-full font-bold border ${soldeNet >= 0 ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-red-500/10 text-red-300 border-red-500/20'}`}>
                  {tauxMarge}%
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION DE CONTRÔLE : BARRE DE RECHERCHE + FILTRES AVANCÉS */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-4 lg:p-5 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            
            {/* Input de recherche stylisé */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher par libellé, élève, catégorie ou numéro de reçu..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
            </div>

            {/* Boutons de Filtre par Type (Tout / Entrées / Sorties) */}
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/10 self-start sm:self-auto overflow-x-auto max-w-full">
              <button
                onClick={() => setFiltreType("TOUT")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtreType === "TOUT"
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                Tous ({fluxBruts.length})
              </button>
              <button
                onClick={() => setFiltreType("ENTREE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtreType === "ENTREE"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "text-slate-400 hover:text-emerald-300 hover:bg-white/[0.05]"
                }`}
              >
                Recettes ({paiements.length})
              </button>
              <button
                onClick={() => setFiltreType("SORTIE")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filtreType === "SORTIE"
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
                    : "text-slate-400 hover:text-rose-300 hover:bg-white/[0.05]"
                }`}
              >
                Dépenses ({depenses.length})
              </button>
            </div>

            {/* Menu Déroulant Tri */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={triOrdre}
                  onChange={(e) => setTriOrdre(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500/60 cursor-pointer shadow-inner appearance-none pr-8"
                >
                  <option value="recent" className="bg-slate-900 text-slate-200">Plus récents</option>
                  <option value="ancien" className="bg-slate-900 text-slate-200">Plus anciens</option>
                  <option value="montant-desc" className="bg-slate-900 text-slate-200">Montant (Décroissant)</option>
                  <option value="montant-asc" className="bg-slate-900 text-slate-200">Montant (Croissant)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                  <ArrowUpDown size={12} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* JOURNAL DES TRANSACTIONS (DESIGN TABLEAU PROFOND & RESPONSIVE) */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          
          <div className="border-b border-white/10 p-4 lg:px-6 lg:py-4 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20 shrink-0">
                <FileText className="text-white w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm lg:text-base font-bold text-white tracking-tight">
                  Historique consolidé des flux
                </h2>
                <p className="text-[11px] lg:text-xs text-slate-400">
                  Affichage en temps réel ({fluxFiltres.length} éléments filtrés)
                </p>
              </div>
            </div>

            <span className="hidden sm:inline-block text-[11px] font-bold px-3 py-1 bg-white/[0.05] text-indigo-300 rounded-full border border-white/10 shadow-inner">
              Mode Sécurisé actif
            </span>
          </div>

          {/* TABLEAU RESPONSIVE (DESKTOP) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10 text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Type de flux</th>
                  <th className="px-6 py-3.5">Libellé / Bénéficiaire</th>
                  <th className="px-6 py-3.5">Référence / Reçu</th>
                  <th className="px-6 py-3.5">Catégorie</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Montant</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {fluxFiltres.length > 0 ? (
                  fluxFiltres.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/[0.04] transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.type === "ENTREE" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm">
                            <ArrowDownLeft size={13} /> Recette
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm">
                            <ArrowUpRight size={13} /> Dépense
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-100 text-xs lg:text-sm">
                          {item.libelle}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-300">
                        {item.reference}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 bg-white/[0.05] text-indigo-300 rounded-xl text-xs font-medium border border-white/10">
                          {item.categorie}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400 font-medium">
                        {item.date ? new Date(item.date).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`inline-block px-3 py-1 rounded-xl text-xs lg:text-sm font-black border shadow-sm ${
                          item.type === "ENTREE"
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/25 text-rose-300"
                        }`}>
                          {item.type === "ENTREE" ? "+" : "-"}{item.montant.toLocaleString()} FC
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-xs sm:text-sm">
                      Aucune transaction trouvée selon les critères sélectionnés.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* VUE MOBILE / CARTES EMPILÉES TRÈS DESIGN */}
          <div className="block md:hidden divide-y divide-white/[0.06]">
            {fluxFiltres.length > 0 ? (
              fluxFiltres.map((item) => (
                <div key={item.id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between">
                    {item.type === "ENTREE" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <ArrowDownLeft size={11} /> Recette
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                        <ArrowUpRight size={11} /> Dépense
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.date ? new Date(item.date).toLocaleDateString("fr-FR") : "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-100 font-bold text-xs sm:text-sm truncate">
                      {item.libelle}
                    </span>
                    <span className={`font-black text-xs sm:text-sm shrink-0 px-2.5 py-1 rounded-xl border ${
                      item.type === "ENTREE" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" : "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    }`}>
                      {item.type === "ENTREE" ? "+" : "-"}{item.montant.toLocaleString()} FC
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="px-2 py-0.5 bg-white/[0.05] text-indigo-300 rounded-lg border border-white/10 font-medium">
                      {item.categorie}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {item.reference}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Aucun mouvement ne correspond à votre recherche.
              </div>
            )}
          </div>

          {/* PIED DE TABLEAU */}
          <div className="p-4 lg:px-6 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-xs text-slate-400">
              Affichage de <strong className="text-white">{fluxFiltres.length}</strong> flux sur <strong className="text-white">{fluxBruts.length}</strong> au total
            </span>
            <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Rapports mis à jour en temps réel
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}