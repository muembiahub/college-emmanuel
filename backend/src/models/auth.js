import { supabase } from "../config/database.js";

/* =====================================================
   AUTH FUNCTIONS
===================================================== */

/**
 * Connexion utilisateur
 */
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
    return {
      success: false,
      message: error.message,
      user: null,
      session: null,
    };
  }
};

/**
 * Déconnexion
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return {
      success: true,
      message: "Déconnexion réussie.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Récupération de la session active
 */
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) throw error;

    return {
      success: true,
      session,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      session: null,
    };
  }
};

/**
 * Récupération de l'utilisateur connecté
 */
export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) throw error;

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      user: null,
    };
  }
};

/**
 * Finalise le compte d'un utilisateur invité en définissant son mot de passe.
 * @param {string} accessToken - Le jeton d'accès reçu du lien d'invitation Supabase.
 * @param {string} password - Le nouveau mot de passe choisi par l'utilisateur.
 * @returns {Promise<{user: object, error: object}>}
 */
export const completeInvitationSetup = async (accessToken, password) => {
  // 1. Met à jour l'utilisateur (mot de passe) en utilisant le jeton d'accès
  const { data: { user }, error: updateError } = await supabase.auth.updateUser(
    { password: password },
    { jwt: accessToken } // Supabase attend le token ici
  );

  if (updateError) {
    return { user: null, error: updateError };
  }

  // 2. Récupère le profil associé pour renvoyer des données complètes
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select(`
      *,
      roles ( name )
    `)
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    // On ne bloque pas le flux si le profil n'est pas trouvé, mais on log l'erreur
    console.error("Avertissement : Le profil utilisateur n'a pas été trouvé après la finalisation.", profileError);
  }

  // 3. Fusionne l'utilisateur Supabase avec son profil local
  const userWithProfile = { ...user, profile: profile || null };

  return { user: userWithProfile, error: null };
};
