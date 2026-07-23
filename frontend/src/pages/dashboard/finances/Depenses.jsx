import { useState, useEffect } from "react";
import { 
  Banknote, 
  Plus, 
  Search, 
  Filter, 
  TrendingDown, 
  Calendar,
  Trash2,
  Pencil,
  FileText,
  Loader2,
  Info
} from "lucide-react";

// Imports des Modales
import DepenseFormModal from "../../../components/modal/DepenseFormModal";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";

export default function Depenses() {
  const [depenses, setDepenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("toutes");

  // ÉTATS DES MODALES
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [depenseToDelete, setDepenseToDelete] = useState(null);

  const initialFormState = {
    motif: "",
    categorie: "Fournitures",
    montant: "",
    date_depense: new Date().toISOString().split("T")[0],
    description: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  /* 1. HELPER & FETCH */
  const parseJSON = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    const text = await response.text();
    throw new Error(`Réponse non-JSON reçue (${response.status}): ${text.substring(0, 50)}...`);
  };

  const chargerDepenses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/finance/depenses`, { credentials: "include" });
      if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);
      
      const data = await parseJSON(response);
      setDepenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur API GET :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDepenses();
  }, []);

  /* 2. HANDLERS MODALES */
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (depense) => {
    setEditingId(depense.depense_id);
    setFormData({
      motif: depense.motif || "",
      categorie: depense.categorie || "Fournitures",
      montant: depense.montant || "",
      date_depense: depense.date_depense ? depense.date_depense.split("T")[0] : new Date().toISOString().split("T")[0],
      description: depense.description || "",
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (depense) => {
    setDepenseToDelete(depense);
    setIsDeleteModalOpen(true);
  };

  /* 3. SOUMISSION DU FORMULAIRE */
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.motif || !formData.montant) return;

    const isEditing = Boolean(editingId);
    const url = isEditing 
      ? `/finance/depenses/${editingId}`
      : `/finance/depenses`;
    
    try {
      setSubmitting(true);
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Échec de l'enregistrement (${response.status})`);

      const resData = await parseJSON(response);

      setDepenses((prev) =>
        isEditing
          ? prev.map((item) =>
              item.depense_id === editingId
                ? { ...item, ...formData, ...(typeof resData === "object" ? resData : {}) }
                : item
            )
          : [resData, ...prev]
      );

      setIsFormModalOpen(false);
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
      chargerDepenses();
    } finally {
      setSubmitting(false);
    }
  };

  /* 4. SUPPRESSION */
  const handleConfirmDelete = async () => {
    if (!depenseToDelete) return;
    const id = depenseToDelete.depense_id;

    try {
      setSubmitting(true);
      const response = await fetch(`/finance/depenses/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`Erreur de suppression (${response.status})`);

      setDepenses((prev) => prev.filter((d) => d.depense_id !== id));
      setIsDeleteModalOpen(false);
      setDepenseToDelete(null);
    } catch (error) {
      console.error("Erreur de suppression :", error);
    } finally {
      setSubmitting(false);
    }
  };

  /* 5. FILTRES ET CALCULS */
  const totalDepenses = depenses.reduce((acc, d) => acc + Number(d.montant || 0), 0);
  const depensesFiltrees = depenses.filter((d) => {
    const motif = d.motif ? d.motif.toLowerCase() : "";
    const description = d.description ? d.description.toLowerCase() : "";
    const correspondRecherche = motif.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
    const correspondCategorie = categorieFiltre === "toutes" || d.categorie === categorieFiltre;
    return correspondRecherche && correspondCategorie;
  });

  // Helper pour les badges de catégories en relief
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "Fournitures":
        return "bg-amber-50 text-amber-700 border-amber-200/60 shadow-xs";
      case "Maintenance":
        return "bg-blue-50 text-blue-700 border-blue-200/60 shadow-xs";
      case "Factures":
        return "bg-purple-50 text-purple-700 border-purple-200/60 shadow-xs";
      case "Salaires":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-xs";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200/60 shadow-xs";
    }
  };

  return (
    <div className="space-y-6 p-3 md:p-8 bg-slate-50/50 min-h-screen">
      {/* HEADER (Effet de profondeur élevé avec ombre portée douce) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-white/80 backdrop-blur-md p-6 shadow-xl shadow-slate-200/50 border border-white/80 transition-all">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-rose-600 p-3.5 text-white shadow-lg shadow-rose-500/30">
            <Banknote size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dépenses</h1>
            <p className="text-sm font-medium text-slate-500">Suivi et enregistrement des sorties de caisse en Francs Congolais.</p>
          </div>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          <span>Nouvelle Dépense</span>
        </button>
      </div>

      {/* CARTS DES STATS (Profondeur avec hover flottant) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/40 border border-slate-100/80 transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Total des dépenses</span>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
              <TrendingDown size={18} />
            </div>
          </div>
          <p className="mt-3 text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalDepenses.toLocaleString("fr-FR")} <span className="text-xs font-semibold text-slate-400">FC</span>
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/40 border border-slate-100/80 transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Nombre de transactions</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <FileText size={18} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">{depenses.length}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/40 border border-slate-100/80 transition-all hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Période</span>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
              <Calendar size={18} />
            </div>
          </div>
          <p className="mt-3 text-xl font-bold text-slate-800">Mois en cours</p>
        </div>
      </div>

      {/* BARRE DE FILTRES */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3.5 rounded-2xl shadow-md shadow-slate-200/30 border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher par motif ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl bg-slate-50 border border-slate-200/80 pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 transition focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400 ml-2" />
          <select
            value={categorieFiltre}
            onChange={(e) => setCategorieFiltre(e.target.value)}
            className="rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 transition focus:bg-white focus:border-rose-500 focus:outline-none"
          >
            <option value="toutes">Toutes les catégories</option>
            <option value="Fournitures">Fournitures</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Factures">Factures</option>
            <option value="Salaires">Salaires</option>
            <option value="Autres">Autres</option>
          </select>
        </div>
      </div>

      {/* TABLEAU AVEC COLONNE DESCRIPTION DÉDIÉE ET EFFET DE PROFONDEUR */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Motif</th>
                <th className="px-6 py-4 min-w-[220px]">Description</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-rose-500" size={24} />
                      <span className="text-sm font-medium">Chargement des dépenses...</span>
                    </div>
                  </td>
                </tr>
              ) : depensesFiltrees.length > 0 ? (
                depensesFiltrees.map((d) => (
                  <tr key={d.depense_id} className="hover:bg-slate-50/80 transition-colors">
                    {/* MOTIF */}
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{d.motif}</span>
                    </td>

                    {/* DESCRIPTION (Dans sa propre colonne lisible) */}
                    <td className="px-6 py-4">
                      {d.description ? (
                        <p className="text-xs text-slate-600 whitespace-pre-line break-words max-w-xs bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                          {d.description}
                        </p>
                      ) : (
                        <span className="text-xs text-slate-300 italic flex items-center gap-1">
                          <Info size={12} /> Aucune description
                        </span>
                      )}
                    </td>

                    {/* CATÉGORIE */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold border ${getCategoryBadgeClass(d.categorie)}`}>
                        {d.categorie}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                      {d.date_depense ? new Date(d.date_depense).toLocaleDateString("fr-FR") : "-"}
                    </td>

                    {/* MONTANT */}
                    <td className="px-6 py-4 font-bold text-rose-600 whitespace-nowrap">
                      -{Number(d.montant).toLocaleString("fr-FR")} FC
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(d)}
                          className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition shadow-2xs hover:shadow-xs"
                          title="Modifier"
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          onClick={() => handleOpenDeleteModal(d)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition shadow-2xs hover:shadow-xs"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    Aucune dépense trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPOSANTS MODALES */}
      <DepenseFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleSubmitForm}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        submitting={submitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDepenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        depense={depenseToDelete}
        submitting={submitting}
      />
    </div>
  );
}