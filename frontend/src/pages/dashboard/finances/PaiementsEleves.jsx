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
  Check,
} from "lucide-react";

const PERIOD_LABELS = {
  septembre_decembre: "Septembre - Décembre",
  janvier_mai: "Janvier - Mai",
  annuel: "Annuel",
};

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="group relative rounded-xl bg-white/5 border border-white/10 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-indigo-500/30">
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon size={13} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />}
      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
    <p className="text-xs sm:text-sm font-bold text-white truncate">
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
      const res = await fetch(
        `/finance/obligations/${item.inscription_id}`
      );
      const data = await res.json();

      if (data.success) {
        setFrais(data.data || []);
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
   * Calcul du total
   */
  const totalSelectionne = useMemo(() => {
    return frais
      .filter((f) => selection.includes(f.obligation_id))
      .reduce((somme, item) => somme + Number(item.reste ?? item.montant_du ?? 0), 0);
  }, [frais, selection]);

  return (
    <div className="relative min-h-screen p-3 sm:p-5 lg:p-6 text-slate-100">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/3 w-72 lg:w-96 h-72 lg:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/3 w-72 lg:w-96 h-72 lg:h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Nouveau paiement
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
              Recherchez un élève et sélectionnez les frais à régler.
            </p>
          </div>
          {eleve && (
            <button 
              onClick={reinitialiser}
              className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <X size={14} /> Nouvelle recherche
            </button>
          )}
        </div>

        {/* Barre de recherche */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nom, prénom ou numéro d'inscription..."
            className="w-full rounded-xl sm:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl py-3 sm:py-3.5 pl-10 pr-10 shadow-lg shadow-indigo-500/5 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">
            {loading && <Loader2 size={18} className="text-indigo-400 animate-spin" />}
            {query && !loading && (
              <button onClick={() => setQuery("")} className="text-slate-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            )}
          </div>

          {/* Liste des résultats (Dropdown) */}
          {resultats.length > 0 && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/20 bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/50 divide-y divide-white/5 max-h-[350px] overflow-y-auto">
              {resultats.map((item) => (
                <button
                  key={item.inscription_id}
                  onClick={() => choisirEleve(item)}
                  className="flex w-full items-center justify-between p-3.5 sm:p-4 text-left hover:bg-white/10 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-500/20 border border-indigo-500/30 p-2.5 text-indigo-300 group-hover:scale-105 transition-transform">
                      <User size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.nom} {item.post_nom} {item.prenom}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {item.numero_inscription}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right mr-3">
                    <p className="text-xs font-semibold text-slate-200">{item.nom_classe}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{item.nom_option}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-300 text-xs sm:text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!eleve ? (
          <div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 sm:p-14 text-center shadow-2xl">
            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap size={32} className="text-slate-400" />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-white">Aucun élève sélectionné</h2>
            <p className="mt-1 text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
              Saisissez un nom ou un identifiant pour lancer la recherche.
            </p>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {/* Profil Élève */}
            <section className="rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 lg:p-5 shadow-xl">
              <div className="flex items-center gap-2.5 mb-3 lg:mb-4">
                <div className="h-5 w-1 bg-indigo-500 rounded-full" />
                <h2 className="text-xs sm:text-sm lg:text-base font-bold text-white">Profil de l'élève</h2>
              </div>
              <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                <InfoCard label="N° Inscription" value={eleve.numero_inscription} />
                <InfoCard label="Classe" value={eleve.nom_classe} />
                <InfoCard label="Section" value={eleve.nom_section} />
                <InfoCard label="Option" value={eleve.nom_option} />
                <InfoCard label="Année" value={eleve.annee_scolaire} />
              </div>
            </section>

            {/* Frais applicables */}
            <section className="rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 lg:p-5 shadow-xl">
              <div className="mb-4 flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="h-5 w-1 bg-emerald-400 rounded-full" />
                  <h2 className="text-xs sm:text-sm lg:text-base font-bold text-white">Frais applicables</h2>
                </div>
                
                {frais.length > 0 && (
                  <button 
                    onClick={selectionnerTout}
                    className="text-xs font-semibold text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    {selection.length === frais.length ? "Tout désélectionner" : "Tout sélectionner"}
                  </button>
                )}
              </div>

              {chargementFrais ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <Loader2 size={24} className="animate-spin text-indigo-400 mb-2" />
                  <p className="text-xs">Récupération des frais...</p>
                </div>
              ) : frais.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-slate-400">
                  Aucun frais trouvé pour cet élève.
                </div>
              ) : (
                <div className="grid gap-2.5">
                  {frais.map((f) => {
                    const id = f.obligation_id;
                    const isSelected = selection.includes(id);
                    return (
                      <div
                        key={id}
                        onClick={() => toggleFrais(id)}
                        className={`group relative flex items-center justify-between rounded-xl border p-3.5 sm:p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
                          isSelected 
                            ? "border-indigo-500/50 bg-indigo-500/10 backdrop-blur-md shadow-md shadow-indigo-500/10" 
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-500 bg-white/5"
                          }`}>
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div>
                            <h3 className={`text-xs sm:text-sm font-bold transition-colors ${isSelected ? "text-indigo-200" : "text-white"}`}>
                              {f.types_frais?.nom}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              {PERIOD_LABELS[f.periode] || f.periode} • {f.sexe}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className={`text-sm sm:text-base font-black transition-colors ${isSelected ? "text-indigo-300" : "text-emerald-300"}`}>
                            {Number(f.reste ?? f.montant_du ?? 0).toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-slate-400">FC</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Barre de résumé de paiement */}
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    {selection.length} frais sélectionné{selection.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {totalSelectionne.toLocaleString("fr-FR")} <span className="text-xs font-normal text-slate-400">FC</span>
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
                          montant_saisi: Number(f.reste ?? f.montant_du ?? 0),
                        })),
                    }
                  })}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 active:scale-95"
                >
                  Continuer vers le paiement
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}