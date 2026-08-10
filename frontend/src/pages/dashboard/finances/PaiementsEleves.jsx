
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

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

/* ==========================================================
   INFO CARD
========================================================== */

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="group relative rounded-xl bg-white/5 border border-white/10 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-indigo-500/30">
    <div className="flex items-center gap-2 mb-1">
      {Icon && (
        <Icon
          size={13}
          className="text-slate-400 group-hover:text-indigo-400 transition-colors"
        />
      )}

      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>

    <p className="text-xs sm:text-sm font-bold text-white truncate">
      {value || "-"}
    </p>
  </div>
);

/* ==========================================================
   PAGE RECHERCHE ELEVE
========================================================== */

export default function RechercheEleve() {
  const navigate = useNavigate();

  /* ========================================================
     ETATS
  ======================================================== */

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [resultats, setResultats] = useState([]);

  const [eleve, setEleve] = useState(null);

  const [frais, setFrais] = useState([]);
  const [chargementFrais, setChargementFrais] = useState(false);

  const [selection, setSelection] = useState([]);

  /* ========================================================
     RECHERCHE ELEVE
  ======================================================== */

  const effectuerRecherche = useCallback(
    async (searchQuery, signal) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/finance/rechercher?q=${encodeURIComponent(
            searchQuery.trim()
          )}`,
          {
            signal,
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Erreur réseau");
        }

        const data = await res.json();

        if (data.success) {
          setResultats(data.data || []);
        } else {
          setResultats([]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erreur recherche :", err);

          setError(
            "Erreur de connexion au serveur."
          );

          setResultats([]);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /* ========================================================
     RECHERCHE AUTOMATIQUE
  ======================================================== */

  useEffect(() => {
    if (eleve !== null) {
      return;
    }

    if (!query || query.trim().length < 2) {
      setResultats([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(() => {
      effectuerRecherche(
        query,
        controller.signal
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    query,
    eleve,
    effectuerRecherche,
  ]);

  /* ========================================================
     CHARGER LES FRAIS
  ======================================================== */

  const chargerFrais = async (item) => {
    try {
      setChargementFrais(true);
      setError(null);

      const res = await fetch(
        `/finance/obligations/${item.inscription_id}`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        const fraisAvecMontant =
          (data.data || []).map(
            (frais) => ({
              ...frais,
              montant_saisi: 0,
            })
          );

        setFrais(fraisAvecMontant);
        setSelection([]);
      } else {
        setFrais([]);

        setError(
          data.message ||
            "Aucun frais trouvé."
        );
      }
    } catch (err) {
      console.error(
        "Erreur chargement frais :",
        err
      );

      setFrais([]);

      setError(
        "Impossible de charger les frais."
      );
    } finally {
      setChargementFrais(false);
    }
  };

  /* ========================================================
     SELECTIONNER / DESELECTIONNER UN FRAIS
  ======================================================== */

  const toggleFrais = (id) => {
    const obligation = frais.find(
      (f) =>
        f.obligation_id === id
    );

    console.log(
      "🎯 OBLIGATION CLIQUÉE :",
      {
        obligation_id:
          obligation?.obligation_id,

        frais:
          obligation?.types_frais?.nom,

        periode:
          obligation?.periode,

        mois:
          obligation?.mois?.nom,

        montant_du:
          obligation?.montant_du,

        reste:
          obligation?.reste,
      }
    );

    setSelection((prev) =>
      prev.includes(id)
        ? prev.filter(
            (x) => x !== id
          )
        : [...prev, id]
    );
  };

  /* ========================================================
     MODIFIER LE MONTANT
  ======================================================== */

  const modifierMontant = (
    id,
    montant
  ) => {
    setFrais((prev) =>
      prev.map((frais) => {
        if (
          frais.obligation_id !== id
        ) {
          return frais;
        }

        const reste = Number(
          frais.reste ??
            frais.montant_du ??
            0
        );

        let montantSaisi =
          Number(montant);

        if (
          Number.isNaN(montantSaisi)
        ) {
          montantSaisi = 0;
        }

        if (montantSaisi < 0) {
          montantSaisi = 0;
        }

        if (
          montantSaisi > reste
        ) {
          montantSaisi = reste;
        }

        return {
          ...frais,
          montant_saisi:
            montantSaisi,
        };
      })
    );
  };

  /* ========================================================
     SELECTIONNER TOUS LES FRAIS
  ======================================================== */

  const selectionnerTout = () => {
    if (
      selection.length ===
      frais.length
    ) {
      setSelection([]);
    } else {
      setSelection(
        frais.map(
          (f) => f.obligation_id
        )
      );
    }
  };

  /* ========================================================
     CHOISIR UN ELEVE
  ======================================================== */

  const choisirEleve = (item) => {
    console.log(
      "🎓 ÉLÈVE SÉLECTIONNÉ :",
      item
    );

    console.log(
      "📅 ANNÉE ID :",
      item.annee_id
    );

    console.log(
      "📅 ANNÉE SCOLAIRE :",
      item.annee_scolaire
    );

    setEleve(item);

    setResultats([]);

    setQuery(
      `${item.nom} ${
        item.post_nom || ""
      } ${
        item.prenom || ""
      }`.trim()
    );

    chargerFrais(item);
  };

  /* ========================================================
     REINITIALISER
  ======================================================== */

  const reinitialiser = () => {
    setQuery("");
    setEleve(null);
    setFrais([]);
    setSelection([]);
    setResultats([]);
    setError(null);
  };

  /* ========================================================
     TOTAL SELECTIONNE
  ======================================================== */

  const totalSelectionne =
    useMemo(() => {
      return frais
        .filter((f) =>
          selection.includes(
            f.obligation_id
          )
        )
        .reduce(
          (somme, item) =>
            somme +
            Number(
              item.montant_saisi || 0
            ),
          0
        );
    }, [
      frais,
      selection,
    ]);

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <div className="relative min-h-screen p-3 sm:p-5 lg:p-6 text-slate-100">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-10 left-1/3 w-72 lg:w-96 h-72 lg:h-96 bg-indigo-500/15 rounded-full blur-3xl" />

        <div className="absolute bottom-10 right-1/3 w-72 lg:w-96 h-72 lg:h-96 bg-purple-500/15 rounded-full blur-3xl" />

      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-4 lg:space-y-6">

        {/* ==================================================
            HEADER
        ================================================== */}

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
              className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <X size={14} />
              Nouvelle recherche
            </button>
          )}

        </div>

        {/* ==================================================
            RECHERCHE
        ================================================== */}

        <div className="relative group">

          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-slate-400 group-focus-within:text-indigo-400 transition-colors"
            />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(
                e.target.value
              );

              if (eleve) {
                setEleve(null);
                setFrais([]);
                setSelection([]);
              }
            }}
            placeholder="Nom, prénom ou numéro d'inscription..."
            className="w-full rounded-xl sm:rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl py-3 sm:py-3.5 pl-10 pr-10 shadow-lg shadow-indigo-500/5 text-white placeholder-slate-400 text-xs sm:text-sm outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />

          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-2">

            {loading && (
              <Loader2
                size={18}
                className="text-indigo-400 animate-spin"
              />
            )}

            {query &&
              !loading && (
                <button
                  onClick={
                    reinitialiser
                  }
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}

          </div>

          {/* ==================================================
              RESULTATS
          ================================================== */}

          {resultats.length > 0 && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/20 bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/50 divide-y divide-white/5 max-h-[350px] overflow-y-auto">

              {resultats.map(
                (item) => (
                  <button
                    key={
                      item.inscription_id
                    }
                    onClick={() =>
                      choisirEleve(
                        item
                      )
                    }
                    className="flex w-full items-center justify-between p-3.5 sm:p-4 text-left hover:bg-white/10 transition group cursor-pointer"
                  >

                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-indigo-500/20 border border-indigo-500/30 p-2.5 text-indigo-300 group-hover:scale-105 transition-transform">
                        <User size={16} />
                      </div>

                      <div>

                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.nom}{" "}
                          {item.post_nom}{" "}
                          {item.prenom}
                        </h3>

                        <p className="text-[11px] text-slate-400 font-mono">
                          {
                            item.numero_inscription
                          }{" "}
                          -{" "}
                          <span className="text-slate-300">
                            {
                              item.nom_classe
                            }
                          </span>
                        </p>

                      </div>

                    </div>

                    <div className="text-right mr-2">

                      {item.finances?.total_reste !==
                        undefined && (
                        <p className="text-xs font-bold text-emerald-400">
                          Reste :{" "}
                          {Number(
                            item.finances.total_reste
                          ).toLocaleString(
                            "fr-FR"
                          )}{" "}
                          FC
                        </p>
                      )}

                      <p className="text-[10px] text-slate-400 uppercase">
                        {
                          item.nom_option ||
                          "Général"
                        }
                      </p>

                    </div>

                    <ChevronRight
                      size={16}
                      className="text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all"
                    />

                  </button>
                )
              )}

            </div>
          )}

        </div>

        {/* ==================================================
            ERREUR
        ================================================== */}

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-300 text-xs sm:text-sm">

            <AlertCircle
              size={18}
              className="shrink-0"
            />

            <p className="font-medium">
              {error}
            </p>

          </div>
        )}

        {/* ==================================================
            AUCUN ELEVE
        ================================================== */}

        {!eleve ? (

          <div className="rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-10 sm:p-14 text-center shadow-2xl">

            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-4">

              <GraduationCap
                size={32}
                className="text-slate-400"
              />

            </div>

            <h2 className="text-base sm:text-xl font-bold text-white">
              Aucun élève sélectionné
            </h2>

            <p className="mt-1 text-slate-400 text-xs sm:text-sm max-w-xs mx-auto">
              Saisissez un nom ou un identifiant pour lancer la recherche.
            </p>

          </div>

        ) : (

          <div className="space-y-4 lg:space-y-6">

            {/* ==================================================
                PROFIL ELEVE
            ================================================== */}

            <section className="rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 lg:p-5 shadow-xl">

              <div className="flex items-center gap-2.5 mb-3 lg:mb-4">

                <div className="h-5 w-1 bg-indigo-500 rounded-full" />

                <h2 className="text-xs sm:text-sm lg:text-base font-bold text-white">
                  Profil de l'élève
                </h2>

              </div>

              <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">

                <InfoCard
                  label="N° Inscription"
                  value={
                    eleve.numero_inscription
                  }
                />

                <InfoCard
                  label="Classe"
                  value={
                    eleve.nom_classe
                  }
                />

                <InfoCard
                  label="Section"
                  value={
                    eleve.nom_section
                  }
                />

                <InfoCard
                  label="Option"
                  value={
                    eleve.nom_option ||
                    "Aucune"
                  }
                />

                {/* ==================================================
                    CORRECTION ANNEE SCOLAIRE
                    On affiche le libellé et non l'UUID
                ================================================== */}

                <InfoCard
                  label="Année scolaire"
                  value={
                    eleve.annee_scolaire ||
                    "-"
                  }
                />

                {/* ==================================================
                    FINANCES
                ================================================== */}

                <InfoCard
                  label="Montant Dû"
                  value={
                    eleve.finances?.total_du !==
                    undefined
                      ? `${Number(
                          eleve.finances.total_du
                        ).toLocaleString(
                          "fr-FR"
                        )} FC`
                      : "-"
                  }
                />

                <InfoCard
                  label="Total Payé"
                  value={
                    eleve.finances?.total_paye !==
                    undefined
                      ? `${Number(
                          eleve.finances.total_paye
                        ).toLocaleString(
                          "fr-FR"
                        )} FC`
                      : "-"
                  }
                />

                <InfoCard
                  label="Reste à Payer"
                  value={
                    eleve.finances?.total_reste !==
                    undefined
                      ? `${Number(
                          eleve.finances.total_reste
                        ).toLocaleString(
                          "fr-FR"
                        )} FC`
                      : "-"
                  }
                />

              </div>

            </section>

            {/* ==================================================
                FRAIS
            ================================================== */}

            <section className="rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-4 lg:p-5 shadow-xl">

              <div className="mb-4 flex flex-row items-center justify-between gap-2">

                <div className="flex items-center gap-2.5">

                  <div className="h-5 w-1 bg-emerald-400 rounded-full" />

                  <h2 className="text-xs sm:text-sm lg:text-base font-bold text-white">
                    Frais applicables
                  </h2>

                </div>

                {frais.length > 0 && (
                  <button
                    onClick={
                      selectionnerTout
                    }
                    className="text-xs font-semibold text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2
                      size={14}
                    />

                    {selection.length ===
                    frais.length
                      ? "Tout désélectionner"
                      : "Tout sélectionner"}
                  </button>
                )}

              </div>

              {/* ==================================================
                  CHARGEMENT
              ================================================== */}

              {chargementFrais ? (

                <div className="flex flex-col items-center justify-center py-10 text-slate-400">

                  <Loader2
                    size={24}
                    className="animate-spin text-indigo-400 mb-2"
                  />

                  <p className="text-xs">
                    Récupération des frais...
                  </p>

                </div>

              ) : frais.length === 0 ? (

                <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-xs text-slate-400">
                  Aucun frais trouvé pour cet élève.
                </div>

              ) : (

                <div className="grid gap-2.5">

                  {frais.map((f) => {

                    console.log(
                      "💰 OBLIGATION AFFICHÉE :",
                      {
                        obligation_id:
                          f.obligation_id,

                        frais:
                          f.types_frais?.nom,

                        periode:
                          f.periode,

                        mois:
                          f.mois?.nom,

                        montant_du:
                          f.montant_du,

                        montant_paye:
                          f.montant_paye,

                        reste:
                          f.reste,
                      }
                    );

                    const id =
                      f.obligation_id;

                    const isSelected =
                      selection.includes(
                        id
                      );

                    return (

                      <div
                        key={id}
                        onClick={() =>
                          toggleFrais(id)
                        }
                        className={`group relative flex items-center justify-between rounded-xl border p-3.5 sm:p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
                          isSelected
                            ? "border-indigo-500/50 bg-indigo-500/10 backdrop-blur-md shadow-md shadow-indigo-500/10"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >

                        <div className="flex items-center gap-3 sm:gap-4">

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              isSelected
                                ? "bg-indigo-500 border-indigo-500 text-white"
                                : "border-slate-500 bg-white/5"
                            }`}
                          >
                            {isSelected && (
                              <Check
                                size={12}
                                strokeWidth={3}
                              />
                            )}
                          </div>

                          <div>

                            <h3
                              className={`text-xs sm:text-sm font-bold transition-colors ${
                                isSelected
                                  ? "text-indigo-200"
                                  : "text-white"
                              }`}
                            >
                              {
                                f.types_frais
                                  ?.nom
                              }

                              {f.periode &&
                                f.periode.toLowerCase() !==
                                  "annuel" && (
                                  <span className="font-normal opacity-90">
                                    {` - ${f.periode}`}
                                  </span>
                                )}
                            </h3>

                          </div>

                        </div>

                        <div className="flex flex-col items-end gap-1">

                          <p className="text-[9px] uppercase tracking-wider text-slate-400">
                            Reste
                          </p>

                          <p className="text-xs font-bold text-emerald-300">
                            {Number(
                              f.reste ??
                                f.montant_du ??
                                0
                            ).toLocaleString(
                              "fr-FR"
                            )}{" "}
                            FC
                          </p>

                          {isSelected && (
                            <input
                              type="number"
                              min="0"
                              max={Number(
                                f.reste ??
                                  f.montant_du ??
                                  0
                              )}
                              step="1"
                              value={
                                f.montant_saisi ||
                                ""
                              }
                              onClick={(e) =>
                                e.stopPropagation()
                              }
                              onChange={(e) =>
                                modifierMontant(
                                  f.obligation_id,
                                  e.target.value
                                )
                              }
                              placeholder="Montant"
                              className="w-32 rounded-lg border border-indigo-500/30 bg-slate-900 px-2.5 py-1.5 text-right text-xs font-bold text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                          )}

                        </div>

                      </div>

                    );
                  })}

                </div>
              )}

              {/* ==================================================
                  TOTAL
              ================================================== */}

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">

                <div className="text-center sm:text-left">

                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    {selection.length}{" "}
                    frais sélectionné
                    {selection.length >
                    1
                      ? "s"
                      : ""}
                  </p>

                  <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    {totalSelectionne.toLocaleString(
                      "fr-FR"
                    )}

                    <span className="text-xs font-normal text-slate-400">
                      {" "}
                      FC
                    </span>
                  </p>

                </div>

                {/* ==================================================
                    CONTINUER VERS PAIEMENT
                ================================================== */}

                <button
                  disabled={
                    selection.length ===
                      0 ||
                    totalSelectionne <=
                      0
                  }
                  onClick={() =>
                    navigate(
                      "/dashboard/finances/paiementficheeleves",
                      {
                        state: {
                          eleve,

                          obligations:
                            frais
                              .filter(
                                (f) =>
                                  selection.includes(
                                    f.obligation_id
                                  )
                              )
                              .filter(
                                (f) =>
                                  Number(
                                    f.montant_saisi ||
                                      0
                                  ) > 0
                              )
                              .map(
                                (f) => ({
                                  ...f,
                                  montant_saisi:
                                    Number(
                                      f.montant_saisi ||
                                        0
                                    ),
                                })
                              ),
                        },
                      }
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
                >
                  Continuer vers le paiement

                  <ChevronRight
                    size={16}
                  />
                </button>

              </div>

            </section>

          </div>
        )}

      </div>
    </div>
  );
}
