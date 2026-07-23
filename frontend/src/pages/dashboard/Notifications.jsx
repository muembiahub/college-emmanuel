import React from "react";
import { Bell, CheckCheck, Inbox, Activity, AlertCircle, Calendar } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import NotificationCard from "../../components/NotificationCard";

export default function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,
    markAllRead,
    markAsRead,          // Fonction du contexte pour marquer UNE notification comme lue
    deleteNotification,  // Fonction du contexte pour supprimer UNE notification
  } = useNotification();

  const todayCount = notifications.filter(
    (n) => new Date(n.created_at).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8">
      
      {/* EN-TÊTE DE LA PAGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 shadow-inner">
              <Bell size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
          </div>
          <p className="text-slate-500 mt-1.5 text-sm ml-12">
            Consultez le fil d'actualité et l'historique des activités du système.
          </p>
        </div>

        <button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer ${
            unreadCount > 0
              ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-md active:scale-95"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          <CheckCheck size={16} />
          Tout marquer comme lu
        </button>
      </div>

      {/* CARTES STATISTIQUES (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* TOTAL */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-400 rounded-l-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Total</p>
              <h2 className="mt-1 text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform origin-left">
                {notifications.length}
              </h2>
            </div>
            <div className="p-3 bg-slate-100/80 text-slate-600 rounded-xl group-hover:bg-slate-200/60 transition-colors">
              <Activity size={22} />
            </div>
          </div>
        </div>

        {/* NON LUES */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-rose-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 rounded-l-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-rose-500">Non lues</p>
              <h2 className="mt-1 text-3xl font-extrabold text-rose-600 group-hover:scale-105 transition-transform origin-left">
                {unreadCount}
              </h2>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition-colors">
              <AlertCircle size={22} />
            </div>
          </div>
        </div>

        {/* AUJOURD'HUI */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-indigo-500">Aujourd'hui</p>
              <h2 className="mt-1 text-3xl font-extrabold text-indigo-600 group-hover:scale-105 transition-transform origin-left">
                {todayCount}
              </h2>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Calendar size={22} />
            </div>
          </div>
        </div>

      </div>

      {/* CONTENEUR LISTE DES NOTIFICATIONS */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/40 overflow-hidden divide-y divide-slate-100">

        {loading ? (
          
          <div className="p-12 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-500">Chargement des notifications en cours...</p>
          </div>

        ) : notifications.length === 0 ? (

          <div className="p-16 text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-200/60 shadow-inner">
              <Inbox size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800">Aucune notification</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Vous êtes à jour ! Toutes vos alertes et activités récentes apparaîtront ici.
            </p>
          </div>

        ) : (

          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.notification_id}
                notification={notification}
                onMarkAsRead={(id) => markAsRead?.(id)}
                onDelete={(id) => deleteNotification?.(id)}
              />
            ))}
          </div>

        )}

      </div>

    </div>
  );
}