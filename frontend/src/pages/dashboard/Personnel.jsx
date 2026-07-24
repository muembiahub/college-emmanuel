// pages/Personnel.jsx
import { useState, useEffect } from "react";
import { Users, UserPlus, Search, Shield, Briefcase, Mail, Phone, X, Edit3, Trash2 } from "lucide-react";

export default function Personnel() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // États de la modale et du formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Enseignant", // 'Enseignant' ou 'Administratif'
    department: "",
  });

  // URL de l'API (Adaptez selon votre endpoint backend)
  const API_URL = "/dashboard/personnel";

  // --- 1. READ (Charger les données) ---
  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Erreur lors du chargement du personnel");
      const data = await res.json();
      setPersonnel(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);

  // --- 2. CREATE / UPDATE (Soumission du formulaire) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      // Recharger la liste après modification
      fetchPersonnel();
      closeModal();
    } catch (err) {
      alert(err.message);
    }
  };

  // --- 3. DELETE (Supprimer) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet employé ?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setPersonnel(personnel.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Préparer l'édition
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      email: item.email,
      phone: item.phone || "",
      role: item.role,
      department: item.department || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: "", email: "", phone: "", role: "Enseignant", department: "" });
  };

  // --- CALCULS STATISTIQUES ---
  const totalCount = personnel.length;
  const teachersCount = personnel.filter((p) => p.role?.toLowerCase() === "enseignant").length;
  const adminCount = personnel.filter((p) => p.role?.toLowerCase() === "administratif").length;

  // Filtrage par recherche
  const filteredPersonnel = personnel.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestion du Personnel</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Vue d'ensemble et administration du personnel enseignant et administratif.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 text-sm"
        >
          <UserPlus size={18} />
          <span>Ajouter un employé</span>
        </button>
      </div>

      {/* STATS RAPIDES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Total Personnel</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{totalCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Enseignants</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{teachersCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Briefcase size={22} />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-slate-400 font-bold tracking-wider">Administratifs</p>
            <h3 className="text-2xl font-extrabold text-purple-400 mt-1">{adminCount}</h3>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Shield size={22} />
          </div>
        </div>
      </div>

      {/* SECTION TABLEAU / RECHERCHE */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou fonction..."
              className="w-full bg-slate-950/50 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">Chargement des données...</div>
        ) : filteredPersonnel.length === 0 ? (
          /* CONTENEUR VIDE */
          <div className="border border-dashed border-slate-700/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center bg-slate-950/20">
            <div className="p-4 rounded-2xl bg-slate-800/50 text-slate-400 mb-3">
              <Users size={32} />
            </div>
            <h3 className="text-base font-semibold text-white">Aucun membre du personnel enregistré</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Commencez par ajouter des enseignants ou des collaborateurs pour les voir apparaître dans cette liste.
            </p>
          </div>
        ) : (
          /* GRILLE DE LISTE */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPersonnel.map((person) => (
              <div
                key={person.id}
                className="bg-slate-950/40 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{person.name}</h4>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mt-1 ${
                        person.role?.toLowerCase() === "enseignant"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                      }`}
                    >
                      {person.role} {person.department && `• ${person.department}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(person)}
                      className="p-2 rounded-xl bg-slate-800/60 text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="p-2 rounded-xl bg-slate-800/60 text-red-400 hover:bg-slate-800 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  {person.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-indigo-400" />
                      <span>{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-indigo-400" />
                      <span>{person.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALE DE FORMULAIRE (CRÉATION / ÉDITION) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Modifier l'employé" : "Ajouter un employé"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nom complet</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Jean Dupont"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Rôle</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Enseignant">Enseignant</option>
                    <option value="Administratif">Administratif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Département / Matière</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Ex: Mathématiques"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jean.dupont@email.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+243..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  {editingId ? "Mettre à jour" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}