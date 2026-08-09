import { supabase } from "../config/database.js";

/* =========================================================
   CONNEXION
========================================================= */
export const signInWithProfile = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
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
    const { error } = await supabase.auth.signOut();

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
   FINALISATION INVITATION
========================================================= */
export const completeInvitationSetup = async (
  accessToken,
  password,
  profileData = {}
) => {
  try {
    // Vérifier token
    const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
    if (userError || !userData?.user) {
      return { success: false, message: "Lien invalide ou expiré." };
    }
    const user = userData.user;

    // Définir mot de passe
    const { error: updateError } = await supabase.auth.updateUser(
      { password },
      { jwt: accessToken }
    );
    if (updateError) {
      return { success: false, message: updateError.message };
    }

    // Créer profil via RPC
    const { data: profile, error: rpcError } = await supabase.rpc("finalize_invitation", {
      uid: user.id,
      firstname: profileData.firstname,
      lastname: profileData.lastname,
      phone: profileData.phone,
    });

    if (rpcError) {
      return { success: false, message: rpcError.message };
    }

    return {
      success: true,
      message: "Invitation finalisée.",
      user,
      profile,
    };
  } catch (error) {
    console.error("❌ Erreur completeInvitationSetup:", error.message);
    return { success: false, message: error.message };
  }
};
