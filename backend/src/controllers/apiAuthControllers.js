import {
  signInWithProfile,
  completeInvitationSetup,
} from "../models/auth.js";

import { supabase } from "../config/database.js";

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
    console.log("🆔 Ancienne session:", req.sessionID);

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
       1. Connexion Supabase
    ------------------------------------------------- */

    const result = await signInWithProfile(
      email.trim(),
      password
    );

    console.log(
      "🔑 Supabase login:",
      result.success
    );

    if (!result.success || !result.session) {
      console.log(
        "❌ Login refusé:",
        result.message
      );

      return res.status(401).json({
        success: false,
        message:
          result.message ||
          "Email ou mot de passe incorrect.",
      });
    }

    /* -------------------------------------------------
       2. Récupérer les tokens
    ------------------------------------------------- */

    const accessToken =
      result.session.access_token;

    const refreshToken =
      result.session.refresh_token;

    if (!accessToken) {
      console.error(
        "❌ Aucun access token Supabase."
      );

      return res.status(401).json({
        success: false,
        message:
          "Impossible de créer la session.",
      });
    }

    console.log(
      "✅ Utilisateur Supabase:",
      result.user.id,
      result.user.email
    );

    /* -------------------------------------------------
       3. Récupérer le profil + rôle
    ------------------------------------------------- */

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
      .eq("user_id", result.user.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "❌ Profil introuvable:",
        profileError?.message
      );

      return res.status(404).json({
        success: false,
        message:
          "Profil utilisateur introuvable.",
      });
    }

    console.log(
      "👤 Profil:",
      profile.id
    );

    console.log(
      "🔐 Rôle:",
      profile.roles?.name
    );

    /* -------------------------------------------------
       4. IMPORTANT :
          Créer une NOUVELLE session Express
          
          Cela empêche l'ancienne session d'un autre
          utilisateur d'être réutilisée.
    ------------------------------------------------- */

    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log(
      "♻️ Nouvelle session Express:",
      req.sessionID
    );

    /* -------------------------------------------------
       5. Stocker UNIQUEMENT les informations
          nécessaires dans la nouvelle session
    ------------------------------------------------- */

    req.session.supabaseAccessToken =
      accessToken;

    req.session.supabaseRefreshToken =
      refreshToken;

    req.session.userId =
      result.user.id;

    /* -------------------------------------------------
       6. Sauvegarder explicitement la session
    ------------------------------------------------- */

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log(
      "✅ SESSION SAUVEGARDÉE"
    );

    console.log(
      "🆔 Nouvelle session:",
      req.sessionID
    );

    console.log(
      "🔑 Token présent:",
      !!req.session.supabaseAccessToken
    );

    console.log(
      "👤 Utilisateur:",
      result.user.email
    );

    console.log(
      "🔐 Rôle:",
      profile.roles?.name
    );

    console.log("=================================");

    /* -------------------------------------------------
       7. Retourner l'utilisateur AVEC son rôle
    ------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",

      user: {
        ...profile,

        id: result.user.id,
        email: result.user.email,

        roles: profile.roles,
      },
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
    console.log(
      "🆔 Session:",
      req.sessionID
    );

    /* -------------------------------------------------
       IMPORTANT

       On ne fait PAS :

       supabase.auth.signOut()

       car ton application utilise le token
       stocké dans express-session pour identifier
       chaque utilisateur.

       On détruit simplement la session Express.
    ------------------------------------------------- */

    if (!req.session) {
      return res.status(200).json({
        success: true,
        message: "Déconnexion réussie.",
      });
    }

    /* -------------------------------------------------
       Détruire la session
    ------------------------------------------------- */

    await new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    /* -------------------------------------------------
       Supprimer le cookie de session
    ------------------------------------------------- */

    res.clearCookie("connect.sid", {
      path: "/",
    });

    console.log(
      "✅ Session supprimée"
    );

    console.log("=================================");

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie.",
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
     * Cette route est protégée par requireApiAuth.
     *
     * requireApiAuth vérifie :
     *
     * 1. express-session
     * 2. supabaseAccessToken
     * 3. utilisateur Supabase
     * 4. user_profiles
     * 5. rôle
     */

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Utilisateur non authentifié.",
      });
    }

    console.log(
      "👤 CURRENT USER:",
      req.user.email
    );

    console.log(
      "🔐 CURRENT ROLE:",
      req.user.roles?.name
    );

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

export const completeInvitation = async (
  req,
  res
) => {
  try {
    console.log(
      "📨 FINALISATION INVITATION"
    );

    const {
      password,
      firstname,
      lastname,
      phone,
    } = req.body;

    /* -------------------------------------------------
       Récupération token invitation
    ------------------------------------------------- */

    const authorization =
      req.headers.authorization;

    const accessToken =
      authorization?.startsWith("Bearer ")
        ? authorization.substring(7)
        : null;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message:
          "Jeton d'invitation manquant.",
      });
    }

    /* -------------------------------------------------
       Validation
    ------------------------------------------------- */

    if (
      !password ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Le mot de passe doit contenir au moins 6 caractères.",
      });
    }

    if (!firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message:
          "Le prénom et le nom sont obligatoires.",
      });
    }

    /* -------------------------------------------------
       Finaliser invitation
    ------------------------------------------------- */

    const result =
      await completeInvitationSetup(
        accessToken,
        password,
        {
          firstname,
          lastname,
          phone,
        }
      );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    const updatedUser =
      result.user;

    /* -------------------------------------------------
       Connexion automatique
    ------------------------------------------------- */

    const loginResult =
      await signInWithProfile(
        updatedUser.email,
        password
      );

    if (
      !loginResult.success ||
      !loginResult.session?.access_token
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Compte créé, mais la connexion automatique a échoué. Veuillez vous connecter manuellement.",
      });
    }

    /* -------------------------------------------------
       Récupérer profil + rôle
    ------------------------------------------------- */

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
      .eq("user_id", updatedUser.id)
      .single();

    if (profileError || !profile) {
      console.error(
        "❌ Profil après invitation:",
        profileError?.message
      );

      return res.status(404).json({
        success: false,
        message:
          "Compte créé mais profil introuvable.",
      });
    }

    /* -------------------------------------------------
       IMPORTANT :
       Nouvelle session après invitation
    ------------------------------------------------- */

    await new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    /* -------------------------------------------------
       Stocker les tokens
    ------------------------------------------------- */

    req.session.supabaseAccessToken =
      loginResult.session.access_token;

    req.session.supabaseRefreshToken =
      loginResult.session.refresh_token;

    req.session.userId =
      updatedUser.id;

    /* -------------------------------------------------
       Sauvegarder
    ------------------------------------------------- */

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log(
      "✅ Session créée après invitation"
    );

    console.log(
      "🆔 Session:",
      req.sessionID
    );

    console.log(
      "👤 Utilisateur:",
      updatedUser.email
    );

    console.log(
      "🔐 Rôle:",
      profile.roles?.name
    );

    return res.status(200).json({
      success: true,
      message:
        "Compte créé et connecté avec succès.",

      user: {
        ...profile,

        id: updatedUser.id,
        email: updatedUser.email,

        roles: profile.roles,
      },

      profile,
    });

  } catch (error) {
    console.error(
      "❌ Erreur completeInvitation:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Erreur interne du serveur.",
    });
  }
};