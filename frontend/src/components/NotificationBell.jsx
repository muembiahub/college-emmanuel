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
} from "lucide-react";

import { useNotification } from "../context/NotificationContext";

const typeIcons = {
  inscription: UserPlus,
  paiement: CreditCard,
  personnel: Users,
  annee: Calendar,
  classe: FileText,
};

function formatRelativeTime(dateString) {
  if (!dateString) return "À l'instant";

  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `Il y a ${seconds} sec`;
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;

  return `Il y a ${Math.floor(seconds / 86400)} jour(s)`;
}

function getNotificationPath(notification) {
  switch (notification.type) {
    case "inscription":
      return `/dashboard/students?eleve=${notification.reference_id}`;

    case "paiement":
      return `/dashboard/finances/paiements?payment=${notification.reference_id}`;

    case "personnel":
      return `/dashboard/personnel?staff=${notification.reference_id}`;

    case "classe":
      return "/dashboard/classes";

    case "annee":
      return "/dashboard";

    default:
      return "/dashboard";
  }
}

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllRead,
    chargerNotifications,
  } = useNotification();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
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

  async function handleOpen() {
    if (!open) {
      await chargerNotifications();
    }

    setOpen(!open);
  }

  async function handleNotificationClick(notification) {
    if (!notification.lue) {
      await markAsRead(notification.notification_id);
    }

    setOpen(false);

    navigate(getNotificationPath(notification));
  }

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        onClick={handleOpen}
        className="relative flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100 transition"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}

        <span className="hidden lg:block">
          Notifications
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-2xl border bg-white shadow-2xl z-50">

          <div className="flex items-center justify-between border-b p-4">

            <div>

              <h3 className="font-bold">
                Notifications
              </h3>

              <p className="text-xs text-slate-500">
                {unreadCount} non lue
                {unreadCount > 1 ? "s" : ""}
              </p>

            </div>

            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs text-white hover:bg-indigo-700"
            >
              <CheckCheck size={14} />
              Tout lire
            </button>

          </div>

          <div className="max-h-[450px] overflow-y-auto">

            {loading ? (

              <div className="p-8 text-center text-slate-500">

                Chargement...

              </div>

            ) : notifications.length === 0 ? (

              <div className="p-8 text-center text-slate-500">

                Aucune notification

              </div>

            ) : (

              notifications.map((notification) => {

                const Icon =
                  typeIcons[notification.type] || Bell;

                return (

                  <button
                    key={notification.notification_id}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`w-full border-b p-4 text-left transition hover:bg-slate-50 ${
                      notification.lue
                        ? "bg-white"
                        : "bg-indigo-50"
                    }`}
                  >

                    <div className="flex gap-3">

                      <div className="rounded-full bg-indigo-100 p-3">

                        <Icon
                          size={18}
                          className="text-indigo-600"
                        />

                      </div>

                      <div className="flex-1">

                        <div className="flex items-center justify-between">

                          <h4 className="font-semibold">

                            {notification.titre}

                          </h4>

                          {!notification.lue && (

                            <span className="rounded-full bg-green-500 px-2 py-1 text-[10px] text-white">

                              Nouveau

                            </span>

                          )}

                        </div>

                        <p className="mt-1 text-sm text-slate-600">

                          {notification.message}

                        </p>

                        <p className="mt-2 text-xs text-slate-400">

                          {formatRelativeTime(
                            notification.created_at
                          )}

                        </p>

                      </div>

                    </div>

                  </button>

                );

              })

            )}

          </div>

        </div>
      )}
    </div>
  );
}