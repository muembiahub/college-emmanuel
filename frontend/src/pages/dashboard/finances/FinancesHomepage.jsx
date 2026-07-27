import { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
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
  Printer,
  BookOpen,
  Clock,
  ShieldAlert,
  Search,
  X,
  Download
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

export const getClasses = async (option_id = null) => {
  if (!option_id) return [];

  try {
    const response = await fetch(`/dashboard/classes?option_id=${option_id}`);
    const data = await response.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des classes :", error);
    throw error;
  }
};

export default function FinanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [finance, setFinance] = useState(null);
  
  const [sections, setSections] = useState([]);
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [form, setForm] = useState({
    section_id: "",
    option_id: ""
  });

  const [classeSelectionnee, setClasseSelectionnee] = useState("");
  const [donneesClasse, setDonneesClasse] = useState(null);
  const [chargementClasse, setChargementClasse] = useState(false);

  // États pour la recherche globale par nom d'élève
  const [rechercheNom, setRechercheNom] = useState("");
  const [resultatsRechercheEleve, setResultatsRechercheEleve] = useState(null);
  const [chargementRechercheEleve, setChargementRechercheEleve] = useState(false);

  const reportRef = useRef();

  useEffect(() => {
    chargerDashboard();
    loadSections();
  }, []);

  async function chargerDashboard() {
    try {
      const res = await fetch("/finance/homepage");
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

  async function loadSections() {
    try {
      const response = await fetch("/dashboard/sections");
      const data = await response.json();
      const sectionsData = Array.isArray(data) ? data : (data.data || []);
      setSections(sectionsData);
    } catch (error) {
      console.error("❌ Erreur sections :", error);
    }
  }

  useEffect(() => {
    setOptions([]);
    setClasses([]);
    setForm(prev => ({ ...prev, option_id: "" }));
    setClasseSelectionnee("");
    setDonneesClasse(null);

    if (!form.section_id) return;
    
    async function loadOptions() {
      try {
        const response = await fetch(`/dashboard/options?section_id=${form.section_id}`);
        const data = await response.json();
        const optionsData = Array.isArray(data) ? data : (data.data || []);
        setOptions(optionsData);
      } catch (error) {
        console.error("❌ Erreur options :", error);
      }
    }
    loadOptions();
  }, [form.section_id]);

  useEffect(() => {
    setClasses([]);
    setClasseSelectionnee("");
    setDonneesClasse(null);

    if (!form.option_id) return;

    async function fetchClassesForOption() {
      try {
        const classesData = await getClasses(form.option_id);
        setClasses(classesData || []);
      } catch (error) {
        console.error("❌ Erreur chargement classes :", error);
      }
    }

    fetchClassesForOption();
  }, [form.option_id]);

  async function chargerPaiementsParClasse(classeId) {
    if (!classeId) {
      setClasseSelectionnee("");
      setDonneesClasse(null);
      return;
    }

    setRechercheNom("");
    setResultatsRechercheEleve(null);
    setClasseSelectionnee(classeId);
    
    setChargementClasse(true);
    try {
      const res = await fetch(`/finance/classe/${classeId}`);
      const json = await res.json();
      
      if (json.success) {
        const classeTrouvee = classes.find(c => c.classe_id === classeId);
        const nomClasse = classeTrouvee ? classeTrouvee.nom_classe : "Classe sélectionnée";

        setDonneesClasse({
          nomClasse: nomClasse,
          eleves: Array.isArray(json.data) ? json.data : []
        });
      } else {
        setDonneesClasse(null);
      }
    } catch (err) {
      console.error(`❌ Erreur chargement classe ${classeId} :`, err);
      setDonneesClasse(null);
    } finally {
      setChargementClasse(false);
    }
  }

  async function rechercherEleveGlobal(nom) {
    setRechercheNom(nom);
    
    if (!nom.trim() || nom.trim().length < 2) {
      setResultatsRechercheEleve(null);
      return;
    }

    setClasseSelectionnee("");
    setDonneesClasse(null);
    setForm({ section_id: "", option_id: "" });

    setChargementRechercheEleve(true);
    try {
      const url = `/finance/rechercher?q=${encodeURIComponent(nom.trim())}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (json.success) {
        const dataEleves = Array.isArray(json.data) ? json.data : (json.data ? [json.data] : []);
        setResultatsRechercheEleve(dataEleves);
      } else {
        setResultatsRechercheEleve([]);
      }
    } catch (err) {
      console.error("❌ Erreur lors de la recherche élève :", err);
      setResultatsRechercheEleve([]);
    } finally {
      setChargementRechercheEleve(false);
    }
  }

  function reinitialiserRecherche() {
    setRechercheNom("");
    setResultatsRechercheEleve(null);
  }

  const modeRechercheNom = rechercheNom.trim().length > 0;

  // --- CORRECTION IMPRESSION ---
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: modeRechercheNom ? `Rapport_eleve_${rechercheNom.trim()}` : `Rapport_classe_${donneesClasse?.nomClasse || 'financier'}`,
    pageStyle: `
      @page {
        size: landscape;
        margin: 15mm;
      }
      @media print {
        body {
          background-color: #ffffff !important;
          color: #000000 !important;
          font-family: sans-serif;
        }
        /* Masquer tous les éléments extérieurs au rapport si besoin */
        .no-print {
          display: none !important;
        }
      }
    `
  });

  // --- TÉLÉCHARGER LE RAPPORT EN PDF ---
  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (!element) return;

    const opt = {
      margin:       10,
      filename:     modeRechercheNom ? `rapport-eleve-${rechercheNom.trim()}.pdf` : `rapport-classe-${donneesClasse?.nomClasse || 'financier'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:   { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().from(element).set(opt).save();
  };

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
        
        {/* En-tête */}
        <div className="mb-4 lg:mb-6 no-print">
          <div className="flex items-center gap-2.5 lg:gap-3">
            <div className="p-2 lg:p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20 shrink-0">
              <TrendingUp className="text-white w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Tableau de bord financier
              </h1>
              <p className="text-[11px] sm:text-xs lg:text-sm text-slate-400 font-medium mt-0.5">
                Suivi en temps réel des recettes, acomptes et états des classes
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 no-print">
          <Card icon={<Wallet className="w-5 h-5" />} title="Recettes du jour" value={`${recettesJour.toLocaleString()} FC`} gradient="from-blue-500 to-cyan-500" trend="+12%" trendUp={true} />
          <Card icon={<Banknote className="w-5 h-5" />} title="Recettes du mois" value={`${recettesMois.toLocaleString()} FC`} gradient="from-emerald-500 to-teal-500" trend="+8%" trendUp={true} />
          <Card icon={<CircleDollarSign className="w-5 h-5" />} title="Montant encaissé" value={`${montantEncaisse.toLocaleString()} FC`} gradient="from-purple-500 to-pink-500" trend="+5%" trendUp={true} />
          <Card icon={<PiggyBank className="w-5 h-5" />} title="Reste à recouvrer" value={`${montantRestant.toLocaleString()} FC`} gradient="from-orange-500 to-red-500" trend="-3%" trendUp={false} />
        </div>

        {/* Statistiques secondaires */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 lg:gap-3.5 no-print">
          <CardSmall icon={<Receipt className="w-4 h-4" />} title="Prochain reçu" value={stats.prochainNumeroRecu || "N/A"} gradient="from-indigo-500 to-blue-500" />
          <CardSmall icon={<CreditCard className="w-4 h-4" />} title="Paiements" value={stats.nombrePaiements ?? 0} gradient="from-green-500 to-emerald-500" />
          <CardSmall icon={<Users className="w-4 h-4" />} title="Débiteurs" value={stats.nombreDebiteurs ?? 0} gradient="from-yellow-500 to-orange-500" />
          <CardSmall icon={<AlertTriangle className="w-4 h-4" />} title="Impayés" value={stats.obligationsImpayees ?? 0} gradient="from-red-500 to-pink-500" />
          <CardSmall icon={<CheckCircle2 className="w-4 h-4" />} title="Soldés" value={stats.obligationsPayees ?? 0} gradient="from-teal-500 to-cyan-500" />
        </div>

        {/* SECTION : FILTRAGE CLASSE OU RECHERCHE GLOBALE */}
        <div className="rounded-xl lg:rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-2xl p-4 lg:p-6 space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5 no-print">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shrink-0">
                <BookOpen className="text-white w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm lg:text-base font-bold text-white">
                  Suivi financier par Classe ou Recherche Globale par Élève
                </h2>
                <p className="text-[11px] lg:text-xs text-slate-400">
                  Filtrez par classe (synthèse) OU tapez directement un nom d'élève (détails complets)
                </p>
              </div>
            </div>

            {/* Zone de contrôles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 no-print">
              
              {/* Filtre en cascade par Classe */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-slate-900/40 border border-white/10 rounded-xl">
                <select
                  value={form.section_id}
                  onChange={(e) => setForm({ ...form, section_id: e.target.value })}
                  className="bg-slate-900/90 border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500"
                >
                  <option value="">-- Section --</option>
                  {sections.map((s) => (
                    <option key={s.section_id} value={s.section_id}>
                      {s.nom_section || s.nom}
                    </option>
                  ))}
                </select>

                <select
                  value={form.option_id}
                  onChange={(e) => setForm({ ...form, option_id: e.target.value })}
                  disabled={!form.section_id}
                  className="bg-slate-900/90 border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 disabled:opacity-40"
                >
                  <option value="">-- Option --</option>
                  {options.map((o) => (
                    <option key={o.option_id} value={o.option_id}>
                      {o.nom_option || o.nom}
                    </option>
                  ))}
                </select>

                <select
                  value={classeSelectionnee}
                  onChange={(e) => chargerPaiementsParClasse(e.target.value)}
                  disabled={!form.option_id}
                  className="bg-slate-900/90 border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-indigo-500 disabled:opacity-40"
                >
                  <option value="">-- Classe --</option>
                  {classes.map((c) => (
                    <option key={c.classe_id} value={c.classe_id}>
                      {c.nom_classe}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recherche Globale Indépendante par Nom d'Élève */}
              <div className="relative flex items-center p-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl">
                <Search className="absolute left-6 text-indigo-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Recherche globale par nom d'élève (ex: Mande)..."
                  value={rechercheNom}
                  onChange={(e) => rechercherEleveGlobal(e.target.value)}
                  className="w-full bg-slate-900/90 border border-indigo-500/40 text-white rounded-xl pl-9 pr-9 py-2 text-xs sm:text-sm outline-none focus:border-indigo-400 placeholder:text-slate-500"
                />
                {rechercheNom && (
                  <button 
                    onClick={reinitialiserRecherche}
                    className="absolute right-6 text-slate-400 hover:text-white"
                    title="Effacer la recherche"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

            </div>

            {/* Boutons d'export (Impression et Téléchargement PDF) */}
            {(donneesClasse || resultatsRechercheEleve) && (
              <div className="flex justify-end gap-2 no-print">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition shadow-lg shrink-0 cursor-pointer"
                >
                  <Printer size={15} /> Imprimer
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition shadow-lg shrink-0 cursor-pointer"
                >
                  <Download size={15} /> Télécharger PDF
                </button>
              </div>
            )}
          </div>

          {/* Affichage des chargements et résultats */}
          {chargementClasse || chargementRechercheEleve ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-400"></div>
            </div>
          ) : modeRechercheNom ? (
            /* ======================================================== */
            /* RÉSULTATS DE LA RECHERCHE GLOBALE PAR ÉLÈVE (DÉTAILLÉ)   */
            /* ======================================================== */
            <div className="space-y-4 print:bg-white print:text-black" ref={reportRef}>
              <div className="hidden print:block mb-4 text-center">
                <h1 className="text-xl font-bold">Rapport Financier - Recherche Élève : "{rechercheNom}"</h1>
                <p className="text-xs text-gray-600">Date d'impression : {new Date().toLocaleDateString("fr-FR")}</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/60 print:border-none print:bg-white">
                <table className="w-full text-left border-collapse print:text-black">
                  <thead className="bg-white/5 border-b border-white/10 text-indigo-300 text-[11px] uppercase tracking-wider print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
                    <tr>
                      <th className="px-4 py-3">Élève</th>
                      <th className="px-4 py-3">Période / Mois (Détails)</th>
                      <th className="px-4 py-3">Montant Dû</th>
                      <th className="px-4 py-3">Montant Payé</th>
                      <th className="px-4 py-3">Reste (Dette)</th>
                      <th className="px-4 py-3 text-center">Statut Ligne</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs print:divide-gray-300">
                    {resultatsRechercheEleve && resultatsRechercheEleve.length > 0 ? (
                      resultatsRechercheEleve.map((eleve) => {
                        const nomComplet = [eleve.nom, eleve.post_nom, eleve.prenom]
                          .filter(Boolean)
                          .join(" ") || "Élève inconnu";

                        const obligations = eleve.obligations || eleve.frais || eleve.paiements || [];

                        if (obligations.length > 0) {
                          return obligations.map((obligation, index) => {
                            const montantDu = Number(obligation.montant_du || obligation.montantDu || 0);
                            const montantPaye = Number(obligation.montant_paye || obligation.montantPaye || 0);
                            const reste = Number(obligation.reste || (montantDu - montantPaye));

                            const estSolde = obligation.statut === 'paye' || reste <= 0;
                            const estAcompte = montantPaye > 0 && reste > 0;
                            const estImpaye = montantPaye === 0;
                            const moisPeriode = obligation.periode_frais || obligation.mois || obligation.libelle;

                            return (
                              <tr key={`${eleve.eleve_id || nomComplet}-${index}`} className="hover:bg-white/5 transition bg-indigo-950/25 print:bg-white print:hover:bg-transparent">
                                <td className="px-4 py-3 font-bold text-white print:text-black">
                                  {index === 0 ? nomComplet : <span className="text-slate-500 italic text-[11px] print:text-gray-500">↳ (suite)</span>}
                                </td>
                                <td className="px-4 py-3 text-slate-300 print:text-gray-800">
                                  <span className="font-semibold text-indigo-300 print:text-black">
                                    {moisPeriode ? `Mois : ${moisPeriode}` : "Frais général"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-slate-200 print:text-black">
                                  {montantDu.toLocaleString()} FC
                                </td>
                                <td className="px-4 py-3 font-mono text-emerald-400 font-bold print:text-emerald-700">
                                  {montantPaye.toLocaleString()} FC
                                </td>
                                <td className="px-4 py-3 font-mono text-orange-400 font-bold print:text-orange-700">
                                  {reste.toLocaleString()} FC
                                </td>
                                <td className="px-4 py-3 text-center">
                                  {estSolde && (
                                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold print:border print:border-emerald-600 print:text-emerald-800">
                                      Soldé
                                    </span>
                                  )}
                                  {estAcompte && (
                                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 justify-center w-max mx-auto print:border print:border-amber-600 print:text-amber-800">
                                      <Clock size={10} /> Acompte
                                    </span>
                                  )}
                                  {estImpaye && (
                                    <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 justify-center w-max mx-auto print:border print:border-red-600 print:text-red-800">
                                      <ShieldAlert size={10} /> Non payé
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          });
                        }

                        return (
                          <tr key={eleve.eleve_id || nomComplet} className="hover:bg-white/5 transition print:bg-white">
                            <td className="px-4 py-3 font-bold text-white print:text-black">{nomComplet}</td>
                            <td className="px-4 py-3 text-slate-400 italic print:text-gray-500">Aucun frais assigné</td>
                            <td className="px-4 py-3 font-mono text-slate-200 print:text-black">0 FC</td>
                            <td className="px-4 py-3 font-mono text-emerald-400 font-bold print:text-emerald-700">0 FC</td>
                            <td className="px-4 py-3 font-mono text-orange-400 font-bold print:text-orange-700">0 FC</td>
                            <td className="px-4 py-3 text-center">-</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-slate-400 italic">
                          Aucun élève trouvé pour "{rechercheNom}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : donneesClasse ? (
            /* ======================================================== */
            /* RÉSULTATS PAR CLASSE (SYNTHÉTIQUE)                      */
            /* ======================================================== */
            <div className="space-y-4 print:bg-white print:text-black" ref={reportRef}>
              <div className="hidden print:block mb-4 text-center">
                <h1 className="text-xl font-bold">Rapport Financier - Classe : {donneesClasse.nomClasse}</h1>
                <p className="text-xs text-gray-600">Date d'impression : {new Date().toLocaleDateString("fr-FR")}</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/60 print:border-none print:bg-white">
                <table className="w-full text-left border-collapse print:text-black">
                  <thead className="bg-white/5 border-b border-white/10 text-indigo-300 text-[11px] uppercase tracking-wider print:bg-gray-100 print:text-black print:border-b-2 print:border-black">
                    <tr>
                      <th className="px-4 py-3">Élève</th>
                      <th className="px-4 py-3">Mois / Périodes</th>
                      <th className="px-4 py-3">Montant Dû</th>
                      <th className="px-4 py-3">Montant Payé</th>
                      <th className="px-4 py-3">Reste (Dette)</th>
                      <th className="px-4 py-3 text-center">Statut Global</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs print:divide-gray-300">
                    {donneesClasse.eleves?.map((eleve, idx) => {
                      const nomComplet = [eleve.nom, eleve.post_nom, eleve.prenom]
                        .filter(Boolean)
                        .join(" ") || "Élève inconnu";

                      const obligations = eleve.obligations || eleve.frais || eleve.paiements || [];
                      const totalDu = obligations.reduce((acc, o) => acc + Number(o.montant_du || o.montantDu || 0), 0);
                      const totalPaye = obligations.reduce((acc, o) => acc + Number(o.montant_paye || o.montantPaye || 0), 0);
                      const totalReste = obligations.reduce((acc, o) => acc + Number(o.reste || (Number(o.montant_du || o.montantDu || 0) - Number(o.montant_paye || o.montantPaye || 0))), 0);

                      const estSolde = totalReste <= 0 && totalDu > 0;
                      const estAcompte = totalPaye > 0 && totalReste > 0;
                      const estImpaye = totalPaye === 0;

                      const periodesList = obligations.map(o => o.periode_frais || o.mois || o.libelle).filter(Boolean);

                      return (
                        <tr key={idx} className="hover:bg-white/5 transition print:bg-white">
                          <td className="px-4 py-3 font-bold text-white print:text-black">
                            {nomComplet}
                          </td>
                          <td className="px-4 py-3 text-slate-300 print:text-gray-800">
                            {periodesList.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {periodesList.map((p, pIdx) => (
                                  <span key={pIdx} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] print:border print:border-gray-400 print:text-black">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 italic print:text-gray-400">Aucun mois assigné</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-200 print:text-black">
                            {totalDu.toLocaleString()} FC
                          </td>
                          <td className="px-4 py-3 font-mono text-emerald-400 font-bold print:text-emerald-700">
                            {totalPaye.toLocaleString()} FC
                          </td>
                          <td className="px-4 py-3 font-mono text-orange-400 font-bold print:text-orange-700">
                            {totalReste.toLocaleString()} FC
                          </td>
                          <td className="px-4 py-3 text-center">
                            {estSolde && (
                              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold print:border print:border-emerald-600 print:text-emerald-800">
                                Soldé
                              </span>
                            )}
                            {estAcompte && (
                              <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 justify-center w-max mx-auto print:border print:border-amber-600 print:text-amber-800">
                                <Clock size={10} /> Acompte
                              </span>
                            )}
                            {estImpaye && (
                              <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-[10px] font-bold flex items-center gap-1 justify-center w-max mx-auto print:border print:border-red-600 print:text-red-800">
                                <ShieldAlert size={10} /> Non payé
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-white/10 rounded-xl">
              Sélectionnez une classe ci-dessus OU tapez un nom d'élève dans la barre de recherche globale.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function Card({ icon, title, value, gradient, trend, trendUp }) {
  return (
    <div className="group relative">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300`}></div>
      <div className="relative rounded-xl bg-white/15 backdrop-blur-xl border border-white/25 p-3.5 lg:p-4.5 shadow-lg overflow-hidden">
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] lg:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{title}</p>
            <h2 className="mt-1 lg:mt-2 text-lg sm:text-xl lg:text-2xl font-black text-white leading-snug truncate">{value}</h2>
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                <span className="text-[10px] font-bold">{trend}</span>
              </div>
              <span className="text-[10px] text-slate-400">vs mois dernier</span>
            </div>
          </div>
          <div className={`rounded-lg lg:rounded-xl bg-gradient-to-br ${gradient} p-2.5 lg:p-3 text-white shadow-md shrink-0`}>
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