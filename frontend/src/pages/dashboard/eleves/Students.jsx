import { useEffect, useState, Fragment } from "react";
import {
  Clock,
  Search,
  Download,
  Eye,
  Users,
  Mail,
  Phone,
  User,
  GraduationCap,
  CalendarDays,
  School,
  BookOpen,
  MapPin,
  Briefcase,
  MessageCircle,
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

  // ==========================================================
  // CHARGER LES ÉLÈVES
  // ==========================================================

  const fetchEleves = async () => {
    try {
      setLoading(true);

      const res = await fetch("/dashboard/eleves");

      if (!res.ok) {
        throw new Error("Erreur lors du chargement des élèves.");
      }

      const data = await res.json();

      setEleves(data);
      setFilteredEleves(data);
    } catch (err) {
      console.error("Error fetching students:", err);

      toast.error(
        "Erreur lors du chargement des élèves."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEleves();
  }, []);

  // ==========================================================
  // MODIFIER
  // ==========================================================

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
        data.message ||
          "Élève modifié avec succès."
      );

      setEditOpen(false);
      setSelectedStudent(null);

      await fetchEleves();
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "Une erreur est survenue."
      );
    }
  };

  // ==========================================================
  // SUPPRIMER
  // ==========================================================

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setDeleteOpen(true);
  };

  // ==========================================================
  // RECHERCHE / FILTRE / TRI
  // ==========================================================

  useEffect(() => {
    let currentFiltered = [...eleves];

    // Filtre statut
    if (filterStatut !== "tous") {
      currentFiltered =
        currentFiltered.filter(
          (e) =>
            e.statut_eleve?.toLowerCase() ===
            filterStatut.toLowerCase()
        );
    }

    // Recherche
    if (searchTerm.trim()) {
      const search =
        searchTerm.toLowerCase().trim();

      currentFiltered =
        currentFiltered.filter((e) => {
          const contenu = `
            ${e.numero_inscription || ""}
            ${e.nom || ""}
            ${e.post_nom || ""}
            ${e.prenom || ""}
            ${e.telephone || ""}
            ${e.eleve_email || ""}
            ${e.nom_pere || ""}
            ${e.nom_mere || ""}
            ${e.nom_classe || ""}
            ${e.nom_section || ""}
            ${e.nom_option || ""}
            ${e.nom_parallele || ""}
          `.toLowerCase();

          return contenu.includes(search);
        });
    }

    // Tri
    if (sortBy === "nom") {
      currentFiltered.sort((a, b) =>
        (a.nom || "").localeCompare(
          b.nom || ""
        )
      );
    }

    if (sortBy === "date_naissance") {
      currentFiltered.sort(
        (a, b) =>
          new Date(b.date_naissance) -
          new Date(a.date_naissance)
      );
    }

    if (sortBy === "date_admission") {
      currentFiltered.sort(
        (a, b) =>
          new Date(b.date_admission) -
          new Date(a.date_admission)
      );
    }

    setFilteredEleves(currentFiltered);
  }, [
    searchTerm,
    filterStatut,
    sortBy,
    eleves,
  ]);

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "fr-FR"
    );
  };

  // ==========================================================
  // FORMAT DATE + HEURE
  // ==========================================================

  const formatDateTime = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleString(
      "fr-FR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  // ==========================================================
  // VALEUR
  // ==========================================================

  const valeur = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return value;
  };

  // ==========================================================
  // STATUT
  // ==========================================================

  const getStatutClass = (statut) => {
    const value =
      statut?.toLowerCase() || "";

    if (
      value === "active" ||
      value === "accepte" ||
      value === "accepté"
    ) {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }

    if (
      value === "en attente" ||
      value === "attente"
    ) {
      return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    }

    if (
      value === "annulee" ||
      value === "annulée"
    ) {
      return "bg-rose-500/10 border-rose-500/20 text-rose-400";
    }

    return "bg-slate-900 border-slate-800 text-slate-300";
  };



  // ==========================================================
// EXPORTER LES ÉLÈVES EN CSV
// ==========================================================

const handleExport = () => {
  if (!filteredEleves.length) {
    toast.error("Aucun élève à exporter.");
    return;
  }

  const headers = [
    "Matricule",
    "Nom",
    "Post-nom",
    "Prénom",
    "Sexe",
    "Date de naissance",
    "Lieu de naissance",
    "Nationalité",
    "Téléphone",
    "Email",
    "Adresse",
    "Statut élève",
    "Date admission",

    // Parent
    "Nom père",
    "Téléphone père",
    "Fonction père",
    "Nom mère",
    "Téléphone mère",
    "Fonction mère",
    "WhatsApp parent",
    "Email parent",
    "Adresse parent",
    "Profession parent",

    // Inscription
    "Date inscription",
    "Statut inscription",
    "Observations",

    // Année scolaire
    "Année scolaire",
    "Date début",
    "Date fin",
    "Année active",

    // Scolarité
    "Section",
    "Option",
    "Code option",
    "Classe",
    "Parallèle",
  ];

  const rows = filteredEleves.map((e) => [
    e.numero_inscription,
    e.nom,
    e.post_nom,
    e.prenom,
    e.sexe,
    e.date_naissance,
    e.lieu_naissance,
    e.nationalite,
    e.telephone,
    e.eleve_email,
    e.eleve_adresse,
    e.statut_eleve,
    e.date_admission,

    // Parent
    e.nom_pere,
    e.numero_telephone_du_pere,
    e.fonction_du_pere,
    e.nom_mere,
    e.numero_telephone_de_la_mere,
    e.fonction_de_la_mere,
    e.numero_whatsapp,
    e.parent_email,
    e.parent_adresse,
    e.profession,

    // Inscription
    e.date_inscription,
    e.statut_inscription,
    e.observations,

    // Année scolaire
    e.annee_scolaire,
    e.date_debut,
    e.date_fin,
    e.annee_active ? "Oui" : "Non",

    // Scolarité
    e.nom_section,
    e.nom_option,
    e.option_code,
    e.nom_classe,
    e.nom_parallele,
  ]);

  // Échapper correctement les valeurs CSV
  const escapeCSV = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return `"${String(value)
      .replace(/"/g, '""')
      .replace(/\r?\n/g, " ")}"`;
  };

  const csvContent = [
    headers.map(escapeCSV).join(";"),
    ...rows.map((row) =>
      row.map(escapeCSV).join(";")
    ),
  ].join("\r\n");

  // BOM UTF-8 pour que Excel reconnaisse
  // correctement les accents
  const BOM = "\uFEFF";

  const blob = new Blob(
    [BOM + csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  const date = new Date()
    .toISOString()
    .slice(0, 10);

  link.download =
    `eleves_${date}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  toast.success(
    `${filteredEleves.length} élève(s) exporté(s) avec succès.`
  );
};

  // ==========================================================
  // AFFICHAGE
  // ==========================================================

  return (
    <>
      <div className="relative min-h-screen p-4 md:p-8 bg-transparent text-slate-100">

        <div className="relative max-w-7xl mx-auto space-y-6">

          {/* ==================================================
              HEADER
          ================================================== */}

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

            {/* ==================================================
                RECHERCHE
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="relative group md:col-span-2">

                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                />

                <input
                  type="text"
                  placeholder="Rechercher par nom ou matricule..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />

              </div>

            </div>

            {/* ==================================================
                STATISTIQUES
            ================================================== */}

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/60">

              <div className="text-center">

                <p className="text-slate-400 text-xs uppercase tracking-wider">
                  Total élèves
                </p>

                <p className="text-2xl font-bold text-white mt-1">
                  {eleves.length}
                </p>

              </div>

              <div className="text-center">

                <p className="text-emerald-400 text-xs uppercase tracking-wider">
                  Actifs
                </p>

                <p className="text-2xl font-bold text-emerald-400 mt-1">

                  {
                    eleves.filter(
                      (e) =>
                        e.statut_eleve?.toLowerCase() ===
                        "active"
                    ).length
                  }

                </p>

              </div>

              <div className="text-center">

                <p className="text-amber-400 text-xs uppercase tracking-wider">
                  En attente
                </p>

                <p className="text-2xl font-bold text-amber-400 mt-1">

                  {
                    eleves.filter(
                      (e) =>
                        e.statut_inscription?.toLowerCase() ===
                        "en attente"
                    ).length
                  }

                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              TABLEAU
          ================================================== */}

          <div className="backdrop-blur-xl bg-slate-950/40 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">

            {loading ? (

              <div className="p-12 text-center">

                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 animate-spin mb-4">

                  <Clock className="w-6 h-6 text-indigo-400" />

                </div>

                <p className="text-slate-400">
                  Chargement des élèves...
                </p>

              </div>

            ) : filteredEleves.length === 0 ? (

              <div className="p-12 text-center">

                <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />

                <p className="text-slate-400">
                  Aucun élève trouvé
                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  {/* ==================================================
                      EN-TÊTE
                  ================================================== */}

                  <thead>

                    <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400">

                      <th className="px-6 py-4 text-left font-semibold">
                        Matricule
                      </th>

                      <th className="px-6 py-4 text-left font-semibold">
                        Nom complet
                      </th>

                      <th className="px-6 py-4 text-left font-semibold">
                        Sexe
                      </th>

                      <th className="px-6 py-4 text-left font-semibold">
                        Date admission
                      </th>

                      <th className="px-6 py-4 text-left font-semibold">
                        Classe
                      </th>

                      <th className="px-6 py-4 text-left font-semibold">
                        Statut
                      </th>

                      <th className="px-6 py-4 text-center font-semibold">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  {/* ==================================================
                      CORPS
                  ================================================== */}

                  <tbody className="divide-y divide-slate-800/40">

                    {filteredEleves.map((e) => {

                      const isExpanded =
                        expandedRow === e.eleve_id;

                      return (

                        <Fragment
                          key={e.eleve_id}
                        >

                          {/* ==================================================
                              LIGNE PRINCIPALE
                          ================================================== */}

                          <tr className="hover:bg-slate-900/40 transition-colors">

                            {/* MATRICULE */}

                            <td className="px-6 py-4">

                              <span className="inline-flex px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">

                                {valeur(
                                  e.numero_inscription
                                )}

                              </span>

                            </td>

                            {/* NOM */}

                            <td className="px-6 py-4">

                              <p className="text-white font-semibold">

                                {`${e.nom || ""} ${
                                  e.post_nom || ""
                                } ${
                                  e.prenom || ""
                                }`.trim()}

                              </p>

                            </td>

                            {/* SEXE */}

                            <td className="px-6 py-4 text-slate-300">

                              <span className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 border border-slate-800">

                                {valeur(e.sexe)}

                              </span>

                            </td>

                            {/* DATE ADMISSION */}

                            <td className="px-6 py-4 text-slate-300">

                              {formatDate(
                                e.date_admission
                              )}

                            </td>

                            {/* CLASSE */}

                            <td className="px-6 py-4 text-slate-300">

                              {valeur(
                                e.nom_classe
                              )}

                            </td>

                            {/* STATUT */}

                            <td className="px-6 py-4">

                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatutClass(
                                  e.statut_eleve
                                )}`}
                              >
                                {valeur(
                                  e.statut_eleve
                                )}
                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td className="px-6 py-4 text-center">

                              <div className="flex items-center justify-center gap-2">

                                <button
                                  onClick={() =>
                                    setExpandedRow(
                                      isExpanded
                                        ? null
                                        : e.eleve_id
                                    )
                                  }
                                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                  title="Voir tous les détails"
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

                          {/* ==================================================
                              TOUS LES DÉTAILS
                          ================================================== */}

                          {isExpanded && (

                            <tr className="bg-slate-950/60 border-b border-slate-800">

                              <td
                                colSpan="7"
                                className="px-6 py-6"
                              >

                                <div className="space-y-8">

                                  {/* ==================================================
                                      1. INFORMATIONS DE L'ÉLÈVE
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <User
                                        size={18}
                                        className="text-indigo-400"
                                      />

                                      <h4 className="font-semibold text-indigo-400 text-xs uppercase tracking-wider">
                                        Informations de l'élève
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                      <DetailItem
                                        label="Matricule"
                                        value={
                                          e.numero_inscription
                                        }
                                      />

                                      <DetailItem
                                        label="Nom"
                                        value={e.nom}
                                      />

                                      <DetailItem
                                        label="Post-nom"
                                        value={
                                          e.post_nom
                                        }
                                      />

                                      <DetailItem
                                        label="Prénom"
                                        value={
                                          e.prenom
                                        }
                                      />

                                      <DetailItem
                                        label="Sexe"
                                        value={e.sexe}
                                      />

                                      <DetailItem
                                        label="Date de naissance"
                                        value={formatDate(
                                          e.date_naissance
                                        )}
                                      />

                                      <DetailItem
                                        label="Lieu de naissance"
                                        value={
                                          e.lieu_naissance
                                        }
                                      />

                                      <DetailItem
                                        label="Nationalité"
                                        value={
                                          e.nationalite
                                        }
                                      />

                                      <DetailItem
                                        label="Téléphone"
                                        value={
                                          e.telephone
                                        }
                                      />

                                      <DetailItem
                                        label="Email"
                                        value={
                                          e.eleve_email || "Non Fourni"
                                        }
                                      />

                                      <DetailItem
                                        label="Adresse"
                                        value={
                                          e.eleve_adresse || "Non Fourni"
                                        }
                                      />

                                      <DetailItem
                                        label="Statut élève"
                                        value={
                                          e.statut_eleve
                                        }
                                      />

                                      <DetailItem
                                        label="Date admission"
                                        value={formatDate(
                                          e.date_admission
                                        )}
                                      />

                                      <DetailItem
                                        label="Créé le"
                                        value={formatDateTime(
                                          e.eleve_created_at
                                        )}
                                      />

                                      <DetailItem
                                        label="Modifié le"
                                        value={formatDateTime(
                                          e.eleve_updated_at
                                        )}
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      2. PÈRE
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <User
                                        size={18}
                                        className="text-blue-400"
                                      />

                                      <h4 className="font-semibold text-blue-400 text-xs uppercase tracking-wider">
                                        Informations du père
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                      <DetailItem
                                        label="Nom du père"
                                        value={
                                          e.nom_pere
                                        }
                                      />

                                      <DetailItem
                                        label="Téléphone du père"
                                        value={
                                          e.numero_telephone_du_pere
                                        }
                                      />

                                      <DetailItem
                                        label="Fonction"
                                        value={
                                          e.fonction_du_pere
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      3. MÈRE
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <User
                                        size={18}
                                        className="text-pink-400"
                                      />

                                      <h4 className="font-semibold text-pink-400 text-xs uppercase tracking-wider">
                                        Informations de la mère
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                      <DetailItem
                                        label="Nom de la mère"
                                        value={
                                          e.nom_mere
                                        }
                                      />

                                      <DetailItem
                                        label="Téléphone de la mère"
                                        value={
                                          e.numero_telephone_de_la_mere
                                        }
                                      />

                                      <DetailItem
                                        label="Fonction"
                                        value={
                                          e.fonction_de_la_mere
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      4. AUTRES INFORMATIONS PARENT
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <Users
                                        size={18}
                                        className="text-emerald-400"
                                      />

                                      <h4 className="font-semibold text-emerald-400 text-xs uppercase tracking-wider">
                                        Informations complémentaires du parent
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                      <DetailItem
                                        label="WhatsApp"
                                        value={
                                          e.numero_whatsapp
                                        }
                                      />

                                      <DetailItem
                                        label="Email parent"
                                        value={
                                          e.parent_email || "Non renseigné"
                                        }
                                      />

                                      <DetailItem
                                        label="Adresse parent"
                                        value={
                                          e.parent_adresse || "Non renseigné"
                                        }
                                      />

                                      <DetailItem
                                        label="Profession"
                                        value={
                                          e.profession || "Non renseigné"
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      5. INSCRIPTION
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <FileTextIcon />

                                      <h4 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">
                                        Informations d'inscription
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                      <DetailItem
                                        label="Matricule"
                                        value={
                                          e.numero_inscription
                                        }
                                      />

                                      <DetailItem
                                        label="Date d'inscription"
                                        value={formatDate(
                                          e.date_inscription
                                        )}
                                      />

                                      <DetailItem
                                        label="Statut inscription"
                                        value={
                                          e.statut_inscription
                                        }
                                      />

                                      <DetailItem
                                        label="Observations"
                                        value={
                                          e.observations || "Non renseigné"
                                        }
                                      />

                                      <DetailItem
                                        label="Inscription créée"
                                        value={formatDateTime(
                                          e.inscription_created_at
                                        )}
                                      />

                                      <DetailItem
                                        label="Inscription modifiée"
                                        value={formatDateTime(
                                          e.inscription_updated_at
                                        )}
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      6. ANNÉE SCOLAIRE
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <CalendarDays
                                        size={18}
                                        className="text-purple-400"
                                      />

                                      <h4 className="font-semibold text-purple-400 text-xs uppercase tracking-wider">
                                        Année scolaire
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                      <DetailItem
                                        label="Année scolaire"
                                        value={
                                          e.annee_scolaire
                                        }
                                      />

                                      <DetailItem
                                        label="Date début"
                                        value={formatDate(
                                          e.date_debut
                                        )}
                                      />

                                      <DetailItem
                                        label="Date fin"
                                        value={formatDate(
                                          e.date_fin
                                        )}
                                      />

                                      <DetailItem
                                        label="Année active"
                                        value={
                                          e.annee_active
                                            ? "Oui"
                                            : "Non"
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      7. SECTION / OPTION
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <School
                                        size={18}
                                        className="text-cyan-400"
                                      />

                                      <h4 className="font-semibold text-cyan-400 text-xs uppercase tracking-wider">
                                        Orientation scolaire
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                      <DetailItem
                                        label="Section"
                                        value={
                                          e.nom_section
                                        }
                                      />

                                      <DetailItem
                                        label="Option"
                                        value={
                                          e.nom_option
                                        }
                                      />

                                      <DetailItem
                                        label="Code option"
                                        value={
                                          e.option_code
                                        }
                                      />

                                      <DetailItem
                                        label="Ordre option"
                                        value={
                                          e.option_ordre
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      8. CLASSE / PARALLÈLE
                                  ================================================== */}

                                  <div>

                                    <div className="flex items-center gap-2 mb-4">

                                      <GraduationCap
                                        size={18}
                                        className="text-indigo-400"
                                      />

                                      <h4 className="font-semibold text-indigo-400 text-xs uppercase tracking-wider">
                                        Classe et affectation
                                      </h4>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                      <DetailItem
                                        label="Classe"
                                        value={
                                          e.nom_classe
                                        }
                                      />

                                      <DetailItem
                                        label="Capacité classe"
                                        value={
                                          e.classe_capacite
                                        }
                                      />

                                      <DetailItem
                                        label="Parallèle"
                                        value={
                                          e.nom_parallele
                                        }
                                      />

                                      <DetailItem
                                        label="Capacité parallèle"
                                        value={
                                          e.parallele_capacite
                                        }
                                      />

                                    </div>

                                  </div>

                                  {/* ==================================================
                                      9. CONTACTS RAPIDES
                                  ================================================== */}

                                  <div className="pt-4 border-t border-slate-800">

                                    <div className="flex flex-wrap gap-3">

                                      {e.telephone && (

                                        <a
                                          href={`tel:${e.telephone}`}
                                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                        >

                                          <Phone size={15} />

                                          Appeler l'élève

                                        </a>

                                      )}

                                      {e.eleve_email && (

                                        <a
                                          href={`mailto:${e.eleve_email}`}
                                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                        >

                                          <Mail size={15} />

                                          Envoyer un email

                                        </a>

                                      )}

                                      {e.numero_whatsapp && (

                                        <a
                                          href={`https://wa.me/${e.numero_whatsapp.replace(
                                            /[^0-9]/g,
                                            ""
                                          )}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                        >

                                          <MessageCircle
                                            size={15}
                                          />

                                          WhatsApp parent

                                        </a>

                                      )}

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

            {/* ==================================================
                PIED DU TABLEAU
            ================================================== */}

            <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-800 flex items-center justify-between">

              <p className="text-slate-400 text-sm">

                Affichage de{" "}

                <span className="font-semibold text-white">
                  {filteredEleves.length}
                </span>{" "}

                élève
                {filteredEleves.length > 1
                  ? "s"
                  : ""}

              </p>

             <button
              onClick={handleExport}
              disabled={filteredEleves.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Exporter
            </button>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          MODAL MODIFICATION
      ================================================== */}

      <EditStudentModal
        open={editOpen}
        student={selectedStudent}
        onClose={() => {
          setEditOpen(false);
          setSelectedStudent(null);
        }}
        onSave={handleSave}
      />

      {/* ==================================================
          MODAL SUPPRESSION
      ================================================== */}

      <DeleteStudentModal
        open={deleteOpen}
        student={selectedStudent}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedStudent(null);
        }}
        onDeleted={() => {
          setDeleteOpen(false);
          setSelectedStudent(null);
          fetchEleves();
        }}
      />
    </>
  );
}


// ==========================================================
// COMPOSANT POUR UNE INFORMATION
// ==========================================================

function DetailItem({ label, value }) {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "-"
      : value;

  return (
    <div className="rounded-xl bg-slate-900/50 border border-slate-800/80 p-3">

      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </p>

      <p className="text-sm text-slate-200 break-words">
        {displayValue}
      </p>

    </div>
  );
}


// ==========================================================
// ICÔNE FICHIER
// ==========================================================

function FileTextIcon() {
  return (
    <BookOpen
      size={18}
      className="text-amber-400"
    />
  );
}