import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    chargerNotifications();
  }, []);

  async function chargerNotifications() {
    try {
      const res = await fetch("/dashboard/notifications");
      const data = await res.json();

      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function markAsRead(id) {
    try {
      await fetch(`/dashboard/notifications/${id}/read`, {
        method: "PUT",
      });

      setNotifications((prev) =>
        prev.map((item) =>
          item.notification_id === id
            ? { ...item, lu: true }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function markAllRead() {
    try {
      await fetch("/dashboard/notifications/read-all", {
        method: "PUT",
      });

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          lu: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }

  const badges = {
    inscriptions: notifications.filter(
      (n) => n.type === "inscription" && !n.lu
    ).length,

    finances: notifications.filter(
      (n) => n.type === "paiement" && !n.lu
    ).length,

    personnel: notifications.filter(
      (n) => n.type === "personnel" && !n.lu
    ).length,

    classe: notifications.filter(
      (n) => n.type === "classe" && !n.lu
    ).length,
  };

  const unreadCount = notifications.filter(
    (n) => !n.lu
  ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        badges,
        unreadCount,
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