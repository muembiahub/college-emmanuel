import { createNotification } from "../models/scolaireModel.js";

/* ==========================================================
   CREATION GENERIQUE D'UNE NOTIFICATION
========================================================== */

export const notify = async ({
  destinataire_id = null,
  type_destinataire = "Admin",
  type,
  titre,
  message,
  reference_id = null,
}) => {
  try {
    if (!type) {
      throw new Error("Le type de notification est obligatoire.");
    }

    if (!titre) {
      throw new Error("Le titre de notification est obligatoire.");
    }

    if (!message) {
      throw new Error("Le message de notification est obligatoire.");
    }

    const notification = await createNotification({
      destinataire_id,
      type_destinataire,
      type,
      titre,
      message,
      reference_id,
    });

    console.log("✅ Notification créée :", notification.notification_id);

    return notification;

  } catch (error) {
    console.error("❌ Erreur Notification :", error.message);
    throw error;
  }
};

/* ==========================================================
   NOUVELLE INSCRIPTION
========================================================== */

export const notifyInscription = async (eleve) => {
  return notify({
    type: "inscription",
    titre: "Nouvelle inscription",
    message: `${eleve.nom} ${eleve.post_nom} ${eleve.prenom} a été inscrit avec succès.`,
    reference_id: eleve.eleve_id,
  });
};

/* ==========================================================
   PAIEMENT
========================================================== */

export const notifyPaiement = async (paiement) => {
  return notify({
    type: "paiement",
    titre: "Paiement reçu",
    message: `Le paiement de ${paiement.montant}$ a été enregistré.`,
    reference_id: paiement.paiement_id,
  });
};

/* ==========================================================
   PERSONNEL
========================================================== */

export const notifyPersonnel = async (personnel) => {
  return notify({
    type: "personnel",
    titre: "Nouveau membre du personnel",
    message: `${personnel.nom} ${personnel.post_nom} a rejoint le personnel.`,
    reference_id: personnel.personnel_id,
  });
};

/* ==========================================================
   ANNEE SCOLAIRE
========================================================== */

export const notifyAnneeScolaire = async (annee) => {
  return notify({
    type: "annee",
    titre: "Nouvelle année scolaire",
    message: `L'année scolaire ${annee.libelle} a été créée.`,
    reference_id: annee.annee_id,
  });
};

/* ==========================================================
   CLASSE
========================================================== */

export const notifyClasse = async (classe) => {
  return notify({
    type: "classe",
    titre: "Nouvelle classe",
    message: `La classe ${classe.nom_classe} a été créée.`,
    reference_id: classe.classe_id,
  });
};

/* ==========================================================
   ABSENCE
========================================================== */

export const notifyAbsence = async (eleve) => {
  return notify({
    type: "absence",
    titre: "Nouvelle absence",
    message: `${eleve.nom} ${eleve.post_nom} est marqué absent.`,
    reference_id: eleve.eleve_id,
  });
};

/* ==========================================================
   BULLETIN
========================================================== */

export const notifyBulletin = async (eleve) => {
  return notify({
    type: "bulletin",
    titre: "Bulletin disponible",
    message: `Le bulletin de ${eleve.nom} ${eleve.post_nom} est disponible.`,
    reference_id: eleve.eleve_id,
  });
};


// ===================================================================
//  Mofication et supprimer 
// ===================================================================

/* ==========================================================
   MODIFICATION D'UN ELEVE
========================================================== */

export const notifyModificationEleve = async (eleve) => {
  return notify({
    type: "modification",
    titre: "Élève modifié",
    message: `${eleve.nom} ${eleve.post_nom} ${eleve.prenom} a été modifié avec succès.`,
    reference_id: eleve.eleve_id,
  });
};

/* ==========================================================
   SUPPRESSION D'UN ELEVE
========================================================== */

export const notifySuppressionEleve = async (eleve) => {
  return notify({
    type: "suppression",
    titre: "Élève supprimé",
    message: `${eleve.nom} ${eleve.post_nom} ${eleve.prenom} a été supprimé.`,
    reference_id: eleve.eleve_id,
  });
};