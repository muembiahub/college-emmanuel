import { supabase } from "../config/database.js";

/* =====================================================
   AUTH CONTROLLERS
===================================================== */

/**
 * Connexion (Login)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email et mot de passe requis" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const message = error.message.includes("Invalid login credentials")
        ? "Email ou mot de passe incorrect"
        : error.message;
      return res.status(401).json({ success: false, message });
    }

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token: data.session?.access_token || null,
      user: data.user,
    });
  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({ success: false, message: "Erreur interne du serveur lors de la connexion" });
  }
};

/**
 * Déconnexion (Logout)
 */
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur logout:", error);
    return res.status(500).json({ success: false, message: "Erreur interne du serveur lors de la déconnexion" });
  }
};

/**
 * Utilisateur connecté (Current user)
 */
export const currentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Utilisateur non authentifié" });
    }

    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.error("Erreur currentUser:", error);
    return res.status(500).json({ success: false, message: "Erreur interne du serveur" });
  }
};
