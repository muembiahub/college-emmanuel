import { supabase } from "../config/database.js";
import { genererObligationsFinancieres } from "./financeModel.js";

/* ==========================================================
   DASHBOARD
========================================================== */

export const getDashboardStats = async () => {
  const [
    inscriptions,
    classes,
    sections,
    options,
    statistiquesClasses,
  ] = await Promise.all([

    // Nombre d'élèves inscrits
    supabase
      .from("vue_eleves_complet")
      .select("*", {
        count: "exact",
        head: true,
      }),

    // Nombre de classes
    supabase
      .from("classes")
      .select("*", {
        count: "exact",
        head: true,
      }),

    // Nombre de sections
    supabase
      .from("sections")
      .select("*", {
        count: "exact",
        head: true,
      }),

    // Nombre d'options
    supabase
      .from("options")
      .select("*", {
        count: "exact",
        head: true,
      }),

    // Statistiques par classe
    supabase
      .from("vue_statistiques_classes")
      .select("*")
      .order("nom_section")
      .order("nom_option")
      .order("nom_classe")
      .order("nom_parallele"),
  ]);

  if (inscriptions.error) throw inscriptions.error;
  if (classes.error) throw classes.error;
  if (sections.error) throw sections.error;
  if (options.error) throw options.error;
  if (statistiquesClasses.error) throw statistiquesClasses.error;

  return {
    studentsCount: inscriptions.count ?? 0,
    classesCount: classes.count ?? 0,
    sectionsCount: sections.count ?? 0,
    optionsCount: options.count ?? 0,

    studentsByClass: statistiquesClasses.data ?? [],
  };
};


export const getRecentEleves = async () => {
  const { data, error } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .order("date_inscription", { ascending: false })
    .limit(20);

  if (error) throw error;


  return data;
};



export const getDashboardHome = async () => {
  const [stats, recentStudents, notifications] = await Promise.all([
    getDashboardStats(),
    getRecentEleves(),
    getNotifications(),
  ]);

  return {
    stats,
    recentStudents,
    notifications,
  };
};

/* ==========================================================
   SECTIONS
========================================================== */

export const getSections = async () => {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("nom_section");

  if (error) throw error;

  return data;
};

/* ==========================================================
   OPTIONS
========================================================== */

export const getOptions = async (section_id = null) => {
  if (!section_id) return [];

  const { data, error } = await supabase
    .from("options")
    .select("*")
    .eq("section_id", section_id)
    .order("ordre");

  if (error) throw error;

  return data;
};

/* ==========================================================
   CLASSES
========================================================== */

export const getClasses = async (option_id = null) => {
  console.log("Recherche avec :", option_id);

  if (!option_id) return [];

  const { data, error } = await supabase
    .from("classes")
    .select("*")
    .eq("option_id", option_id);

  console.log("Résultat Supabase :", data);

  if (error) throw error;

  return data;
};
/* ==========================================================
   PARALLELES
========================================================== */

export const getParalleles = async (classe_id = null) => {
  if (!classe_id) return [];

  const { data, error } = await supabase
    .from("paralleles")
    .select("*")
    .eq("classe_id", classe_id);

  console.log("PARALLELES :", data);

  if (error) throw error;

  return data;
};

/* ==========================================================
   INSCRIPTION
========================================================== */
/**
 * Fonction de nettoyage (Rollback)
 * Supprime les enregistrements créés si une étape ultérieure échoue.
 */
export const rollbackInscription = async ({ inscriptionId, eleveId, parentId }) => {
  console.log("⚠️ Début du rollback des données...");

  try {
    if (inscriptionId) {
      console.log(`➡️ Suppression de l'inscription (${inscriptionId})...`);
      await supabase.from("inscriptions").delete().eq("inscription_id", inscriptionId);
    }

    if (eleveId) {
      console.log(`➡️ Suppression de l'élève (${eleveId})...`);
      await supabase.from("eleves").delete().eq("eleve_id", eleveId);
    }

    if (parentId) {
      console.log(`➡️ Suppression du parent (${parentId})...`);
      await supabase.from("parents").delete().eq("parent_id", parentId);
    }

    console.log("✅ Rollback terminé avec succès.");
  } catch (rollbackError) {
    console.error("❌ Erreur critique lors du rollback :", rollbackError);
  }
};

/**
 * Création d'une inscription complète avec conditionnement strict sur les frais
 */
export const createInscription = async (
  eleveData,
  parentData,
  inscriptionData
) => {
  let createdParent = null;
  let createdEleve = null;
  let createdInscription = null;

  try {
    console.log("========== DEBUT INSCRIPTION ==========");

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (
      !eleveData.nom ||
      !eleveData.post_nom ||
      !eleveData.prenom ||
      !eleveData.sexe ||
      !eleveData.date_naissance ||
      !eleveData.lieu_naissance ||
      !eleveData.nationalite
    ) {
      throw new Error(
        "Les informations obligatoires de l'élève sont manquantes."
      );
    }

    if (
      !parentData.nom_pere ||
      !parentData.numero_telephone_du_pere ||
      !parentData.nom_mere ||
      !parentData.numero_telephone_de_la_mere
    ) {
      throw new Error(
        "Les informations obligatoires des parents sont manquantes."
      );
    }

    if (
      !inscriptionData.section_id ||
      !inscriptionData.classe_id ||
      !inscriptionData.parallele_id ||
      !inscriptionData.annee_id
    ) {
      throw new Error(
        "Les informations obligatoires de l'inscription sont manquantes."
      );
    }

    console.log("✅ Validation réussie");

    /* =====================================================
       CREATION DU PARENT
    ===================================================== */

    console.log("➡️ Création du parent...");

    const { data: parent, error: parentError } = await supabase
      .from("parents")
      .insert([
        {
          ...parentData,
          fonction_du_pere: parentData.fonction_du_pere || "Non spécifié",
          fonction_de_la_mere: parentData.fonction_de_la_mere || "Non spécifié",
          numero_whatsapp: parentData.numero_whatsapp || "",
          profession: parentData.profession || "",

        },
      ])
      .select()
      .single();

    if (parentError) throw parentError;
    createdParent = parent;

    console.log("✅ Parent créé");
    console.log(parent);

    /* =====================================================
       CREATION DE L'ELEVE
    ===================================================== */

    console.log("➡️ Création de l'élève...");

    const { data: eleve, error: eleveError } = await supabase
      .from("eleves")
      .insert([
        {
          ...eleveData,
          lieu_naissance: eleveData.lieu_naissance || "Non spécifié",
          nationalite: eleveData.nationalite || "Non spécifié",
          telephone: eleveData.telephone || "",
          statut: eleveData.statut || "Active",
          date_admission:
            eleveData.date_admission ||
            new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (eleveError) throw eleveError;
    createdEleve = eleve;

    console.log("✅ Élève créé");
    console.log(eleve);

    /* =====================================================
       CREATION DE L'INSCRIPTION
    ===================================================== */

    console.log("➡️ Création de l'inscription...");

    const { data: inscription, error: inscriptionError } = await supabase
      .from("inscriptions")
      .insert([
        {
          numero_inscription: inscriptionData.numero_inscription,
          eleve_id: eleve.eleve_id,
          parent_id: parent.parent_id,
          section_id: inscriptionData.section_id,
          option_id: inscriptionData.option_id || null,
          classe_id: inscriptionData.classe_id,
          parallele_id: inscriptionData.parallele_id,
          annee_id: inscriptionData.annee_id,
          date_inscription:
            inscriptionData.date_inscription ||
            new Date().toISOString().split("T")[0],
          statut: inscriptionData.statut || "Acceptée",
          type_inscription:
            inscriptionData.type_inscription || "Nouvelle",
          observations: inscriptionData.observations || "",
        },
      ])
      .select()
      .single();

    if (inscriptionError) throw inscriptionError;
    createdInscription = inscription;

    console.log("✅ Inscription créée");
    console.log(inscription);

    /* =====================================================
       DONNEES UTILISEES POUR LES FRAIS
    ===================================================== */

    console.log("========== DONNEES POUR LES FRAIS ==========");

    console.table({
      annee_inscription: inscription.annee_id,
      section_inscription: inscription.section_id,
      classe_inscription: inscription.classe_id,
      option_inscription: inscription.option_id,
      sexe_eleve: eleve.sexe,
    });

    /* =====================================================
       GENERATION DES OBLIGATIONS
    ===================================================== */

    console.log("➡️ Génération des obligations financières...");

    const obligations = await genererObligationsFinancieres(inscription, eleve);

    // 🛑 CONDITION STRICTE : Si aucune obligation n'est générée, on stoppe tout et déclenche le rollback
    if (!obligations || obligations.length === 0) {
      throw new Error(
        "Échec de l'inscription : Aucun frais scolaire n'a été trouvé pour cette configuration (Année, Section, Classe, Option)."
      );
    }

    console.log("✅ Génération terminée");

    console.log("========== FIN INSCRIPTION ==========");

    return {
      parent,
      eleve,
      inscription,
      obligations,
    };
  } catch (error) {
    console.error("❌ ERREUR createInscription");
    console.error(error.message || error);

    // Rollback automatique de toutes les entités créées
    await rollbackInscription({
      inscriptionId: createdInscription?.inscription_id,
      eleveId: createdEleve?.eleve_id,
      parentId: createdParent?.parent_id,
    });

    throw error;
  }
};


/* ==========================================================
   ELEVES
========================================================== */

export const getEleves = async () => {
  const { data, error } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .order("date_inscription", { ascending: false });

  if (error) throw error;

  return data;
};

/* ==========================================================
   SUPPRIMER UNE INSCRIPTION COMPLETE
========================================================== */

export const deleteInscriptionComplete = async (eleveId) => {
  /* ==========================================
     1. Récupérer les informations
  ========================================== */

  const { data: inscription, error: inscriptionError } = await supabase
    .from("inscriptions")
    .select("inscription_id,parent_id")
    .eq("eleve_id", eleveId)
    .single();

  if (inscriptionError) throw inscriptionError;

  /* ==========================================
     2. Supprimer les notifications
  ========================================== */

  const { error: notificationError } = await supabase
    .from("notifications")
    .delete()
    .eq("reference_id", eleveId);

  if (notificationError) throw notificationError;

  /* ==========================================
     3. Supprimer l'inscription
  ========================================== */

  const { error: deleteInscriptionError } = await supabase
    .from("inscriptions")
    .delete()
    .eq("eleve_id", eleveId);

  if (deleteInscriptionError) throw deleteInscriptionError;

  /* ==========================================
     4. Supprimer l'élève
  ========================================== */

  const { error: deleteEleveError } = await supabase
    .from("eleves")
    .delete()
    .eq("eleve_id", eleveId);

  if (deleteEleveError) throw deleteEleveError;

  /* ==========================================
     5. Vérifier si le parent possède
        encore d'autres enfants
  ========================================== */

  const { count, error: countError } = await supabase
    .from("inscriptions")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("parent_id", inscription.parent_id);

  if (countError) throw countError;

  /* ==========================================
     6. Supprimer le parent
        uniquement s'il n'a plus d'enfant
  ========================================== */

  if (count === 0) {
    const { error: parentError } = await supabase
      .from("parents")
      .delete()
      .eq("parent_id", inscription.parent_id);

    if (parentError) throw parentError;
  }

  return {
    success: true,
    message: "Élève supprimé avec succès.",
  };
};

/* ==========================================================
   RECUPERER UN ELEVE PAR ID
========================================================== */

export const getEleveById = async (eleveId) => {
  const { data, error } = await supabase
    .from("vue_eleves_complet")
    .select("*")
    .eq("eleve_id", eleveId)
    .single();

  if (error) {
    console.error("Erreur récupération élève :", error);
    throw error;
  }

  return data;
};

/* ==========================================================
   MODIFIER UN ELEVE
========================================================== */

export const updateEleve = async (id, eleveData) => {
  /* ==========================================
     1. Mise à jour de l'élève
  ========================================== */

  const {
    data: eleve,
    error: eleveError,
  } = await supabase
    .from("eleves")
    .update({
      matricule: eleveData.matricule,
      nom: eleveData.nom,
      post_nom: eleveData.post_nom,
      prenom: eleveData.prenom,
      sexe: eleveData.sexe,
      date_naissance: eleveData.date_naissance,
      lieu_naissance: eleveData.lieu_naissance,
      nationalite: eleveData.nationalite,
      numero_national: eleveData.numero_national,
      telephone: eleveData.telephone,
      email: eleveData.email,
      eleve_adresse: eleveData.eleve_adresse,
      photo: eleveData.photo,
      statut: eleveData.statut_eleve,
      updated_at: new Date().toISOString(),
    })
    .eq("eleve_id", id)
    .select()
    .single();

  if (eleveError) throw eleveError;

  /* ==========================================
     2. Mise à jour du parent
  ========================================== */

  if (eleveData.parent_id) {
    const { error: parentError } = await supabase
      .from("parents")
      .update({
        nom_pere: eleveData.nom_pere,
        numero_telephone_du_pere:
          eleveData.numero_telephone_du_pere,
        fonction_du_pere:
          eleveData.fonction_du_pere,

        nom_mere: eleveData.nom_mere,
        numero_telephone_de_la_mere:
          eleveData.numero_telephone_de_la_mere,
        fonction_de_la_mere:
          eleveData.fonction_de_la_mere,

        numero_whatsapp:
          eleveData.numero_whatsapp,
        email:
          eleveData.email_parent,
        eleve_adresse:
          eleveData.eleve_adresse_parent,
        profession:
          eleveData.profession,

        updated_at: new Date().toISOString(),
      })
      .eq("parent_id", eleveData.parent_id);

    if (parentError) throw parentError;
  }

  /* ==========================================
     3. Mise à jour de l'inscription
  ========================================== */

  if (eleveData.inscription_id) {
    const { error: inscriptionError } = await supabase
      .from("inscriptions")
      .update({
        section_id: eleveData.section_id,
        option_id: eleveData.option_id,
        classe_id: eleveData.classe_id,
        parallele_id: eleveData.parallele_id,
        annee_scolaire: eleveData.annee_scolaire,
        statut: eleveData.statut_inscription,
        montant_paye: eleveData.montant_paye,
        observations: eleveData.observations,
        updated_at: new Date().toISOString(),
      })
      .eq(
        "inscription_id",
        eleveData.inscription_id
      );

    if (inscriptionError) throw inscriptionError;
  }

  return eleve;
};


/* ==========================================================
   NOTIFICATIONS
========================================================== */



/**
 * Créer une notification
 */
export const createNotification = async ({
  destinataire_id = null,
  type_destinataire = "Admin",
  type,
  titre,
  message,
  reference_id = null,
}) => {
  const notification = {
    destinataire_id,
    type_destinataire,
    type,
    titre,
    message,
    reference_id,
    date_envoi: new Date().toISOString(),
    lue: false,
  };

  const { data, error } = await supabase
    .from("notifications")
    .insert(notification)
    .select()
    .single();

  if (error) {
    console.error("Erreur création notification :", error);
    throw error;
  }

  return data;
};

/**
 * Récupérer toutes les notifications
 */
export const getNotifications = async () => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur récupération notifications :", error);
    throw error;
  }

  return data ?? [];
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (notificationId) => {
  const { data, error } = await supabase
    .from("notifications")
    .update({
      lue: true,
      updated_at: new Date().toISOString(),
    })
    .eq("notification_id", notificationId)
    .select()
    .single();

  if (error) {
    console.error("Erreur markAsRead :", error);
    throw error;
  }

  return data;
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async () => {
  const { error } = await supabase
    .from("notifications")
    .update({
      lue: true,
      updated_at: new Date().toISOString(),
    })
    .eq("lue", false);

  if (error) {
    console.error("Erreur markAllAsRead :", error);
    throw error;
  }

  return true;
};

/**
 * Supprimer une notification par son ID (AJOUTÉ)
 */
export const deleteNotification = async (notificationId) => {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("notification_id", notificationId);

  if (error) {
    console.error("Erreur suppression notification :", error);
    throw error;
  }

  return true;
};

/**
 * Nombre de notifications non lues
 */
export const getUnreadNotificationsCount = async () => {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("lue", false);

  if (error) {
    console.error("Erreur compteur notifications :", error);
    throw error;
  }

  return count ?? 0;
};

