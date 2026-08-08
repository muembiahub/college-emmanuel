import { supabase } from "../config/database.js";
import { completeInvitationSetup } from "../models/auth.js";

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

/**
 * Finalisation de l'invitation (création du mot de passe)
 */
export const completeInvitation = async (req, res) => {
  try {
    const { password } = req.body;
    // Le jeton est passé dans le header Authorization: Bearer <token>
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Jeton d'accès manquant." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const { user, error } = await completeInvitationSetup(accessToken, password);

    if (error) {
      // Personnalisation du message d'erreur pour l'utilisateur
      const message = error.message.includes("expired") ? "Le lien d'invitation a expiré." : "Une erreur est survenue lors de la finalisation du compte.";
      return res.status(400).json({ success: false, message });
    }

    return res.status(200).json({ success: true, message: "Compte finalisé avec succès.", user });
  } catch (error) {
    console.error("Erreur completeInvitation:", error);
    return res.status(500).json({ success: false, message: error.message || "Erreur interne du serveur." });
  }
};
