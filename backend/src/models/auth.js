import { supabase } from "../config/database.js";

/* =========================================================
   CONNEXION
========================================================= */

export const signInWithProfile = async (email, password) => {
  try {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) throw error;

    return {
      success: true,
      message: "Connexion réussie.",
      user: data.user,
      session: data.session,
    };

  } catch (error) {
    console.error("❌ Erreur login:", error.message);

    return {
      success: false,
      message: error.message,
      user: null,
      session: null,
    };
  }
};


/* =========================================================
   DÉCONNEXION
========================================================= */

export const signOut = async () => {
  try {
    const { error } =
      await supabase.auth.signOut();

    if (error) throw error;

    return {
      success: true,
      message: "Déconnexion réussie.",
    };

  } catch (error) {
    console.error("❌ Erreur logout:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};


/* =========================================================
   FINALISATION DE L'INVITATION
========================================================= */

/**
 * Finalise un compte créé par invitation Supabase.
 *
 * IMPORTANT :
 * - L'utilisateur existe déjà dans auth.users.
 * - Aucun user_profiles n'est créé lors de l'invitation.
 * - Le frontend ne fournit PAS user_id.
 * - Le frontend ne fournit PAS role_id.
 * - Le backend récupère l'utilisateur grâce au token.
 * - Le profil est créé uniquement ici.
 */

export const completeInvitationSetup = async (
  accessToken,
  password,
  profileData = {}
) => {
  try {
    /* =====================================================
       1. Vérifier le token d'invitation
    ===================================================== */

    if (!accessToken) {
      return {
        user: null,
        profile: null,
        error: new Error("Jeton d'invitation manquant."),
      };
    }

    /* =====================================================
       2. Vérifier le mot de passe
    ===================================================== */

    if (!password || password.length < 6) {
      return {
        user: null,
        profile: null,
        error: new Error(
          "Le mot de passe doit contenir au moins 6 caractères."
        ),
      };
    }

    /* =====================================================
       3. Récupérer les informations personnelles
    ===================================================== */

    const firstname =
      typeof profileData.firstname === "string"
        ? profileData.firstname.trim()
        : "";

    const lastname =
      typeof profileData.lastname === "string"
        ? profileData.lastname.trim()
        : "";

    const phone =
      typeof profileData.phone === "string"
        ? profileData.phone.trim()
        : null;

    if (!firstname || !lastname) {
      return {
        user: null,
        profile: null,
        error: new Error(
          "Le prénom et le nom sont obligatoires."
        ),
      };
    }

    /* =====================================================
       4. Vérifier le token auprès de Supabase Auth
    ===================================================== */

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !userData?.user) {
      console.error(
        "❌ Token d'invitation invalide:",
        userError?.message
      );

      return {
        user: null,
        profile: null,
        error: new Error(
          "Le lien d'invitation est invalide ou expiré."
        ),
      };
    }

    const user = userData.user;

    console.log("👤 Utilisateur invité:", user.id);
    console.log("📧 Email:", user.email);

    /* =====================================================
       5. Vérifier si le profil existe déjà
    ===================================================== */

    const {
      data: existingProfile,
      error: existingProfileError,
    } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingProfileError) {
      console.error(
        "❌ Erreur vérification profil:",
        existingProfileError.message
      );

      return {
        user: null,
        profile: null,
        error: existingProfileError,
      };
    }

    if (existingProfile) {
      return {
        user: null,
        profile: null,
        error: new Error(
          "Ce compte a déjà été configuré."
        ),
      };
    }

    /* =====================================================
       6. Récupérer automatiquement le rôle AGENT
    ===================================================== */

    const {
      data: agentRole,
      error: roleError,
    } = await supabase
      .from("roles")
      .select("id, name")
      .eq("name", "agent")
      .single();

    if (roleError || !agentRole) {
      console.error(
        "❌ Rôle agent introuvable:",
        roleError?.message
      );

      return {
        user: null,
        profile: null,
        error: new Error(
          'Le rôle "agent" n\'existe pas dans la table roles.'
        ),
      };
    }

    console.log("🔐 Rôle par défaut:", agentRole.name);
    console.log("🆔 Role ID:", agentRole.id);

    /* =====================================================
       7. Définir le mot de passe
    ===================================================== */

    const {
      data: updatedUserData,
      error: updateError,
    } = await supabase.auth.updateUser(
      {
        password,
      },
      {
        jwt: accessToken,
      }
    );

    if (updateError) {
      console.error(
        "❌ Erreur définition mot de passe:",
        updateError.message
      );

      return {
        user: null,
        profile: null,
        error: updateError,
      };
    }

    const updatedUser = updatedUserData?.user;

    if (!updatedUser) {
      return {
        user: null,
        profile: null,
        error: new Error(
          "Impossible de récupérer l'utilisateur après la mise à jour."
        ),
      };
    }

    /* =====================================================
       8. Créer le profil avec le rôle AGENT
    ===================================================== */

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("user_profiles")
      .insert({
        user_id: updatedUser.id,
        role_id: agentRole.id,
        firstname,
        lastname,
        phone: phone || null,
      })
      .select(`
        *,
        roles (
          name
        )
      `)
      .single();

    if (profileError) {
      console.error(
        "❌ Erreur création profil:",
        profileError.message
      );

      return {
        user: null,
        profile: null,
        error: profileError,
      };
    }

    /* =====================================================
       9. Construire l'utilisateur complet
    ===================================================== */

    const userWithProfile = {
      ...updatedUser,
      profile,
    };

    /* =====================================================
       10. Logs
    ===================================================== */

    console.log("=================================");
    console.log("✅ INVITATION FINALISÉE");
    console.log("📧 Email:", updatedUser.email);
    console.log("👤 Nom:", firstname, lastname);
    console.log("🔐 Rôle:", agentRole.name);
    console.log("🆔 Profil:", profile.id);
    console.log("=================================");

    /* =====================================================
       11. Retour
    ===================================================== */

    return {
      user: userWithProfile,
      profile,
      error: null,
    };

  } catch (error) {
    console.error(
      "❌ Erreur completeInvitationSetup:",
      error
    );

    return {
      user: null,
      profile: null,
      error,
    };
  }
};

