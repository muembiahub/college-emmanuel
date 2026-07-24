// pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  School,
  CalendarX,
  TrendingUp,
  Calendar,
  FileText,
  Bell,
  UserPlus,
  CreditCard,
  Loader2,
  AlertCircle
} from "lucide-react";

import { useAuth } from "../../hooks/UseAuth";
import NotificationBell from "../../components/NotificationBell";
import StudentsByClassChart from "./StudentsByClassChart";

// Composant Carte Statistique - Design Depth (Effet verrier / profondeur)
const StatCard = ({ title, value, icon: Icon, colorClass, linkTo }) => (
  <Link
    to={linkTo || "#"}
    className="
      bg-slate-900/60 
      backdrop-blur-md
      rounded-2xl
      shadow-xl
      border border-slate-700/60
      p-5
      flex
      justify-between
      items-center
      hover:bg-slate-900/80
      hover:border-indigo-500/50
      hover:shadow-indigo-500/10
      transition-all
      duration-300
      group
    "
  >
    <div>
      <p className="text-xs uppercase text-slate-400 font-bold tracking-wider group-hover:text-indigo-400 transition-colors">
        {title}
      </p>
      <h2 className="text-3xl font-extrabold text-white mt-2 tracking-tight">
        {value}
      </h2>
    </div>
    <div className={`p-3.5 rounded-xl shadow-inner ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={24} />
    </div>
  </Link>
);

// Composant Élément Notification
const NotificationItem = ({ title, message, date }) => (
  <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/80 hover:bg-slate-900/70 transition-all">
    <p className="font-semibold text-sm text-slate-200">{title}</p>
    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
    {date && <p className="text-[11px] text-slate-500 mt-2">{new Date(date).toLocaleDateString("fr-FR")}</p>}
  </div>
);

// Composant Élève Récent
const RecentStudentItem = ({ nom, prenom, nom_classe, photo }) => (
  <div className="flex items-center gap-3 bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/80 hover:bg-slate-900/70 transition-all">
    {photo ? (
      <img src={photo} alt={`${prenom} ${nom}`} className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/30" />
    ) : (
      <div className="w-10 h-10 rounded-xl bg-indigo-600/20 ring-2 ring-indigo-500/30 flex items-center justify-center text-indigo-300 text-sm font-bold">
        {prenom[0]}{nom[0]}
      </div>
    )}
    <div>
      <p className="font-semibold text-sm text-slate-200">{prenom} {nom}</p>
      <p className="text-xs text-indigo-400/90 font-medium mt-0.5">{nom_classe}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch(
          "/dashboard/homepage",
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error("Impossible de charger le tableau de bord.");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Erreur lors du chargement du tableau de bord:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <p className="ml-3 text-slate-300 font-medium">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-red-950/40 border border-red-500/30 p-6 rounded-2xl shadow-2xl text-red-300 backdrop-blur-md flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Élèves",
      value: dashboardData?.stats?.studentsCount ?? 0,
      icon: Users,
      colorClass: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      linkTo: "/dashboard/students"
    },
    {
      title: "Enseignants",
      value: dashboardData?.stats?.teachersCount ?? 0,
      icon: GraduationCap,
      colorClass: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      linkTo: "/dashboard/enseignants"
    },
    {
      title: "Classes",
      value: dashboardData?.stats?.classesCount ?? 0,
      icon: School,
      colorClass: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      linkTo: "/dashboard/classes"
    },
    {
      title: "Absences",
      value: dashboardData?.stats?.absencesCount ?? 0,
      icon: CalendarX,
      colorClass: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
      linkTo: "/dashboard/absences"
    },
  ];

  const quickActions = [
    {
      title: "Nouvelle Inscription",
      icon: UserPlus,
      link: "/dashboard/inscriptions/nouvelle",
      color: "text-indigo-300 group-hover:text-white",
      bgColor: "bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-500/30",
    },
    {
      title: "Gérer les Finances",
      icon: CreditCard,
      link: "finances/homepage",
      color: "text-emerald-300 group-hover:text-white",
      bgColor: "bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/30",
    },
    {
      title: "Voir les Rapports",
      icon: FileText,
      link: "/dashboard/finances/rapports",
      color: "text-amber-300 group-hover:text-white",
      bgColor: "bg-amber-950/40 hover:bg-amber-900/60 border-amber-500/30",
    },
  ];

  return (
    <div className="w-full space-y-8 pb-12">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{user?.prenom || "Administrateur"}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tableau de bord général du Collège Emmanuel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-inner">
            <Calendar size={16} className="text-indigo-400" />
            <span className="text-xs font-medium text-slate-300 capitalize">
              {new Date().toLocaleDateString(
                "fr-FR",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long"
                }
              )}
            </span>
          </div>
        </div>
      </div>

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            icon={item.icon}
            colorClass={item.colorClass}
            linkTo={item.linkTo}
          />
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4 tracking-wide">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`
                ${action.bgColor}
                ${action.color}
                rounded-2xl
                p-5
                flex
                flex-col
                items-center
                justify-center
                gap-3
                text-center
                font-semibold
                shadow-xl
                hover:scale-[1.02]
                transition-all
                duration-300
                border
                group
                backdrop-blur-md
              `}
            >
              <div className="p-3 rounded-xl bg-slate-950/40 shadow-inner group-hover:scale-110 transition-transform">
                <action.icon size={26} />
              </div>
              <span className="text-sm font-medium tracking-wide">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* STUDENTS BY CLASS CHART */}
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl">
          {dashboardData?.stats?.studentsByClass ? (
            <StudentsByClassChart
              data={dashboardData.stats.studentsByClass}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              <p>Chargement des statistiques de répartition...</p>
            </div>
          )}
        </div>

        {/* ASIDE - NOTIFICATIONS & RECENT STUDENTS */}
        <aside className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-700/60 p-6 shadow-xl space-y-8">
          <div>
            <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-white">
              <Bell size={18} className="text-indigo-400" />
              Notifications Récentes
            </h3>
            <div className="space-y-3">
              {dashboardData?.notifications?.length ? (
                dashboardData.notifications
                  .slice(0, 5)
                  .map((n) => (
                    <NotificationItem
                      key={n.notification_id}
                      title={n.titre || "Notification"}
                      message={n.message}
                      date={n.created_at}
                    />
                  ))
              ) : (
                <p className="text-xs text-slate-400 italic">Aucune notification récente.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-white">
              <TrendingUp size={18} className="text-emerald-400" />
              Derniers Élèves Inscrits
            </h3>
            <div className="space-y-3">
              {dashboardData?.recentStudents?.length ? (
                dashboardData.recentStudents.map((student) => (
                  <RecentStudentItem
                    key={student.eleve_id}
                    nom={student.nom}
                    prenom={student.prenom}
                    nom_classe={student.nom_classe}
                    photo={student.photo}
                  />
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Aucun élève inscrit récemment.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}