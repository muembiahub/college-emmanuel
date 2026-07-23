import { useEffect, useState, Fragment } from "react";
import {
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Users,
  Mail,
  Phone
} from "lucide-react";
import toast from "react-hot-toast";
import ActionMenu from "../../../components/action/ActionMenu";
import EditStudentModal from "../../../components/modal/EditStudentModal";
import DeleteStudentModal from "../../../components/modal/DeleteStudentModal";

export default function ListEleves() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [eleves, setEleves] = useState([]);
  const [filteredEleves, setFilteredEleves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatut, setFilterStatut] = useState("tous");
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortBy, setSortBy] = useState("nom");

  const fetchEleves = async () => {
    try {
      setLoading(true);
      const res = await fetch("/dashboard/eleves");
      const data = await res.json();
      setEleves(data);
      setFilteredEleves(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error("Erreur lors du chargement des élèves.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setEditOpen(true);
  };

  const handleSave = async (student) => {
    try {
      const response = await fetch(
        `/dashboard/eleves/${student.eleve_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Erreur lors de la mise à jour de l'élève."
        );
      }

      toast.success(
        data.message || "Élève modifié avec succès."
      );

      setEditOpen(false);
      setSelectedStudent(null);
      await fetchEleves();

    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "Une erreur est survenue."
      );
    }
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  // Filtrage, recherche et tri
  useEffect(() => {
    let currentFiltered = [...eleves];

    if (filterStatut !== "tous") {
      currentFiltered = currentFiltered.filter(e => e.statut?.toLowerCase() === filterStatut);
    }

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(e =>
        `${e.nom} ${e.post_nom} ${e.prenom}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())

      );
    }

    if (sortBy === "nom") {
      currentFiltered.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (sortBy === "date_naissance") {
      currentFiltered.sort((a, b) => new Date(b.date_naissance) - new Date(a.date_naissance));
    }

    setFilteredEleves(currentFiltered);
  }, [searchTerm, filterStatut, sortBy, eleves]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <>
      {/* Container principal avec prise en compte du fond d'écran / layout global */}
      <div className="relative min-h-screen p-4 md:p-8 bg-transparent text-slate-100">
        
        <div className="relative max-w-7xl mx-auto space-y-6">
          
          {/* Header avec effet Glassmorphism soutenu */}
          <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                  <Users className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white">
                    Historique des Inscriptions
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Gestion complète des demandes et décisions d'inscription
                  </p>
                </div>
              </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative group md:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/60">
              <div className="text-center">
                <p className="text-slate-400 text-xs uppercase tracking-wider">Total élèves</p>
                <p className="text-2xl font-bold text-white mt-1">{eleves.length}</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400 text-xs uppercase tracking-wider">Acceptés</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {eleves.filter(e => e.statut?.toLowerCase() === "accepté").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-amber-400 text-xs uppercase tracking-wider">En attente</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {eleves.filter(e => e.statut?.toLowerCase() === "en attente").length}
                </p>
              </div>
            </div>
          </div>

          {/* Tableau des données */}
          <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 animate-spin mb-4">
                  <Clock className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-slate-400">Chargement des élèves...</p>
              </div>
            ) : filteredEleves.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Aucun élève trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400">
                      <th className="px-6 py-4 text-left font-semibold">N°</th>
                      <th className="px-6 py-4 text-left font-semibold">Nom complet</th>
                      <th className="px-6 py-4 text-left font-semibold">Sexe</th>
                      <th className="px-6 py-4 text-left font-semibold">Date admission</th>
                      <th className="px-6 py-4 text-left font-semibold">Classe</th>
                      <th className="px-6 py-4 text-left font-semibold">Statut</th>
                      <th className="px-6 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredEleves.map((e, index) => {
                      const isExpanded = expandedRow === e.eleve_id;

                      return (
                        <Fragment key={e.eleve_id}>
                          <tr className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-6 py-4 text-slate-400 font-medium">{index + 1}</td>
                            <td className="px-6 py-4">
                              <p className="text-white font-semibold">
                                {`${e.nom} ${e.post_nom} ${e.prenom}`}
                              </p>
                              <p className="text-slate-500 text-xs mt-0.5">ID: {e.eleve_id}</p>
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              <span className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800">
                                {e.sexe || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              {formatDate(e.date_admission)}
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              {e.nom_classe || "-"}
                            </td>
                            <td className="px-6 py-4 text-slate-300">
                              {/* Affichage direct de la valeur brute du statut provenant de l'API */}
                              <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-200">
                                {e.statut_eleve || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setExpandedRow(isExpanded ? null : e.eleve_id)}
                                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                  title="Voir détails"
                                >
                                  <Eye size={16} />
                                </button>
                                <ActionMenu
                                  student={e}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                />
                              </div>
                            </td>
                          </tr>

                          {/* Ligne d'expansion des détails */}
                          {isExpanded && (
                            <tr className="bg-slate-950/60 border-b border-slate-800">
                              <td colSpan="7" className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-indigo-400 text-xs uppercase tracking-wider">Informations Personnelles</h4>
                                    <div className="text-sm space-y-1 text-slate-300">
                                      <p><span className="text-slate-500">Lieu de naissance :</span> {e.lieu_naissance || "-"}</p>
                                      <p><span className="text-slate-500">Nationalité :</span> {e.nationalite || "-"}</p>
                                      <p><span className="text-slate-500">Date de naissance  :</span> {e.date_naissance || "-"}</p>

                                    </div>
                                  </div>

                                <div className="space-y-2">
                                <h4 className="font-semibold text-indigo-400 text-xs uppercase tracking-wider">Coordonnées</h4>
                                <div className="text-sm space-y-1 text-slate-300">
                                  {/* Email */}
                                  <p className="flex items-center gap-2">
                                    <Mail size={14} className="text-slate-500 shrink-0" />
                                    {e.eleve_email ? (
                                      <a 
                                        href={`mailto:${e.eleve_email}`} 
                                        className="hover:text-indigo-400 hover:underline transition-colors"
                                      >
                                        {e.eleve_email}
                                      </a>
                                    ) : (
                                      "-"
                                    )}
                                  </p>

                                  {/* Téléphone */}
                                  <p className="flex items-center gap-2">
                                    <Phone size={14} className="text-slate-500 shrink-0" />
                                    {e.telephone ? (
                                      <a 
                                        href={`tel:${e.telephone}`} 
                                        className="hover:text-indigo-400 hover:underline transition-colors"
                                      >
                                        {e.telephone}
                                      </a>
                                    ) : (
                                      "-"
                                    )}
                                  </p>

                                  {/* WhatsApp */}
                                  <p>
                                    <span className="text-slate-500">WhatsApp :</span>{" "}
                                    {e.numero_whatsapp ? (
                                      <a 
                                        href={`https://wa.me/${e.numero_whatsapp.replace(/[^0-9]/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="hover:text-indigo-400 hover:underline transition-colors"
                                      >
                                        {e.numero_whatsapp}
                                      </a>
                                    ) : (
                                      "-"
                                    )}
                                  </p>

                                  {/* Adresse */}
                                  <p>
                                    <span className="text-slate-500">Adresse :</span> {e.eleve_adresse || "-"}
                                  </p>
                                </div>
                              </div>

                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-indigo-400 text-xs uppercase tracking-wider">Parents</h4>
                                    <div className="text-sm space-y-1 text-slate-300">
                                      <p><span className="text-slate-500">Père :</span> {e.nom_pere || "-"}</p>
                                      <p><span className="text-slate-500">Mère :</span> {e.nom_mere || "-"}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pied de page du tableau */}
            <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Affichage de <span className="font-semibold text-white">{filteredEleves.length}</span> élève{filteredEleves.length > 1 ? "s" : ""}
              </p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium">
                <Download size={16} />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditStudentModal
        open={editOpen}
        student={selectedStudent}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
      
      <DeleteStudentModal
        open={deleteOpen}
        student={selectedStudent}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => {
          setDeleteOpen(false);
          fetchEleves();
        }}
      />
    </>
  );
}