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
  if (!dateString) return "À l'instant";

  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `Il y a ${seconds} sec`;
  if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;

  return `Il y a ${Math.floor(seconds / 86400)} jour(s)`;
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

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  async function handleOpen() {
    if (!open) {
      await chargerNotifications();
    }

    setOpen((prev) => !prev);
  }

  async function handleNotificationClick(notification) {
    if (!notification.lue) {
      await markAsRead(notification.notification_id);
    }

    setOpen(false);

    navigate("/dashboard/notifications");
  }

  function openNotificationsPage() {
    setOpen(false);
    navigate("/dashboard/notifications");
  }

  return (
    <div className="relative ml-6" ref={menuRef}>
      <button
        onClick={handleOpen}
        className="relative flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/40 px-3.5 py-2.5 text-slate-300 shadow-inner backdrop-blur-md transition-all hover:bg-slate-900/80 hover:text-white group"
      >
        <Bell
          size={20}
          className="transition-transform duration-300 group-hover:rotate-12"
        />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}

        <span className="hidden text-sm font-medium lg:block">
          Notifications
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-96 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/95 text-slate-100 shadow-2xl backdrop-blur-2xl">

          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div>
              <h3 className="font-bold">
                Notifications
              </h3>

              <p className="text-xs text-slate-400">
                {unreadCount} non lue
                {unreadCount > 1 ? "s" : ""}
              </p>
            </div>

            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              <CheckCheck size={14} />
              Tout lire
            </button>
          </div>

          <div className="max-h-[450px] overflow-y-auto divide-y divide-slate-800">

            {loading ? (
              <div className="p-8 text-center">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Aucune notification
              </div>
            ) : (
              notifications.slice(0, 8).map((notification) => {
                const Icon =
                  typeIcons[notification.type] || Bell;

                return (
                  <button
                    key={notification.notification_id}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`flex w-full gap-3 p-4 text-left transition hover:bg-slate-900 ${
                      notification.lue
                        ? ""
                        : "border-l-4 border-indigo-500 bg-indigo-950/20"
                    }`}
                  >
                    <div className="rounded-xl bg-indigo-500/20 p-3">
                      <Icon
                        size={18}
                        className="text-indigo-400"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">
                          {notification.titre}
                        </h4>

                        {!notification.lue && (
                          <span className="rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-bold">
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
              })
            )}
          </div>

          <div className="border-t border-slate-800 p-3">
            <button
              onClick={openNotificationsPage}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
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