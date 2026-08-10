
import { useNotification } from "../context/NotificationContext.jsx";

/**
 * Hook notifications
 *
 * Utilise NotificationContext comme source unique
 * pour éviter plusieurs appels API concurrents.
 */
export default function useNotifications() {
  const {
    notifications,
    loading,
    unreadCount,
    badges,
    markAsRead,
    markAllRead,
    chargerNotifications,
    deleteNotification,
  } = useNotification();

  return {
    notifications,
    loading,
    unreadCount,
    badges,

    markAsRead,
    markAllRead,
    deleteNotification,

    // Alias pour garder ton ancien nom
    refresh: chargerNotifications,
  };
}