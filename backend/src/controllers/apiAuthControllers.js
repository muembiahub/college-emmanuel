import {
  signInWithProfile,
  signOut,
  completeInvitationSetup,
} from "../models/auth.js";

/* =====================================================
   AUTH CONTROLLERS
===================================================== */



/* =====================================================
   LOGIN
===================================================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=================================");
    console.log("🔐 LOGIN");
    console.log("📧 Email:", email);
    console.log("🆔 Session:", req.sessionID);

    /* -------------------------------------------------
       Validation
    ------------------------------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email et mot de passe requis.",
      });
    }

    /* -------------------------------------------------
       Connexion Supabase
    ------------------------------------------------- */

    const result = await signInWithProfile(
      email.trim(),
      password
    );

    console.log(
      "🔑 Supabase login:",
      result.success
    );

    if (!result.success) {
      console.log(
        "❌ Login refusé:",
        result.message
      );

      return res.status(401).json({
        success: false,
        message: result.message || "Email ou mot de passe incorrect.",
      });
    }

    /* -------------------------------------------------
       Récupérer le token Supabase
    ------------------------------------------------- */

    const accessToken =
      result.session?.access_token;

    if (!accessToken) {
      console.error(
        "❌ Aucun access token Supabase."
      );

      return res.status(401).json({
        success: false,
        message: "Impossible de créer la session.",
      });
    }

    /* -------------------------------------------------
       Stockage du token UNIQUEMENT côté serveur
    ------------------------------------------------- */

    req.session.supabaseAccessToken =
      accessToken;

    console.log(
      "✅ Token stocké dans express-session"
    );

    /* -------------------------------------------------
       Sauvegarder la session
    ------------------------------------------------- */

    req.session.save((err) => {
      if (err) {
        console.error(
          "❌ Erreur sauvegarde session:",
          err
        );

        return res.status(500).json({
          success: false,
          message:
            "Erreur lors de la sauvegarde de la session.",
        });
      }

      console.log(
        "✅ SESSION SAUVEGARDÉE"
      );

      console.log(
        "🆔 Session:",
        req.sessionID
      );

      console.log(
        "🔐 Token présent:",
        !!req.session.supabaseAccessToken
      );

      console.log("=================================");

      return res.status(200).json({
        success: true,
        message: "Connexion réussie.",
        user: result.user,
      });
    });

  } catch (error) {
    console.error(
      "❌ Erreur login:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur interne du serveur lors de la connexion.",
    });
  }
};


/* =====================================================
   LOGOUT
===================================================== */

export const logout = async (req, res) => {
  try {
    console.log("=================================");
    console.log("🔓 LOGOUT");
    console.log("🆔 Session:", req.sessionID);

    /* -------------------------------------------------
       Déconnexion Supabase
    ------------------------------------------------- */

    const result = await signOut();

    if (!result.success) {
      console.warn(
        "⚠️ Déconnexion Supabase:",
        result.message
      );
    }

    /* -------------------------------------------------
       Détruire la session Express
    ------------------------------------------------- */

    req.session.destroy((err) => {
      if (err) {
        console.error(
          "❌ Erreur destruction session:",
          err
        );

        return res.status(500).json({
          success: false,
          message:
            "Erreur lors de la déconnexion.",
        });
      }

      /* -------------------------------------------------
         Supprimer le cookie
      ------------------------------------------------- */

      res.clearCookie("connect.sid");

      console.log(
        "✅ Session supprimée"
      );

      console.log("=================================");

      return res.status(200).json({
        success: true,
        message: "Déconnexion réussie.",
      });
    });

  } catch (error) {
    console.error(
      "❌ Erreur logout:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur interne du serveur lors de la déconnexion.",
    });
  }
};


/* =====================================================
   CURRENT USER
===================================================== */

export const currentUser = async (req, res) => {
  try {
    /*
      Cette route est protégée par requireApiAuth.

      Le middleware vérifie :
      - la session Express
      - le token Supabase
      - l'utilisateur Supabase
      - le profil
      - le rôle
    */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié.",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });

  } catch (error) {
    console.error(
      "❌ Erreur currentUser:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Erreur interne du serveur.",
    });
  }
};


/* =====================================================
   COMPLETE INVITATION
===================================================== */


export const completeInvitation = async (req, res) => {
  try {
    console.log("📨 FINALISATION INVITATION");

    const { password, firstname, lastname, phone } = req.body;

    // Récupération du token d'invitation
    const authorization = req.headers.authorization;
    const accessToken = authorization?.startsWith("Bearer ")
      ? authorization.substring(7)
      : null;

    if (!accessToken) {
      return res.status(401).json({ success: false, message: "Jeton d'invitation manquant." });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    if (!firstname || !lastname) {
      return res.status(400).json({ success: false, message: "Le prénom et le nom sont obligatoires." });
    }

    // Finaliser l’invitation
    const result = await completeInvitationSetup(accessToken, password, { firstname, lastname, phone });

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    const updatedUser = result.user;

    // Connexion automatique (email + mot de passe)
    const loginResult = await signInWithProfile(updatedUser.email, password);

    if (!loginResult.success || !loginResult.session?.access_token) {
      return res.status(500).json({
        success: false,
        message: "Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter manuellement.",
      });
    }

    // Stocker access_token + refresh_token en session
    req.session.supabaseAccessToken = loginResult.session.access_token;
    req.session.supabaseRefreshToken = loginResult.session.refresh_token;
    req.session.user = {
      id: updatedUser.id,
      email: updatedUser.email,
      firstname,
      lastname,
      phone,
    };

    await req.session.save();

    console.log("✅ Session créée après invitation");

    return res.status(200).json({
      success: true,
      message: "Compte créé et connecté avec succès.",
      user: result.user,
      profile: result.profile,
    });
  } catch (error) {
    console.error("❌ Erreur completeInvitation:", error);
    return res.status(500).json({ success: false, message: error.message || "Erreur interne du serveur." });
  }
};



