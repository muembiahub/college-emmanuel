import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================================
     CHARGER LES NOTIFICATIONS
  ========================================================== */

  const chargerNotifications = useCallback(async () => {
    try {
      const response = await fetch("/dashboard/notifications", {
        credentials: "include",
      });

      // 1. Si la réponse n'est pas OK (ex: 401 Unauthenticated ou 404 Not Found)
      if (!response.ok) {
        console.warn(`Erreur HTTP lors du chargement : ${response.status}`);
        return;
      }

      // 2. Vérification que la réponse est bien du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Le serveur renvoie du HTML au lieu de JSON.");
        return;
      }

      const data = await response.json();
      setNotifications(data ?? []);
    } catch (error) {
      console.error("Erreur notifications :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================================================
     INITIALISATION & POLLING (5s)
  ========================================================== */

  useEffect(() => {
    chargerNotifications();

    const interval = setInterval(() => {
      chargerNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [chargerNotifications]);

  /* ==========================================================
     MARQUER UNE NOTIFICATION COMME LUE
  ========================================================== */

  const markAsRead = async (id) => {
    // Mise à jour optimiste (immédiate sur l'interface)
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.notification_id === id
          ? { ...notification, lue: true }
          : notification
      )
    );

    try {
      const response = await fetch(`/dashboard/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Échec du marquage serveur.");
    } catch (error) {
      console.error("Erreur marquage notification :", error);
      // En cas d'erreur, resynchronisation avec la base de données
      chargerNotifications();
    }
  };

  /* ==========================================================
     SUPPRIMER / EFFACER UNE NOTIFICATION
  ========================================================== */

  const deleteNotification = async (id) => {
    // Suppression optimiste
    setNotifications((prev) =>
      prev.filter((notification) => notification.notification_id !== id)
    );

    try {
      const response = await fetch(`/dashboard/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Échec de la suppression serveur.");
    } catch (error) {
      console.error("Erreur suppression notification :", error);
      chargerNotifications();
    }
  };

  /* ==========================================================
     TOUT MARQUER COMME LU
  ========================================================== */

  const markAllRead = async () => {
    // Mise à jour optimiste
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, lue: true }))
    );

    try {
      const response = await fetch("/dashboard/notifications/read-all", {
        method: "PUT",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Échec du marquage global.");
    } catch (error) {
      console.error("Erreur marquage global :", error);
      chargerNotifications();
    }
  };

  /* ==========================================================
     BADGES & COMPTEURS
  ========================================================== */

  const badges = {
    inscriptions: notifications.filter(
      (n) => n.type === "inscription" && !n.lue
    ).length,

    finances: notifications.filter(
      (n) => n.type === "paiement" && !n.lue
    ).length,

    personnel: notifications.filter(
      (n) => n.type === "personnel" && !n.lue
    ).length,

    classe: notifications.filter(
      (n) => n.type === "classe" && !n.lue
    ).length,
  };

  const unreadCount = notifications.filter((n) => !n.lue).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        unreadCount,
        badges,
        chargerNotifications,
        markAsRead,
        deleteNotification,
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