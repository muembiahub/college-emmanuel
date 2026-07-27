import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";

/**
 * Composant FacturePaiement - Format Ticket Thermique (80mm)
 * Filigrane corrigé pour l'impression.
 */
export default function FacturePaiement() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const ticketRef = useRef(null);

  const SCHOOL_LOGO =
    "https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2xvZ28ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDU0MzM2NiwiZXhwIjoxODE2MDc5MzY2fQ.OnTEBpc3FwJgQkCZfpNXc_b6_EWtC71dYvTj73-4-Hs";

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

  const numRecu =
    paiement.paiement?.numero_recu || paiement.numero_recu || "REC-000";

  // --- IMPRESSION NATIVE AVEC CORRECTIF CSS FILIGRANE ---
  const handlePrint = () => {
    const printContent = ticketRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <style>
        @page {
          size: 80mm auto;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family: monospace;
          display: flex;
          justify-content: center;
        }
        .print-wrapper {
          width: 80mm;
          box-sizing: border-box;
          padding: 4mm;
          position: relative;
          background: white;
        }
        /* Correction stricte de la taille du filigrane à l'impression */
        .print-wrapper .watermark {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 45mm !important;
          max-width: 45mm !important;
          height: auto !important;
          opacity: 0.08 !important;
          filter: grayscale(100%) !important;
          z-index: 0 !important;
          pointer-events: none !important;
        }
        .print-wrapper .content-layer {
          position: relative !important;
          z-index: 10 !important;
        }
      </style>
      <div class="print-wrapper">
        ${printContent}
      </div>
    `;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  // --- TÉLÉCHARGER LE TICKET EN HTML ---
  const handleDownload = () => {
    if (!ticketRef.current) return;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Recu_${numRecu}</title>
          <style>
            body { font-family: monospace; width: 80mm; margin: 0 auto; padding: 10px; background: #fff; color: #000; }
            .receipt { border: 2px solid #000; padding: 12px; position: relative; }
            .text-center { text-align: center; }
            .flex { display: flex; justify-content: space-between; }
            .bold { font-weight: bold; }
            .border-b { border-bottom: 1px dashed #000; margin: 8px 0; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 45mm; opacity: 0.08; filter: grayscale(100%); z-index: 0; pointer-events: none; }
            .content-layer { position: relative; z-index: 10; }
          </style>
        </head>
        <body>
          <div class="receipt">
            ${ticketRef.current.innerHTML}
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Recu_${numRecu}_${eleve.nom || "Eleve"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- ENVOI WHATSAPP ---
  const handleWhatsAppShare = () => {
    const nomEleve = `${eleve.nom || ""} ${eleve.post_nom || ""} ${eleve.prenom || ""}`.trim();
    
    const message = 
`🧾 *REÇU DE PAIEMENT - COLLÈGE EMMANUEL*
----------------------------------
📌 *N° Reçu :* ${numRecu}
👤 *Élève :* ${nomEleve}
🏫 *Classe :* ${eleve.nom_classe || "N/A"} (${eleve.nom_section || ""})
📅 *Date :* ${new Date().toLocaleDateString("fr-FR")}

💰 *Détails du règlement :*
- Total Payé : *${total.toLocaleString("fr-FR")} FC*
- Mode : ${modePaiement}
- Montant versé : ${Number(montantVerse).toLocaleString("fr-FR")} FC
- Monnaie rendue : ${Number(monnaie).toLocaleString("fr-FR")} FC

Merci de votre confiance !`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen py-8 px-2 flex flex-col items-center justify-start font-mono text-xs text-black">
      
      {/* BARRE D'ACTIONS (Non imprimée) */}
      <div className="no-print flex flex-col w-full max-w-[80mm] mb-4 gap-2 font-sans">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-slate-700 font-medium text-xs shadow-sm hover:bg-slate-50 transition-colors cursor-pointer w-max border border-slate-200"
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="grid grid-cols-3 gap-1.5 w-full">
          <button
            onClick={handlePrint}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-indigo-600 text-white font-bold text-[11px] shadow hover:bg-indigo-700 transition-colors cursor-pointer"
            title="Imprimer le ticket"
          >
            <Printer size={16} />
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-slate-800 text-white font-bold text-[11px] shadow hover:bg-slate-900 transition-colors cursor-pointer"
            title="Télécharger le reçu"
          >
            <Download size={16} />
            <span>Télécharger</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shadow hover:bg-emerald-700 transition-colors cursor-pointer"
            title="Partager sur WhatsApp"
          >
            <Share2 size={16} />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* REÇU THERMIQUE (80mm) avec Bordure Double et Cadre Stylisé */}
      <div
        ref={ticketRef}
        className="receipt-container relative overflow-hidden w-full max-w-[80mm] bg-white p-4 shadow-xl border-2 border-slate-900 rounded-sm"
      >
        {/* FILIGRANE (Watermark Logo dimensionné en millimètres pour bloquer l'agrandissement) */}
        <img
          src={SCHOOL_LOGO}
          alt=""
          className="watermark absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45mm] max-w-[45mm] opacity-[0.08] grayscale pointer-events-none z-0"
        />

        {/* CONTENU DU TICKET */}
        <div className="content-layer relative z-10 border border-dashed border-slate-400 p-2">
          
          {/* EN-TÊTE ÉCOLE AVEC LOGO */}
          <div className="text-center space-y-1">
            <img
              src={SCHOOL_LOGO}
              alt="Logo"
              className="w-12 h-12 mx-auto object-contain mb-1"
            />
            <h1 className="font-extrabold text-sm uppercase tracking-tight">
              Collège Emmanuel
            </h1>
            <p className="text-[10px] uppercase">R.D. Congo - EPST</p>
            <p className="text-[9px] text-slate-600">
              L'excellence est mon destin
            </p>
          </div>

          <div className="my-2 border-b border-dashed border-black"></div>

          {/* INFOS REÇU */}
          <div className="space-y-0.5 text-[11px]">
            <div className="text-center font-bold text-xs uppercase my-1">
              Reçu de Paiement
            </div>
            <div className="flex justify-between">
              <span>N° Reçu:</span>
              <span className="font-bold">{numRecu}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex justify-between">
              <span>Heure:</span>
              <span>
                {new Date().toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="my-2 border-b border-dashed border-black"></div>

          {/* INFOS ÉLÈVE */}
          <div className="space-y-0.5 text-[11px]">
            <div className="font-bold uppercase mb-1">Élève :</div>
            <div className="font-bold text-xs uppercase leading-tight">
              {eleve.nom} {eleve.post_nom} {eleve.prenom}
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Matricule:</span>
              <span>{eleve.numero_inscription}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Classe:</span>
              <span className="font-semibold">{eleve.nom_classe}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Section:</span>
              <span>{eleve.nom_section}</span>
            </div>
            {eleve.nom_option && (
              <div className="flex justify-between text-[10px]">
                <span>Option:</span>
                <span>{eleve.nom_option}</span>
              </div>
            )}
          </div>

          <div className="my-2 border-b border-dashed border-black"></div>

          {/* TABLEAU DES FRAIS */}
          <div>
            <div className="flex justify-between font-bold text-[10px] uppercase mb-1">
              <span>Libellé / Période</span>
              <span>Montant</span>
            </div>
            <div className="space-y-1.5">
              {details.length > 0 ? (
                details.map((o, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start text-[11px]"
                  >
                    <div className="pr-2 max-w-[70%]">
                      <p className="font-semibold leading-tight">
                        {o.types_frais?.nom || "Frais Scolaires"}
                      </p>
                      <p className="text-[9px] text-slate-500">
                        {o.periode || o.mois?.nom || "Année en cours"}
                      </p>
                    </div>
                    <span className="font-bold whitespace-nowrap">
                      {Number(o.montant_paye).toLocaleString("fr-FR")} FC
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-[10px] italic">
                  Aucun détail spécifié.
                </div>
              )}
            </div>
          </div>

          <div className="my-2 border-b border-dashed border-black"></div>

          {/* DÉTAILS DU RÈGLEMENT */}
          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Mode de paiement:</span>
              <span className="font-bold uppercase">{modePaiement}</span>
            </div>
            <div className="flex justify-between">
              <span>Montant Versé:</span>
              <span>{Number(montantVerse).toLocaleString("fr-FR")} FC</span>
            </div>
            <div className="flex justify-between">
              <span>Monnaie rendue:</span>
              <span>{Number(monnaie).toLocaleString("fr-FR")} FC</span>
            </div>
          </div>

          <div className="my-2 border-b-2 border-black"></div>

          {/* TOTAL PAYÉ */}
          <div className="flex justify-between items-center my-2 text-sm font-black">
            <span className="uppercase">TOTAL PAYÉ</span>
            <span className="text-base">{total.toLocaleString("fr-FR")} FC</span>
          </div>

          <div className="my-2 border-b-2 border-black"></div>

          {/* CODE BARRES & PIED DE PAGE */}
          <div className="text-center pt-2 space-y-2">
            <div className="flex justify-center items-center gap-0.5 h-8 opacity-80 my-1">
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 2].map(
                (w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  ></div>
                )
              )}
            </div>

            <p className="text-[9px] font-bold tracking-widest uppercase">
              *** MERCI DE VOTRE CONFIANCE ***
            </p>
            <p className="text-[8px] text-slate-500">
              Document officiel • Conservé à des fins de contrôle.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}