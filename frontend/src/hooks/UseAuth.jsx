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
        // Le cookie de session est envoyé automatiquement par le navigateur.
        // On demande juste au backend "qui suis-je ?".
        const response = await fetch("/current-user", {
          // credentials: 'include' est crucial si le frontend et le backend ne sont pas sur le même domaine en production
          credentials: "include", 
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // backend retourne l'utilisateur dans la clé `user`
          setUser(data.user || data.data || null);
        } else {
          // Si la session est invalide (401) ou autre erreur, on s'assure que l'utilisateur est null
          setUser(null);
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Déclenché par le handleSubmit de votre formulaire lors d'une connexion réussie
  // Le backend gère maintenant la session, le frontend a juste besoin de savoir qui est l'utilisateur.
  const login = (userData) => {
    setUser(userData);
  };

  // Déconnexion complète côté client
  const logout = () => {
    // Le backend détruit la session et le cookie, on nettoie juste l'état local.
    setUser(null);
  };

  // Lecture sécurisée du rôle utilisateur calculé depuis le backend
  const role = user?.roles?.name?.toLowerCase() || "";
  const isPrivileged = ["admin", "superadmin"].includes(role);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isPrivileged,
        role,
      }}
    >
      {/* 
        Empêche l'application de clignoter ou d'afficher des pages protégées 
        pendant que le serveur Express valide le token au démarrage
      */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
