// ==========================================
// 4. PAGES / classes/ClassesOverview.jsx (Connecté à l'API)
// ==========================================
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Landmark, 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  ChevronRight, 
  GraduationCap,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function ClassesOverview() {
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("all");

  // Appel de l'API pour récupérer les classes
  useEffect(() => {
    async function fetchClasses() {
      try {
        setLoading(true);
        // Remplace l'URL par ton endpoint API réel (ex: /api/classes ou autre)
        const response = await fetch("/dashboard/classes"); 
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des classes depuis le serveur.");
        }
        
        const data = await response.json();
        setClassesData(data);
      } catch (err) {
        console.error("Erreur API Classes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchClasses();
  }, []);

  // Définition des métadonnées visuelles par cycle
  const cycleConfig = {
    maternelle: {
      title: "Maternelle",
      path: "/dashboard/classes/maternelle",
      icon: Landmark,
      color: "from-pink-500 to-rose-600",
      description: "Première étape d'éveil et d'apprentissage pour les tout-petits.",
    },
    primaire: {
      title: "Primaire",
      path: "/dashboard/classes/primaire",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      description: "Acquisition des bases fondamentales : lecture, écriture et calcul.",
    },
    secondaire: {
      title: "Secondaire",
      path: "/dashboard/classes/secondaire",
      icon: GraduationCap,
      color: "from-purple-500 to-violet-600",
      description: "Enseignement secondaire général et technique orienté vers l'excellence.",
    }
  };

  // Transformation et regroupement dynamique des données de l'API par cycle
  // (En supposant que l'API retourne un tableau d'objets du type : { id, name, cycle, studentsCount, room, teacher })
  const groupedByCycle = classesData.reduce((acc, curr) => {
    const cycleKey = curr.cycle ? curr.cycle.toLowerCase() : "secondaire";
    if (!acc[cycleKey]) {
      acc[cycleKey] = {
        ...(cycleConfig[cycleKey] || { title: cycleKey, path: `/dashboard/classes/${cycleKey}`, icon: GraduationCap, color: "from-indigo-500 to-purple-600", description: "" }),
        id: cycleKey,
        classesList: [],
        stats: { classes: 0, students: 0, teachers: new Set() }
      };
    }
    acc[cycleKey].classesList.push(curr);
    acc[cycleKey].stats.classes += 1;
    acc[cycleKey].stats.students += curr.studentsCount || curr.students || 0;
    if (curr.teacher) acc[cycleKey].stats.teachers.add(curr.teacher);
    return acc;
  }, {});

  // Conversion en tableau pour l'affichage
  const sections = Object.values(groupedByCycle).map(section => ({
    ...section,
    stats: {
      ...section.stats,
      teachers: section.stats.teachers.size
    }
  }));

  // Filtrage par cycle sélectionné et terme de recherche
  const filteredSections = sections.filter(section => {
    if (selectedCycle !== "all" && section.id !== selectedCycle) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 size={40} className="animate-spin text-indigo-500" />
        <p className="text-sm text-slate-400 font-medium">Chargement des classes depuis le serveur...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-red-500/20 text-center">
        <AlertCircle size={40} className="text-red-400" />
        <h2 className="text-lg font-bold text-white">Impossible de charger les données</h2>
        <p className="text-sm text-slate-400 max-w-md">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-500 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles size={14} /> Gestion Académique
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Cycles et Classes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Visualisez et gérez l'ensemble des structures scolaires du Collège Emmanuel connectées à la base de données.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/classes/nouvelle"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus size={18} />
            <span>Ajouter une classe</span>
          </Link>
        </div>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCycle("all")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCycle === "all" 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Tous les cycles
          </button>
          <button
            onClick={() => setSelectedCycle("maternelle")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCycle === "maternelle" 
                ? "bg-pink-600 text-white shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Maternelle
          </button>
          <button
            onClick={() => setSelectedCycle("primaire")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCycle === "primaire" 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Primaire
          </button>
          <button
            onClick={() => setSelectedCycle("secondaire")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCycle === "secondaire" 
                ? "bg-purple-600 text-white shadow-md" 
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Secondaire
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Liste des sections et des classes associées */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Aucune classe trouvée pour votre recherche.</p>
          </div>
        ) : (
          filteredSections.map((section) => {
            const Icon = section.icon || GraduationCap;
            const filteredClasses = section.classesList.filter(c => 
              (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (c.teacher && c.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            if (searchTerm && filteredClasses.length === 0) return null;

            return (
              <div 
                key={section.id} 
                className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition-all"
              >
                {/* En-tête de section */}
                <div className="p-6 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/40">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{section.title}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{section.description}</p>
                    </div>
                  </div>

                  {/* Statistiques rapides de la section */}
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800/60 border border-slate-700/60 px-3.5 py-2 rounded-xl text-center">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Classes</span>
                      <span className="text-sm font-extrabold text-white">{section.stats.classes}</span>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/60 px-3.5 py-2 rounded-xl text-center">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Élèves</span>
                      <span className="text-sm font-extrabold text-white">{section.stats.students}</span>
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/60 px-3.5 py-2 rounded-xl text-center">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Enseignants</span>
                      <span className="text-sm font-extrabold text-white">{section.stats.teachers}</span>
                    </div>

                    <Link
                      to={section.path}
                      className={`p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all ml-2`}
                      title="Voir le détail complet"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* Grille des classes individuelles */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClasses.map((cls, idx) => (
                    <div 
                      key={cls.id || idx}
                      className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl flex flex-col justify-between gap-4 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                            {cls.room || "Salle standard"}
                          </span>
                          <h3 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                            {cls.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          <Users size={12} className="text-indigo-400" />
                          <span className="font-semibold text-white">{cls.studentsCount || cls.students || 0}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs text-slate-400">
                        <span>Titulaire : <strong className="text-slate-300">{cls.teacher || "Non assigné"}</strong></span>
                        <Link 
                          to={`${section.path}`} 
                          className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                        >
                          Gérer <ChevronRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}