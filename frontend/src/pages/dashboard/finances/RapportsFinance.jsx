import React, { useEffect, useState, useMemo, useRef } from "react";
import html2pdf from "html2pdf.js";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  RefreshCw,
  Search,
  List,
  Loader2,
  AlertTriangle,
  Printer,
  Download,
} from "lucide-react";
import FiltersModal from "./FiltersModal";
import ReceiptModal from "./ReceiptModal";
import RapportsTable from "./RapportsTable";
import SummaryFooter from "./SummaryFooter";

export default function RapportsFinance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statsHomepage, setStatsHomepage] = useState(null);
  const [allPaiements, setAllPaiements] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("TOUT");
  const [triOrdre, setTriOrdre] = useState("recent");
  const [filtreModePaiement, setFiltreModePaiement] = useState("");
  const [filtreTypeFrais, setFiltreTypeFrais] = useState("");
  const [filtreClasse, setFiltreClasse] = useState("");
  const [filtreSection, setFiltreSection] = useState("");
  const [filtreOption, setFiltreOption] = useState("");
  const [filtreEleve, setFiltreEleve] = useState("");
  const [filtreDateDebut, setFiltreDateDebut] = useState("");
  const [filtreDateFin, setFiltreDateFin] = useState("");
  const [filtreMois, setFiltreMois] = useState("");
  const [sections, setSections] = useState([]);
  const [classes, setClasses] = useState([]);
  const [typesFrais, setTypesFrais] = useState([]);
  const [modesPaiement, setModesPaiement] = useState([]);
  const [groupByReceipt, setGroupByReceipt] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceiptData, setSelectedReceiptData] = useState(null);
  const reportContentRef = useRef(null);

  const parseJSON = async (res) => {
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) return res.json();
    throw new Error("Réponse non JSON");
  };

  const chargerDonneesRapport = async () => {
    try {
      setLoading(true);
      setError(false);
      const [resHomepage, resPaiements, resDepenses, resSections, resClasses] = await Promise.all([
        fetch("/finance/homepage", { credentials: "include" }),
        fetch("/finance/paiements", { credentials: "include" }),
        fetch("/finance/depenses", { credentials: "include" }),
        fetch("/dashboard/sections"),
        fetch("/dashboard/classes/all"),
      ]);

      if (resHomepage.ok) {
        const json = await parseJSON(resHomepage);
        if (json.success) setStatsHomepage(json.data.statistiques || null);
      }
      if (resPaiements.ok) {
        const json = await parseJSON(resPaiements);
        if (json.success) {
          const paiements = Array.isArray(json.data) ? json.data : [];
          setAllPaiements(paiements);
          setTypesFrais([...new Set(paiements.map((p) => p.type_frais).filter(Boolean))]);
          setModesPaiement([...new Set(paiements.map((p) => p.mode_paiement).filter(Boolean))]);
        }
      }
      if (resDepenses.ok) setDepenses(await parseJSON(resDepenses));
      if (resSections.ok) setSections(await parseJSON(resSections));
      if (resClasses.ok) setClasses(await parseJSON(resClasses));
    } catch (err) {
      console.error("Erreur chargement rapport:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonneesRapport();
  }, []);

  const openReceiptModal = (receiptData) => {
    setSelectedReceiptData(receiptData);
    setShowReceiptModal(true);
  };

  const optionsList = useMemo(() => [...new Set(allPaiements.map((p) => p.nom_option).filter(Boolean))], [allPaiements]);
  const elevesList = useMemo(() => [...new Set(allPaiements.map((p) => p.nom_complet).filter(Boolean))], [allPaiements]);

  const totalRecettes = statsHomepage?.montantEncaisse ?? allPaiements.reduce((acc, p) => acc + Number(p.montant_paye || 0), 0);
  const totalDepenses = depenses.reduce((acc, d) => acc + Number(d.montant || 0), 0);
  const soldeNet = totalRecettes - totalDepenses;

  const mouvementsConsolides = useMemo(() => {
    const recettes = (allPaiements || []).map((p) => ({
      id: `recette-${p.detail_paiement_id || p.id || Math.random()}`,
      type: "ENTREE",
      date: p.date_paiement,
      description: p.type_frais,
      details: p.nom_complet,
      context: `${p.nom_classe || ""} ${p.nom_option ? `(${p.nom_option})` : ""}`.trim(),
      amount: Number(p.montant_paye || 0),
      receipt: p.numero_recu,
      paymentMethod: p.mode_paiement,
      cashier: p.caissier_nom || "-",
      status: p.statut,
      original: p,
    }));
    const sorties = (depenses || []).map((d) => ({
      id: `depense-${d.depense_id}`,
      type: "SORTIE",
      date: d.date_depense || d.created_at,
      description: d.motif || "Dépense diverse",
      details: d.categorie || "N/A",
      context: d.description || "Aucune",
      amount: Number(d.montant || 0),
      receipt: null,
      paymentMethod: null,
      cashier: null,
      status: null,
      original: d,
    }));
    return [...recettes, ...sorties];
  }, [allPaiements, depenses]);

  const fluxFiltres = useMemo(() => {
    const normalizeText = (value) => String(value ?? "").trim().toLowerCase();
    const includesSelectedValue = (values, selectedValue) => {
      if (!selectedValue) return true;
      const target = normalizeText(selectedValue);
      return values.some((value) => normalizeText(value) === target);
    };

    const parseDateValue = (value) => {
      if (!value) return null;
      if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

      if (typeof value === "string") {
        const trimmed = value.trim();
        if (!trimmed) return null;

        const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) {
          const [, year, month, day] = isoMatch;
          const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
          if (!Number.isNaN(parsed.getTime())) return parsed;
        }

        const slashParts = trimmed.split(/[\/.-]/).filter(Boolean);
        if (slashParts.length === 3) {
          const [first, second, third] = slashParts;
          let day = null;
          let month = null;
          let year = null;

          if (first.length === 4) {
            year = Number(first);
            month = Number(second);
            day = Number(third);
          } else if (third.length === 4) {
            day = Number(first);
            month = Number(second);
            year = Number(third);
          }

          if (year && month && day) {
            const parsed = new Date(year, month - 1, day);
            if (!Number.isNaN(parsed.getTime())) return parsed;
          }
        }

        const parsed = new Date(trimmed);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }

      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const getMonthValue = (item) => {
      if (item?.type !== "ENTREE") return null;

      const original = item?.original || {};
      const candidates = [
        original?.periode,
        original?.libelle,
        original?.mois,
        original?.mois_paye,
        original?.periode_paiement,
        original?.periode_facture,
        original?.mois_paie,
        original?.month,
      ].filter((value) => value != null && String(value).trim() !== "");

      return candidates[0] ?? null;
    };

    const matchesDateFilters = (item) => {
      const parsedDate = parseDateValue(item.date);
      if (!parsedDate) return false;

      if (filtreDateDebut) {
        const start = parseDateValue(`${filtreDateDebut}T00:00:00`);
        if (start && parsedDate < start) return false;
      }

      if (filtreDateFin) {
        const end = parseDateValue(`${filtreDateFin}T23:59:59`);
        if (end && parsedDate > end) return false;
      }

      if (filtreMois) {
        const monthValue = getMonthValue(item);
        if (!monthValue) return false;

        const normalizedMonthValue = String(monthValue).trim().toLowerCase();
        const monthMatch =
          normalizedMonthValue.includes(String(filtreMois)) ||
          normalizedMonthValue.includes(monthNames[Number(filtreMois) - 1]?.toLowerCase()) ||
          normalizedMonthValue.includes(monthNames[Number(filtreMois) - 1]?.slice(0, 3).toLowerCase());

        if (!monthMatch) return false;
      }

      return true;
    };

    const getFieldValues = (item, keys) => {
      return keys.flatMap((key) => {
        const parts = key.split(".");
        let current = item;
        for (const part of parts) {
          if (current == null) return [];
          current = current[part];
        }
        return current == null ? [] : [current];
      });
    };

    const monthNames = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    const lowSearch = recherche.toLowerCase();
    return mouvementsConsolides
      .filter((item) => {
        const matchSearch =
          !recherche ||
          ["description", "details", "context", "receipt", "paymentMethod"].some((prop) =>
            String(item[prop] || "").toLowerCase().includes(lowSearch)
          );
        const matchType = filtreType === "TOUT" || item.type === filtreType;
        if (!matchSearch || !matchType) return false;
        if (!matchesDateFilters(item)) return false;
        if (item.type === "ENTREE") {
          const optionValues = getFieldValues(item, [
            "original.nom_option",
            "original.option",
            "original.option.nom_option",
            "original.option.nom",
            "original.option_id",
            "original.option.id",
            "original.nom",
          ]);
          const sectionValues = getFieldValues(item, [
            "original.section_id",
            "original.section.section_id",
            "original.section.id",
            "original.section.nom_section",
            "original.nom_section",
            "original.section.nom",
          ]);
          const classeValues = getFieldValues(item, [
            "original.classe_id",
            "original.classe.classe_id",
            "original.classe.id",
            "original.classe.nom_classe",
            "original.nom_classe",
            "original.classe.nom",
          ]);
          const eleveValues = getFieldValues(item, [
            "details",
            "original.nom_complet",
            "original.eleve_nom_complet",
            "original.nom",
            "original.prenom",
            "original.post_nom",
          ]);

          return (
            (!filtreModePaiement || item.paymentMethod === filtreModePaiement) &&
            (!filtreTypeFrais || item.description === filtreTypeFrais) &&
            (!filtreClasse || includesSelectedValue(classeValues, filtreClasse)) &&
            (!filtreSection || includesSelectedValue(sectionValues, filtreSection)) &&
            (!filtreOption || includesSelectedValue(optionValues, filtreOption)) &&
            (!filtreEleve || includesSelectedValue(eleveValues, filtreEleve))
          );
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        if (triOrdre === "recent") return dateB - dateA;
        if (triOrdre === "ancien") return dateA - dateB;
        if (triOrdre === "montant-desc") return b.amount - a.amount;
        if (triOrdre === "montant-asc") return a.amount - b.amount;
        return 0;
      });
  }, [mouvementsConsolides, recherche, filtreType, triOrdre, filtreModePaiement, filtreTypeFrais, filtreClasse, filtreSection, filtreOption, filtreEleve, filtreDateDebut, filtreDateFin, filtreMois]);

  const processedFlux = useMemo(() => {
    if (!groupByReceipt) return fluxFiltres.map((item) => ({ ...item, isGroup: false }));

    const grouped = fluxFiltres.reduce((acc, item) => {
      if (item.type === "ENTREE" && item.receipt) {
        if (!acc[item.receipt]) {
          acc[item.receipt] = {
            id: `group-${item.receipt}`,
            isGroup: true,
            receipt: item.receipt,
            date: item.date,
            details: item.details,
            context: item.context,
            cashier: item.cashier,
            items: [],
            totalAmount: 0,
            original: item.original,
          };
        }
        acc[item.receipt].items.push(item);
        acc[item.receipt].totalAmount += item.amount;
        if (new Date(item.date) < new Date(acc[item.receipt].date)) acc[item.receipt].date = item.date;
      } else {
        acc[`item-${item.id}`] = { ...item, isGroup: false };
      }
      return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      if (triOrdre === "recent") return dateB - dateA;
      if (triOrdre === "ancien") return dateA - dateB;
      const amountA = a.isGroup ? a.totalAmount : a.amount;
      const amountB = b.isGroup ? b.totalAmount : b.amount;
      if (triOrdre === "montant-desc") return amountB - amountA;
      if (triOrdre === "montant-asc") return amountA - amountB;
      return 0;
    });
  }, [fluxFiltres, groupByReceipt, triOrdre]);

  const resumeFiltre = useMemo(() => {
    const recettes = fluxFiltres.filter((m) => m.type === "ENTREE").reduce((acc, m) => acc + m.amount, 0);
    const depenses = fluxFiltres.filter((m) => m.type === "SORTIE").reduce((acc, m) => acc + m.amount, 0);
    return { nbMouvements: fluxFiltres.length, totalRecettes: recettes, totalDepenses: depenses, solde: recettes - depenses };
  }, [fluxFiltres]);

  const handleApplyFilters = (nextFilters) => {
    setFiltreClasse(nextFilters.filtreClasse);
    setFiltreSection(nextFilters.filtreSection);
    setFiltreOption(nextFilters.filtreOption);
    setFiltreEleve(nextFilters.filtreEleve);
    setFiltreTypeFrais(nextFilters.filtreTypeFrais);
    setFiltreModePaiement(nextFilters.filtreModePaiement);
    setFiltreDateDebut(nextFilters.filtreDateDebut);
    setFiltreDateFin(nextFilters.filtreDateFin);
    setFiltreMois(nextFilters.filtreMois);
    setTriOrdre(nextFilters.triOrdre);
    setFiltreType(nextFilters.filtreType);
  };

  const handleResetFilters = () => {
    setFiltreClasse("");
    setFiltreSection("");
    setFiltreOption("");
    setFiltreEleve("");
    setFiltreTypeFrais("");
    setFiltreModePaiement("");
    setFiltreDateDebut("");
    setFiltreDateFin("");
    setFiltreMois("");
    setTriOrdre("recent");
    setFiltreType("TOUT");
  };

  const handlePrintReport = () => {
    if (reportContentRef.current) {
      window.print();
    }
  };

  const handleDownloadReportPdf = () => {
    if (!reportContentRef.current) return;

    const opt = {
      margin: 0.3,
      filename: `Rapports_financiers_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf().from(reportContentRef.current).set(opt).save();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center text-slate-300">
        <AlertTriangle className="text-amber-400" />
        <p>Erreur de chargement.</p>
        <button type="button" onClick={chargerDonneesRapport} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-report, .printable-report * {
            visibility: visible;
          }
          .printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        filters={{
          filtreClasse,
          filtreSection,
          filtreOption,
          filtreEleve,
          filtreTypeFrais,
          filtreModePaiement,
          filtreDateDebut,
          filtreDateFin,
          filtreMois,
          triOrdre,
          filtreType,
        }}
        sections={sections}
        classes={classes}
        typesFrais={typesFrais}
        modesPaiement={modesPaiement}
        optionsList={optionsList}
        elevesList={elevesList}
      />
      <ReceiptModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} receiptData={selectedReceiptData} />

      <div className="min-h-screen p-3 text-slate-100 selection:bg-indigo-500 selection:text-white sm:p-5 lg:p-8">
        <div className="relative mx-auto max-w-7xl space-y-5 lg:space-y-6">
          <div className="no-print flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-300">
                <Wallet size={14} />
                Rapports financiers
              </div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">Suivi des encaissements et dépenses</h1>
              <p className="mt-2 text-sm text-slate-400">Analysez les mouvements, les reçus et la santé globale du budget.</p>
            </div>
            <button type="button" onClick={chargerDonneesRapport} className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10">
              <RefreshCw size={16} />
              Actualiser
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 p-4 shadow-xl">
              <div className="flex items-center justify-between text-emerald-300">
                <span className="text-sm font-medium">Recettes</span>
                <ArrowUpRight size={18} />
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{totalRecettes.toLocaleString()} FC</p>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/15 to-rose-500/5 p-4 shadow-xl">
              <div className="flex items-center justify-between text-rose-300">
                <span className="text-sm font-medium">Dépenses</span>
                <ArrowDownLeft size={18} />
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{totalDepenses.toLocaleString()} FC</p>
            </div>
            <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-indigo-500/5 p-4 shadow-xl">
              <div className="flex items-center justify-between text-indigo-300">
                <span className="text-sm font-medium">Solde net</span>
                <Scale size={18} />
              </div>
              <p className="mt-4 text-2xl font-semibold text-white">{soldeNet.toLocaleString()} FC</p>
            </div>
          </div>

          <div className="no-print rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-xl backdrop-blur-2xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher un mouvement, un reçu ou un élève"
                  className="w-full rounded-xl border border-white/10 bg-slate-900/70 py-2.5 pl-9 pr-3 text-sm text-slate-100 outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(true)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  <List size={16} />
                  Filtres
                </button>
                <button type="button" onClick={handlePrintReport} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                  <Printer size={16} />
                  Imprimer
                </button>
                <button type="button" onClick={handleDownloadReportPdf} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                  <Download size={16} />
                  Télécharger PDF
                </button>
                <button type="button" onClick={chargerDonneesRapport} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/10">
                  <RefreshCw size={16} />
                  Actualiser
                </button>
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm font-medium text-slate-200">
                  <input type="checkbox" checked={groupByReceipt} onChange={(e) => setGroupByReceipt(e.target.checked)} className="h-4 w-4 rounded border-white/10 bg-slate-900 text-indigo-500" />
                  <span>Regrouper par reçu</span>
                </label>
              </div>
            </div>
          </div>

          <div ref={reportContentRef} className="printable-report space-y-4">
            <RapportsTable items={processedFlux} groupByReceipt={groupByReceipt} onOpenReceipt={openReceiptModal} />
            <SummaryFooter stats={resumeFiltre} />
          </div>
        </div>
      </div>
    </>
  );
}
