import { X, Loader2 } from "lucide-react";

export default function DepenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingId,
  submitting,
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl antialiased"
        onClick={(e) => e.stopPropagation()}
      >
        {/* EN-TÊTE */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            {editingId ? "Modifier la dépense" : "Ajouter une dépense"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Motif / Libellé *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Achat rame de papier"
              value={formData?.motif || ""}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Montant ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
                value={formData?.montant || ""}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catégorie *
              </label>
              <select
                value={formData?.categorie || "Fournitures"}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition bg-white"
              >
                <option value="Fournitures">Fournitures</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Factures">Factures</option>
                <option value="Salaires">Salaires</option>
                <option value="Autres">Autres</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={formData?.date_depense || ""}
              onChange={(e) => setFormData({ ...formData, date_depense: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description / Notes (Optionnel)
            </label>
            <textarea
              rows="3"
              placeholder="Détails supplémentaires..."
              value={formData?.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition resize-none"
            />
          </div>

          {/* BOUTONS D'ACTION */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              <span>{editingId ? "Mettre à jour" : "Enregistrer"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}