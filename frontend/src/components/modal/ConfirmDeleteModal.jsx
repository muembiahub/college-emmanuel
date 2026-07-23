import { AlertTriangle, Loader2 } from "lucide-react";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  depense,
  submitting,
}) {
  if (!isOpen || !depense) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-lg font-semibold text-slate-800">Supprimer la dépense ?</h3>
        <p className="mt-2 text-xs text-slate-500">
          Êtes-vous sûr de vouloir supprimer la dépense{" "}
          <strong className="text-slate-700">"{depense.motif}"</strong> d'un montant de{" "}
          <span className="text-rose-600 font-semibold">${depense.montant}</span> ? Cette action est irréversible.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
}