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

// Configuration des thèmes de couleurs et icônes par type de notification
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

const DEFAULT_CONFIG = {
  icon: Bell,
  bg: "bg-slate-100 border-slate-200",
  color: "text-slate-600",
};

export default function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}) {
  const config = TYPE_CONFIG[notification.type] || DEFAULT_CONFIG;
  const Icon = config.icon;

  // Formatage propre de la date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return `Aujourd'hui à ${date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 transition-all duration-200 border-b border-slate-100/80 hover:bg-slate-50/80 ${
        !notification.lue ? "bg-indigo-50/30" : "bg-white"
      }`}
    >
      {/* Indicateur visuel d'état non-lu sur le bord gauche */}
      {!notification.lue && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-md" />
      )}

      {/* Conteneur d'icône avec profondeur et relief */}
      <div
        className={`flex-shrink-0 p-2.5 rounded-2xl border shadow-inner transition-transform duration-200 group-hover:scale-105 ${config.bg}`}
      >
        <Icon size={20} className={config.color} />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className={`text-sm tracking-tight leading-snug truncate ${
              notification.lue
                ? "font-medium text-slate-700"
                : "font-bold text-slate-900"
            }`}
          >
            {notification.titre}
          </h3>

          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
            {formatDate(notification.created_at)}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-600 leading-relaxed break-words">
          {notification.message}
        </p>
      </div>

      {/* Zone des actions & badge d'état */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Badge "Nouveau" pour les notifications non lues */}
        {!notification.lue && (
          <div className="hidden sm:flex items-center gap-1.5 bg-indigo-100/80 border border-indigo-200/60 px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Nouveau
            </span>
          </div>
        )}

        {/* Boutons d'action rapides */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Bouton : Marquer comme lu */}
          {!notification.lue && (
            <button
              onClick={() => onMarkAsRead?.(notification.notification_id)}
              title="Marquer comme lue"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
            >
              <Check size={16} />
            </button>
          )}

          {/* Bouton : Effacer / Supprimer */}
          <button
            onClick={() => onDelete?.(notification.notification_id)}
            title="Supprimer la notification"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}