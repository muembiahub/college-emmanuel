// components/DashboardMenu.jsx
// Version Rétractable Ultra-Stylisée avec Scroll Optimisé

import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  School,
  Wallet,
  Users,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  BookOpen,
  BarChart3,
  Calendar,
  Sparkles,
  CreditCard,
  FileText,
  RotateCcw,
  Menu,
  X
} from "lucide-react";

import { useAuth } from "../hooks/UseAuth";
import NotificationBell from "./NotificationBell";
import logo from "../assets/logo.png";
import { useNotification } from "../context/NotificationContext";


export default function DashboardMenu() {
  const { logout } = useAuth();
  const location = useLocation();
  const { badges } = useNotification();


  // État pour suivre quels menus de niveau supérieur sont ouverts
  const [openMenus, setOpenMenus] = useState({});
  
  // État pour le menu rétractable
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  // Fonction pour basculer l'affichage d'un sous-menu
  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // Liste des menus enrichie avec la propriété optional 'submenu'
  const menuItems = [
    {
      name: "Tableau de bord",
      path: "/dashboard",
      icon: LayoutDashboard,
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "Inscriptions",
      path: "/dashboard/inscriptions",
      icon: UserPlus,
      badge: badges?.inscriptions || 0,
      color: "from-indigo-500 to-purple-600",
      submenu: [
        { name: "Nouvelle inscription", path: "/dashboard/inscriptions/nouvelle", icon: UserPlus },
        { name: "Réinscriptions", path: "/dashboard/inscriptions/reinscription", icon: RotateCcw },
        { name: "Liste des inscrits", path: "/dashboard/students", icon: Users },
      ],
    },
    {
      name: "Classes",
      path: "/dashboard/classes",
      icon: School,
      badge: badges?.classe || 0,
      color: "from-green-500 to-emerald-600",
      submenu: [
        { name: "Maternelle", path: "/dashboard/classes/maternelle", icon: BookOpen },
        { name: "Primaire", path: "/dashboard/classes/primaire", icon: BookOpen },
        { name: "Secondaire", path: "/dashboard/classes/secondaire", icon: BookOpen },
      ],
    },
    {
      name: "Finances",
      path: "/dashboard/finances",
      icon: Wallet,
      badge: badges?.finances || 0,
      color: "from-yellow-500 to-orange-600",
      submenu: [
        { name: "Dépenses", path: "/dashboard/finances/depenses", icon: FileText },
        { name: "Paiement", path: "/dashboard/finances/payement", icon: CreditCard },
        { name: "Rapports", path: "/dashboard/finances/rapports", icon: BarChart3 },
        { name: "Historique", path: "/dashboard/finances/historique", icon: Calendar }
      ],
    },
    {
      name: "Personnel",
      path: "/dashboard/personnel",
      icon: Users,
      badge: badges?.personnel || 0,
      color: "from-pink-500 to-rose-600"
    },
    {
      name: "Inventaire Patrimoine",
      path: "/dashboard/inventaire",
      icon: Package,
      color: "from-purple-500 to-indigo-600"
    },
    {
      name: "Notes de classe",
      path: "/dashboard/notes",
      icon: ClipboardList,
      color: "from-red-500 to-pink-600"
    },
    {
      name: "Rapports",
      path: "/dashboard/reports",
      icon: BarChart3,
      color: "from-teal-500 to-cyan-600",
      submenu: [
        { name: "Rapports académiques", path: "/dashboard/reports/academic", icon: FileText },
        { name: "Statistiques", path: "/dashboard/reports/statistics", icon: BarChart3 },
        { name: "Présences", path: "/dashboard/reports/attendance", icon: Calendar },
      ],
    },
    {
      name: "Calendrier",
      path: "/dashboard/calendar",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      submenu: [
        { name: "Événements", path: "/dashboard/calendar/events", icon: Calendar },
        { name: "Jours fériés", path: "/dashboard/calendar/holidays", icon: Calendar },
        { name: "Examens", path: "/dashboard/calendar/exams", icon: ClipboardList },
      ],
    },
  ];

  return (
    <>
      {/* Bouton Toggle pour mobile/desktop */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay pour mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Menu Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          h-screen
          bg-gradient-to-b
          from-slate-900
          via-indigo-900
          to-slate-950
          text-white
          flex
          flex-col
          shadow-2xl
          overflow-hidden
          backdrop-blur-xl
          border-r
          border-white/10
          z-30
          transition-all
          duration-300
          ease-in-out
          ${isMenuOpen ? "w-72" : "-translate-x-full lg:translate-x-0 lg:w-72"}
          lg:translate-x-0
         
        `}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        </div>

        {/* Logo Section */}
        <div className="relative flex items-center gap-3 p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl group hover:bg-white/10 transition-all duration-300 flex-shrink-0">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50 group-hover:shadow-indigo-500/70 transition-all duration-300 transform group-hover:scale-110">
            <img
              src={logo}
              alt="Logo Collège Emmanuel"
              className="w-12 h-12 object-contain"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Collège Emmanuel
            </h1>
            <p className="text-xs text-indigo-300/70">
              Gestion Scolaire
            </p>
          </div>

          <Sparkles className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>

        {/* Notifications */}
        <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
          <NotificationBell />
        </div>

        {/* Menu - Scrollable */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-custom">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isMenuOpenState = !!openMenus[item.name];

            // Vérifie si l'un des sous-menus est actuellement actif
            const isSubmenuActive = hasSubmenu && item.submenu.some(sub => location.pathname === sub.path);
            const isMainActive = location.pathname === item.path;

            return (
              <div key={item.path} className="space-y-1">
                {hasSubmenu ? (
                  // Si le menu a un sous-menu, on utilise un bouton au lieu d'un NavLink direct
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`
                      w-full
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      transition-all
                      duration-300
                      text-left
                      group
                      relative
                      overflow-hidden
                      border
                      ${
                        isSubmenuActive
                          ? "bg-gradient-to-r from-indigo-600/50 to-purple-600/50 shadow-lg shadow-indigo-500/20 border-white/20"
                          : "hover:bg-white/10 hover:border-white/20 border-white/5"
                      }
                    `}
                  >
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>

                    <div className="relative flex items-center gap-3 flex-1">
                      <div className={`
                        p-2 rounded-lg transition-all duration-300 flex-shrink-0
                        ${isSubmenuActive 
                          ? "bg-indigo-500/30 text-indigo-300" 
                          : "bg-white/5 text-indigo-200 group-hover:bg-white/10"
                        }
                      `}>
                        <Icon size={18} />
                      </div>
                      <span className="font-semibold text-sm truncate">{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="
                          bg-gradient-to-r
                          from-red-500
                          to-pink-600
                          text-white
                          text-xs
                          font-bold
                          rounded-full
                          w-5
                          h-5
                          flex
                          items-center
                          justify-center
                          shadow-lg
                          shadow-red-500/50
                          flex-shrink-0
                        ">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <ChevronDown
                      size={16}
                      className={`
                        transition-transform
                        duration-300
                        relative
                        flex-shrink-0
                        ${isMenuOpenState ? "rotate-180" : ""}
                      `}
                    />
                  </button>
                ) : (
                  // Si pas de sous-menu, simple NavLink classique
                  <NavLink
                    to={item.path}
                    end={item.path === "/dashboard"}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-3
                      rounded-xl
                      transition-all
                      duration-300
                      group
                      relative
                      overflow-hidden
                      border
                      ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-600/50 to-purple-600/50 shadow-lg shadow-indigo-500/20 border-white/20"
                          : "hover:bg-white/10 hover:border-white/20 border-white/5"
                      }
                      `
                    }
                  >
                    {/* Gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>

                    <div className="relative flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-white/5 text-indigo-200 group-hover:bg-white/10 transition-all duration-300 flex-shrink-0">
                        <Icon size={18} />
                      </div>
                      <span className="font-semibold text-sm truncate">{item.name}</span>
                    </div>

                    {item.badge && item.badge > 0 && (
                      <span className="
                        bg-gradient-to-r
                        from-red-500
                        to-pink-600
                        text-white
                        text-xs
                        font-bold
                        rounded-full
                        w-5
                        h-5
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        shadow-red-500/50
                        relative
                        flex-shrink-0
                      ">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )}

                {/* Affichage du sous-menu si ouvert */}
                {hasSubmenu && isMenuOpenState && (
                  <div className="
                    ml-4
                    pl-3
                    space-y-1
                    border-l-2
                    border-indigo-500/50
                    animate-in
                    fade-in
                    slide-in-from-left-2
                    duration-200
                  ">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `
                            flex
                            items-center
                            gap-2
                            px-3
                            py-2
                            rounded-lg
                            text-xs
                            font-medium
                            transition-all
                            duration-200
                            group
                            relative
                            overflow-hidden
                            border
                            ${
                              isActive
                                ? "bg-indigo-600/40 text-indigo-100 border-indigo-500/50 shadow-md shadow-indigo-500/20"
                                : "text-indigo-300/70 hover:text-indigo-100 hover:bg-white/5 border-white/5 hover:border-white/20"
                            }
                            `
                          }
                        >
                          {/* Gradient background on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none"></div>

                          <SubIcon size={14} className="relative flex-shrink-0" />
                          <span className="relative truncate">{subItem.name}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="
          relative
          border-t
          border-white/10
          p-4
          space-y-2
          bg-gradient-to-t
          from-white/5
          to-transparent
          backdrop-blur-xl
          flex-shrink-0
        ">
          <NavLink
            to="/dashboard/settings"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-300
              group
              relative
              overflow-hidden
              border
              ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/50 to-purple-600/50 shadow-lg shadow-indigo-500/20 border-white/20"
                  : "hover:bg-white/10 hover:border-white/20 border-white/5"
              }
              `
            }
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>

            <div className="p-2 rounded-lg bg-white/5 text-indigo-200 group-hover:bg-white/10 transition-all duration-300 relative">
              <Settings size={18} />
            </div>
            <span className="font-semibold text-sm relative">Paramètres</span>
          </NavLink>

          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-xl
            transition-all
            duration-300
            hover:bg-red-600/20
            hover:border-red-500/30
            text-left
            font-semibold
            text-sm
            group
            relative
            overflow-hidden
            border
            border-white/5
            hover:border-red-500/30
            "
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/10 group-hover:to-pink-500/10 transition-all duration-300 pointer-events-none"></div>

            <div className="p-2 rounded-lg bg-white/5 text-red-300 group-hover:bg-red-600/20 transition-all duration-300 relative">
              <LogOut size={18} />
            </div>
            <span className="relative">Déconnexion</span>
          </button>
        </div>

        {/* CSS for custom scrollbar */}
        <style jsx>{`
          .scrollbar-custom::-webkit-scrollbar {
            width: 6px;
          }

          .scrollbar-custom::-webkit-scrollbar-track {
            background: transparent;
          }

          .scrollbar-custom::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.3);
            border-radius: 3px;
          }

          .scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.5);
          }

          .scrollbar-custom {
            scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
            scrollbar-width: thin;
          }

          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </aside>
    </>
  );
}
