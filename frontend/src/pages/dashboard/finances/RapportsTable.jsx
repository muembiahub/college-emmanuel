import React from "react";
import { Layers, Eye } from "lucide-react";
import StatutBadge from "./StatutBadge";

export default function RapportsTable({ items, groupByReceipt, onOpenReceipt }) {
  return (
    <>
      <style>{`
        @media print {
          body {
            background: white !important;
            color: #0f172a !important;
          }
          .finance-table-shell {
            box-shadow: none !important;
            border: 1px solid #334155 !important;
            background: white !important;
            color: #0f172a !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .finance-table-shell table {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 9px !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
          }
          .finance-table-shell th,
          .finance-table-shell td {
            padding: 5px 6px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            vertical-align: top !important;
            word-break: break-word !important;
          }
          .finance-table-shell thead {
            background: #f8fafc !important;
            color: #334155 !important;
          }
          .finance-table-shell .print-hide {
            display: none !important;
          }
          .finance-table-shell .print-compact {
            font-size: 9px !important;
          }
        }
      `}</style>
      <div className="finance-table-shell overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 p-4 lg:px-6">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">Flux financier</h2>
          <p className="text-sm text-slate-400">Historique consolidé des mouvements et des reçus.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] text-[11px] font-bold uppercase text-indigo-300">
            <tr>
              <th className="px-4 py-3">{groupByReceipt ? "Reçu" : "Type"}</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Mois / Libellé</th>
              <th className="px-4 py-3">Détails</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3">Info</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {items.length > 0 ? (
              items.map((item) =>
                item.isGroup ? (
                  <React.Fragment key={item.id}>
                    <tr className="bg-slate-900/50 font-semibold hover:bg-slate-900/70">
                      <td className="px-4 py-2 text-indigo-300">
                        <div className="flex items-center gap-2">
                          <Layers size={14} />
                          <span>REÇU</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-300">{new Date(item.date).toLocaleDateString("fr-FR")}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-wide text-slate-500">{item.original?.periode || item.original?.libelle || item.original?.mois || item.original?.mois_paye || "-"}</span>
                          <span className="text-white">{item.details}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 font-mono text-slate-400">#{item.receipt}</td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-emerald-300">+{item.totalAmount.toLocaleString()} FC</span>
                          <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-[10px] text-indigo-300">{item.items.length} lignes</span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-slate-400">{item.cashier || "Caisse"}</td>
                      <td className="print-hide px-4 py-2">
                        <div className="flex justify-center gap-1">
                          <button type="button" onClick={() => onOpenReceipt(item)} className="rounded-md p-1.5 transition hover:bg-white/10">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {item.items.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.04]">
                        <td className="px-4 py-2 pl-8 text-slate-500">↳</td>
                        <td className="px-4 py-2 text-slate-500">{new Date(sub.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wide text-slate-500">{sub.original?.periode || sub.original?.libelle || sub.original?.mois || sub.original?.mois_paye || "-"}</span>
                            <span className="text-slate-200">{sub.description}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-slate-400">{sub.original?.periode}</td>
                        <td className="px-4 py-2 text-right font-mono text-emerald-400">+{sub.amount.toLocaleString()} FC</td>
                        <td className="px-4 py-2 text-slate-400">{sub.paymentMethod || "Espèces"}</td>
                        <td className="px-4 py-2" />
                      </tr>
                    ))}
                  </React.Fragment>
                ) : (
                  <tr key={item.id} className="hover:bg-white/[0.04]">
                    <td className="px-4 py-3">
                      {item.type === "ENTREE" ? (
                        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-300">Entrée</span>
                      ) : (
                        <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-300">Sortie</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(item.date).toLocaleDateString("fr-FR")}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-slate-500">{item.original?.periode || item.original?.libelle || item.original?.mois || item.original?.mois_paye || "-"}</span>
                        <span className="font-medium text-slate-200">{item.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.details}
                      <div className="text-[11px] text-slate-400">{item.context}</div>
                    </td>
                    <td className={`px-4 py-3 text-right font-bold font-mono ${item.type === "ENTREE" ? "text-emerald-400" : "text-rose-400"}`}>
                      <div className="flex flex-col items-end gap-1">
                        {item.type === "ENTREE" && <StatutBadge statut={item.status} />}
                        <span>
                          {item.type === "ENTREE" ? "+" : "-"}
                          {item.amount.toLocaleString()} FC
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{item.type === "ENTREE" ? `Reçu: ${item.receipt}` : item.context}</td>
                    <td className="px-4 py-3">
                      {item.type === "ENTREE" && (
                        <div className="print-hide flex justify-center gap-1">
                          <button type="button" onClick={() => onOpenReceipt({ isGroup: true, items: [item], ...item, totalAmount: item.amount })} className="rounded-md p-1.5 transition hover:bg-white/10">
                            <Eye size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-400">
                  Aucun mouvement trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
