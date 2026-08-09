
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


  /* ==========================================================
     CHARGEMENT DE L'UTILISATEUR
  ========================================================== */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/current-user", {
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success && data.user) {

          console.log(
            "👤 Utilisateur connecté:",
            data.user
          );

          console.log(
            "📝 Prénom:",
            data.user?.firstname
          );

          console.log(
            "📝 Nom:",
            data.user?.lastname
          );

          console.log(
            "🔐 Rôle:",
            data.user?.roles?.name
          );

          setUser(data.user);

        } else {
          console.log(
            "⚠️ Aucun utilisateur connecté"
          );

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


  /* ==========================================================
     LOGIN
  ========================================================== */

  const login = (userData) => {

    console.log(
      "🔐 LOGIN USER:",
      userData
    );

    console.log(
      "📝 Prénom:",
      userData?.firstname
    );

    console.log(
      "📝 Nom:",
      userData?.lastname
    );

    console.log(
      "🔐 LOGIN ROLE:",
      userData?.roles?.name
    );

    setUser(userData);
  };


  /* ==========================================================
     LOGOUT
  ========================================================== */

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


  /* ==========================================================
     RÔLE UTILISATEUR
  ========================================================== */

  /*
   * Les rôles viennent directement de :
   *
   * user.roles.name
   *
   * Rôles disponibles :
   *
   * promoteur
   * superadmin
   * secretaire
   * comptable
   * agent
   * enseignant
   */

  const role =
    user?.roles?.name?.toLowerCase().trim() || "";


  /* ==========================================================
     NOM COMPLET
  ========================================================== */

  /*
   * Ton profil utilise :
   *
   * firstname
   * lastname
   */

  const firstName =
    user?.firstname || "";

  const lastName =
    user?.lastname || "";

  const fullName =
    `${firstName} ${lastName}`.trim();


  /* ==========================================================
     TESTER UN RÔLE
  ========================================================== */

  const hasRole = (requiredRole) => {

    if (!role || !requiredRole) {
      return false;
    }

    return (
      role === requiredRole
        .toLowerCase()
        .trim()
    );
  };


  /* ==========================================================
     TESTER PLUSIEURS RÔLES
  ========================================================== */

  const hasAnyRole = (...allowedRoles) => {

    if (!role) {
      return false;
    }

    return allowedRoles
      .map((r) =>
        r.toLowerCase().trim()
      )
      .includes(role);
  };


  /* ==========================================================
     ACCÈS COMPLET
  ========================================================== */

  /*
   * Ces rôles ont accès à l'ensemble
   * du menu :
   *
   * promoteur
   * superadmin
   * secretaire
   * comptable
   */

  const hasFullAccess = hasAnyRole(
    "promoteur",
    "superadmin",
    "secretaire",
    "comptable"
  );


  /* ==========================================================
     RÔLES SPÉCIFIQUES
  ========================================================== */

  const isPromoteur =
    hasRole("promoteur");

  const isSuperAdmin =
    hasRole("superadmin");

  const isSecretaire =
    hasRole("secretaire");

  const isComptable =
    hasRole("comptable");

  const isAgent =
    hasRole("agent");

  const isEnseignant =
    hasRole("enseignant");


  /* ==========================================================
     RÔLE LIMITÉ
  ========================================================== */

  const isLimited =
    hasAnyRole(
      "agent",
      "enseignant"
    );


  /* ==========================================================
     CONTEXT
  ========================================================== */

  return (
    <AuthContext.Provider
      value={{

        /* ==============================
           UTILISATEUR
        ============================== */

        user,

        loading,


        /* ==============================
           NOM
        ============================== */

        firstName,

        lastName,

        fullName,


        /* ==============================
           AUTH
        ============================== */

        login,

        logout,


        /* ==============================
           RÔLE
        ============================== */

        role,


        /* ==============================
           VÉRIFICATIONS
        ============================== */

        hasRole,

        hasAnyRole,


        /* ==============================
           ACCÈS
        ============================== */

        hasFullAccess,

        isLimited,


        /* ==============================
           RÔLES
        ============================== */

        isPromoteur,

        isSuperAdmin,

        isSecretaire,

        isComptable,

        isAgent,

        isEnseignant,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
}


/* ==========================================================
   USE AUTH
========================================================== */

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }

  return context;
}
