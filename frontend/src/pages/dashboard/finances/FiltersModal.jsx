import React, { useEffect, useState } from "react";
import { X, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";

const selectClassName =
  "w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 focus:border-indigo-400";

export default function FiltersModal({
  isOpen,
  onClose,
  onApply,
  onReset,
  filters,
  sections,
  classes,
  typesFrais,
  modesPaiement,
}) {
  const [draft, setDraft] = useState({
    filtreClasse: filters?.filtreClasse || "",
    filtreSection: filters?.filtreSection || "",
    filtreOption: filters?.filtreOption || "",
    filtreEleve: filters?.filtreEleve || "",
    filtreTypeFrais: filters?.filtreTypeFrais || "",
    filtreModePaiement: filters?.filtreModePaiement || "",
    filtreDateDebut: filters?.filtreDateDebut || "",
    filtreDateFin: filters?.filtreDateFin || "",
    filtreMois: filters?.filtreMois || "",
    triOrdre: filters?.triOrdre || "recent",
    filtreType: filters?.filtreType || "TOUT",
  });
  const [options, setOptions] = useState([]);
  const [classesByOption, setClassesByOption] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingEleves, setLoadingEleves] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDraft({
      filtreClasse: filters?.filtreClasse || "",
      filtreSection: filters?.filtreSection || "",
      filtreOption: filters?.filtreOption || "",
      filtreEleve: filters?.filtreEleve || "",
      filtreTypeFrais: filters?.filtreTypeFrais || "",
      filtreModePaiement: filters?.filtreModePaiement || "",
      filtreDateDebut: filters?.filtreDateDebut || "",
      filtreDateFin: filters?.filtreDateFin || "",
      filtreMois: filters?.filtreMois || "",
      triOrdre: filters?.triOrdre || "recent",
      filtreType: filters?.filtreType || "TOUT",
    });
  }, [isOpen, filters]);

  useEffect(() => {
    if (!isOpen) return;

    const loadEleves = async () => {
      try {
        setLoadingEleves(true);
        const res = await fetch("/dashboard/eleves");
        const data = await res.json();
        setEleves(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Erreur chargement élèves:", err);
      } finally {
        setLoadingEleves(false);
      }
    };

    loadEleves();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (!draft.filtreSection) {
      setOptions([]);
      if (draft.filtreOption || draft.filtreClasse) {
        setDraft((prev) => ({ ...prev, filtreOption: "", filtreClasse: "" }));
      }
      return;
    }

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        const res = await fetch(`/dashboard/options?section_id=${draft.filtreSection}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setOptions(list);

        if (draft.filtreOption && !list.some((item) => String(item.option_id || item.id) === String(draft.filtreOption))) {
          setDraft((prev) => ({ ...prev, filtreOption: "", filtreClasse: "" }));
        }
      } catch (err) {
        console.error("Erreur chargement options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, [isOpen, draft.filtreSection]);

  useEffect(() => {
    if (!isOpen) return;

    if (!draft.filtreOption) {
      setClassesByOption([]);
      if (draft.filtreClasse) {
        setDraft((prev) => ({ ...prev, filtreClasse: "" }));
      }
      return;
    }

    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        const res = await fetch(`/dashboard/classes?option_id=${draft.filtreOption}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setClassesByOption(list);

        if (draft.filtreClasse && !list.some((item) => String(item.classe_id || item.id) === String(draft.filtreClasse))) {
          setDraft((prev) => ({ ...prev, filtreClasse: "" }));
        }
      } catch (err) {
        console.error("Erreur chargement classes:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, [isOpen, draft.filtreOption]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    const nextDraft = { ...draft, [field]: value };
    setDraft(nextDraft);
    onApply(nextDraft);
  };

  const handleApply = () => {
    onClose();
  };

  const handleReset = () => {
    const resetDraft = {
      filtreClasse: "",
      filtreSection: "",
      filtreOption: "",
      filtreEleve: "",
      filtreTypeFrais: "",
      filtreModePaiement: "",
      filtreDateDebut: "",
      filtreDateFin: "",
      filtreMois: "",
      triOrdre: "recent",
      filtreType: "TOUT",
    };
    setDraft(resetDraft);
    onReset();
    onClose();
  };

  const classOptions = classesByOption.length > 0 ? classesByOption : classes || [];
  const studentOptions = eleves.filter((student) => {
    if (!draft.filtreClasse) return true;
    return String(student.classe_id || student.classe?.classe_id || student.classe_id || "") === String(draft.filtreClasse);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Filtres avancés</h3>
            <p className="text-sm text-slate-400">Choisissez d’abord une section puis affinez par option, classe et élève.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-300">
            <span>Section</span>
            <select value={draft.filtreSection} onChange={(e) => updateField("filtreSection", e.target.value)} className={selectClassName}>
              <option value="">Toutes les sections</option>
              {sections.map((item) => (
                <option key={item.section_id || item.id} value={item.section_id || item.id}>
                  {item.nom_section || item.libelle || item.nom}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Option</span>
            <select value={draft.filtreOption} onChange={(e) => updateField("filtreOption", e.target.value)} className={selectClassName} disabled={!draft.filtreSection || loadingOptions}>
              <option value="">Toutes les options</option>
              {options.map((item) => (
                <option key={item.option_id || item.id} value={item.option_id || item.id}>
                  {item.nom_option || item.libelle || item.nom || item.option}
                </option>
              ))}
            </select>
            {loadingOptions && <span className="flex items-center gap-2 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" />Chargement des options...</span>}
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Classe</span>
            <select value={draft.filtreClasse} onChange={(e) => updateField("filtreClasse", e.target.value)} className={selectClassName} disabled={!draft.filtreOption || loadingClasses}>
              <option value="">Toutes les classes</option>
              {classOptions.map((item) => (
                <option key={item.classe_id || item.id} value={item.classe_id || item.id}>
                  {item.nom_classe || item.libelle || item.nom}
                </option>
              ))}
            </select>
            {loadingClasses && <span className="flex items-center gap-2 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" />Chargement des classes...</span>}
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Élève</span>
            <select value={draft.filtreEleve} onChange={(e) => updateField("filtreEleve", e.target.value)} className={selectClassName} disabled={loadingEleves}>
              <option value="">Tous les élèves</option>
              {studentOptions.map((item) => (
                <option key={item.eleve_id || item.id} value={item.nom_complet || item.nom || `${item.prenom || ""} ${item.nom || ""}`.trim()}>
                  {item.nom_complet || `${item.prenom || ""} ${item.nom || ""}`.trim()}
                </option>
              ))}
            </select>
            {loadingEleves && <span className="flex items-center gap-2 text-xs text-slate-400"><Loader2 size={12} className="animate-spin" />Chargement des élèves...</span>}
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Date de début</span>
            <input type="date" value={draft.filtreDateDebut} onChange={(e) => updateField("filtreDateDebut", e.target.value)} className={selectClassName} />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Date de fin</span>
            <input type="date" value={draft.filtreDateFin} onChange={(e) => updateField("filtreDateFin", e.target.value)} className={selectClassName} />
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Mois</span>
            <select value={draft.filtreMois} onChange={(e) => updateField("filtreMois", e.target.value)} className={selectClassName}>
              <option value="">Tous les mois</option>
              <option value="1">Janvier</option>
              <option value="2">Février</option>
              <option value="3">Mars</option>
              <option value="4">Avril</option>
              <option value="5">Mai</option>
              <option value="6">Juin</option>
              <option value="7">Juillet</option>
              <option value="8">Août</option>
              <option value="9">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Décembre</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Type de frais</span>
            <select value={draft.filtreTypeFrais} onChange={(e) => updateField("filtreTypeFrais", e.target.value)} className={selectClassName}>
              <option value="">Tous les types</option>
              {typesFrais.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Mode de paiement</span>
            <select value={draft.filtreModePaiement} onChange={(e) => updateField("filtreModePaiement", e.target.value)} className={selectClassName}>
              <option value="">Tous les modes</option>
              {modesPaiement.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Tri</span>
            <select value={draft.triOrdre} onChange={(e) => updateField("triOrdre", e.target.value)} className={selectClassName}>
              <option value="recent">Plus récents</option>
              <option value="ancien">Plus anciens</option>
              <option value="montant-desc">Montant décroissant</option>
              <option value="montant-asc">Montant croissant</option>
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-300">
            <span>Type de mouvement</span>
            <select value={draft.filtreType} onChange={(e) => updateField("filtreType", e.target.value)} className={selectClassName}>
              <option value="TOUT">Tous</option>
              <option value="ENTREE">Entrées</option>
              <option value="SORTIE">Sorties</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
          >
            <RotateCcw size={16} />
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            <CheckCircle2 size={16} />
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
