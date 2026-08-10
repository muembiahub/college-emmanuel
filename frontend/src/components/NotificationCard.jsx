
import React from "react";

import {
  Bell,
  UserPlus,
  CreditCard,
  Users,
  Calendar,
  FileText,
  Pencil,
  Trash2,
  Check,
  Trash,
} from "lucide-react";

/* ==========================================================
   CONFIGURATION DES TYPES DE NOTIFICATIONS
========================================================== */

const TYPE_CONFIG = {
  inscription: {
    icon: UserPlus,
    bg: "bg-emerald-50 border-emerald-100",
    color: "text-emerald-600",
  },

  paiement: {
    icon: CreditCard,
    bg: "bg-indigo-50 border-indigo-100",
    color: "text-indigo-600",
  },

  personnel: {
    icon: Users,
    bg: "bg-blue-50 border-blue-100",
    color: "text-blue-600",
  },

  classe: {
    icon: FileText,
    bg: "bg-amber-50 border-amber-100",
    color: "text-amber-600",
  },

  annee: {
    icon: Calendar,
    bg: "bg-purple-50 border-purple-100",
    color: "text-purple-600",
  },

  modification: {
    icon: Pencil,
    bg: "bg-sky-50 border-sky-100",
    color: "text-sky-600",
  },

  suppression: {
    icon: Trash2,
    bg: "bg-rose-50 border-rose-100",
    color: "text-rose-600",
  },
};

/* ==========================================================
   CONFIGURATION PAR DÉFAUT
========================================================== */

const DEFAULT_CONFIG = {
  icon: Bell,
  bg: "bg-slate-100 border-slate-200",
  color: "text-slate-600",
};

/* ==========================================================
   COMPOSANT
========================================================== */

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}) {
  /* ----------------------------------------------------------
     Sécurité
  ---------------------------------------------------------- */

  if (!notification) {
    return null;
  }

  const config =
    TYPE_CONFIG[notification.type] ||
    DEFAULT_CONFIG;

  const Icon = config.icon;

  /* ==========================================================
     FORMATAGE DE LA DATE
  ========================================================== */

  const formatDate = (dateString) => {
    if (!dateString) {
      return "";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const now = new Date();

    const isToday =
      date.toDateString() ===
      now.toDateString();

    if (isToday) {
      return `Aujourd'hui à ${date.toLocaleTimeString(
        "fr-FR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )}`;
    }

    return date.toLocaleDateString(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* ==========================================================
     MARQUER COMME LUE
  ========================================================== */

  const handleMarkAsRead = async () => {
    if (
      !notification.lue &&
      notification.notification_id
    ) {
      await onMarkAsRead?.(
        notification.notification_id
      );
    }
  };

  /* ==========================================================
     SUPPRIMER
  ========================================================== */

  const handleDelete = async () => {
    if (
      notification.notification_id
    ) {
      await onDelete?.(
        notification.notification_id
      );
    }
  };

  /* ==========================================================
     AFFICHAGE
  ========================================================== */

  return (
    <div
      className={`
        group
        relative
        flex
        items-start
        gap-4
        border-b
        border-slate-100/80
        p-4
        transition-all
        duration-200
        hover:bg-slate-50/80
        ${
          !notification.lue
            ? "bg-indigo-50/30"
            : "bg-white"
        }
      `}
    >

      {/* ======================================================
          INDICATEUR NON LU
      ====================================================== */}

      {!notification.lue && (
        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-1
            rounded-r-full
            bg-indigo-600
          "
        />
      )}

      {/* ======================================================
          ICÔNE
      ====================================================== */}

      <div
        className={`
          flex-shrink-0
          rounded-2xl
          border
          p-2.5
          shadow-inner
          transition-transform
          duration-200
          group-hover:scale-105
          ${config.bg}
        `}
      >
        <Icon
          size={20}
          className={config.color}
        />
      </div>

      {/* ======================================================
          CONTENU
      ====================================================== */}

      <div
        className="
          min-w-0
          flex-1
          pr-2
        "
      >

        <div
          className="
            flex
            items-baseline
            justify-between
            gap-2
          "
        >
          <h3
            className={`
              truncate
              text-sm
              leading-snug
              tracking-tight
              ${
                notification.lue
                  ? "font-medium text-slate-700"
                  : "font-bold text-slate-900"
              }
            `}
          >
            {notification.titre ||
              "Notification"}
          </h3>

          <span
            className="
              whitespace-nowrap
              text-[11px]
              font-medium
              text-slate-400
            "
          >
            {formatDate(
              notification.created_at ??
                notification.date_envoi
            )}
          </span>
        </div>

        <p
          className="
            mt-1
            break-words
            text-xs
            leading-relaxed
            text-slate-600
          "
        >
          {notification.message}
        </p>
      </div>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      <div
        className="
          flex
          flex-shrink-0
          items-center
          gap-2
        "
      >

        {/* ----------------------------------------------------
            BADGE NOUVEAU
        ---------------------------------------------------- */}

        {!notification.lue && (
          <div
            className="
              hidden
              items-center
              gap-1.5
              rounded-full
              border
              border-indigo-200/60
              bg-indigo-100/80
              px-2.5
              py-1
              sm:flex
            "
          >
            <span
              className="
                relative
                flex
                h-2
                w-2
              "
            >
              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-indigo-400
                  opacity-75
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  h-2
                  w-2
                  rounded-full
                  bg-indigo-600
                "
              />
            </span>

            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-wider
                text-indigo-700
              "
            >
              Nouveau
            </span>
          </div>
        )}

        {/* ----------------------------------------------------
            BOUTONS
        ---------------------------------------------------- */}

        <div
          className="
            flex
            items-center
            gap-1
            opacity-90
            transition-opacity
            duration-200
            sm:opacity-0
            sm:group-hover:opacity-100
          "
        >

          {/* Marquer comme lue */}

          {!notification.lue && (
            <button
              type="button"
              onClick={handleMarkAsRead}
              title="Marquer comme lue"
              aria-label="Marquer comme lue"
              className="
                cursor-pointer
                rounded-lg
                border
                border-transparent
                p-1.5
                text-slate-400
                transition-all
                hover:border-emerald-200
                hover:bg-emerald-50
                hover:text-emerald-600
              "
            >
              <Check size={16} />
            </button>
          )}

          {/* Supprimer */}

          <button
            type="button"
            onClick={handleDelete}
            title="Supprimer la notification"
            aria-label="Supprimer la notification"
            className="
              cursor-pointer
              rounded-lg
              border
              border-transparent
              p-1.5
              text-slate-400
              transition-all
              hover:border-rose-200
              hover:bg-rose-50
              hover:text-rose-600
            "
          >
            <Trash size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}