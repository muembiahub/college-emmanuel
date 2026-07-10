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
