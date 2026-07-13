import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================================
     CHARGER LES NOTIFICATIONS
  ========================================================== */

  const chargerNotifications = async () => {
    try {
      const response = await fetch(
        "/dashboard/notifications",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de charger les notifications."
        );
      }

      const data = await response.json();

      setNotifications(data ?? []);
    } catch (error) {
      console.error(
        "Erreur notifications :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     INITIALISATION
  ========================================================== */

  useEffect(() => {
    chargerNotifications();

    const interval = setInterval(() => {
      chargerNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ==========================================================
     MARQUER UNE NOTIFICATION
  ========================================================== */

  const markAsRead = async (id) => {
    try {
      await fetch(
        `/dashboard/notifications/${id}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === id
            ? {
                ...notification,
                lue: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================================
     TOUT LIRE
  ========================================================== */

  const markAllRead = async () => {
    try {
      await fetch(
        "/dashboard/notifications/read-all",
        {
          method: "PUT",
          credentials: "include",
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          lue: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==========================================================
     BADGES
  ========================================================== */

  const badges = {
    inscriptions: notifications.filter(
      (n) =>
        n.type === "inscription" &&
        !n.lue
    ).length,

    finances: notifications.filter(
      (n) =>
        n.type === "paiement" &&
        !n.lue
    ).length,

    personnel: notifications.filter(
      (n) =>
        n.type === "personnel" &&
        !n.lue
    ).length,

    classe: notifications.filter(
      (n) =>
        n.type === "classe" &&
        !n.lue
    ).length,
  };

  const unreadCount = notifications.filter(
    (n) => !n.lue
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,
        badges,
        chargerNotifications,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
