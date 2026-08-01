import React, { useRef } from "react";
import { Printer, Download, X } from "lucide-react";

export default function ReceiptModal({ isOpen, onClose, receiptData, schoolInfo }) {
  const printRef = useRef();
  const SCHOOL_LOGO =
    "https://stcxcoveiivvywefwcsi.supabase.co/storage/v1/object/sign/College-Emmanuel/logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yMzYxZDVhMy02OTY3LTQ2NGQtOTM2Yy1mMTFlOGQ1NzQ4ZmQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJDb2xsZWdlLUVtbWFudWVsL2xvZ28ucG5nIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDU0MzM2NiwiZXhwIjoxODE2MDc5MzY2fQ.OnTEBpc3FwJgQkCZfpNXc_b6_EWtC71dYvTj73-4-Hs";

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
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

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;

    const { default: html2pdf } = await import("html2pdf.js");

    const opt = {
      margin: 0.3,
      filename: `Recu_${receiptData?.receipt || "paiement"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
    };

    html2pdf().from(element).set(opt).save();
  };

  if (!isOpen || !receiptData) return null;

  const items = receiptData.items || [];
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const studentName = (receiptData.details || "").replace(/\s+/g, " ").trim() || "Élève";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm">
      <div className="w-full max-w-[90mm] rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h3 className="text-sm font-bold text-white">Reçu de Paiement #{receiptData.receipt}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 transition hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="bg-slate-900 p-3">
          <div ref={printRef} className="mx-auto w-full max-w-[80mm] rounded-sm border border-slate-900 bg-white p-2 text-[11px] text-black shadow-xl">
            <img src={SCHOOL_LOGO} alt="" className="watermark pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[45mm] max-w-[45mm] -translate-x-1/2 -translate-y-1/2 opacity-[0.08] grayscale" />
            <div className="relative z-10 border border-dashed border-slate-400 p-2">
              <div className="space-y-1 text-center">
                <img src={SCHOOL_LOGO} alt="Logo" className="mx-auto mb-1 h-8 w-8 object-contain" />
                <h1 className="text-[11px] font-extrabold uppercase tracking-tight">Collège Emmanuel</h1>
                <p className="text-[7px] uppercase">R.D. Congo - EPST</p>
                <p className="text-[6px] text-slate-600">L'excellence est mon destin</p>
              </div>

              <div className="my-2 border-b border-dashed border-black"></div>

              <div className="space-y-0.5 text-[8px]">
                <div className="my-1 text-center text-[9px] font-bold uppercase">Reçu de Paiement</div>
                <div className="flex justify-between">
                  <span>N° Reçu:</span>
                  <span className="font-bold">{receiptData.receipt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(receiptData.date || Date.now()).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Heure:</span>
                  <span>{new Date(receiptData.date || Date.now()).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              </div>

              <div className="my-2 border-b border-dashed border-black"></div>

              <div className="space-y-0.5 text-[8px]">
                <div className="mb-1 font-bold uppercase">Élève :</div>
                <div className="text-[9px] font-bold uppercase leading-tight">{studentName}</div>
                <div className="flex justify-between">
                  <span>Classe:</span>
                  <span className="font-semibold">{receiptData.context || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-semibold">{items[0]?.paymentMethod || "Espèces"}</span>
                </div>
              </div>

              <div className="my-2 border-b border-dashed border-black"></div>

              <div>
                <div className="mb-1 flex justify-between text-[7px] font-bold uppercase">
                  <span>Libellé / Période</span>
                  <span>Montant</span>
                </div>
                <div className="space-y-1.5">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-start justify-between text-[8px]">
                        <div className="max-w-[70%] pr-2">
                          <p className="font-semibold leading-tight">{item.description || "Frais Scolaires"}</p>
                          <p className="text-[6px] text-slate-500">{item.original?.periode || item.original?.libelle || item.original?.mois || item.original?.mois_paye || "Année en cours"}</p>
                        </div>
                        <span className="whitespace-nowrap font-bold">{Number(item.amount || 0).toLocaleString("fr-FR")} FC</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-[9px] italic">Aucun détail spécifié.</div>
                  )}
                </div>
              </div>

              <div className="my-2 border-b border-dashed border-black"></div>

              <div className="my-2 flex items-center justify-between text-[9px] font-black">
                <span className="uppercase">TOTAL PAYÉ</span>
                <span className="text-[10px]">{total.toLocaleString("fr-FR")} FC</span>
              </div>

              <div className="my-2 border-b-2 border-black"></div>

              <div className="space-y-1 pt-1 text-center">
                <p className="text-[6px] font-bold uppercase tracking-widest">*** MERCI DE VOTRE CONFIANCE ***</p>
                <p className="text-[5px] text-slate-500">Document officiel • Conservé à des fins de contrôle.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 bg-slate-800/50 p-3">
          <button onClick={handlePrint} className="flex items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-sky-700">
            <Printer size={14} /> Imprimer
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-indigo-700">
            <Download size={14} /> Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  );
}
