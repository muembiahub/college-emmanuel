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
  Sparkles,
  Receipt,
  Wallet
} from "lucide-react";

/**
 * Page de finalisation du paiement - Style Depth Design (Profondeur & Reliefs)
 */
export default function Paiement() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirection si accès direct sans données
  useEffect(() => {
    if (!state || !state.eleve || !state.obligations) {
      navigate("/dashboard/finance/nouveau");
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
    (total, o) => total + Number(o.reste),
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
          eleve,
          obligations,
          paiement: data.data,
          montantVerse: Number(montantVerse),
          devise,
          monnaie,
          modePaiement,
        },
      });
    } catch (err) {
      setError(err.message || "Une erreur s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  p-4 md:p-8 space-y-8 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Halos lumineux d'arrière-plan pour accentuer la profondeur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Bouton Retour avec relief */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 text-slate-600 hover:text-indigo-600 font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={18} /> Retour à la sélection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* COLONNE GAUCHE : RÉCAPITULATIF */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Carte Élève (Effet Layered Glass & Depth) */}
            <div className="relative bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-5 mb-6">
                <div className="p-4 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {eleve.nom} {eleve.post_nom} {eleve.prenom}
                  </h2>
                  <p className="text-slate-500 font-medium text-sm mt-0.5">
                    N° {eleve.numero_inscription} • <span className="text-indigo-600 font-semibold">{eleve.nom_classe}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-100/80 pt-6">
                <div className="p-3.5 rounded-2xl bg-slate-100/50 border border-slate-200/40">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Section</p>
                  <p className="font-bold text-slate-700 mt-1">{eleve.nom_section}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100/50 border border-slate-200/40">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Option</p>
                  <p className="font-bold text-slate-700 mt-1">{eleve.nom_option || "Générale"}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100/50 border border-slate-200/40 col-span-2 md:col-span-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Année scolaire</p>
                  <p className="font-bold text-slate-700 mt-1">{eleve.annee_scolaire}</p>
                </div>
              </div>
            </div>

            {/* Carte Détails des Frais (Cartes encastrées) */}
            <div className="bg-gradient-to-b from-white to-slate-50/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white/80">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="text-indigo-600" size={20} /> Frais sélectionnés
                </h3>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  {obligations.length} obligation{obligations.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3.5">
                {obligations.map((o) => (
                  <div
                    key={o.obligation_id}
                    className="p-5 rounded-2xl bg-white border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {o.types_frais?.nom}
                      </p>
                      <p className="text-xs font-medium text-slate-400">
                        Période : <span className="text-slate-600">{o.periode}</span>
                      </p>
                    </div>

                    <div className="text-right bg-slate-50/80 px-4 py-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Reste à payer
                      </p>
                      <p className="text-lg font-black text-slate-900">
                        {Number(o.reste).toLocaleString("fr-FR")}{" "}
                        <span className="text-xs font-bold text-indigo-600">FC</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total à Payer - Bannière à fort relief */}
              <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-6 text-white shadow-xl shadow-indigo-500/25 border border-indigo-400/30">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-indigo-200 uppercase block">Montant global</span>
                    <span className="text-xl font-extrabold">Total à régler</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl md:text-4xl font-black tracking-tight">
                      {totalAPayer.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-sm font-semibold text-indigo-200 ml-1.5">FC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : FORMULAIRE EN RELIEF */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <form
              onSubmit={handlePaiement}
              className="bg-gradient-to-b from-white via-white to-slate-50/90 rounded-3xl p-8 shadow-2xl shadow-slate-300/60 border border-white/90 relative"
            >
              <div className="flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
                <Wallet className="text-indigo-600" size={22} />
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Finaliser le règlement
                </h3>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 text-red-700 rounded-2xl flex items-start gap-3 text-sm font-semibold border border-red-200/60 shadow-sm animate-in shake">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Champ de Saisie de Montant en Relief Inversé (Inset Look) */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Montant versé
                  </label>
                  <div className="relative rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/80 shadow-inner focus-within:ring-4 focus-within:ring-indigo-500/15 focus-within:border-indigo-500 transition-all">
                    <input
                      required
                      type="number"
                      min="0"
                      step="any"
                      value={montantVerse}
                      onChange={(e) => setMontantVerse(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-transparent py-3 pl-4 pr-20 text-2xl font-black text-slate-900 outline-none placeholder:text-slate-300"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <select
                        value={devise}
                        onChange={(e) => setDevise(e.target.value)}
                        className="bg-white border border-slate-200/80 rounded-xl px-3 py-2 text-xs font-black text-slate-700 shadow-sm hover:shadow transition-shadow outline-none cursor-pointer"
                      >
                        <option value="CDF">FC</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sélecteur de Mode de Paiement Dynamique */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Mode de règlement
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
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
                          className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl font-bold transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-b from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30 border border-indigo-500 translate-y-[-2px]"
                              : "bg-slate-50 text-slate-500 border border-slate-200/60 hover:bg-white hover:shadow-md hover:text-slate-800"
                          }`}
                        >
                          <m.icon size={22} className={isSelected ? "text-white" : "text-slate-400"} />
                          <span className="text-[10px] tracking-wider uppercase">
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Monnaie à Rendre (Boîte de résultat en relief vert) */}
                {Number(montantVerse) > 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 shadow-sm animate-in fade-in">
                    <div className="flex justify-between items-center text-emerald-900">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Monnaie à rendre</span>
                      <span className="text-xl font-black">
                        {monnaie.toLocaleString("fr-FR")}{" "}
                        <span className="text-xs font-extrabold text-emerald-600">{devise === "CDF" ? "FC" : "USD"}</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Bouton d'Action Principal (High-Depth Button) */}
                <button
                  type="submit"
                  disabled={loading || !montantVerse || Number(montantVerse) <= 0}
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-4 px-6 rounded-2xl font-black text-base shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 disabled:opacity-50 disabled:shadow-none transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed border border-indigo-400/30"
                >
                  <div className="flex items-center justify-center gap-2.5">
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Validation en cours...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        <span>Valider le paiement</span>
                      </>
                    )}
                  </div>
                </button>

                <p className="text-center text-[11px] text-slate-400 font-medium px-2 leading-relaxed">
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