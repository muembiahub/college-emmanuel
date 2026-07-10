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
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return `Il y a ${diff} sec`;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return `Il y a ${Math.floor(diff / 86400)} jour(s)`;
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
    markAsRead,
    markAllRead,
  } = useNotification();

  const [open, setOpen] = useState(false);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleNotificationClick(notification) {
    await markAsRead(notification.notification_id);

    setOpen(false);

    navigate(getNotificationPath(notification));
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative flex items-center gap-2"
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}

        <span className="hidden md:block">Notifications</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl bg-slate-900 shadow-2xl border border-slate-700 z-50">
          <div className="flex items-center justify-between border-b border-slate-700 p-4">
            <div>
              <h3 className="text-white font-semibold">
                Notifications
              </h3>

              <p className="text-xs text-slate-400">
                {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
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

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                Aucune notification
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = typeIcons[notification.type] || Bell;

                return (
                  <button
                    key={notification.notification_id}
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    className={`w-full p-4 text-left border-b border-slate-800 hover:bg-slate-800 transition ${
                      notification.lu
                        ? "bg-slate-900"
                        : "bg-slate-800"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="rounded-full bg-slate-700 p-2">
                        <Icon size={16} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-white">
                            {notification.titre}
                          </h4>

                          {!notification.lu && (
                            <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] text-white">
                              Nouveau
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-300">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                          {formatRelativeTime(notification.created_at)}
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