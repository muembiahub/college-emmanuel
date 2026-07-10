import { useCallback, useEffect, useState } from "react";

export default function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/dashboard/notifications");
      if (!res.ok) {
        throw new Error("Erreur lors du chargement des notifications");
      }
      const data = await res.json();
      setNotifications(data || []);
    } catch (error) {
      console.error("useNotifications error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id) => {
    try {
      await fetch(`/dashboard/notifications/${id}/read`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, lu: true } : n
        )
      );
    } catch (error) {
      console.error("Erreur markAsRead:", error);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await fetch("/dashboard/notifications/read-all", {
        method: "PUT",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
    } catch (error) {
      console.error("Erreur markAllRead:", error);
    }
  }, []);

  const badges = {
    inscriptions: notifications.filter(
      (n) => n.type === "inscription" && !n.lu
    ).length,
    classe: notifications.filter(
      (n) => n.type === "classe" && !n.lu
    ).length,
    finances: notifications.filter(
      (n) => n.type === "paiement" && !n.lu
    ).length,
    personnel: notifications.filter(
      (n) => n.type === "personnel" && !n.lu
    ).length,
  };

  const unreadCount = notifications.filter((n) => !n.lu).length;

  return {
    notifications,
    badges,
    unreadCount,
    markAsRead,
    markAllRead,
    refresh: fetchNotifications,
    loading,
  };
}
