import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  CheckCircle2,
  User,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  Hash,
  ShieldCheck,
} from "lucide-react";


/**
 * Composant FacturePaiement Redesigné
 * Style: Moderne, Professionnel, Institutionnel (RDC)
 */
export default function FacturePaiement() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Logo de l'école généré et Armoiries RDC (URLs fictives ou placeholders pour le code)
  const SCHOOL_LOGO = "https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2xvZ28ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDU0MzM2NiwiZXhwIjoxODE2MDc5MzY2fQ.OnTEBpc3FwJgQkCZfpNXc_b6_EWtC71dYvTj73-4-Hs"; 
  const RDC_ARMS = "https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/rdc-arms.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL3JkYy1hcm1zLndlYnAiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzg0NTQ0MDQ0LCJleHAiOjE4MTYwODAwNDR9.7ae1bt5bsgYz3mDsJ7DowXBFhZLnEreyZDxweepyPhE"

  if (!state) {
    navigate("/dashboard/finance");
    return null;
  }

  const {
    eleve = {},
    paiement = {},
    montantVerse = 0,
    monnaie = 0,
    modePaiement = "Espèces",
  } = state;

  const details = paiement.details || [];
  const total = details.reduce(
    (s, d) => s + Number(d.montant_paye || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Barre d'actions supérieure */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-medium transition-all hover:bg-slate-50 hover:border-slate-300 shadow-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Retour au tableau
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-semibold transition-all hover:bg-indigo-700 hover:shadow-lg active:scale-95"
            >
              <Printer size={18} />
              Imprimer le reçu
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
              <Download size={20} />
            </button>
            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm">
              <Mail size={20} />
            </button>
          </div>
        </div>

        {/* Document de Reçu */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 overflow-hidden border border-slate-100 relative">
          
          {/* Filigrane discret (Optionnel en CSS) */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center">
             <img src={RDC_ARMS} alt="" className="w-1/2" />
          </div>

          {/* En-tête Officiel RDC */}
          <div className="p-8 sm:p-12 border-b border-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              
              {/* Mentions RDC & Ministère */}
              <div className="flex items-start gap-6">
                <img src={RDC_ARMS} alt="RDC" className="w-20 h-20 object-contain" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                    République Démocratique du Congo
                  </h4>
                  <h3 className="text-sm font-extrabold text-slate-800 leading-tight uppercase max-w-[280px]">
                    Ministère de l'Éducation Nationale et Nouvelle Citoyenneté
                  </h3>
                  <div className="h-1 w-12 bg-indigo-500 rounded-full mt-2"></div>
                </div>
              </div>

              {/* Logo de l'École */}
              <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden p-2">
                   <img src={SCHOOL_LOGO} alt="Collège Emmanuel" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-indigo-950 uppercase tracking-tight">
                    Collège Emmanuel
                  </h2>
                  <p className="text-xs font-medium text-slate-500">Excellence • Discipline • Travail</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
                  Document Officiel
                </span>
                <h1 className="text-4xl font-black text-slate-900">
                  Reçu de Paiement
                </h1>
                <p className="text-slate-500 mt-2 flex items-center gap-2">
                  <Hash size={14} />
                  Référence : <span className="font-mono font-bold text-slate-700">
                    {paiement.paiement?.numero_recu || paiement.numero_recu || "REC-2024-000"}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-bold border border-emerald-100 shadow-sm">
                  <CheckCircle2 size={18} />
                  STATUT : PAYÉ
                </div>
                <div className="text-right text-sm text-slate-400 font-medium">
                  Émis le {new Date().toLocaleDateString("fr-FR")} à {new Date().toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          {/* Corps du Reçu */}
          <div className="p-8 sm:p-12 space-y-12">
            
            {/* Grille d'informations */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Infos Élève */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-50 to-slate-50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white border border-slate-100 rounded-[1.8rem] p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <User size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">Information de l'Élève</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <InfoRow label="Nom Complet" value={`${eleve.nom || ""} ${eleve.post_nom || ""} ${eleve.prenom || ""}`} bold />
                    <InfoRow label="N° Inscription" value={eleve.numero_inscription} />
                    <div className="pt-2 grid grid-cols-2 gap-4">
                      <InfoRow label="Classe" value={eleve.nom_classe} />
                      <InfoRow label="Section" value={eleve.nom_section} />
                    </div>
                    <InfoRow label="Option" value={eleve.nom_option || "Générale"} />
                  </div>
                </div>
              </div>

              {/* Infos Paiement */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-50 to-slate-50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white border border-slate-100 rounded-[1.8rem] p-7 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">Détails de la Transaction</h3>
                  </div>

                  <div className="space-y-4">
                    <InfoRow label="Mode de Règlement" value={modePaiement} />
                    <InfoRow label="Montant Versé" value={`${Number(montantVerse).toLocaleString("fr-FR")} FC`} bold color="text-emerald-600" />
                    <InfoRow label="Reliquat (Monnaie)" value={`${Number(monnaie).toLocaleString("fr-FR")} FC`} />
                    <InfoRow label="Réf. Transaction" value={paiement.paiement?.reference_transaction || "TRX-N/A"} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau des Frais */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 text-xl tracking-tight flex items-center gap-3">
                  <ShieldCheck className="text-indigo-500" />
                  Répartition des Frais
                </h3>
                <span className="text-sm font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                  {details.length} Ligne(s)
                </span>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-slate-100 shadow-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="text-left p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Désignation des Frais</th>
                      <th className="text-left p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Période</th>
                      <th className="text-right p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Quote-part (FC)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {details.length > 0 ? (
                      details.map((o, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="p-5">
                            <div className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                              {o.types_frais?.nom || "Frais Scolaires"}
                            </div>
                          </td>
                          <td className="p-5 text-slate-500 font-medium italic">
                            {o.periode || o.mois?.nom || "Année en cours"}
                          </td>
                          <td className="p-5 text-right">
                            <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50/50 text-indigo-700 font-black">
                              {Number(o.montant_paye).toLocaleString("fr-FR")}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-12 text-slate-300 font-medium italic">
                          Aucun détail spécifique enregistré pour ce versement.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Résumé Financier Final */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden">
              {/* Décoration abstraite */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2 text-center md:text-left">
                  <p className="text-indigo-300 font-bold uppercase tracking-widest text-xs">Total Net Encaissé</p>
                  <h2 className="text-5xl font-black tracking-tighter">
                    {total.toLocaleString("fr-FR")} <span className="text-2xl text-indigo-400 font-medium uppercase ml-1">FC</span>
                  </h2>
                </div>

                <div className="h-[1px] md:h-16 w-full md:w-[1px] bg-white/10"></div>

                <div className="grid grid-cols-2 gap-8 text-center md:text-right">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Versé</p>
                    <p className="text-xl font-bold">{Number(montantVerse).toLocaleString("fr-FR")} FC</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Rendu</p>
                    <p className="text-xl font-bold text-emerald-400">{Number(monnaie).toLocaleString("fr-FR")} FC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation & Sécurité */}
            <div className="pt-8 flex flex-col md:flex-row justify-between items-end gap-12">
              <div className="w-full md:w-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <Building2 size={20} />
                  </div>
                  <p className="font-bold text-slate-800">Cachet & Signature de la Caisse</p>
                </div>
                <div className="h-32 w-full md:w-72 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
                   <span className="text-slate-200 text-xs font-black uppercase tracking-widest rotate-12">Espace Réservé</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 bg-white border border-slate-100 rounded-3xl p-3 shadow-sm flex items-center justify-center group hover:scale-105 transition-transform cursor-pointer">
                  {/* Placeholder pour QR Code */}
                  <div className="w-full h-full bg-slate-50 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <div className="grid grid-cols-3 gap-1 opacity-20">
                      {[...Array(9)].map((_, i) => <div key={i} className="w-3 h-3 bg-slate-900 rounded-sm"></div>)}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase">Vérifier</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Authenticité Garantie <br /> par le Collège Emmanuel
                </p>
              </div>
            </div>
          </div>

          {/* Footer Bas de Page */}
          <div className="bg-slate-50/50 p-6 text-center border-t border-slate-50">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.3em]">
              Merci de votre confiance • Excellence dans l'éducation en RDC
            </p>
          </div>
        </div>

        {/* Note de bas de page print */}
        <p className="mt-8 text-center text-slate-400 text-xs font-medium hidden print:block">
          Ceci est un document numérique officiel généré par le système de gestion scolaire du Collège Emmanuel.
        </p>
      </div>
    </div>
  );
}

/** Composant utilitaire pour les lignes d'info */
function InfoRow({ label, value, bold = false, color = "text-slate-700" }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
      <span className="text-slate-400 font-medium">{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${color} truncate ml-4`}>
        {value || "-"}
      </span>
    </div>
  );
}
