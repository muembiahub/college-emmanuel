import { supabase } from "../config/database.js";

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
export const createInscription = async (
  eleveData,
  parentData,
  inscriptionData
) => {
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
    !inscriptionData.annee_scolaire
  ) {
    throw new Error(
      "Les informations obligatoires de l'inscription sont manquantes."
    );
  }

  /* =====================================================
     CREATION DU PARENT
  ===================================================== */

  const { data: parent, error: parentError } = await supabase
    .from("parents")
    .insert([
      {
        ...parentData,
        fonction_du_pere:
          parentData.fonction_du_pere || "Non spécifié",
        fonction_de_la_mere:
          parentData.fonction_de_la_mere || "Non spécifié",
        numero_whatsapp:
          parentData.numero_whatsapp || "",
        email:
          parentData.email || "",
        adresse:
          parentData.adresse || "",
        profession:
          parentData.profession || "",
      },
    ])
    .select()
    .single();

  if (parentError) throw parentError;

  /* =====================================================
     CREATION DE L'ELEVE
  ===================================================== */

  const { data: eleve, error: eleveError } = await supabase
    .from("eleves")
    .insert([
      {
        ...eleveData,
        lieu_naissance:
          eleveData.lieu_naissance || "Non spécifié",
        nationalite:
          eleveData.nationalite || "Non spécifié",
        telephone:
          eleveData.telephone || "",
        email:
          eleveData.email || "",
        adresse:
          eleveData.adresse || "",
        statut:
          eleveData.statut || "Active",
        date_admission:
          eleveData.date_admission ||
          new Date().toISOString().split("T")[0],
      },
    ])
    .select()
    .single();

  if (eleveError) throw eleveError;

  /* =====================================================
     CREATION DE L'INSCRIPTION
  ===================================================== */

  const { data: inscription, error: inscriptionError } =
    await supabase
      .from("inscriptions")
      .insert([
        {
          numero_inscription:
            inscriptionData.numero_inscription,

          eleve_id:
            eleve.eleve_id,

          parent_id:
            parent.parent_id,

          section_id:
            inscriptionData.section_id,

          option_id:
            inscriptionData.option_id || null,

          classe_id:
            inscriptionData.classe_id,

          parallele_id:
            inscriptionData.parallele_id,

          annee_scolaire:
            inscriptionData.annee_scolaire,

          date_inscription:
            inscriptionData.date_inscription ||
            new Date()
              .toISOString()
              .split("T")[0],

          statut:
            inscriptionData.statut || "Active",

          montant_paye:
            inscriptionData.montant_paye || 0,

          observations:
            inscriptionData.observations || "",
        },
      ])
      .select()
      .single();

  if (inscriptionError) throw inscriptionError;

  return {
    parent,
    eleve,
    inscription,
  };
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
   NOTIFICATIONS
========================================================== */

/**
 * Créer une notification
 */
export const createNotification = async ({
  destinataire_id = null,
  type_destinataire = "admin",
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



