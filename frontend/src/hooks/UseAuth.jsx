import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Le cookie de session est envoyé automatiquement.
        const response = await fetch("/current-user", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Le backend retourne normalement l'utilisateur
          // dans la propriété `user`.
          setUser(data.user || data.data || null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement de la session:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Connexion
  const login = (userData) => {
    setUser(userData);
  };

  // Déconnexion
  const logout = async () => {
    try {
      // Si tu as déjà une route backend /auth/logout,
      // on la laisse gérer la destruction de la session.
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      setUser(null);
    }
  };

  /*
   * ==========================================================
   * RÔLE UTILISATEUR
   * ==========================================================
   *
   * Ton backend semble retourner :
   *
   * user.roles.name
   *
   * Exemple :
   *
   * user.roles.name = "agent"
   *
   */

  const role = user?.roles?.name?.toLowerCase() || "";

  /*
   * ==========================================================
   * TESTER UN RÔLE
   * ==========================================================
   */

  const hasRole = (requiredRole) => {
    if (!role || !requiredRole) {
      return false;
    }

    return role === requiredRole.toLowerCase();
  };

  /*
   * ==========================================================
   * TESTER PLUSIEURS RÔLES
   * ==========================================================
   *
   * Exemple :
   *
   * hasAnyRole("admin", "superadmin")
   *
   */

  const hasAnyRole = (...allowedRoles) => {
    if (!role) {
      return false;
    }

    return allowedRoles
      .map((r) => r.toLowerCase())
      .includes(role);
  };

  /*
   * ==========================================================
   * RÔLES PRIVILÉGIÉS
   * ==========================================================
   */

  const isPrivileged = hasAnyRole(
    "admin",
    "superadmin"
  );

  /*
   * ==========================================================
   * RÔLES SPÉCIFIQUES
   * ==========================================================
   *
   * Ces valeurs peuvent être utilisées directement
   * dans les composants si nécessaire.
   */

  const isSuperAdmin = hasRole("superadmin");

  const isAdmin = hasRole("admin");

  const isAgent = hasRole("agent");

  const isEnseignant = hasRole("enseignant");

  const isComptable = hasRole("comptable");

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        // Auth
        login,
        logout,

        // Rôle
        role,

        // Vérifications générales
        hasRole,
        hasAnyRole,

        // Rôles privilégiés
        isPrivileged,

        // Vérifications spécifiques
        isSuperAdmin,
        isAdmin,
        isAgent,
        isEnseignant,
        isComptable,
      }}
    >
      {/*
        Empêche l'application de clignoter ou
        d'afficher des pages protégées avant
        la validation de la session.
      */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}