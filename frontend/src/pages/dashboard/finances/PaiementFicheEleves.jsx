import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Receipt,
  Wallet
} from "lucide-react";

/**
 * Page de finalisation du paiement - Style Depth Design & Cohérent
 */
export default function Paiement() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirection si accès direct sans données
  useEffect(() => {
    if (!state || !state.eleve || !state.obligations) {
      navigate("/dashboard/finances/nouveau");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { eleve } = state;
  const obligations = state.obligations || [];

  // États du formulaire
  const [montantVerse, setMontantVerse] = useState("");
  const [devise, setDevise] = useState("CDF");
  const [modePaiement, setModePaiement] = useState("especes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculs financiers
  const totalAPayer = obligations.reduce(
    (total, o) => total + Number(o.reste ?? o.montant_du ?? 0),
    0
  );

  const monnaie =
    Number(montantVerse) > totalAPayer
      ? Number(montantVerse) - totalAPayer
      : 0;

  const handlePaiement = async (e) => {
    e.preventDefault();

    if (Number(montantVerse) <= 0) {
      setError("Veuillez saisir un montant valide.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/finance/paiementseleves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          inscription_id: eleve.inscription_id,
          mode_paiement: modePaiement,
          montant_verse: Number(montantVerse),
          devise: devise,
          observation: "",
          reference_transaction: null,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Échec de la validation.");
      }

      navigate("/dashboard/finances/factureseleves", {
        state: {
          paiement_id: data.data.paiement_id,
        },
      });
    } catch (err) {
      setError(err.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen p-3 sm:p-5 lg:p-6 text-slate-100">
      {/* Halos lumineux d'arrière-plan pour accentuer la profondeur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/3 w-72 lg:w-96 h-72 lg:h-96 bg-indigo-500/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/3 w-72 lg:w-96 h-72 lg:h-96 bg-purple-500/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6 lg:space-y-8">
        {/* Bouton Retour */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm shadow-lg hover:bg-white/20 transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft size={16} /> Retour à la sélection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* COLONNE GAUCHE : RÉCAPITULATIF */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            
            {/* Carte Élève */}
            <div className="rounded-2xl lg:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 lg:p-8 shadow-2xl">
              <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
                  <User size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight">
                    {eleve.nom} {eleve.post_nom} {eleve.prenom}
                  </h2>
                  <p className="text-slate-400 font-medium text-xs sm:text-sm mt-0.5">
                    N° {eleve.numero_inscription} • <span className="text-indigo-400 font-semibold">{eleve.nom_classe}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-white/10 pt-5">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section</p>
                  <p className="font-bold text-slate-200 text-xs sm:text-sm mt-1">{eleve.nom_section}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Option</p>
                  <p className="font-bold text-slate-200 text-xs sm:text-sm mt-1">{eleve.nom_option || "Générale"}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 col-span-2 md:col-span-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Année scolaire</p>
                  <p className="font-bold text-slate-200 text-xs sm:text-sm mt-1">{eleve.annee_id}</p>
                </div>
              </div>
            </div>

            {/* Carte Détails des Frais */}
            <div className="rounded-2xl lg:rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-6 lg:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h3 className="text-sm sm:text-base lg:text-lg font-extrabold text-white flex items-center gap-2">
                  <Receipt className="text-indigo-400" size={18} /> Frais sélectionnés
                </h3>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                  {obligations.length} obligation{obligations.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {obligations.map((o) => (
                  <div
                    key={o.obligation_id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all flex justify-between items-center group"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-xs sm:text-sm text-white group-hover:text-indigo-300 transition-colors">
                        {o.types_frais?.nom}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        Période : <span className="text-slate-300">{o.periode}</span>
                      </p>
                    </div>

                    <div className="text-right bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-white/10">
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                        Reste à payer
                      </p>
                      <p className="text-sm sm:text-base font-black text-emerald-300">
                        {Number(o.reste ?? o.montant_du ?? 0).toLocaleString("fr-FR")}{" "}
                        <span className="text-[10px] font-bold text-slate-400">FC</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total à Payer - Bannière */}
              <div className="mt-6 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-5 sm:p-6 text-white shadow-xl shadow-indigo-500/20 border border-indigo-400/30">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold tracking-widest text-indigo-200 uppercase block">Montant global</span>
                    <span className="text-sm sm:text-base lg:text-xl font-extrabold">Total à régler</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                      {totalAPayer.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-indigo-200 ml-1.5">FC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : FORMULAIRE DE PAIEMENT */}
          <div className="space-y-6 lg:sticky lg:top-6">
            <form
              onSubmit={handlePaiement}
              className="rounded-2xl lg:rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-white/20 p-5 sm:p-6 lg:p-8 shadow-2xl shadow-black/50 relative"
            >
              <div className="flex items-center gap-2.5 mb-6 border-b border-white/10 pb-4">
                <Wallet className="text-indigo-400" size={20} />
                <h3 className="text-base sm:text-lg lg:text-xl font-black text-white tracking-tight">
                  Finaliser le règlement
                </h3>
              </div>

              {error && (
                <div className="mb-5 p-3.5 bg-red-500/10 text-red-300 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm font-semibold border border-red-500/20 shadow-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Champ de Saisie de Montant */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Montant versé
                  </label>
                  <div className="relative rounded-xl bg-white/5 p-1.5 border border-white/10 shadow-inner focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50 transition-all">
                    <input
                      required
                      type="number"
                      min="0"
                      step="any"
                      value={montantVerse}
                      onChange={(e) => setMontantVerse(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent py-2.5 pl-3 pr-20 text-xl sm:text-2xl font-black text-white outline-none placeholder:text-slate-600"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <select
                        value={devise}
                        onChange={(e) => setDevise(e.target.value)}
                        className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-black text-white shadow-sm outline-none cursor-pointer"
                      >
                        <option value="CDF">FC</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sélecteur de Mode de Paiement */}
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Mode de règlement
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "especes", icon: Banknote, label: "Espèces" },
                      { id: "mobile_money", icon: Smartphone, label: "Mobile" },
                      { id: "banque", icon: CreditCard, label: "Banque" },
                    ].map((m) => {
                      const isSelected = modePaiement === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setModePaiement(m.id)}
                          className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/40"
                              : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <m.icon size={18} className={isSelected ? "text-white" : "text-slate-400"} />
                          <span className="text-[10px] tracking-wider uppercase">
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Monnaie à Rendre */}
                {Number(montantVerse) > 0 && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                    <div className="flex justify-between items-center text-emerald-300">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">Monnaie à rendre</span>
                      <span className="text-base sm:text-lg font-black">
                        {monnaie.toLocaleString("fr-FR")}{" "}
                        <span className="text-xs font-extrabold text-emerald-400">{devise === "CDF" ? "FC" : "USD"}</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Bouton d'Action Principal */}
                <button
                  type="submit"
                  disabled={loading || !montantVerse || Number(montantVerse) <= 0}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:opacity-90 text-white py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] cursor-pointer border border-indigo-400/30"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Validation en cours...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Valider le paiement</span>
                      </>
                    )}
                  </div>
                </button>

                <p className="text-center text-[10px] text-slate-400 font-medium px-2 leading-relaxed">
                  En validant, l'opération sera enregistrée et le reçu officiel sera immédiatement généré.
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}