
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
  BarChart3,
  CalendarDays,
  Menu,
  X,
  CreditCard,
  BriefcaseBusiness,
  FileText,
  ReceiptText,
  Landmark,
  BellDot,
  MapPin,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

import { useAuth } from "../hooks/UseAuth";
import NotificationBell from "./NotificationBell";
import logo from "../assets/logo.png";
import { useNotification } from "../context/NotificationContext";


export default function DashboardMenu({
  isMenuOpen,
  setIsMenuOpen,
}) {

  /* ==========================================================
     AUTHENTIFICATION
  ========================================================== */

  const {
    user,
    logout,
    role,
    fullName,
    hasFullAccess,
    isAgent,
    isEnseignant,
    loading: authLoading,
  } = useAuth();

  const location = useLocation();

  const { badges } = useNotification();

  const [openMenus, setOpenMenus] = useState({});


  /* ==========================================================
     RÔLE ACTUEL
  ========================================================== */

  const currentRole =
    role?.toLowerCase().trim() || "";


  /* ==========================================================
     NOM UTILISATEUR
  ========================================================== */

  /*
   * Le AuthContext construit déjà :
   *
   * firstname + lastname = fullName
   *
   * Exemple :
   *
   * Jonathan Mukuta
   */

  const displayName =
    fullName ||
    `${user?.firstname || ""} ${user?.lastname || ""}`.trim() ||
    user?.email ||
    "Utilisateur";


  /* ==========================================================
     CHARGEMENT AUTHENTIFICATION
  ========================================================== */

  if (authLoading) {
    return null;
  }


  /* ==========================================================
     OUVERTURE / FERMETURE DES SOUS-MENUS
  ========================================================== */

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };


  /* ==========================================================
     CLASSES
  ========================================================== */

  const baseLinkClasses =
    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 w-full text-left group";

  const activeClasses =
    "bg-indigo-600/10 text-indigo-300 font-semibold shadow-sm";

  const inactiveClasses =
    "text-slate-300 hover:bg-slate-800 hover:text-white";

  const badgeClasses =
    "ml-auto bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-none";


  /* ==========================================================
     MENU PRINCIPAL
  ========================================================== */

  /*
   * ==========================================================
   * RÔLES
   * ==========================================================
   *
   * ACCÈS COMPLET :
   *
   *   - promoteur
   *   - superadmin
   *   - secretaire
   *   - comptable
   *
   * ACCÈS LIMITÉ :
   *
   *   - agent
   *   - enseignant
   *
   * ==========================================================
   *
   * AGENT :
   *
   *   - Tableau de bord
   *   - Notifications
   *   - Inscriptions
   *
   * ENSEIGNANT :
   *
   *   - Tableau de bord
   *   - Notifications
   *   - Académique
   *   - Évaluations
   *   - Rapports
   *   - Agenda
   *
   * ACCÈS COMPLET :
   *
   *   - Tout
   *
   * ==========================================================
   */


  const menuItems = [

    /* ========================================================
       TABLEAU DE BORD
    ======================================================== */

    {
      name: "Tableau de bord",
      path: "/dashboard",
      icon: LayoutDashboard,

      visible:
        hasFullAccess ||
        isAgent ||
        isEnseignant,
    },


    /* ========================================================
       NOTIFICATIONS
    ======================================================== */

    {
      name: "Notifications",
      path: "/notifications",
      icon: BellDot,

      visible:
        hasFullAccess ||
        isAgent ||
        isEnseignant,
    },


    /* ========================================================
       INSCRIPTIONS
    ======================================================== */

    {
      name: "Inscriptions",
      path: "/dashboard/inscriptions",
      icon: UserPlus,

      /*
       * Tout le monde sauf enseignant.
       */

      visible:
        hasFullAccess ||
        isAgent,

      badge:
        badges?.inscriptions || 0,

      submenu: [

        {
          name: "Nouvelle inscription",
          path: "/dashboard/inscriptions/nouvelle",
          icon: UserPlus,
        },

        {
          name: "Réinscriptions",
          path: "/dashboard/inscriptions/reinscription",
          icon: ClipboardList,
        },

        {
          name: "Liste des inscrits",
          path: "/dashboard/students",
          icon: Users,
        },

      ],
    },


    /* ========================================================
       FINANCES
    ======================================================== */

    {
      name: "Finances",
      path: "/dashboard/finances",
      icon: Wallet,

      /*
       * Agent et enseignant n'ont pas accès.
       *
       * Promoteur
       * Superadmin
       * Secrétaire
       * Comptable
       *
       * ont accès.
       */

      visible: hasFullAccess,

      badge:
        badges?.finances || 0,

      submenu: [

        {
          name: "Vue d'ensemble",
          path: "/dashboard/finances/homepage",
          icon: BarChart3,
        },

        {
          name: "Paiements Élèves",
          path: "/dashboard/finances/paiements-eleves",
          icon: CreditCard,
        },

        {
          name: "Paie Employés",
          path: "/dashboard/finances/paiements-employes",
          icon: BriefcaseBusiness,
        },

        {
          name: "Journal des dépenses",
          path: "/dashboard/finances/depenses",
          icon: ReceiptText,
        },

        {
          name: "Rapports financiers",
          path: "/dashboard/finances/rapports",
          icon: FileText,
        },

        {
          name: "Gestion des frais",
          path: "/dashboard/finances/configurationfrais",
          icon: Settings,
        },

      ],
    },


    /* ========================================================
       ACADÉMIQUE
    ======================================================== */

    {
      name: "Académique",
      path: "/dashboard/classes",
      icon: School,

      /*
       * Les rôles complets et l'enseignant
       * ont accès à cette section.
       *
       * L'agent n'y a pas accès.
       */

      visible:
        hasFullAccess ||
        isEnseignant,

      submenu: [

        {
          name: "Maternelle",
          path: "/dashboard/classes/maternelle",
          icon: Landmark,
        },

        {
          name: "Primaire",
          path: "/dashboard/classes/primaire",
          icon: Landmark,
        },

        {
          name: "Secondaire",
          path: "/dashboard/classes/secondaire",
          icon: Landmark,
        },

      ],
    },


    /* ========================================================
       PERSONNEL
    ======================================================== */

    {
      name: "Personnel",
      path: "/dashboard/personnel",
      icon: Users,

      visible: hasFullAccess,

      badge:
        badges?.personnel || 0,
    },


    /* ========================================================
       INVENTAIRE
    ======================================================== */

    {
      name: "Inventaire",
      path: "/dashboard/inventaire",
      icon: Package,

      visible: hasFullAccess,
    },


    /* ========================================================
       ÉVALUATIONS
    ======================================================== */

    {
      name: "Évaluations",
      path: "/dashboard/notes",
      icon: FileCheck2,

      /*
       * Enseignant + accès complet.
       */

      visible:
        hasFullAccess ||
        isEnseignant,
    },


    /* ========================================================
       RAPPORTS OFFICIELS
    ======================================================== */

    {
      name: "Rapports Officiels",
      path: "/dashboard/reports",
      icon: BarChart3,

      /*
       * Agent n'a pas accès.
       *
       * Enseignant et rôles complets oui.
       */

      visible:
        hasFullAccess ||
        isEnseignant,

      submenu: [

        {
          name: "Bulletins",
          path: "/dashboard/reports/academic",
          icon: FileText,
        },

        {
          name: "Statistiques annuelles",
          path: "/dashboard/reports/statistics",
          icon: BarChart3,
        },

        {
          name: "Registre de présence",
          path: "/dashboard/reports/attendance",
          icon: CalendarDays,
        },

      ],
    },


    /* ========================================================
       AGENDA
    ======================================================== */

    {
      name: "Agenda",
      path: "/dashboard/calendar",
      icon: CalendarDays,

      /*
       * Agent n'a pas accès.
       *
       * Enseignant et rôles complets oui.
       */

      visible:
        hasFullAccess ||
        isEnseignant,

      submenu: [

        {
          name: "Événements scolaires",
          path: "/dashboard/calendar/events",
          icon: CalendarDays,
        },

        {
          name: "Jours fériés",
          path: "/dashboard/calendar/holidays",
          icon: CalendarDays,
        },

        {
          name: "Périodes d'examens",
          path: "/dashboard/calendar/exams",
          icon: ClipboardList,
        },

      ],
    },

  ];


  /* ==========================================================
     FILTRAGE FINAL
  ========================================================== */

  const visibleMenuItems =
    menuItems.filter(
      (item) => item.visible
    );


  /* ==========================================================
     PARAMÈTRES
  ========================================================== */

  /*
   * Seuls les rôles avec accès complet
   * voient les paramètres.
   */

  const canAccessSettings =
    hasFullAccess;


  /* ==========================================================
     RENDU
  ========================================================== */

  return (
    <>

      {/* ======================================================
          BOUTON MOBILE
      ====================================================== */}

      <button
        onClick={() =>
          setIsMenuOpen(!isMenuOpen)
        }
        className="
          fixed
          top-6
          left-6
          z-50
          p-2.5
          rounded-xl
          bg-slate-900
          text-white
          shadow-lg
          hover:bg-slate-800
          transition-all
          duration-300
          lg:hidden
        "
        aria-label="Toggle Menu"
      >

        {isMenuOpen ? (
          <X size={20} />
        ) : (
          <Menu size={20} />
        )}

      </button>


      {/* ======================================================
          OVERLAY MOBILE
      ====================================================== */}

      {isMenuOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/60
            backdrop-blur-sm
            z-30
            lg:hidden
            transition-opacity
            duration-300
          "
          onClick={() =>
            setIsMenuOpen(false)
          }
          aria-hidden="true"
        />
      )}


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-screen
          bg-slate-950
          text-slate-200
          flex
          flex-col
          shadow-2xl
          border-r
          border-slate-800
          z-40
          transition-all
          duration-300
          ease-in-out

          ${
            isMenuOpen
              ? "w-72 translate-x-0"
              : "-translate-x-full lg:translate-x-0 lg:w-20"
          }
        `}
      >


        {/* ==================================================
            LOGO / ÉCOLE
        ================================================== */}

        <div
          className={`
            flex
            items-center
            gap-3
            p-5
            border-b
            border-slate-800
            bg-slate-900/50
            flex-shrink-0

            ${
              !isMenuOpen &&
              "lg:justify-center lg:p-4"
            }
          `}
        >

          <div
            className="
              w-11
              h-11
              bg-gradient-to-br
              from-indigo-500
              to-purple-600
              rounded-xl
              flex
              items-center
              justify-center
              shadow-inner
              flex-shrink-0
            "
          >

            <img
              src={logo}
              alt="Logo"
              className="
                w-8
                h-8
                object-contain
              "
            />

          </div>


          <div
            className={`
              flex-1

              ${
                !isMenuOpen &&
                "lg:hidden"
              }
            `}
          >

            <h1
              className="
                text-sm
                font-bold
                text-white
                truncate
              "
            >
              Collège Emmanuel
            </h1>


            <p
              className="
                text-xs
                text-slate-400
                flex
                items-center
                gap-1
              "
            >
              <MapPin size={11} />
              Lubumbashi, RDC
            </p>


            {/* NOM UTILISATEUR */}

            <p
              className="
                text-xs
                text-white
                mt-2
                font-semibold
                truncate
              "
            >
              {displayName}
            </p>


            {/* RÔLE */}

            <p
              className="
                text-[10px]
                text-indigo-400
                mt-1
                uppercase
                font-semibold
              "
            >
              {currentRole || "Utilisateur"}
            </p>

          </div>

        </div>


        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        {isMenuOpen && (
          <div
            className="
              px-5
              py-4
              border-b
              border-slate-800
              bg-slate-950
              flex-shrink-0
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                text-xs
                text-slate-400
                mb-2
              "
            >

              <span>
                Alertes récentes
              </span>

              <BellDot
                size={16}
                className="
                  text-amber-400
                "
              />

            </div>


            <NotificationBell />

          </div>
        )}


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav
          className="
            flex-1
            px-3
            py-5
            space-y-1.5
            overflow-y-auto
            overflow-x-hidden
            scrollbar-thin
            scrollbar-thumb-slate-700
            scrollbar-track-slate-900
          "
        >

          {visibleMenuItems.map(
            (item) => {

              const Icon =
                item.icon;

              const hasSubmenu =
                item.submenu &&
                item.submenu.length > 0;

              const isMenuOpenState =
                !!openMenus[item.name];

              const isSubmenuActive =
                hasSubmenu &&
                item.submenu.some(
                  (sub) =>
                    location.pathname ===
                    sub.path
                );

              const isMainActive =
                location.pathname ===
                item.path;


              return (
                <div
                  key={item.name}
                  className="
                    space-y-1.5
                  "
                >

                  {/* ========================================
                      MENU AVEC SOUS-MENU
                  ======================================== */}

                  {hasSubmenu ? (

                    <button
                      onClick={() =>
                        toggleMenu(
                          item.name
                        )
                      }
                      className={`
                        ${baseLinkClasses}

                        ${
                          isSubmenuActive
                            ? activeClasses
                            : inactiveClasses
                        }

                        ${
                          !isMenuOpen &&
                          "lg:justify-center lg:px-3"
                        }
                      `}
                      title={
                        !isMenuOpen
                          ? item.name
                          : undefined
                      }
                    >

                      <Icon
                        size={18}
                        className={`
                          flex-shrink-0

                          ${
                            isSubmenuActive
                              ? "text-indigo-400"
                              : "text-slate-500 group-hover:text-slate-300"
                          }
                        `}
                      />


                      <span
                        className={`
                          truncate
                          flex-1

                          ${
                            !isMenuOpen &&
                            "lg:hidden"
                          }
                        `}
                      >
                        {item.name}
                      </span>


                      {item.badge &&
                        item.badge > 0 &&
                        isMenuOpen && (

                          <span
                            className={
                              badgeClasses
                            }
                          >
                            {item.badge}
                          </span>

                        )}


                      <ChevronDown
                        size={16}
                        className={`
                          transition-transform
                          duration-300
                          flex-shrink-0

                          ${
                            !isMenuOpen &&
                            "lg:hidden"
                          }

                          ${
                            isMenuOpenState
                              ? "rotate-180 text-indigo-400"
                              : "text-slate-500"
                          }
                        `}
                      />

                    </button>

                  ) : (

                    /* ======================================
                       MENU SIMPLE
                    ====================================== */

                    <NavLink
                      to={item.path}
                      end={
                        item.path ===
                        "/dashboard"
                      }
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                      className={({
                        isActive,
                      }) =>
                        `
                        ${baseLinkClasses}

                        ${
                          isActive
                            ? activeClasses
                            : inactiveClasses
                        }

                        ${
                          !isMenuOpen &&
                          "lg:justify-center lg:px-3"
                        }
                      `
                      }
                      title={
                        !isMenuOpen
                          ? item.name
                          : undefined
                      }
                    >

                      <Icon
                        size={18}
                        className={`
                          flex-shrink-0

                          ${
                            isMainActive
                              ? "text-indigo-400"
                              : "text-slate-500 group-hover:text-slate-300"
                          }
                        `}
                      />


                      <span
                        className={`
                          truncate
                          flex-1

                          ${
                            !isMenuOpen &&
                            "lg:hidden"
                          }
                        `}
                      >
                        {item.name}
                      </span>


                      {item.badge &&
                        item.badge > 0 &&
                        isMenuOpen && (

                          <span
                            className={
                              badgeClasses
                            }
                          >
                            {item.badge}
                          </span>

                        )}

                    </NavLink>

                  )}


                  {/* ========================================
                      SOUS-MENU
                  ======================================== */}

                  {hasSubmenu &&
                    isMenuOpenState &&
                    isMenuOpen && (

                      <div
                        className="
                          pl-6
                          space-y-1
                          border-l-2
                          border-slate-800
                          ml-5
                          animate-in
                          slide-in-from-left-2
                          duration-200
                        "
                      >

                        {item.submenu.map(
                          (subItem) => {

                            const SubIcon =
                              subItem.icon;

                            return (

                              <NavLink
                                key={
                                  subItem.name
                                }
                                to={
                                  subItem.path
                                }
                                onClick={() =>
                                  setIsMenuOpen(
                                    false
                                  )
                                }
                                className={({
                                  isActive,
                                }) =>
                                  `
                                  flex
                                  items-center
                                  gap-2
                                  px-3
                                  py-2
                                  rounded-lg
                                  text-xs
                                  transition-colors
                                  duration-150

                                  ${
                                    isActive
                                      ? "text-white font-medium bg-slate-800"
                                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                  }
                                `
                                }
                              >

                                <SubIcon
                                  size={14}
                                  className="
                                    flex-shrink-0
                                  "
                                />

                                <span
                                  className="
                                    truncate
                                  "
                                >
                                  {
                                    subItem.name
                                  }
                                </span>

                              </NavLink>

                            );
                          }
                        )}

                      </div>

                    )}

                </div>
              );
            }
          )}

        </nav>


        {/* ==================================================
            FOOTER
        ================================================== */}

        <div
          className="
            p-3
            mt-auto
            border-t
            border-slate-800
            bg-slate-900/30
            space-y-1.5
            flex-shrink-0
          "
        >


          {/* ================================================
              PARAMÈTRES
          ================================================= */}

          {canAccessSettings && (

            <NavLink
              to="/dashboard/settings"
              onClick={() =>
                setIsMenuOpen(false)
              }
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-3.5
                py-2.5
                rounded-xl
                text-sm
                group

                ${
                  isActive
                    ? activeClasses
                    : inactiveClasses
                }

                ${
                  !isMenuOpen &&
                  "lg:justify-center lg:px-3"
                }
              `
              }
              title={
                !isMenuOpen
                  ? "Paramètres"
                  : undefined
              }
            >

              <Settings
                size={18}
                className={`
                  flex-shrink-0

                  ${
                    location.pathname ===
                    "/dashboard/settings"
                      ? "text-indigo-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }
                `}
              />

              <span
                className={`
                  truncate

                  ${
                    !isMenuOpen &&
                    "lg:hidden"
                  }
                `}
              >
                Paramètres
              </span>

            </NavLink>

          )}


          {/* ================================================
              PROFIL
          ================================================= */}

          <NavLink
            to="/dashboard/profiles"
            onClick={() =>
              setIsMenuOpen(false)
            }
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-3
              px-3.5
              py-2.5
              rounded-xl
              text-sm
              group

              ${
                isActive
                  ? activeClasses
                  : inactiveClasses
              }

              ${
                !isMenuOpen &&
                "lg:justify-center lg:px-3"
              }
            `
            }
            title={
              !isMenuOpen
                ? "Profil"
                : undefined
            }
          >

            <User
              size={18}
              className={`
                flex-shrink-0

                ${
                  location.pathname ===
                  "/dashboard/profiles"
                    ? "text-indigo-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }
              `}
            />

            <span
              className={`
                truncate

                ${
                  !isMenuOpen &&
                  "lg:hidden"
                }
              `}
            >
              Profil
            </span>

          </NavLink>


          {/* ================================================
              DÉCONNEXION
          ================================================= */}

          <button
            onClick={logout}
            className={`
              flex
              items-center
              gap-3
              px-3.5
              py-2.5
              rounded-xl
              text-sm
              w-full
              text-left
              group
              text-red-400
              hover:bg-red-950/40
              hover:text-red-300

              ${
                !isMenuOpen &&
                "lg:justify-center lg:px-3"
              }
            `}
            title={
              !isMenuOpen
                ? "Déconnexion"
                : undefined
            }
          >

            <LogOut
              size={18}
              className="
                flex-shrink-0
                text-red-500
                group-hover:text-red-300
              "
            />

            <span
              className={`
                truncate

                ${
                  !isMenuOpen &&
                  "lg:hidden"
                }
              `}
            >
              Déconnexion
            </span>

          </button>


          {/* ================================================
              RÉDUIRE / AGRANDIR
          ================================================= */}

          <button
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
            className={`
              hidden
              lg:flex
              items-center
              gap-3
              px-3.5
              py-2.5
              rounded-xl
              text-sm
              w-full
              text-left
              text-slate-400
              hover:bg-slate-800
              hover:text-white
              transition-all

              ${
                !isMenuOpen &&
                "lg:justify-center lg:px-3"
              }
            `}
            title={
              isMenuOpen
                ? "Réduire le menu"
                : "Agrandir le menu"
            }
          >

            {isMenuOpen ? (

              <ChevronLeft
                size={18}
                className="
                  flex-shrink-0
                  text-slate-500
                "
              />

            ) : (

              <ChevronRight
                size={18}
                className="
                  flex-shrink-0
                  text-slate-500
                "
              />

            )}

            <span
              className={`
                truncate

                ${
                  !isMenuOpen &&
                  "lg:hidden"
                }
              `}
            >
              Réduire le menu
            </span>

          </button>

        </div>

      </aside>

    </>
  );
}
