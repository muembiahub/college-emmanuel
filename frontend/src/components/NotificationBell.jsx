
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CheckCheck,
  UserPlus,
  CreditCard,
  Users,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { useNotification } from "../context/NotificationContext";

const typeIcons = {
  inscription: UserPlus,
  paiement: CreditCard,
  personnel: Users,
  annee: Calendar,
  classe: FileText,
  absence: Calendar,
  bulletin: FileText,
  modification: Pencil,
  suppression: Trash2,
};

function formatRelativeTime(dateString) {
  if (!dateString) {
    return "À l'instant";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "À l'instant";
  }

  const seconds = Math.floor(
    (Date.now() - date.getTime()) / 1000
  );

  if (seconds < 60) {
    return `Il y a ${Math.max(seconds, 0)} sec`;
  }

  if (seconds < 3600) {
    return `Il y a ${Math.floor(seconds / 60)} min`;
  }

  if (seconds < 86400) {
    return `Il y a ${Math.floor(seconds / 3600)} h`;
  }

  return `Il y a ${Math.floor(seconds / 86400)} jour(s)`;
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
  } = useNotification();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  /* ==========================================================
     FERMER LE MENU SI ON CLIQUE À L'EXTÉRIEUR
  ========================================================== */

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* ==========================================================
     OUVRIR / FERMER LES NOTIFICATIONS
     
     IMPORTANT :
     On ne fait PAS de fetch ici.
     
     Les notifications sont déjà dans le Context.
  ========================================================== */

  function handleOpen() {
    setOpen((prev) => !prev);
  }

  /* ==========================================================
     CLIQUER SUR UNE NOTIFICATION
  ========================================================== */

  async function handleNotificationClick(notification) {
    try {
      if (
        !notification.lue &&
        notification.notification_id
      ) {
        await markAsRead(
          notification.notification_id
        );
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors du marquage :",
        error
      );
    }

    setOpen(false);

    navigate(
      "/dashboard/all-notifications"
    );
  }

  /* ==========================================================
     VOIR TOUTES LES NOTIFICATIONS
  ========================================================== */

  function openNotificationsPage() {
    setOpen(false);

    navigate(
      "/dashboard/all-notifications"
    );
  }

  /* ==========================================================
     AFFICHER LES 8 PLUS RÉCENTES
  ========================================================== */

  const notificationsRecentes =
    notifications.slice(0, 8);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      ref={menuRef}
      className="relative"
    >

      {/* ======================================================
          BOUTON NOTIFICATIONS
      ====================================================== */}

      <button
        type="button"
        onClick={handleOpen}
        className="relative flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-800"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={21} />

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-red-600
              px-1
              text-[10px]
              font-bold
              text-white
            "
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}

        <span className="hidden text-sm font-medium lg:block">
          Notifications
        </span>
      </button>

      {/* ======================================================
          MENU
      ====================================================== */}

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-3
            w-96
            overflow-hidden
            rounded-3xl
            border
            border-slate-800/80
            bg-slate-950/95
            text-slate-100
            shadow-2xl
            backdrop-blur-2xl
          "
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-slate-800
              p-4
            "
          >
            <div>
              <h3 className="font-bold">
                Notifications
              </h3>

              <p className="text-xs text-slate-400">
                {unreadCount} non lue
                {unreadCount > 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                "
              >
                <CheckCheck size={14} />

                Tout lire
              </button>
            )}
          </div>

          {/* ==================================================
              LISTE
          ================================================== */}

          <div
            className="
              max-h-[450px]
              divide-y
              divide-slate-800
              overflow-y-auto
            "
          >

            {loading ? (
              <div className="p-8 text-center text-slate-400">
                Chargement...
              </div>
            ) : notificationsRecentes.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Aucune notification
              </div>
            ) : (
              notificationsRecentes.map(
                (notification) => {

                  const Icon =
                    typeIcons[
                      notification.type
                    ] || Bell;

                  return (
                    <button
                      type="button"
                      key={
                        notification.notification_id
                      }
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                      className={`
                        flex
                        w-full
                        gap-3
                        p-4
                        text-left
                        transition
                        hover:bg-slate-900
                        ${
                          notification.lue
                            ? ""
                            : "border-l-4 border-indigo-500 bg-indigo-950/20"
                        }
                      `}
                    >

                      {/* Icône */}

                      <div
                        className="
                          h-fit
                          rounded-xl
                          bg-indigo-500/20
                          p-3
                        "
                      >
                        <Icon
                          size={18}
                          className="text-indigo-400"
                        />
                      </div>

                      {/* Contenu */}

                      <div className="flex-1">

                        <div className="flex items-center justify-between gap-2">

                          <h4 className="text-sm font-semibold">
                            {notification.titre}
                          </h4>

                          {!notification.lue && (
                            <span
                              className="
                                shrink-0
                                rounded-full
                                bg-emerald-600
                                px-2
                                py-1
                                text-[10px]
                                font-bold
                              "
                            >
                              Nouveau
                            </span>
                          )}

                        </div>

                        <p className="mt-1 text-sm text-slate-300">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {formatRelativeTime(
                            notification.created_at ??
                              notification.date_envoi
                          )}
                        </p>

                      </div>

                    </button>
                  );
                }
              )
            )}

          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="
              border-t
              border-slate-800
              p-3
            "
          >
            <button
              type="button"
              onClick={openNotificationsPage}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-indigo-600
                py-3
                font-semibold
                text-white
                transition
                hover:bg-indigo-700
              "
            >
              Voir toutes les notifications

              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
