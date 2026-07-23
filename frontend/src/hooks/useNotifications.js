import { useCallback, useEffect, useMemo, useState } from "react";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/dashboard/notifications");

      if (!res.ok) {
        throw new Error("Impossible de charger les notifications");
      }

      const result = await res.json();

      setNotifications(result.data || result || []);
    } catch (error) {
      console.error("Notifications :", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      const res = await fetch(`/dashboard/notifications/${id}/read`, {
        method: "PUT",
      });

      if (!res.ok) throw new Error();

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === id
            ? { ...notification, lu: true }
            : notification
        )
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      const res = await fetch("/dashboard/notifications/read-all", {
        method: "PUT",
      });

      if (!res.ok) throw new Error();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          lu: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.lu).length,
    [notifications]
  );

  const badges = useMemo(
    () => ({
      inscriptions: notifications.filter(
        (n) => n.type === "inscription" && !n.lu
      ).length,

      finances: notifications.filter(
        (n) =>
          ["paiement", "finance", "obligation"].includes(n.type) &&
          !n.lu
      ).length,

      personnel: notifications.filter(
        (n) => n.type === "personnel" && !n.lu
      ).length,

      classe: notifications.filter(
        (n) => n.type === "classe" && !n.lu
      ).length,

      eleves: notifications.filter(
        (n) => n.type === "eleve" && !n.lu
      ).length,

      total: notifications.filter((n) => !n.lu).length,
    }),
    [notifications]
  );

  return {
    notifications,
    loading,
    unreadCount,
    badges,
    markAsRead,
    markAllRead,
    refresh: fetchNotifications,
  };
}