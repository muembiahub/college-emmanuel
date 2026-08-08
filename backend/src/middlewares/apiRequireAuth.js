
import { supabase } from "../config/database.js";

/* =========================================================
   AUTH MIDDLEWARE
   Authentification via express-session + Supabase
========================================================= */

export const requireApiAuth = async (req, res, next) => {
  try {
    /* =====================================================
       1. Récupérer le token depuis la session
    ===================================================== */

    const token = req.session?.supabaseAccessToken;

    console.log("🔐 Vérification authentification...");
    console.log("🆔 Session ID:", req.sessionID);
    console.log("🔑 Token présent:", !!token);

    if (!token) {
      console.log("❌ Aucun token dans la session");

      return res.status(401).json({
        success: false,
        message: "Authentification requise",
      });
    }

    /* =====================================================
       2. Vérifier le token auprès de Supabase
    ===================================================== */

    console.log("🔎 Vérification du token auprès de Supabase...");

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error(
        "❌ Token Supabase invalide:",
        authError?.message
      );

      return res.status(401).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    console.log("✅ Utilisateur Supabase:", user.id);
    console.log("📧 Email:", user.email);

    /* =====================================================
       3. Récupérer le profil et le rôle
    ===================================================== */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("user_profiles")
      .select(`
        *,
        roles (
          name
        )
      `)
      .eq("user_id", user.id)
      .single();

    console.log("👤 Profil trouvé:", !!profile);

    if (profileError) {
      console.error(
        "❌ Erreur profil:",
        profileError.message
      );

      return res.status(404).json({
        success: false,
        message: "Profil utilisateur introuvable.",
      });
    }

    /* =====================================================
       4. Ajouter l'utilisateur à la requête
    ===================================================== */

    req.user = {
      ...profile,

      // Informations Supabase utiles
      id: user.id,
      email: user.email,
    };

    console.log("✅ Authentification réussie");
    console.log("👤 Utilisateur:", req.user.email);

    /* =====================================================
       5. Continuer vers le contrôleur
    ===================================================== */

    next();

  } catch (error) {
    console.error(
      "❌ Erreur middleware authentification:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur interne lors de la vérification de l'authentification",
    });
  }
};