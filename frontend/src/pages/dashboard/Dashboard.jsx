import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  School,
  CalendarX,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  FileText,
  Bell,
  UserPlus,
  CreditCard,
  Loader2
} from "lucide-react";

import { useAuth } from "../../hooks/UseAuth";
import NotificationBell from "../../components/NotificationBell";
import StudentsByClassChart from "./StudentsByClassChart";

// Card component for displaying statistics
const StatCard = ({ title, value, icon: Icon, colorClass, linkTo }) => (
  <Link
    to={linkTo || "#"}
    className={`
      bg-white
      rounded-xl
      shadow-sm
      border border-slate-200
      p-5
      flex
      justify-between
      items-center
      hover:shadow-md
      hover:border-indigo-300
      transition-all
      duration-200
      group
    `}
  >
    <div>
      <p className="
        text-xs
        uppercase
        text-slate-500
        font-semibold
        group-hover:text-indigo-600
        transition-colors
      ">
        {title}
      </p>
      <h2 className="
        text-3xl
        font-bold
        text-slate-800
        mt-2
      ">
        {value}
      </h2>
    </div>
    <div className={`
      p-3
      rounded-xl
      ${colorClass}
      group-hover:scale-105
      transition-transform
    `}>
      <Icon size={26} />
    </div>
  </Link>
);

// Notification Item component
const NotificationItem = ({ title, message, date }) => (
  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 hover:bg-slate-100 transition-colors">
    <p className="font-medium text-sm text-slate-800">{title}</p>
    <p className="text-xs text-slate-500 mt-1">{message}</p>
    {date && <p className="text-xs text-slate-400 mt-1">{new Date(date).toLocaleDateString("fr-FR")}</p>}
  </div>
);

// Recent Student Item component
const RecentStudentItem = ({ nom, prenom, nom_classe, photo }) => (
  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-100 hover:bg-slate-100 transition-colors">
    {photo ? (
      <img src={photo} alt={`${prenom} ${nom}`} className="w-8 h-8 rounded-full object-cover" />
    ) : (
      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-sm font-semibold">
        {prenom[0]}{nom[0]}
      </div>
    )}
    <div>
      <p className="font-medium text-sm text-slate-800">{prenom} {nom}</p>
      <p className="text-xs text-slate-500">{nom_classe}</p>
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="ml-3 text-slate-600">Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-6 rounded-xl shadow text-red-600 border border-red-200">
          <AlertCircle className="inline-block mr-2" />
          {error}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Élèves",
      value: dashboardData?.stats?.studentsCount ?? 0,
      icon: Users,
      colorClass: "bg-blue-50 text-blue-600",
      linkTo: "/dashboard/students"
    },
    {
      title: "Enseignants",
      value: dashboardData?.stats?.teachersCount ?? 0,
      icon: GraduationCap,
      colorClass: "bg-green-50 text-green-600",
      linkTo: "/dashboard/enseignants"
    },
    {
      title: "Classes",
      value: dashboardData?.stats?.classesCount ?? 0,
      icon: School,
      colorClass: "bg-purple-50 text-purple-600",
      linkTo: "/dashboard/classes"
    },
    {
      title: "Absences",
      value: dashboardData?.stats?.absencesCount ?? 0,
      icon: CalendarX,
      colorClass: "bg-red-50 text-red-600",
      linkTo: "/dashboard/absences"
    },
  ];

  const quickActions = [
    {
      title: "Nouvelle Inscription",
      icon: UserPlus,
      link: "/dashboard/inscriptions/nouvelle",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Gérer les Paiements",
      icon: CreditCard,
      link: "/dashboard/paiements",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Voir les Rapports",
      icon: FileText,
      link: "/dashboard/rapports",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="
      min-h-screen
      bg-slate-50
      p-4
      sm:p-6
      lg:p-8
    ">
      {/* HEADER */}
      <div className="
        flex
        flex-col
        sm:flex-row
        justify-between
        gap-4
        mb-8
      ">
        <div>
          <h1 className="
            text-3xl
            font-bold
            text-slate-900
          ">
            Bonjour {user?.prenom || "Administrateur"}
          </h1>
          <p className="text-slate-500 mt-2">
            Tableau de bord du Collège Emmanuel
          </p>
        </div>
        <div className="
          flex
          items-center
          gap-3
        ">
          <NotificationBell />
          <div className="
            bg-white
            border border-slate-200
            rounded-xl
            px-4
            py-2
            flex
            items-center
            gap-2
          ">
            <Calendar size={16} className="text-slate-500" />
            <span className="text-sm text-slate-700">
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
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
        mb-8
      ">
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
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className={`
                ${action.bgColor}
                ${action.color}
                rounded-xl
                p-5
                flex
                flex-col
                items-center
                justify-center
                gap-3
                text-center
                font-semibold
                hover:shadow-md
                hover:scale-105
                transition-all
                duration-200
                border border-transparent
                hover:border-current
              `}
            >
              <action.icon size={32} />
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      ">
        {/* STUDENTS BY CLASS CHART */}
        <div className="lg:col-span-2">
          {dashboardData?.stats?.studentsByClass ? (
            <StudentsByClassChart
              data={dashboardData.stats.studentsByClass}
            />
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-500">Chargement des statistiques de répartition...</p>
            </div>
          )}
        </div>

        {/* ASIDE - NOTIFICATIONS & RECENT STUDENTS */}
        <aside className="
          bg-white
          rounded-xl
          border border-slate-200
          p-6
          space-y-8
        ">
          <div>
            <h3 className="
              font-bold
              text-lg
              mb-4
              flex
              items-center
              gap-2
              text-slate-800
            ">
              <Bell size={18} className="text-indigo-500" />
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
                <p className="text-sm text-slate-500">Aucune notification récente.</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="
              font-bold
              text-lg
              mb-4
              flex
              items-center
              gap-2
              text-slate-800
            ">
              <TrendingUp size={18} className="text-green-500" />
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
                <p className="text-sm text-slate-500">Aucun élève inscrit récemment.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
