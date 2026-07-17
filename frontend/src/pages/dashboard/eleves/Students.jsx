import { useEffect, useState, Fragment } from "react";
import {
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Mail,
  Phone,
  Loader2
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
      // Optionally set an error state to display to the user
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  const handleEdit = (student) => {
  console.log(student);

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

  // Filtering, searching, and sorting logic
  useEffect(() => {
    let currentFiltered = [...eleves];

    // Filter by status
    if (filterStatut !== "tous") {
      currentFiltered = currentFiltered.filter(e => e.statut?.toLowerCase() === filterStatut);
    }

    // Search by name
    if (searchTerm) {
      currentFiltered = currentFiltered.filter(e =>
        `${e.nom} ${e.post_nom} ${e.prenom}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "nom") {
      currentFiltered.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (sortBy === "date_naissance") {
      currentFiltered.sort((a, b) => new Date(b.date_naissance) - new Date(a.date_naissance));
    }

    setFilteredEleves(currentFiltered);
  }, [searchTerm, filterStatut, sortBy, eleves]);

  // Function to get status badge styling
  const getStatusBadge = (statut) => {
    const statusMap = {
      "accepté": {
        bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
        border: "border-green-500/50",
        text: "text-green-300",
        icon: CheckCircle,
        label: "Accepté"
      },
      "en attente": {
        bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
        border: "border-yellow-500/50",
        text: "text-yellow-300",
        icon: Clock,
        label: "En attente"
      },
      "rejeté": {
        bg: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
        border: "border-red-500/50",
        text: "text-red-300",
        icon: AlertCircle,
        label: "Rejeté"
      }
    };

    return statusMap[statut?.toLowerCase()] || statusMap["accepté"]; // Default to 'en attente'
  };

  // Function to format date
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  return (
    <>
      <div className="min-h-screen  p-6 md:p-8">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:border-white/30 transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Historique des Inscriptions
                </h1>
                <p className="text-indigo-200/70 mt-1">
                  Gestion complète des demandes et décisions d'inscription
                </p>
              </div>
            </div>

            {/* Contrôles de recherche et filtrage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recherche */}
              <div className="relative group md:col-span-2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30"
                />
              </div>

              {/* Filtrer par statut */}
              <div className="relative group">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value)}
                  className="w-full backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:bg-white/10 hover:border-white/30 appearance-none cursor-pointer"
                >
                  <option value="tous" className="bg-slate-900 text-white">Tous les statuts</option>
                  <option value="accepté" className="bg-slate-900 text-white">Accepté</option>
                  <option value="en attente" className="bg-slate-900 text-white">En attente</option>
                  <option value="rejeté" className="bg-slate-900 text-white">Rejeté</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-indigo-200/70 text-sm">Total élèves</p>
                <p className="text-3xl font-bold text-indigo-300 mt-1">{eleves.length}</p>
              </div>
              <div className="text-center">
                <p className="text-green-200/70 text-sm">Acceptés</p>
                <p className="text-3xl font-bold text-green-300 mt-1">
                  {eleves.filter(e => e.statut?.toLowerCase() === "accepté").length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-yellow-200/70 text-sm">En attente</p>
                <p className="text-3xl font-bold text-yellow-300 mt-1">
                  {eleves.filter(e => e.statut?.toLowerCase() === "en attente").length}
                </p>
              </div>
            </div>
          </div>

          {/* Tableau */}
          <div className="mt-6 w-full overflow-x-auto backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:border-white/30 transition-all duration-300">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/20 animate-spin mb-4">
                  <Clock className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-indigo-200">Chargement des élèves...</p>
              </div>
            ) : filteredEleves.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-indigo-400/50 mx-auto mb-4" />
                <p className="text-indigo-200">Aucun élève trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-white/10">
                      <th className="px-6 py-4 text-left font-semibold text-indigo-300">N°</th>
                      <th className="px-6 py-4 text-left font-semibold text-indigo-300">Nom complet</th>
                      <th className="px-6 py-4 text-left font-semibold text-indigo-300">Sexe</th>
                      <th className="px-6 py-4 text-left font-semibold text-indigo-300">Date naissance</th>
                      <th className="px-6 py-4 text-left font-semibold text-indigo-300">Classe</th>
                      <th className="px-6 py-4 text-left font-semibold text-indigo-300">Statut</th>
                      <th className="px-6 py-4 text-center font-semibold text-indigo-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEleves.map((e, index) => {
                      const statusInfo = getStatusBadge(e.statut);
                      const StatusIcon = statusInfo.icon;
                      const isExpanded = expandedRow === e.eleve_id;

                      return (
                        <Fragment key={e.eleve_id}>
                          <tr className="border-b border-white/5 hover:bg-white/5 transition-all duration-200 group">
                            <td className="px-6 py-4 text-indigo-300 font-semibold">{index + 1}</td>
                            <td className="px-6 py-4">
                              <p className="text-white font-medium">
                                {`${e.nom} ${e.post_nom} ${e.prenom}`}
                              </p>
                              <p className="text-indigo-200/50 text-xs mt-1">ID: {e.eleve_id}</p>
                            </td>
                            <td className="px-6 py-4 text-indigo-200">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                                {e.sexe || "-"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-indigo-200">
                              {formatDate(e.date_naissance)}
                            </td>
                            <td className="px-6 py-4 text-indigo-200">
                              {e.nom_classe || "-"}
                            </td>
                            <td className="px-6 py-4">
                              <div className={`
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-bold
                                border
                                ${statusInfo.bg}
                                ${statusInfo.border}
                                ${statusInfo.text}
                              `}>
                                <StatusIcon size={14} />
                                {statusInfo.label}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => setExpandedRow(isExpanded ? null : e.eleve_id)}
                                  className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-500/50 transition-all duration-200"
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

                          {/* Ligne d'expansion détails */}
                          {isExpanded && (
                            <tr className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border-b border-white/5 animate-in fade-in duration-200">
                              <td colSpan="7" className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {/* Informations personnelles */}
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-indigo-300 text-sm uppercase tracking-wide">Informations Personnelles</h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <p className="text-indigo-200/50">Lieu de naissance</p>
                                        <p className="text-white font-medium">{e.lieu_naissance || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-indigo-200/50">Nationalité</p>
                                        <p className="text-white font-medium">{e.nationalite || "-"}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Coordonnées */}
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-indigo-300 text-sm uppercase tracking-wide">Coordonnées</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-indigo-400" />
                                        <p className="text-white">{e.email || "-"}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-indigo-400" />
                                        <p className="text-white">{e.telephone || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-indigo-200/50 text-xs">WhatsApp</p>
                                        <p className="text-white font-medium">{e.numero_whatsapp || "-"}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Parents */}
                                  <div className="space-y-3">
                                    <h4 className="font-semibold text-indigo-300 text-sm uppercase tracking-wide">Parents</h4>
                                    <div className="space-y-2 text-sm">
                                      <div>
                                        <p className="text-indigo-200/50">Père</p>
                                        <p className="text-white font-medium">{e.nom_pere || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-indigo-200/50">Mère</p>
                                        <p className="text-white font-medium">{e.nom_mere || "-"}</p>
                                      </div>
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

            {/* Footer avec pagination */}
            <div className="px-6 py-4 border-t border-white/10 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 flex items-center justify-between">
              <p className="text-indigo-200 text-sm">
                Affichage de <span className="font-semibold">{filteredEleves.length}</span> élève{filteredEleves.length > 1 ? "s" : ""}
              </p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/40 transition-all duration-200">
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
