
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==========================================================
     CHARGER LES NOTIFICATIONS
  ========================================================== */

  const chargerNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        "/dashboard/notifications",
        {
          credentials: "include",
        }
      );

      /* --------------------------------------------------------
         SESSION NON AUTHENTIFIÉE
      -------------------------------------------------------- */

      if (response.status === 401) {
        console.warn(
          "⚠️ Session non authentifiée pour les notifications."
        );

        setNotifications([]);
        return;
      }

      /* --------------------------------------------------------
         AUTRE ERREUR HTTP
      -------------------------------------------------------- */

      if (!response.ok) {
        console.warn(
          `⚠️ Erreur HTTP notifications : ${response.status}`
        );

        return;
      }

      /* --------------------------------------------------------
         VÉRIFIER QUE LA RÉPONSE EST DU JSON
      -------------------------------------------------------- */

      const contentType =
        response.headers.get("content-type");

      if (
        !contentType ||
        !contentType.includes(
          "application/json"
        )
      ) {
        console.error(
          "❌ Le serveur renvoie autre chose que du JSON."
        );

        return;
      }

      /* --------------------------------------------------------
         LIRE LE JSON
      -------------------------------------------------------- */

      const data =
        await response.json();

      /*
       * Selon ton backend, la réponse peut être :
       *
       * [...]
       *
       * ou :
       *
       * {
       *   success: true,
       *   data: [...]
       * }
       */

      const liste =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setNotifications(liste);

    } catch (error) {
      console.error(
        "❌ Erreur notifications :",
        error
      );

    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================================================
     CHARGEMENT INITIAL
     
     UNE SEULE FOIS
  ========================================================== */

  useEffect(() => {
    chargerNotifications();
  }, [chargerNotifications]);

  /* ==========================================================
     RAFRAÎCHIR QUAND L'UTILISATEUR REVIENT SUR L'APPLICATION
     
     Pas de polling permanent.
  ========================================================== */

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        chargerNotifications();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [chargerNotifications]);

  /* ==========================================================
     RAFRAÎCHIR LORSQUE LA FENÊTRE REPREND LE FOCUS
  ========================================================== */

  useEffect(() => {
    const handleFocus = () => {
      chargerNotifications();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [chargerNotifications]);

  /* ==========================================================
     MARQUER UNE NOTIFICATION COMME LUE
  ========================================================== */

  const markAsRead = async (id) => {
    /* --------------------------------------------------------
       Mise à jour optimiste
    -------------------------------------------------------- */

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

    try {
      const response = await fetch(
        `/dashboard/notifications/${id}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Échec du marquage serveur."
        );
      }

    } catch (error) {
      console.error(
        "❌ Erreur marquage notification :",
        error
      );

      await chargerNotifications();
    }
  };

  /* ==========================================================
     SUPPRIMER UNE NOTIFICATION
  ========================================================== */

  const deleteNotification = async (id) => {
    /* --------------------------------------------------------
       Mise à jour optimiste
    -------------------------------------------------------- */

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.notification_id !== id
      )
    );

    try {
      const response = await fetch(
        `/dashboard/notifications/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Échec de la suppression serveur."
        );
      }

    } catch (error) {
      console.error(
        "❌ Erreur suppression notification :",
        error
      );

      await chargerNotifications();
    }
  };

  /* ==========================================================
     TOUT MARQUER COMME LU
  ========================================================== */

  const markAllRead = async () => {
    /* --------------------------------------------------------
       Mise à jour optimiste
    -------------------------------------------------------- */

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        lue: true,
      }))
    );

    try {
      const response = await fetch(
        "/dashboard/notifications/read-all",
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Échec du marquage global."
        );
      }

    } catch (error) {
      console.error(
        "❌ Erreur marquage global :",
        error
      );

      await chargerNotifications();
    }
  };

  /* ==========================================================
     BADGES
  ========================================================== */

  const badges = {
    inscriptions:
      notifications.filter(
        (notification) =>
          notification.type === "inscription" &&
          !notification.lue
      ).length,

    finances:
      notifications.filter(
        (notification) =>
          notification.type === "paiement" &&
          !notification.lue
      ).length,

    personnel:
      notifications.filter(
        (notification) =>
          notification.type === "personnel" &&
          !notification.lue
      ).length,

    classe:
      notifications.filter(
        (notification) =>
          notification.type === "classe" &&
          !notification.lue
      ).length,
  };

  /* ==========================================================
     TOTAL NON LUES
  ========================================================== */

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.lue
    ).length;

  /* ==========================================================
     CONTEXT
  ========================================================== */

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

/* ==========================================================
   HOOK
========================================================== */

export function useNotification() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }

  return context;
}