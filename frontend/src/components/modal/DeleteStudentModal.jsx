import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteStudentModal({
  open,
  student,
  onClose,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);

  if (!open || !student) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/dashboard/eleves/${student.eleve_id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression de l'élève.");
      }

      onDeleted();
      onClose(); // Close modal after successful deletion

    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-red-900/50 w-full max-w-lg border border-slate-700/50 transform scale-95 animate-in zoom-in-95 duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/70 px-6 py-4 bg-slate-800/60 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle
                size={24}
                className="text-red-400"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Supprimer un élève
              </h2>
              <p className="text-sm text-red-300 mt-1">
                Cette action est irréversible.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors duration-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 text-white">
          <p className="text-slate-300 leading-7 mb-6">
            Voulez-vous vraiment supprimer
            <span className="font-bold text-white ml-1">
              {student.nom} {student.post_nom} {student.prenom}
            </span>
            ?
          </p>
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-red-300 font-semibold mb-2">
              Les données suivantes seront supprimées :
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
              <li>L'élève</li>
              <li>Son inscription</li>
              <li>Les notifications associées</li>
              <li>Le parent (si aucun autre enfant n'est inscrit)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-700/70 px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500 transition-colors duration-200"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md shadow-red-500/30"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Trash2 size={18} />
            )}
            {loading ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
