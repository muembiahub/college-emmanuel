import {
  getDashboardHome,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getSections,
  getOptions,
  getClasses,
  getParalleles,
  createInscription,
  getEleves,
  getEleveById,
  deleteInscriptionComplete,
  updateEleve,
  fetchAllPersonnel,
  fetchPersonnelById,
  insertPersonnel,
  modifyPersonnel,
  removePersonnel,
} from "../models/scolaireModel.js";

import {
  notifyInscription,
  notifyModificationEleve,
  notifySuppressionEleve,
} from "../services/notifications.js";

/* ==========================================================
   DASHBOARD
========================================================== */

export const afficherDashboard = async (req, res) => {
  try {
    const dashboard = await getDashboardHome();

    return res.status(200).json(dashboard);
  } catch (error) {
    console.error("Erreur Dashboard :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de charger le tableau de bord.",
      error: error.message,
    });
  }
};

/* ==========================================================
   NOTIFICATIONS
========================================================== */

/**
 * Récupérer la liste de toutes les notifications
 */
export const listerNotifications = async (req, res) => {
  try {
    const notifications = await getNotifications();
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    return res.status(500).json({
      error: "Impossible de récupérer les notifications.",
    });
  }
};

/**
 * Marquer une notification spécifique comme lue
 */
export const lireNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRead(id);

    return res.status(200).json({
      success: true,
      message: "Notification marquée comme lue.",
    });
  } catch (error) {
    console.error(`Erreur lors du marquage de la notification ${req.params.id} :`, error);
    return res.status(500).json({
      error: error.message || "Impossible de marquer la notification comme lue.",
    });
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const lireToutesNotifications = async (req, res) => {
  try {
    await markAllAsRead();

    return res.status(200).json({
      success: true,
      message: "Toutes les notifications ont été marquées comme lues.",
    });
  } catch (error) {
    console.error("Erreur lors du marquage de toutes les notifications :", error);
    return res.status(500).json({
      error: error.message || "Impossible de marquer toutes les notifications comme lues.",
    });
  }
};

/**
 * Supprimer une notification
 */
export const supprimerNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNotification(id);

    return res.status(200).json({
      success: true,
      message: "Notification supprimée avec succès.",
    });
  } catch (error) {
    console.error(`Erreur lors de la suppression de la notification ${req.params.id} :`, error);
    return res.status(500).json({
      error: error.message || "Impossible de supprimer la notification.",
    });
  }
};

/* ==========================================================
   STRUCTURE SCOLAIRE
========================================================== */

export const listerSections = async (req, res) => {
  try {
    const sections = await getSections();

    res.json(sections);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

export const listerOptions = async (req, res) => {
  try {
    const { section_id } = req.query;

    const options = await getOptions(section_id);

    res.json(options);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};


export const listerClasses = async (req, res) => {
  try {
    const { option_id } = req.query;

    console.log("OPTION REÇUE :", option_id);

    const classes = await getClasses(option_id);

    console.log("CLASSES :", classes);

    res.json(classes);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

export const listerParalleles = async (req, res) => {
  try {
    const { classe_id } = req.query;

    const paralleles = await getParalleles(classe_id);

    res.json(paralleles);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

/* ==========================================================
   INSCRIPTIONS
========================================================== */

export const inscrireEleve = async (req, res) => {
  try {
    const formData = req.body;

    /* ==========================================================
   ÉLÈVE
========================================================== */

const eleveData = {
  matricule: formData.matricule,

  nom: formData.nom?.trim() || "",
  post_nom: formData.post_nom?.trim() || "",
  prenom: formData.prenom?.trim() || "",

  sexe: formData.sexe,
  date_naissance: formData.date_naissance,
  lieu_naissance: formData.lieu_naissance,
  nationalite: formData.nationalite || "Congolaise",

  numero_national: formData.numero_national,

  telephone: formData.telephone || "",
  email_eleve: formData.email || "",
  adresse_eleve: formData.adresse || "",

  photo: formData.photo || null,

  date_admission:
    formData.date_admission ||
    new Date().toISOString().split("T")[0],

  statut: formData.statut || "Active",
};

/* ==========================================================
   PARENT
========================================================== */

const parentData = {
  nom_pere: formData.nom_pere?.trim() || "",
  nom_mere: formData.nom_mere?.trim() || "",

  numero_telephone_du_pere:
    formData.numero_telephone_du_pere || "",

  numero_telephone_de_la_mere:
    formData.numero_telephone_de_la_mere || "",

  numero_whatsapp:
    formData.numero_whatsapp || "",

  fonction_du_pere:
    formData.fonction_du_pere || "",

  fonction_de_la_mere:
    formData.fonction_de_la_mere || "",

  profession:
    formData.profession || "",

  email_parent:
    formData.email_parent || "",

  adresse_parent:
    formData.adresse_parent || "",
};

    /* ==========================================================
       INSCRIPTION
    ========================================================== */

    const inscriptionData = {
      section_id: formData.section_id,
      option_id: formData.option_id || null,
      classe_id: formData.classe_id,
      parallele_id: formData.parallele_id,

      // ✅ UUID de l'année scolaire
      annee_id: formData.annee_id,

      numero_inscription:
        formData.numero_inscription ||
        `INS-${new Date().getFullYear()}-${Math.floor(
          Math.random() * 10000
        )}`,

      date_inscription:
        formData.date_inscription ||
        new Date().toISOString().split("T")[0],

      statut: formData.statut_inscription || "Accepte",

      type_inscription:
        formData.type_inscription || "Nouvelle",

      observations: formData.observations || "",
    };

    /* ==========================================================
       VALIDATION
    ========================================================== */

    const validations = [
      [eleveData.nom, "Nom de l'élève"],
      [eleveData.post_nom, "Post-nom de l'élève"],
      [eleveData.prenom, "Prénom de l'élève"],
      [eleveData.sexe, "Sexe"],
      [eleveData.date_naissance, "Date de naissance"],

      [parentData.nom_pere, "Nom du père"],
      [
        parentData.numero_telephone_du_pere,
        "Téléphone du père",
      ],
      [parentData.nom_mere, "Nom de la mère"],
      [
        parentData.numero_telephone_de_la_mere,
        "Téléphone de la mère",
      ],

      [inscriptionData.section_id, "Section"],
      [inscriptionData.classe_id, "Classe"],
      [inscriptionData.parallele_id, "Parallèle"],
      [inscriptionData.annee_id, "Année scolaire"],
      [inscriptionData.type_inscription, "Type d'inscription"],
    ];

    for (const [value, label] of validations) {
      if (!value || value.toString().trim() === "") {
        return res.status(400).json({
          success: false,
          message: `${label} est obligatoire.`,
        });
      }
    }

    /* ==========================================================
       ENREGISTREMENT
    ========================================================== */

    const result = await createInscription(
      eleveData,
      parentData,
      inscriptionData
    );

    /* ==========================================================
       NOTIFICATION
    ========================================================== */

    try {
      await notifyInscription(result.eleve);
      console.log("✅ Notification créée");
    } catch (notificationError) {
      console.error(
        "Erreur notification :",
        notificationError
      );
    }

    /* ==========================================================
       RÉPONSE
    ========================================================== */

    return res.status(201).json({
      success: true,
      message:
        "Élève inscrit et obligations financières générées avec succès.",
      data: result,
    });
  } catch (error) {
    console.error("ERREUR INSCRIPTION :", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ==========================================================
   ELEVES
========================================================== */

export const listerEleves = async (req, res) => {
  try {
    const eleves = await getEleves();

    res.json(eleves);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur.",
    });
  }
};

/* ==========================================================
   SUPPRIMER UN ELEVE
========================================================== */

export const supprimerEleve = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Identifiant de l'élève manquant.",
      });
    }

    // Récupérer les informations de l'élève
    const eleve = await getEleveById(id);

    // Supprimer toutes les données liées
    const result = await deleteInscriptionComplete(id);

    // Créer la notification
    await notifySuppressionEleve(eleve);

    return res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error) {

    console.error("ERREUR SUPPRESSION ELEVE :", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};

/* ==========================================================
   MODIFIER UN ELEVE
========================================================== */

export const modifierEleve = async (req, res) => {
  try {
    const { id } = req.params;

    const formData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Identifiant de l'élève manquant.",
      });
    }

    const eleve = await updateEleve(id, formData);
    await notifyModificationEleve(eleve);

    return res.status(200).json({
      success: true,
      message: "Élève modifié avec succès.",
      eleve,
    });

  } catch (error) {

    console.error("ERREUR MODIFICATION ELEVE :", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
};



export const getPersonnel = async (req, res) => {
  try {
    const data = await fetchAllPersonnel();
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur getPersonnel :", error);
    res.status(500).json({ error: error.message });
  }
};

export const getPersonnelById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchPersonnelById(id);
    
    if (!data) {
      return res.status(404).json({ error: "Employé introuvable" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur getPersonnelById :", error);
    res.status(404).json({ error: error.message });
  }
};

export const createPersonnel = async (req, res) => {
  try {
    const { name, role } = req.body;

    if (!name || !role) {
      return res.status(400).json({ error: "Le nom et le rôle sont obligatoires." });
    }

    const newPerson = await insertPersonnel(req.body);
    res.status(201).json(newPerson);
  } catch (error) {
    console.error("Erreur createPersonnel :", error);
    res.status(400).json({ error: error.message });
  }
};

export const updatePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPerson = await modifyPersonnel(id, req.body);
    res.status(200).json(updatedPerson);
  } catch (error) {
    console.error("Erreur updatePersonnel :", error);
    res.status(400).json({ error: error.message });
  }
};

export const deletePersonnel = async (req, res) => {
  try {
    const { id } = req.params;
    await removePersonnel(id);
    res.status(200).json({
      success: true,
      message: "Employé supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur deletePersonnel :", error);
    res.status(500).json({ error: error.message });
  }
};