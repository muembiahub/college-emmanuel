
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

  /*
   * ==========================================================
   * CHARGEMENT DE L'UTILISATEUR
   * ==========================================================
   */

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Le cookie de session est envoyé automatiquement.
        const response = await fetch("/current-user", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          console.log(
            "👤 Utilisateur connecté:",
            data.user
          );

          console.log(
            "🔐 Rôle:",
            data.user?.roles?.name
          );

          setUser(
            data.user ||
            data.data ||
            null
          );
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "❌ Erreur lors du chargement de la session:",
          error
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /*
   * ==========================================================
   * LOGIN
   * ==========================================================
   */

  const login = (userData) => {
    console.log(
      "🔐 LOGIN USER:",
      userData
    );

    console.log(
      "🔐 LOGIN ROLE:",
      userData?.roles?.name
    );

    setUser(userData);
  };

  /*
   * ==========================================================
   * LOGOUT
   * ==========================================================
   */

  const logout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error(
        "❌ Erreur lors de la déconnexion:",
        error
      );
    } finally {
      setUser(null);
    }
  };

  /*
   * ==========================================================
   * RÔLE UTILISATEUR
   * ==========================================================
   *
   * Le backend retourne :
   *
   * user.roles.name
   *
   * Exemples :
   *
   * superadmin
   * admin
   * secretaire
   * agent
   * enseignant
   * comptable
   *
   */

  const role =
    user?.roles?.name?.toLowerCase() || "";

  /*
   * ==========================================================
   * TESTER UN RÔLE
   * ==========================================================
   */

  const hasRole = (requiredRole) => {
    if (!role || !requiredRole) {
      return false;
    }

    return (
      role === requiredRole.toLowerCase()
    );
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
   *
   * Seuls admin et superadmin sont considérés
   * comme utilisateurs privilégiés.
   */

  const isPrivileged = hasAnyRole(
    "admin",
    "superadmin"
  );

  /*
   * ==========================================================
   * RÔLES SPÉCIFIQUES
   * ==========================================================
   */

  const isSuperAdmin =
    hasRole("superadmin");

  const isAdmin =
    hasRole("admin");

  const isSecretaire =
    hasRole("secretaire");

  const isAgent =
    hasRole("agent");

  const isEnseignant =
    hasRole("enseignant");

  const isComptable =
    hasRole("comptable");

  /*
   * ==========================================================
   * CONTEXT
   * ==========================================================
   */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,

        // Auth
        login,
        logout,

        // Rôle actuel
        role,

        // Vérifications générales
        hasRole,
        hasAnyRole,

        // Utilisateur privilégié
        isPrivileged,

        // Rôles spécifiques
        isSuperAdmin,
        isAdmin,
        isSecretaire,
        isAgent,
        isEnseignant,
        isComptable,
      }}
    >
      {/*
        Empêche l'application de clignoter
        ou d'afficher des pages protégées
        avant la validation de la session.
      */}

      {children}
    </AuthContext.Provider>
  );
}


/*
 * ==========================================================
 * USE AUTH
 * ==========================================================
 */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}