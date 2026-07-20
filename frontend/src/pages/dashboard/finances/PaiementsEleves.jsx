import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  User,
  GraduationCap,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const PERIOD_LABELS = {
  septembre_decembre: "Septembre - Décembre",
  janvier_mai: "Janvier - Mai",
  annuel: "Annuel",
};

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="group rounded-2xl bg-slate-50 p-5 transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-2 mb-2">
      {Icon && <Icon size={14} className="text-slate-400" />}
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
    <p className="font-semibold text-slate-800 truncate">
      {value || "-"}
    </p>
  </div>
);

export default function RechercheEleve() {
  const navigate = useNavigate();

  // États de recherche
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resultats, setResultats] = useState([]);
  
  // États de sélection
  const [eleve, setEleve] = useState(null);
  const [frais, setFrais] = useState([]);
  const [chargementFrais, setChargementFrais] = useState(false);
  const [selection, setSelection] = useState([]);

  /**
   * Fonction de recherche
   */
  const effectuerRecherche = useCallback(async (searchQuery, signal) => {
    if (searchQuery.trim().length < 2) {
      setResultats([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/finance/rechercher?q=${encodeURIComponent(searchQuery)}`,
        { signal }
      );

      if (!res.ok) throw new Error("Erreur réseau");

      const data = await res.json();
      if (data.success) {
        setResultats(data.data || []);
      } else {
        setResultats([]);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setError("Erreur de connexion au serveur.");
        setResultats([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      effectuerRecherche(query, controller.signal);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, effectuerRecherche]);

  /**
   * Charger les frais
   */
  const chargerFrais = async (item) => {
    try {
      setChargementFrais(true);
      const params = new URLSearchParams({
        anneeId: item.annee_id,
        sectionId: item.section_id,
        optionId: item.option_id || "",
        classeId: item.classe_id,
        sexe: item.sexe,
      });

      const res = await fetch(
        `/finance/obligations/${item.inscription_id}`
      );
      const data = await res.json();

      console.log("OBLIGATIONS :", data);
      console.log("OBLIGATIONS DATA :", data.data);

      if (data.success) {
        setFrais(data.data || []);
        // Par défaut, on peut ne rien sélectionner ou tout sélectionner
        setSelection([]); 
      } else {
        setFrais([]);
        setError(data.message);
      }
    } catch (err) {
      setFrais([]);
      setError("Impossible de charger les frais.");
    } finally {
      setChargementFrais(false);
    }
  };

  /**
   * Gestion de la sélection des frais
   */
  const toggleFrais = (id) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectionnerTout = () => {
  if (selection.length === frais.length) {
    setSelection([]);
  } else {
    setSelection(frais.map(f => f.obligation_id));
  }
};

  const choisirEleve = (item) => {
    setEleve(item);
    setResultats([]);
    setQuery(`${item.nom} ${item.post_nom} ${item.prenom}`);
    chargerFrais(item);
  };

  const reinitialiser = () => {
    setQuery("");
    setEleve(null);
    setFrais([]);
    setSelection([]);
    setResultats([]);
    setError(null);
  };

  /**
   * Calculs
   */
  const totalSelectionne = useMemo(() => {
    return frais
      .filter((f) => selection.includes(f.frais_id || f.id))
      .reduce((somme, item) => somme + Number(item.reste || item.montant_du || 0), 0);
  }, [frais, selection]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Nouveau paiement
          </h1>
          <p className="mt-1 text-slate-500">
            Recherchez un élève et sélectionnez les frais à régler.
          </p>
        </div>
        {eleve && (
          <button 
            onClick={reinitialiser}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <X size={16} /> Nouvelle recherche
          </button>
        )}
      </div>

      {/* Barre de recherche */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nom, prénom ou numéro d'inscription..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
        />

        <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-2">
          {loading && <Loader2 size={20} className="text-indigo-500 animate-spin" />}
          {query && !loading && (
            <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Liste des résultats */}
        {resultats.length > 0 && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-[400px] overflow-y-auto">
              {resultats.map((item) => (
                <button
                  key={item.inscription_id}
                  onClick={() => choisirEleve(item)}
                  className="flex w-full items-center justify-between border-b border-slate-50 px-5 py-4 text-left transition hover:bg-indigo-50/50 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-indigo-50 p-3 group-hover:bg-indigo-100 transition-colors">
                      <User size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-900">
                        {item.nom} {item.post_nom} {item.prenom}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono">
                        {item.numero_inscription}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right mr-4">
                    <p className="font-semibold text-slate-700">{item.nom_classe}</p>
                    <p className="text-xs text-slate-400 uppercase">{item.nom_option}</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-700 border border-red-100">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!eleve ? (
        <div className="rounded-3xl bg-white border border-slate-100 p-16 text-center shadow-sm">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <GraduationCap size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Aucun élève sélectionné</h2>
          <p className="mt-2 text-slate-500 max-w-xs mx-auto">Saisissez un nom pour commencer le processus de paiement.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Profil */}
          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
               <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
               <h2 className="text-xl font-bold text-slate-900">Profil de l'élève</h2>
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
              <InfoCard label="N° Inscription" value={eleve.numero_inscription} />
              <InfoCard label="Classe" value={eleve.nom_classe} />
              <InfoCard label="Section" value={eleve.nom_section} />
              <InfoCard label="Option" value={eleve.nom_option} />
              <InfoCard label="Année" value={eleve.annee_scolaire} />
            </div>
          </section>

          {/* Frais */}
          <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1.5 bg-emerald-500 rounded-full" />
                <h2 className="text-xl font-bold text-slate-900">Frais applicables</h2>
              </div>
              
              {frais.length > 0 && (
                <button 
                  onClick={selectionnerTout}
                  className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  {selection.length === frais.length ? "Tout désélectionner" : "Tout sélectionner"}
                </button>
              )}
            </div>

            {chargementFrais ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 size={32} className="animate-spin mb-4" />
                <p>Récupération des frais...</p>
              </div>
            ) : frais.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-slate-100 p-12 text-center text-slate-400">
                Aucun frais trouvé pour cet élève.
              </div>
            ) : (
              <div className="grid gap-4">
                {frais.map((f) => {
                  const id = f.obligation_id;
                  const isSelected = selection.includes(f.obligation_id);
                  return (
                    <div
                      key={id}
                      onClick={() => toggleFrais(f.obligation_id)}
                      className={`flex items-center justify-between rounded-2xl border p-5 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500" 
                          : "border-slate-100 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                          isSelected ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                        }`}>
                          {isSelected && <X size={14} className="text-white rotate-45" />}
                        </div>
                        <div>
                          <h3 className={`font-bold transition-colors ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                            {f.types_frais?.nom}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {PERIOD_LABELS[f.periode] || f.periode} • {f.sexe}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-black transition-colors ${isSelected ? "text-indigo-700" : "text-slate-900"}`}>
                          {Number(f.reste ?? f.montant_du).toLocaleString("fr-FR")} <span className="text-xs font-normal">FC</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Résumé de sélection */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
              <div className="text-center md:text-left">
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">
                  {selection.length} frais sélectionné{selection.length > 1 ? 's' : ''}
                </p>
                <p className="text-3xl font-black">
                  {totalSelectionne.toLocaleString("fr-FR")} <span className="text-sm font-normal text-slate-400">FC</span>
                </p>
              </div>

              <button 
                disabled={selection.length === 0}
                onClick={() => navigate("/dashboard/finances/paiementficheeleves", {
                  state: {
                    eleve,
                    obligations: frais
  .filter(f => selection.includes(f.obligation_id))
  .map(f => ({
    ...f,
    montant_saisi: Number(f.reste),
  })),
                  }
                })}
                className="w-full md:w-auto flex items-center justify-center gap-3 rounded-xl bg-indigo-500 px-8 py-4 font-bold text-white transition-all hover:bg-indigo-400 disabled:opacity-50 disabled:bg-slate-700 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                Continuer vers le paiement
                <ChevronRight size={20} />
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
