import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";

/**
 * Page de finalisation du paiement
 */
export default function Paiement() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Redirection si pas de données (accès direct)
  useEffect(() => {
    if (!state || !state.eleve || !state.obligations)  {
      navigate("/dashboard/finance/nouveau");
    }
  }, [state, navigate]);

  if (!state) return null;

 const { eleve } = state;
 // Liste des frais sélectionnés (lecture seule)
const obligations = state.obligations || [];



// États du formulaire
const [montantVerse, setMontantVerse] = useState("");
const [devise, setDevise] = useState("CDF");
const [modePaiement, setModePaiement] = useState("especes");
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


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
        observation: "",
        reference_transaction: null,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Échec de la validation.");
    }
  console.log("PAIEMENT =", JSON.stringify(data.data, null, 2));
    navigate("/dashboard/finances/factureseleves", {
      state: {
        eleve,
        obligations,
        paiement: data.data,
        montantVerse: Number(montantVerse),
        monnaie,
        modePaiement,
      },
    });

  } catch (error) {
    setError(error.message || "Une erreur s'est produite.");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Retour */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Retour à la sélection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Récapitulatif */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Info Élève */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{eleve.nom} {eleve.post_nom} {eleve.prenom}</h2>
                <p className="text-slate-500">{eleve.numero_inscription} • {eleve.nom_classe}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-50 pt-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section</p>
                <p className="font-semibold text-slate-700">{eleve.nom_section}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Option</p>
                <p className="font-semibold text-slate-700">{eleve.nom_option || "Générale"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Année</p>
                <p className="font-semibold text-slate-700">{eleve.annee_scolaire}</p>
              </div>
            </div>
          </div>

          {/* Détails des frais */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Frais sélectionnés</h3>
           <div className="space-y-4">
  {obligations.map((o) => (
    <div
      key={o.obligation_id}
      className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="font-bold text-slate-800">
            {o.types_frais?.nom}
          </p>
          <p className="text-xs text-slate-500">
            {o.periode}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase text-slate-400">
            Reste à payer
          </p>
          <p className="font-black text-slate-900">
            {Number(o.reste).toLocaleString("fr-FR")}
            <span className="text-[10px] text-slate-400 ml-1">
              FC
            </span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-slate-100 px-4 py-3">
  <p className="text-xs uppercase text-slate-500 font-semibold">
    Reste à payer
  </p>

  <p className="text-xl font-black text-slate-900">
    {Number(o.reste).toLocaleString("fr-FR")} FC
  </p>
</div>
    </div>
  ))}
</div>
            
            <div className="mt-8 flex justify-between items-center p-6 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
              <span className="text-lg font-bold">Total à payer</span>
              <span className="text-3xl font-black">
                {totalAPayer.toLocaleString("fr-FR")} <span className="text-sm font-normal text-indigo-200">FC</span>
              </span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Formulaire de Paiement */}
        <div className="space-y-6">
          <form onSubmit={handlePaiement} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-8">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Finaliser le règlement</h3>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Montant Versé */}
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Montant versé</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    value={montantVerse}
                    onChange={(e) => setMontantVerse(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-2xl font-black text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <select 
                      value={devise} 
                      onChange={(e) => setDevise(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-slate-600 outline-none"
                    >
                      <option value="CDF">FC</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Mode de règlement</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
  { id: "especes", icon: Banknote, label: "Espèces" },
  { id: "mobile_money", icon: Smartphone, label: "Mobile Money" },
  { id: "banque", icon: CreditCard, label: "Banque" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setModePaiement(m.id)}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        modePaiement === m.id
                          ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                          : "border-slate-100 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      <m.icon size={20} />
                      <span className="text-[10px] font-bold uppercase">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calcul de la monnaie */}
              {Number(montantVerse) > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="flex justify-between items-center text-emerald-700">
                    <span className="text-sm font-medium">Monnaie à rendre</span>
                    <span className="text-xl font-black">
                      {monnaie.toLocaleString("fr-FR")} <span className="text-xs font-normal">FC</span>
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !montantVerse}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                Valider le paiement
              </button>
              
              <p className="text-center text-[10px] text-slate-400 font-medium px-4">
                En validant, vous confirmez avoir reçu le montant indiqué et générez un reçu officiel.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
